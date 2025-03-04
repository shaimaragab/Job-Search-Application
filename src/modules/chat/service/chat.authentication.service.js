import { socketConnections } from "../../../DB/models/User.model.js";
import { authenticationSocket } from "../../../middleware/authentication.socket.middleware.js";

export const registerSocket = async(socket) =>{
    console.log({socket});
    
    const {data}= await authenticationSocket({socket})
    if(!data.valid) return socket.emit("socket_Error",{data})
        socketConnections.set(data.user._id.toString(),socket.id)
        console.log(socketConnections);
    
    return "Done"

    }
export const logoutSocket = async(socket) => {
        return socket.on("disconnect", async() => {
        console.log("disconnect");
        const {data}= await authenticationSocket({socket})
        if(!data.valid) return socket.emit("socket_Error",{data})
        socketConnections.delete(data.user._id.toString())
        })
    
}
