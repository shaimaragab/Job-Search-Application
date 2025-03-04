import { userModel } from "../DB/models/User.model.js";
import { tokenTypes, verifyToken } from "../utils/security/token.security.js";

export const authentication = async({authorization,tokenType=tokenTypes.access}={})=>{
    const [bearer,token]= authorization.split(" ")||[]
    if(!bearer||!token) throw new Error("authorization required or invalid format")
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
    console.log(access_SIGNATURE,refresh_SIGNATURE);

    const decoded = verifyToken({token,signature:tokenType==tokenTypes.access?access_SIGNATURE: refresh_SIGNATURE})
     
    if(!decoded?.id) throw new Error("invalid token payload") 
    console.log(decoded.id);
              
    const user = await userModel.findById(decoded.id)    
    if (!user) throw new Error("not registered user")
    if((parseInt(user.changeCredentialsTime?.getTime()/1000) || 0) >= decoded.iat){
        throw new Error("invalid credentials") 
    }
    if (user.isDeleted) {
        throw new Error("please activate your account first and check your email") 
    }
    return user
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