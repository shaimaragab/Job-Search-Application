import { generalsFields } from "../../middleware/validation.middleware.js";
import joi from 'joi'

export const updateUserAccount = joi.object().keys({
    userName:generalsFields.userName,
    mobileNumber:generalsFields.mobileNumber,
    DOB:generalsFields.DOB,
    gender:generalsFields.gender
}).required()

export const shareProfile = joi.object().keys({
    profileId:generalsFields.id.required()
}).required()

export const updatePassword = joi.object().keys({
    oldPassword:generalsFields.password.required(),
    confirmPassword:generalsFields.confirmationPassword.required(),
    password:generalsFields.password.not(joi.ref("oldPassword")).required(),
}).required()

export const banOrUnbanUserAccount = joi.object().keys({
    userId:generalsFields.id.required(),
    action:joi.string().valid("ban","unban").default("ban"),
}).required()

export const banOrUnbanCompany = joi.object().keys({
    companyId:generalsFields.id.required(),
    action:joi.string().valid("ban","unban").default("ban"),
}).required()

export const approveCompany = joi.object().keys({
    companyId:generalsFields.id.required(),
}).required()