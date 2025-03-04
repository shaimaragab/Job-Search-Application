import { companyModel } from "../../../DB/models/company.model.js";
import { jobOpportunityModel } from "../../../DB/models/JobOpportunity.model.js";
import cloudinary from "../../../utils/multer/cloudinary.config.js";
import { paginate } from "../../../utils/pagination.js";
import { asyncHandler } from "../../../utils/response/error.response.js";
import { successResponse } from "../../../utils/response/success.response.js";
import { populateList } from "../../company/services/company.service.js";

//////////////////////////////add job by owner or HR
export const addJob=asyncHandler(async(req,res,next)=>{
    const {companyId}= req.params
    const {jobLocation,workingTime,seniorityLevel,jobTitle}=req.body
    
    //check user if owner of company or HR
    const company = await companyModel.findOne({_id:companyId,deletedAt:{$exists:false}});
    
    if (req.user._id.toString()!==company.createdBy.toString() && !company.HRs.includes(req.user._id  )) {
        return next(new Error("you are not authorized", { cause: 403 }));
    }
    const  job= new jobOpportunityModel({...req.body,addedBy:req.user._id,companyId})
    await job.save()
    return successResponse({res,status:201,data:{job:job}})
});

//////////////////////////////////////////////////////////update job by owner only
export const updateJob=asyncHandler(async(req,res,next)=>{
    const {companyId}= req.params
    const {jobLocation,workingTime,seniorityLevel,jobTitle}=req.body
    
    //check user if owner of company
    const company = await companyModel.findOne({_id:companyId,deletedAt:{$exists:false}})
    
    if (req.user._id.toString()!==company.createdBy.toString()) {
        return next(new Error("you are not authorized", { cause: 403 }));
    }
    const  job= await jobOpportunityModel.findOneAndUpdate({_id:req.params.jobId,closed:{$exists:false}},{...req.body},{new:true})
    
    return successResponse({res,status:200,data:{job:job}})
})

////////////////////////////////////////////////////////delete job by HR
export const deleteJob=asyncHandler(async(req,res,next)=>{
    const {companyId}= req.params
    
    //check user if HR of company
    const company = await companyModel.findOne({_id:companyId,deletedAt:{$exists:false}})
    
    if (! company.HRs.includes(req.user._id  )) {
        return next(new Error("you are not authorized", { cause: 403 }));
    }
    const job = await jobOpportunityModel.findOne({_id:req.params.jobId,closed:{$exists:false}})
    await job.deleteOne()
    return successResponse({res,status:200})
});

/////////////////////////////////////////////////////////////////////get all jobs or specific one for specific company
export const getJobs=asyncHandler(async(req,res,next)=>{
    const {companyId,jobId}=req.params
    const {page,size}=req.query
    if (jobId) {
        const company = await companyModel.findOne({_id:companyId,deletedAt:{$exists:false}}).populate({path:"jobs",match:{_id:jobId}})
        return successResponse({res,message:"done",status:200,data:{company} })
    }

    const data=await paginate({page:page,size:size,model:jobOpportunityModel,filter:{companyId:companyId,closed:{$exists:false}},sort:{createdAt:-1}})
    return successResponse({res,status:200,data:{data}})
    
});

////////////////////////////////////////////////////////////////////////////////get all jobs by filter
export const getJobsByFilter=asyncHandler(async(req,res,next)=>{
    const {companyId}=req.params
    const{page,size}=req.body
    const {workingTime,jobTitle,jobLocation,seniorityLevel}=req.query
    console.log(workingTime,jobTitle,jobLocation,seniorityLevel);
    if (workingTime==undefined&&jobTitle==undefined&&jobLocation==undefined&&seniorityLevel==undefined) {
        const data=await paginate({page:page,size:size,model:jobOpportunityModel,sort:{createdAt:-1}})
    return successResponse({res,status:200,data:{data}})
    }
    const data=await paginate({page:1,size:2,model:jobOpportunityModel,filter:{$or:[{workingTime:workingTime},{jobLocation:jobLocation},{jobTitle:jobTitle},{seniorityLevel:seniorityLevel}]},sort:{createdAt:-1}})
    return successResponse({res,status:200,data:{data}})
});