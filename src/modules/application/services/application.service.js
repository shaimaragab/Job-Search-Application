
import { applicationModel, statusTypes } from "../../../DB/models/Application.model.js";
import { jobOpportunityModel } from "../../../DB/models/JobOpportunity.model.js";
import { socketConnections } from "../../../DB/models/User.model.js";
import { emailEvent } from "../../../utils/events/sendEmail.event.js";
import cloudinary from "../../../utils/multer/cloudinary.config.js";
import { paginate } from "../../../utils/pagination.js";
import { asyncHandler } from "../../../utils/response/error.response.js";
import { successResponse } from "../../../utils/response/success.response.js";
import { getIo } from "../../chat/chat.socket.controller.js";


//////////////////////////////add application by user
export const addApplication=asyncHandler(async(req,res,next)=>{
    const {jobId}= req.params
    const checkJob = await jobOpportunityModel.findOne({_id:jobId,closed:{$exists:false}}).populate({path:"companyId",select:"HRs"});
    if (!checkJob) return next(new Error("job is closed or not found", { cause: 404 }));
    //check if he applied before
    const checkApplication=await applicationModel.findOne({jobId:jobId,userId:req.user._id})
    if (checkApplication) return next(new Error("it is already exist", { cause: 409 }));
        
    const  application= new applicationModel({jobId,userId:req.user._id})
    
    //upload user cv in cloudinary req.file.path
    if (req.file) {
            const {secure_url, public_id} = await cloudinary.uploader.upload(req.file.path, {
            folder:`/company/${req.params.companyId}/job/${req.params.jobId}`
            })
            application.userCV={secure_url, public_id}
    }
    await application.save()
    //Emit a socket event to notify the HR that a new application has been submitted
    getIo().to(socketConnections.get(checkJob.companyId.HRs[0].toString())).emit("newApplication",{jobId:req.params.jobId,appliedBy:req.user._id})
    return successResponse({res,status:201,data:{application:application}})
    
    
});
//////////////////////////////////////////////get all applications of specific job by owner of company or HR
export const getApplicationsOfJob=asyncHandler(async(req,res,next)=>{
    const {jobId}=req.params
    const {page,size}= req.query
    const  job= await jobOpportunityModel.findOne({_id:jobId,closed:{$exists:false}}).populate([{path:"companyId",select:"createdBy HRs"}]);
    const data = await paginate({model:applicationModel,filter:{jobId:jobId},populate:[{path:"userId"}],page,size})
    //check user if he is owner of company or HR
    if (req.user._id.toString() !== job.companyId.createdBy.toString() && !job.companyId.HRs.includes(req.user._id)) {
        return next(new Error("you are not authorized", { cause: 403 }));
    }
    return successResponse({res,status:200,data:{data}})
    
});

export const acceptOrRejectApplication =asyncHandler(async(req,res,next)=>{
    const {applicationId}=req.params
    const{ action }= req.query

    const application= await applicationModel.findOne({_id:applicationId})
    if (!application) return next(new Error("not found", { cause: 404 }));
        
    //check user if he is HR company 
    const  job= await jobOpportunityModel.findOne({_id:application.jobId}).populate([{path:"companyId"}])
    
    if ( !job.companyId.HRs.includes(req.user._id)) return next(new Error("you are not authorized", { cause: 403 }));
    
    const data = action?.toLowerCase() ==='rejected'?{status:statusTypes.rejected}:{status:statusTypes.accepted}

    const  updatedApplication= await applicationModel.findOneAndUpdate({_id:applicationId},data,{new:true});

    //send notification email to applicant
    emailEvent.emit("sendApplicationResponse", { message:`${req.user.userName}'s application is ${req.query.action}`,email:req.user.email });
    
    return successResponse({res,status:200,data:{updatedApplication}})
    
});
















