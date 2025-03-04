import { application } from "express";
import mongoose, { Schema, Types, model } from "mongoose"
import { applicationModel } from "./Application.model.js";
import cloudinary from "../../utils/multer/cloudinary.config.js";

export const jobLocationTypes = {
  onSite: "onSite",
  remotely: "remotely",
  hybrid: "hybrid",
};
export const workingTimeTypes={
    partTime:"partTime",
    fullTime:"FullTime"
}
export const seniorityLevelTypes={
    fresh:"fresh",
    junior:"junior",
    midLevel:"midLevel",
    senior:"senior",
    teamLead:"teamLead",
    CTO:"CTO"
}

export const jobOpportunitySchema = new Schema(
    {
        jobTitle:{type:String},
        jobLocation:{type:String,enum:Object.values(jobLocationTypes)},
        workingTime:{type:String,enum:Object.values(workingTimeTypes)},
        seniorityLevel:{type:String,enum:Object.values(seniorityLevelTypes)},
        jobDescription:{type:String},
        technicalSkills:[{type:String}],
        softSkills:[{type:String}],
        addedBy:{type:Types.ObjectId,ref:"User"},
        updatedBy:{type:Types.ObjectId,ref:"User"},
        closed:Boolean,
        companyId:{type:Types.ObjectId,ref:"Company"}
    },
    {
        timestamps:true,toObject: {virtuals: true},toJSON: {virtuals: true}
    }
)
//virtual populate
jobOpportunitySchema.virtual("applications",{
    localField:"_id",
    foreignField:"jobId",
    justOne:false,
    ref:"Application"
})

// document post hook to delete job's applications

jobOpportunitySchema.post('deleteOne',{query:false,document:true},async function (doc,next) {
    console.log(doc);
    //delete its applications
    if (doc._id) {
        //this.constructor==>jobOpportunityModel
        const applications = await applicationModel.find({jobId:doc._id})
        console.log(applications);
        if (applications.length){
            for (const application of applications) {
                //delete userCV from cloudinary
                if (application.userCV.public_id){ 
                    await cloudinary.uploader.destroy(application.userCV.public_id)  
                }
                await application.deleteOne()    
            }
        }
        
    }
   
    return next()
})

export const jobOpportunityModel=mongoose.models.JobOpportunity||model("JobOpportunity",jobOpportunitySchema)