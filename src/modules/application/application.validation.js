import joi from 'joi'
import { generalsFields } from "../../middleware/validation.middleware.js";
import { statusTypes } from '../../DB/models/Application.model.js';

export const addApplication = joi.object().keys({
    jobId:generalsFields.id.required(),
    file:generalsFields.file

    //jobLocation:joi.string().valid(...Object.values(jobLocationTypes)).default("onsite"),
    
}).required()

export const getApplicationsOfJob = joi.object().keys({
    page:joi.number(),
    size:joi.number(),
    jobId:generalsFields.id.required(),
}).required()

export const acceptOrRejectApplication = joi.object().keys({
    applicationId:generalsFields.id.required(),
    action:joi.string().valid(statusTypes.accepted,statusTypes.rejected).default(statusTypes.accepted)
}).required()
