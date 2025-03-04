import joi from 'joi'
import { generalsFields } from "../../middleware/validation.middleware.js";
import { jobLocationTypes, seniorityLevelTypes, workingTimeTypes } from '../../DB/models/JobOpportunity.model.js';

export const addJob = joi.object().keys({
    companyId:generalsFields.id.required(),
    jobTitle: generalsFields.userName,
    jobLocation:joi.string().valid(...Object.values(jobLocationTypes)).default("onsite"),
    workingTime:joi.string().valid(...Object.values(workingTimeTypes)).default("part-time"),
    seniorityLevel:joi.string().valid(...Object.values(seniorityLevelTypes)).default("fresh"),
}).required()

export const updateJob = joi.object().keys({
    companyId:generalsFields.id.required(),
    jobId:generalsFields.id.required(),
    jobTitle: generalsFields.userName,
    jobLocation:joi.string().valid(...Object.values(jobLocationTypes)),
    workingTime:joi.string().valid(...Object.values(workingTimeTypes)),
    seniorityLevel:joi.string().valid(...Object.values(seniorityLevelTypes)),
}).required()

export const deleteJob = joi.object().keys({
    companyId:generalsFields.id.required(),
    jobId:generalsFields.id.required(),
}).required()

export const getJobs = joi.object().keys({
    companyId:generalsFields.id.required(),
    jobId:generalsFields.id,
    page:joi.number(),
    size:joi.number()
})

export const getJobsByFilter = joi.object().keys({
    companyId:generalsFields.id.required(),
    page:joi.number(),
    size:joi.number(),
    jobTitle: generalsFields.userName,
    jobLocation:joi.string().valid(...Object.values(jobLocationTypes)),
    workingTime:joi.string().valid(...Object.values(workingTimeTypes)),
    seniorityLevel:joi.string().valid(...Object.values(seniorityLevelTypes)),
}).required()