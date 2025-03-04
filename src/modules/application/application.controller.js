import {Router} from "express";
import * as applicationServices from './services/application.service.js'
import * as validators from './application.validation.js'
import { validation } from "../../middleware/validation.middleware.js";
import { authentication, authorization } from "../../middleware/authentication.middleware.js";
import { fileValidationTypes, uploadCloudFile } from "../../utils/multer/cloud.multer.js";
import { endPoints } from "./application.authorization.js";
const router = Router()
router.post('/:jobId',authentication(),authorization(endPoints.addApplication),uploadCloudFile(fileValidationTypes.imageOrDocument).single('userCV'),validation(validators.addApplication),applicationServices.addApplication)
router.get('/:jobId',authentication(),authorization(endPoints.getApplicationsOfJob),validation(validators.getApplicationsOfJob),applicationServices.getApplicationsOfJob)
router.patch('/:applicationId',authentication(),authorization(endPoints.acceptOrRejectApplication),validation(validators.acceptOrRejectApplication),applicationServices.acceptOrRejectApplication)
export default router