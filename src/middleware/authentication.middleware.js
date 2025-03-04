import { asyncHandler } from "../utils/response/error.response.js"
import { decodeToken } from "../utils/security/token.security.js"

export const authentication = ()=>{
    return asyncHandler(async (req,res,next)=>{
        const {authorization} = req.headers
        if(!authorization)  return next(new Error("authorization required",{cause:400}))

        req.user= await decodeToken({authorization:req.headers.authorization,next})
       
        return next()
    })      
}
export const authorization= (accessRoles=[])=>{
    return asyncHandler(async (req,res,next)=>{
      //console.log(req.user.role,accessRoles);
        if (!accessRoles.includes(req.user.role)) { 
            return next(new Error("not authorized!",{cause:403}))
        }

        return next()
    })
}