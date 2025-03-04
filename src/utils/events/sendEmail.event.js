import { EventEmitter } from "node:events";
import { nanoid,customAlphabet } from "nanoid";
import { sendEmail } from "../email/send.email.js";
import { verificationEmailTemplate } from "../template/verification.email.js";
import { userModel } from "../../DB/models/User.model.js";
import { generateHash } from "../security/hash.security.js";
export const emailEvent = new EventEmitter();
export const subjectTypes = {
    confirmEmail:"confirmEmail",
    resetPassword:"reset-password-email",
    updateEmail:"updateEmail"
}
const sendCode=async({data,subject=subjectTypes.confirmEmail}={})=>{
    
    const {id,email}=data
    const otp = customAlphabet('1234567890', 4)();
    const hashedOtp = generateHash({plainText:`${otp}`})
    let updatedData={}
    switch (subject) {
        case subjectTypes.confirmEmail:
            updatedData={emailOtp:hashedOtp,emailOtpExpireTime:Date.now()+600000}
            await userModel.findOneAndUpdate({_id:id},{$addToSet:{OTP:{code:hashedOtp,otpType:"confirmEmail",expiresIn:Date.now()+600000}}},{new:true})
            break;
        case subjectTypes.updateEmail:
            updatedData={updatedEmailOtp:hashedOtp,updatedEmailOtpExpireTime:Date.now()+120000}
            await userModel.findOneAndUpdate({_id:id},{$addToSet:{OTP:{code:hashedOtp,otpType:"updateEmail",expiresIn:Date.now()+600000}}},{new:true})
            break;
        case subjectTypes.resetPassword:
            updatedData={forgetPasswordOtp:hashedOtp,forgetPasswordOtpExpireTime:Date.now()+120000}
            await userModel.findOneAndUpdate({_id:id},{$addToSet:{OTP:{code:hashedOtp,otpType:"forgetPassword",expiresIn:Date.now()+180000}}},{new:true})
            break;
        default:
            break;
    }
    const html = verificationEmailTemplate(otp);
    await sendEmail({to:[email],subject,html})
}

emailEvent.on("sendConfirmEmail", async(data) => {
    await sendCode({data,subject:subjectTypes.confirmEmail});
});

emailEvent.on("updateEmail", async(data) => {
    await sendCode({data,subject:subjectTypes.updateEmail});
});

///////////////////////send acceptance or reject email for applicant
emailEvent.on("sendApplicationResponse", async(data) => {
    const {email,message}=data
  
    console.log(email,message);
    
    const html = verificationEmailTemplate(message);
    await sendEmail({to:[email],subject:"notification message about your application",html})
});
emailEvent.on("sendForgetPasswordEmail", async(data) => {
    await sendCode({data,subject:"reset-password-email"});
});
