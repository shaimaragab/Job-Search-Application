import {Router} from "express";
import * as userServices from './services/user.service.js'
import * as validators from './user.validation.js'
import { validation } from "../../middleware/validation.middleware.js";
//import { fileValidationTypes,uploadDiskFile } from "../../utils/multer/local.multer.js";
//import { uploadCloudFile } from "../../utils/multer/cloud.multer.js";
import { endPoint} from "./user.authorization.js";
import { authentication, authorization } from "../../middleware/authentication.middleware.js";
import { fileValidationTypes, uploadCloudFile } from "../../utils/multer/cloud.multer.js";
const router = Router();
router.patch('/profile',authentication(),authorization(endPoint.updateUserAccount),validation(validators.updateUserAccount),userServices.updateUserAccount)
router.get('/profile',authentication(),userServices.getUserProfile)
router.patch('/profile/update-Password',authentication(),validation(validators.updatePassword),userServices.updatePassword)
router.patch('/profile/image',authentication(),uploadCloudFile(fileValidationTypes.image).single('image'),userServices.updateImage)
router.patch('/profile/image/cover',authentication(),uploadCloudFile(fileValidationTypes.image).array('image',2),userServices.updateCoverImages)
router.delete('/profile/image',authentication(),userServices.deleteImage)
router.delete('/profile/image/cover',authentication(),userServices.deleteCoverImage)
router.get('/profile/:profileId',authentication(),validation(validators.shareProfile),userServices.shareProfile)
router.patch('/admin/:userId/ban-user',authentication(),authorization(endPoint.banOrUnbanUserAccount),validation(validators.banOrUnbanUserAccount),userServices.banOrUnbanUserAccount)
router.patch('/admin/:companyId/ban-company',authentication(),authorization(endPoint.banOrUnbanCompany),validation(validators.banOrUnbanCompany),userServices.banOrUnbanCompany)
router.patch('/admin/:companyId/approve-company',authentication(),authorization(endPoint.approveCompany),validation(validators.approveCompany),userServices.approveCompany)
export default router