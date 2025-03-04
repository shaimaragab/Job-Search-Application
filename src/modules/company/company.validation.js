import joi from 'joi'
import { generalsFields } from "../../middleware/validation.middleware.js";

export const addCompany = joi.object().keys({
    companyName: generalsFields.userName.required(),
    description:joi.string().min(5).max(500).trim(),
    industry:joi.string().min(5).max(500).trim(),
    address:joi.string().min(5).max(500).trim(),
    numberOfEmployees:generalsFields.numberRange,
    companyEmail:generalsFields.email.required(),
    HRs:joi.array().items(generalsFields.id),
    file:joi.array().items(generalsFields.file).max(2)
}).required()

export const updateCompany = joi.object().keys({
    companyId:generalsFields.id.required(),
    companyName: generalsFields.userName,
    description:joi.string().min(5).max(500).trim(),
    industry:joi.string().min(5).max(500).trim(),
    address:joi.string().min(5).max(500).trim(),
    numberOfEmployees:generalsFields.numberRange,
    companyEmail:generalsFields.email,
    file:joi.array().items(generalsFields.file).max(2)
}).required()

export const freezeCompany = joi.object().keys({
    companyId:generalsFields.id.required(),
}).required()

export const getCompany = joi.object().keys({
    companyId:generalsFields.id.required(),
}).required()

export const getCompanyByName = joi.object().keys({
    name:generalsFields.userName.required(),
}).required()

export const getApplicationsOfCompany = joi.object().keys({
    companyId:generalsFields.id.required(),
}).required()