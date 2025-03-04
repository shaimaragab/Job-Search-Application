import { chatModel } from "../../../DB/models/chat.model.js"
import { asyncHandler } from "../../../utils/response/error.response.js"
import { successResponse } from "../../../utils/response/success.response.js"

export const getChat=asyncHandler(async (req,res,next)=>{
    const {destId}=req.params 
    const chat=await chatModel.findOne({$or:[{mainUser:req.user._id,subParticipant:destId},{mainUser:destId,subParticipant:req.user._id}]}).
    populate([{path:"mainUser"},{path:"subParticipant"},{path:"messages.senderId"}])
    successResponse({res,status:200,data:{chat}})
})

