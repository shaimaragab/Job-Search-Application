import { chatModel } from "../../../DB/models/chat.model.js";
import { companyModel } from "../../../DB/models/company.model.js";
import { socketConnections } from "../../../DB/models/User.model.js";
import { authenticationSocket } from "../../../middleware/authentication.socket.middleware.js";


export const sendMessage=async(socket)=>{
    return socket.on("sendMessage",async(messageData)=>{
        const {data}=await authenticationSocket({socket})
        if(!data.valid) return socket.emit("socket_Error",{data})
        const {destId,message,companyId}=messageData
        console.log(data.user._id.toString(),destId.toString(),message);
        const chat=await chatModel.findOneAndUpdate({$or:[{mainUser:data.user._id,subParticipant:destId},{mainUser:destId,subParticipant:data.user._id}]},{$push:{messages:{message,senderId:data.user._id}}},{new:true})
        if(!chat) {
            const company=await companyModel.findOne({_id:companyId})
            if (!company.HRs.includes(data.user._id)) {
                return next(new Error("not authorized to start conversation",{cause:403}))
            }
            const chat=await chatModel.create({messages:{message,senderId:data.user._id},subParticipant:destId,mainUser:data.user._id})
        }
    
        socket.emit("successMessage",{message,chat}) 
        socket.to(socketConnections.get(destId)).emit("receiveMessage",{message,chat})
        return "Done"
    })
}