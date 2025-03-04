import mongoose, { Schema, Types, model } from "mongoose"

export const defaultSecureUrl ="https://res.cloudinary.com/dkexqgamt/image/upload/v1738874490/defaultProfilePicture_kj7diy.png";
export const defaultPublicId = "defaultProfilePicture_kj7diy";
export const companySchema = new Schema(
    {
        companyName: { type: String, required: true,unique:true },
        description:{ type:String},
        industry:{type:String},
        address:{type:String},
        numberOfEmployees:{type:String},
        companyEmail:{type:String,required:true,unique:true},
        createdBy:{type:Types.ObjectId,ref:"User"},
        logo:{ 
            secure_url: { type: String }, 
            public_id: { type: String } 
        },
        coverPic:[{ 
            secure_url: { type: String }, 
            public_id: { type: String } 
        }],
        HRs:[{type:Types.ObjectId,ref:"User"}],
        bannedAt:Date,
        deletedAt:Date,
        legalAttachment:[{ 
            secure_url: { type: String }, 
            public_id: { type: String } 
        }],
        approvedByAdmin:Boolean
    },
    {
        timestamps:true,toObject: {virtuals: true},toJSON: {virtuals: true}
    }
)

//virtual populate
companySchema.virtual("jobs",{
    localField:"_id",
    foreignField:"companyId",
    justOne:false,
    ref:"JobOpportunity"
})

//to freeze all its comments when freeze the post
// postSchema.post('updateOne',{query:false,document:true},async function (doc,next) {
//     console.log(doc);
//     const postId= doc._id
//     const comments = await commentModel.updateMany({postId},{isDeletedAt:Date.now()})
//     return next()
// })

// document hook
// commentSchema.post('deleteOne',{query:false,document:true},async function (doc,next) {
//     console.log(doc);
//     //delete attachments of comment from cloudinary
//     if (doc.attachments.length) {
//         for (const attachment of doc.attachments) {
//             await cloudinary.uploader.destroy(attachment.public_id)  
//         }
//     }
//     const parentComment=doc._id
//     //delete replies
//     if (parentComment) {
//         //this.constructor==>commentModel
//         const replies = await this.constructor.find({commentId:parentComment})
//     }
//     if (replies.length){
//         for (const reply of replies) {
//             await reply.deleteOne()    
//         }
//     }
//     return next()
// })

export const companyModel=mongoose.models.Company||model("Company",companySchema)