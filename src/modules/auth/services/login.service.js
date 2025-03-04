import { providerTypes, roleTypes, userModel } from "../../../DB/models/User.model.js";
import { checkOtpValidation } from "../../../utils/checkOtpValidation.js";
import { emailEvent } from "../../../utils/events/sendEmail.event.js";
import { asyncHandler } from "../../../utils/response/error.response.js";
import { successResponse } from "../../../utils/response/success.response.js";
import verifyGoogleToken from "../../../utils/security/googleVerifyToken.security.js";
import { compareHash, generateHash } from "../../../utils/security/hash.security.js";
import { generateToken, verifyToken } from "../../../utils/security/token.security.js";

export const login = asyncHandler(async (req,res,next)=>{
  
    const{email,password} = req.body
    console.log(email,password);
    const user = await userModel.findOne({email,isDeleted:{$exists:false}})
    if(!user) return next(new Error("invalid account",{cause:404}))
    if(!user.isConfirmed) return next(new Error("please confirm your email",{cause:400}))
    if(!compareHash({plainText:password,hashedValue:user.password}) ){
        return next(new Error("invalid account credentials ",{cause:404}))  
    }
          
    // user.phone=cryptoJs.AES.decrypt(user.phone,process.env.ENCRYPTION_SIGNATURE).toString(cryptoJs.enc.Utf8)
    // console.log(user.phone) 
    const accessToken=generateToken({payload:{id:user._id},signature:user.role == roleTypes.admin?process.env.SYSTEM_ACCESS_TOKEN: process.env.USER_ACCESS_TOKEN})
    const refreshToken=generateToken({payload:{id:user._id},signature:user.role == roleTypes.admin?process.env.SYSTEM_REFRESH_TOKEN: process.env.USER_REFRESH_TOKEN,expiresIn:'7d'})
    console.log(accessToken,refreshToken);
    return successResponse({res,message:"Done",status:200,data:{accessToken,refreshToken}})     
   
})
export const googleSignUp = asyncHandler(async (req,res,next)=>{
    const{idToken}=req.body
    const payload = await verifyGoogleToken(idToken)
    console.log(payload);
    if (!payload) {
        return next(new Error("Invalid payload ",{cause:404}))
    }
    if (!payload.email_verified) {
        return next(new Error("Invalid account ",{cause:404}))
    }
    const {email,name,picture,email_verified}=payload
    console.log(email,name);
    let user = await userModel.findOne({email,isDeleted:{$exists:false}})
    console.log(user);
    if (user) {
        return next(new Error(" user already exists ",{cause:409}))
    }
    //create new user  (signup with google)
    
    user = await userModel.create({userName:name,email,isConfirmed:email_verified,image:picture,provider:"google"})
    console.log(user);
    const accessToken=generateToken({payload:{id:user._id},signature:user.role == roleTypes.admin?process.env.SYSTEM_ACCESS_TOKEN: process.env.USER_ACCESS_TOKEN})
    const refreshToken=generateToken({payload:{id:user._id},signature:user.role == roleTypes.admin?process.env.SYSTEM_REFRESH_TOKEN: process.env.USER_REFRESH_TOKEN,expiresIn:31536000})
    console.log(accessToken,refreshToken);
    return successResponse({res,message:"signed up success",status:200,data:{accessToken,refreshToken}})  

})

export const googleLogin = asyncHandler(async (req,res,next)=>{
    const{idToken}=req.body
    const payload = await verifyGoogleToken(idToken)
    console.log(payload);
    if (!payload) {
        return next(new Error("Invalid payload ",{cause:404}))
    }
    if (!payload.email_verified) {
        return next(new Error("Invalid account ",{cause:404}))
    }
    const {email,name,picture,email_verified}=payload
    console.log(email,name);
    let user = await userModel.findOne({email,isDeleted:{$exists:false}})
    console.log(user);
    if (user?.provider==providerTypes.system) {
        return next(new Error("Invalid login provider ",{cause:409}))
    }
    //create new user if it is not exist (google signup with google)
    if (!user) {
        user = await userModel.create({userName:name,email,isConfirmed:email_verified,image:picture,provider:"google"})
        console.log(user);
        const accessToken=generateToken({payload:{id:user._id},signature:user.role == roleTypes.admin?process.env.SYSTEM_ACCESS_TOKEN: process.env.USER_ACCESS_TOKEN})
        const refreshToken=generateToken({payload:{id:user._id},signature:user.role == roleTypes.admin?process.env.SYSTEM_REFRESH_TOKEN: process.env.USER_REFRESH_TOKEN,expiresIn:31536000})
        console.log(accessToken,refreshToken);
        return successResponse({res,message:"signed in success",status:200,data:{accessToken,refreshToken}}) 
    }
    const accessToken=generateToken({payload:{id:user._id},signature:user.role == roleTypes.admin?process.env.SYSTEM_ACCESS_TOKEN: process.env.USER_ACCESS_TOKEN})
    const refreshToken=generateToken({payload:{id:user._id},signature:user.role == roleTypes.admin?process.env.SYSTEM_REFRESH_TOKEN: process.env.USER_REFRESH_TOKEN,expiresIn:31536000})
    console.log(accessToken,refreshToken);
    return successResponse({res,message:"login success",status:200,data:{accessToken,refreshToken}})    

})

export const forgetPassword = asyncHandler(async (req,res,next)=>{
    const{email}=req.body
    console.log(email);
    const user = await userModel.findOne({email:req.body.email,isDeleted:{$exists:false}})
    console.log(user)
    if (!user) {
        return next(new Error("Invalid user ",{cause:404}))
    }
   emailEvent.emit("sendForgetPasswordEmail",{email:req.body.email,id:user._id})
   return successResponse({res,status:200,message:"please check your email to get otp for verification"})
})
export const resetPassword = asyncHandler(async (req,res,next)=>{
    const {otp,email,password,confirmPassword} = req.body 
    console.log(otp,email);
    const  isValid=await checkOtpValidation({code:req.body.otp, email:req.body.email, otpType:"forgetPassword",next});
    if (isValid) {
         const hashedPassword = generateHash({plainText:req.body.password})
         await userModel.findOneAndUpdate({email:req.body.email},{password:hashedPassword,changeCredentialsTime:Date.now()},{new:true})
         return successResponse({res,status:200,message:"password reset successfully"})
    }
})
//8-refresh token
export const refreshToken = asyncHandler(async (req,res,next)=>{
        
    const {authorization} = req.headers
    console.log(authorization);
    if(!authorization)  return next(new Error("authorization required",{cause:400}))
    const [bearer,token]= authorization.split(" ")||[]
    if(!bearer||!token) return next(new Error("authorization required",{cause:400}))
    console.log(token,bearer);

    let TOKEN_SIGNATURE= undefined
    switch (bearer) {
        case "Bearer":
            TOKEN_SIGNATURE = process.env.USER_REFRESH_TOKEN
            break;
        case "system":
            TOKEN_SIGNATURE = process.env.SYSTEM_REFRESH_TOKEN
            break;
        default:
            break;
    }
    console.log(TOKEN_SIGNATURE);
    const decoded = verifyToken({token,signature:TOKEN_SIGNATURE})
    console.log(decoded);
        
    if(!decoded?.id) return next(new Error("invalid token payload",{cause:400}))  
    console.log(decoded.id);      
    const user = await userModel.findOne({_id:decoded.id,isDeleted:{$exists:false}})    
    console.log(user);
    if (!user) return next(new Error("not registered user",{cause:404}))
    // to check credentials time        
    if((parseInt(user.changeCredentialsTime?.getTime()/1000) || 0) >= decoded.iat){
        return next(new Error("expired credentials please try to login again",{cause:400}))
        
    }
    const accessToken=generateToken({payload:{id:user._id},signature:user.role == roleTypes.admin?process.env.SYSTEM_ACCESS_TOKEN: process.env.USER_ACCESS_TOKEN})
    const refreshToken=generateToken({payload:{id:user._id},signature:user.role == roleTypes.admin?process.env.SYSTEM_REFRESH_TOKEN: process.env.USER_REFRESH_TOKEN,expiresIn:31536000})
    return successResponse({res,message:"Done",status:200,data:{accessToken,refreshToken}})  
   
})
     