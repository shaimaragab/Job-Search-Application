import {Router} from "express";
import * as companyServices from './services/company.service.js'
import * as validators from './company.validation.js'
import { validation } from "../../middleware/validation.middleware.js";
import { authentication, authorization } from "../../middleware/authentication.middleware.js";
import { fileValidationTypes, uploadCloudFile } from "../../utils/multer/cloud.multer.js";
import { endPoints } from "./company.authorization.js";
import jobController from "../job/job.controller.js"
const router = Router();
router.use('/:companyId/job',jobController)
router.post('/add',authentication(),authorization(endPoints.addCompany),uploadCloudFile(fileValidationTypes.imageOrDocument).fields([{name:'legalAttachment',maxCount:1},{name:'logo',maxCount:1}]),validation(validators.addCompany),companyServices.addCompany)
router.patch('/:companyId/update',authentication(),authorization(endPoints.updateCompany),uploadCloudFile(fileValidationTypes.image).fields([{name:'coverPic',maxCount:1},{name:'logo',maxCount:1}]),validation(validators.updateCompany),companyServices.updateCompany)
router.delete('/:companyId',authentication(),authorization(endPoints.freezeCompany),validation(validators.freezeCompany),companyServices.freezeCompany)
router.get('/:companyId',authentication(),authorization(endPoints.getCompany),validation(validators.getCompany),companyServices.getCompany)
router.get('/:companyId/applications',validation(validators.getCompany),companyServices.getApplicationsOfCompany)
router.get('/',authentication(),authorization(endPoints.getApplicationsOfCompany),validation(validators.getApplicationsOfCompany),companyServices.getCompanyByName)
router.patch('/:companyId/logo',authentication(),uploadCloudFile(fileValidationTypes.image).single('logo'),companyServices.updateLogo)
router.patch('/:companyId/cover',authentication(),uploadCloudFile(fileValidationTypes.image).array('coverPic',2),companyServices.updateCover)
router.delete('/:companyId/logo',authentication(),companyServices.deleteLogo)
router.delete('/:companyId/cover',authentication(),companyServices.deleteCover)
export default router