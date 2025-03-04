import path from "node:path";
import connectDB from "./DB/connection.js"
import authController from './modules/auth/auth.controller.js'
import userController from './modules/user/user.controller.js'
import companyController from './modules/company/company.controller.js'
import applicationController from './modules/application/application.controller.js'
import chatController from './modules/chat/chat.controller.js'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import helmet from "helmet";
import { globalErrorHandling } from "./utils/response/error.response.js";
import { createHandler } from "graphql-http/lib/use/express";
import {schema }from './modules/modules.schema.js'
import playground from 'graphql-playground-middleware-express'

const bootstrap = async (app,express) => {
    //whitelist
    // const whitelist = ['http://localhost:3000'];
    // app.use((req, res, next) => {
    //     const origin = req.header.origin;
    //     if (!whitelist.includes(origin)) {
    //         return next(new Error("Not allowed by CORS!"))
    //     }
    //     if (!['GET','POST','patch','DELETE','OPTIONS'].includes(req.method)) {
    //             return next(new Error("Not allowed by CORS!",{status:403}))
    //     }
    //     res.setHeader('Access-Control-Allow-Origin',origin)
    //     res.setHeader('Access-Control-Allow-Header',"*")
    //     res.setHeader('Access-Control-Allow-Methods',"*")
    //     res.setHeader('Access-Control-Private-Network',true)
    //     //local frontend means private network
    //     //deploy backend  mean public network
    //     return next()
    // })
    app.use(cors())
    /////rate limiter to limit request per hour to avoid DDOS(too many requests from this IP danial of ) and brute force attack(for comment module only)
    app.use('/',rateLimit({
        limit: 20,//default is 5
        windowMs: 2 * 60 * 1000,//default is 1 minute,
        message: 'Too many requests from this IP, please try again in an hour!',
        handler: (req, res, next, options) => {
            return res.status(429).json({message: 'Too many requests from this IP, please try again in an hour!',})
        },    
        legacyHeaders: false,//default is true,
        standardHeaders: true ,//means 'draft-6'//default is false ,boolean || string:"draft-6" || string:"draft-7"|| string:"draft-8",
        skip: (req, res) => {//to skip rate limiter for certain user
              return ['::1','195.11.156.1'].includes(req.ip)
        },
        skipSucessfulRequest: true,//to skip rate limiter for successful request,default is false,
        requestWasSuccessful: (req,res) => {return res.statusCode < 400}
    }))
    
    /////////////////
    app.use(helmet())
    app.use(express.json())
    app.get('/', (req, res, next) => {return res.status(200).json('Hello to job search Application powered by express and mongoose and ES6!')})
    // Graphql
    app.all('/graphql/admin',createHandler({schema}))
    //Graphql documentation by using graphql playground
    app.get('/graphql/documentation', playground.default({ endpoint: '/graphql/admin' }))
    ///////////Restful APIS
    app.use("/auth",authController)
    app.use("/user",userController)
    app.use("/company",companyController)
    app.use("/application",applicationController)
    app.use('/chat',chatController)
    app.all('*',(req,res,next)=>{
        return res.status(404).json({message:"invalid routing"})
     })
     //global error handling function
     app.use(globalErrorHandling)
     //DB
     connectDB();    
    
}
export default bootstrap