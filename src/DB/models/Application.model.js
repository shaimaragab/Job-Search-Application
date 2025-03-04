import mongoose, { Schema, Types, model } from "mongoose"

export const statusTypes = {
    pending:'pending',
    accepted:'accepted', 
    viewed:'viewed',
    inConsideration:'inConsideration',
    rejected:'rejected'
  };

export const applicationSchema = new Schema(
    {
        jobId:{type:Types.ObjectId,ref:"Job",required:true},
        userId:{type:Types.ObjectId,ref:"User",required:true},
        status:{type:String,enum:Object.values(statusTypes),default:statusTypes.pending},
        userCV:{ 
            secure_url: { type: String }, 
            public_id: { type: String } 
        }
    },
    {
        timestamps:true,
    }
)


export const applicationModel=mongoose.models.Application||model("Application",applicationSchema)