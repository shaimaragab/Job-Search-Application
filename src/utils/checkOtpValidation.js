import { userModel } from "../DB/models/User.model.js";
import { compareHash } from "./security/hash.security.js";

export const checkOtpValidation = async({code='',email='',otpType,next}={})=>{
    try {
        console.log({ code, email,otpType });
        const user = await userModel.findOne({
        email,  
        isDeleted: { $exists: false },
        });
        if (!user) {
            return next(new Error("Invalid user ", { cause: 404 }));
        }
        let expireTime=null
        let OTP=null
        if (otpType==="confirmEmail") {
            if (user.isConfirmed) {
                return next(new Error("email already confirmed ", { cause: 409 }));
            }
            user.OTP.filter((otpElement)=>{
                otpElement.otpType=="confirmEmail"
                console.log(otpElement);
                expireTime=otpElement.expiresIn
                OTP=otpElement.code  
                return otpElement
            })
        }else{
            user.OTP.filter((otpElement)=>{
                console.log(otpElement);
                otpElement.otpType=="forgetPassword"
                expireTime=otpElement.expiresIn
                OTP=otpElement.code  
                return otpElement
            })
            
        }
        
        if ((Date.now() || 0) > parseInt(expireTime?.getTime())) {
            return next(new Error("otp expired ", { cause: 400 }));
        }
        console.log({ hashedValue: OTP, plainText: code });
        if (!compareHash({ hashedValue: OTP, plainText: code })) {
            return next(new Error(`invalid otp try again `, { cause: 400 }));
        }
        return true 
    }catch (error) {
     console.log(error);
     return next(new Error(error.message, { cause: 500 }));
     
    }
     
}
   