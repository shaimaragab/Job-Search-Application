import {Router} from "express";
import * as chatServices from './service/chat.service.js'
import { authentication } from "../../middleware/authentication.middleware.js";
import { authorization } from "../../middleware/authentication.socket.middleware.js";
const router = Router();
router.get('/:destId',authentication(),chatServices.getChat)
export default router