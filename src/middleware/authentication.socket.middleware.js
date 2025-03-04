import { userModel } from "../DB/models/User.model.js";
import { tokenTypes, verifyToken } from "../utils/security/token.security.js";

export const authenticationSocket = async({socket={},tokenType=tokenTypes.access}={})=>{
    const [bearer,token]= socket?.handshake?.auth?.authorization?.split(" ")||[]
    if(!bearer||!token) return {data:{message:"authorization required or invalid format",status:400}}

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

    const decoded = verifyToken({token,signature:tokenType==tokenTypes.access?access_SIGNATURE: refresh_SIGNATURE})
     
    if(!decoded?.id) return {data:{message:"invalid token payload",status:400}}
    const user = await userModel.findById(decoded.id)    
    if (!user) return {data:{message:"not registered user",status:404}}
    if((parseInt(user.changePasswordTime?.getTime()/1000) || 0) >= decoded.iat){
       return {data:{message:{message:"invalid credentials",status:401}}}
    }
    if (user.isDeleted) {
        return {data:{message:"please activate your account first and check your email",status:400}}
        
    }
   
    return {data:{user,valid:true}}
}

        
    
          


export const authorization= (accessRoles=[])=>{
    return asyncHandler(async (req,res,next)=>{
      //console.log(req.user.role,accessRoles);
      
        if (!accessRoles.includes(req.user.role)) { 
            return next(new Error("not authorized!",{cause:403}))
        }
 
        return next()
   
        }
    )
}