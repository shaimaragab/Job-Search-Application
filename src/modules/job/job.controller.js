import {Router} from "express";
import applicationController from '../application/application.controller.js'
import * as jobServices from './services/job.service.js'
import * as validators from './job.validation.js'
import { validation } from "../../middleware/validation.middleware.js";
import { authentication, authorization } from "../../middleware/authentication.middleware.js";
import { fileValidationTypes, uploadCloudFile } from "../../utils/multer/cloud.multer.js";
import { endPoints } from "./job.authorization.js";
const router = Router({mergeParams:true,caseSensitive:true,strict:false})
router.post('/',authentication(),authorization(endPoints.addJob),validation(validators.addJob),jobServices.addJob)
router.patch('/:jobId',authentication(),authorization(endPoints.updateJob),validation(validators.updateJob),jobServices.updateJob)
router.delete('/:jobId',authentication(),authorization(endPoints.deleteJob),validation(validators.deleteJob),jobServices.deleteJob)
router.get('/by-filter',authentication(),authorization(endPoints.getJobsByFilter),validation(validators.getJobsByFilter),jobServices.getJobsByFilter)
router.get('/:jobId?',authentication(),authorization(endPoints.getJobs),validation(validators.getJobs),jobServices.getJobs)


export default router