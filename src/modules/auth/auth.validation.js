import joi from 'joi'
import { generalsFields } from '../../middleware/validation.middleware.js'
export const signup = joi.object().keys({
    userName:generalsFields.userName.required(),
    email:generalsFields.email.required(),
    password:generalsFields.password.required(),
    confirmPassword:generalsFields.confirmationPassword.required(),
    mobileNumber:generalsFields.mobileNumber,
    DOB:generalsFields.DOB
}).required()
export const confirmEmail = joi.object().keys({
    email:generalsFields.email.required(),
    otp:joi.string().length(4).trim().required()
}).required()
export const login = joi.object().keys({
    email:generalsFields.email,
    password:generalsFields.password.required(),
}).required()
export const forgetPassword = joi.object().keys({
    email:generalsFields.email.required()
}).required()
export const resetPassword= joi.object().keys({
    email:generalsFields.email.required(),
    otp:joi.string().length(4).trim().required(),
    password:generalsFields.password.required(),
    confirmPassword:generalsFields.confirmationPassword.required()
}).required()