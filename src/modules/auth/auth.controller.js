import { Router } from "express";
import { validation } from "../../middleware/validation.middleware.js";
import * as validators from "./auth.validation.js"
import * as registrationServices from "./services/registration.service.js"
import * as loginServices from "./services/login.service.js"
const router = Router();
router.post("/signup",validation(validators.signup),registrationServices.signup )
router.patch("/confirm-email", validation(validators.confirmEmail),registrationServices.confirmEmail)
router.post("/login",validation(validators.login),loginServices.login)
router.post("/googleLogin",loginServices.googleLogin)
router.post("/google-signup",loginServices.googleSignUp)
router.patch("/forget-password",validation(validators.forgetPassword),loginServices.forgetPassword)
router.post("/reset-password",validation(validators.resetPassword),loginServices.resetPassword)
router.get("/refresh-token",loginServices.refreshToken)
export default router