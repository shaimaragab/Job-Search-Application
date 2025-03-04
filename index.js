import path from "node:path";
import * as dotenv from 'dotenv';
import cors from 'cors'
dotenv.config({ path: path.resolve('./src/config/.env') });
import bootstrap from './src/app.controller.js'
import  express from 'express'
import { runIo } from "./src/modules/chat/chat.socket.controller.js";


const app = express()
const port = process.env.PORT ||5000
app.use(cors({
    origin:"*"
}))

bootstrap(app,express)
const httpServer = app.listen(port, () => console.log(`Example app listening on port ${port}!`))
runIo(httpServer)