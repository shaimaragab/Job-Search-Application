import { Server } from "socket.io";
import { logoutSocket, registerSocket } from "./service/chat.authentication.service.js";
import { sendMessage } from "./service/message.service.js";
let io=null
export const runIo=async(httpServer)=>{
    io = new Server(httpServer, {
        cors: {
            origin: "*",
        },
    });
   
    return io.on("connection", async(socket) => {
        console.log(socket.id);
        
        await registerSocket(socket)
        await sendMessage(socket)
        await logoutSocket(socket)
    })
}
export const getIo=()=>{
    return io
}