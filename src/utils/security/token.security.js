import jwt from "jsonwebtoken";
import { userModel } from "../../DB/models/User.model.js";
export const tokenTypes = {
    access:"access",    
    refresh:"refresh"
}
export const generateToken=({payload={},signature=process.env.USER_ACCESS_TOKEN,expiresIn='6h' }={})=>{
    const token = jwt.sign(payload,signature,{expiresIn})
    return token
}
export const verifyToken=({token="",signature=process.env.USER_ACCESS_TOKEN}={})=>{
    //console.log(token,signature);
    const decoded = jwt.verify(token,signature)
    console.log(decoded);
    return decoded
}
export const decodeToken=async({authorization="",tokenType=tokenTypes.access,next}={})=>{
    
    const [bearer,token]= authorization.split(" ")||[]
    if(!bearer||!token) return next(new Error("authorization required",{cause:400}))
    console.log(token,bearer);
    let access_SIGNATURE= ""
    let refresh_SIGNATURE= ""
    switch (bearer) {
        case "Bearer":
            access_SIGNATURE = process.env.USER_ACCESS_TOKEN
            refresh_SIGNATURE = process.env.USER_REFRESH_TOKEN
            break;
        case "system":
            access_SIGNATURE = process.env.SYSTEM_ACCESS_TOKEN
            refresh_SIGNATURE=process.env.SYSTEM_REFRESH_TOKEN
            break;
        default:
            break;
    }
    //console.log(access_SIGNATURE,refresh_SIGNATURE); 
    const decoded = verifyToken({token,signature:tokenType==tokenTypes.access?access_SIGNATURE:refresh_SIGNATURE})
    // console.log(decoded);
    if(!decoded?.id) return next(new Error("invalid token payload",{cause:401}))  
    //console.log(decoded.id);        
    const user = await userModel.findById(decoded.id)    
    if (!user) return next(new Error("not registered user",{cause:404}))
    if((parseInt(user.changeCredentialsTime?.getTime()/1000) || 0) >= decoded.iat){
        return next(new Error("expired credentials",{cause:400}))  
    }
    if (user.isDeleted) {
        return next(new Error("please activate your account first and check your email",{cause:400}))
    }
    return user
}
