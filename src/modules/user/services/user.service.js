import CryptoJS from "crypto-js"
import { defaultPublicId, defaultSecureUrl, userModel } from "../../../DB/models/User.model.js";
import { asyncHandler } from "../../../utils/response/error.response.js";
import { successResponse } from "../../../utils/response/success.response.js";
import { decryption, generateEncryption } from "../../../utils/security/encryption.security.js";
import { compareHash, generateHash } from "../../../utils/security/hash.security.js";
import cloudinary from "../../../utils/multer/cloudinary.config.js"
import { companyModel } from "../../../DB/models/company.model.js";

////////////////////////////////////////////////////////////////////Update user account
export const updateUserAccount = asyncHandler(async (req, res, next) => {
    const{DOB,gender,mobileNumber,userName}=req.body
    
    const encryptedMobileNumber=generateEncryption(mobileNumber)
    
    const user=await userModel.findOneAndUpdate({ _id: req.user._id },{DOB,gender,mobileNumber:encryptedMobileNumber,userName},{new:true})
     successResponse({ res, status: 200, data:{user } });
});
///////////////////////////////////////////////////////////////////Get login user account data
export const getUserProfile = asyncHandler(async (req, res, next) => {

  const user = await userModel.find({ _id: req.user._id ,isDeleted:{$exists:false}});
  
  successResponse({ res, status: 200, data: { user:user[0] } });
});
////////////////////////////////////////////////////Get profile data for another use
export const shareProfile = asyncHandler(async (req, res, next) => {
    const { profileId } = req.params;
  
    const user = await userModel.findOne({ _id: profileId, isDeleted: {$exists:false} })
  
    if (!user) {
      return next(new Error("user not found ", { cause: 404 }));
    }
    const userProfile = await userModel.find({ _id: profileId,isDeleted: {$exists:false} }).select({userName:1, mobileNumber:1, profilePic:1, coverPic:1});

    successResponse({ res, status: 200, data: { user:userProfile[0] } });
})
//////////////////////////////////////////////////Update password
export const updatePassword = asyncHandler(async (req, res, next) => {
    const {oldPassword,password}=req.body
    
    if(!compareHash({plainText:oldPassword,hashedValue:req.user.password})) {
      return next(new Error("invalid password", { cause: 400 }))
    }
    const newPassword=generateHash({plainText:password});
    
    const user=await userModel.findOneAndUpdate({ _id: req.user._id },{password:newPassword,changeCredentialsTime:Date.now()},{new:true})
     successResponse({ res, status: 200, data:{ user} });
});
  
/////////////////////////////////////////////////Upload Profile Pic by cloudinary
export const updateImage= asyncHandler(async (req, res, next) => {
    const user= await userModel.findById({_id:req.user._id})
    //upload file in cloudinary req.file.path
    const {secure_url, public_id} = await cloudinary.uploader.upload(req.file.path, {
        folder:`user/${req.user._id}`
      })
    //to remove old profile picture
    if(user.profilePic?.public_id){
        await cloudinary.uploader.destroy(user.profilePic.public_id)
    }
    //save url of image in DB
    const newUser= await userModel.findByIdAndUpdate({_id:req.user._id},{profilePic:{secure_url,public_id}},{new:false})
    
    successResponse({ res, status: 200, data: { newUser } });
});
//////////////////////////////////////////////////////Upload Cover Pic  by cloudinary
export const updateCoverImages= asyncHandler(async (req, res, next) => {
    console.log(req.files);
    const images =[]
    for (const file of req.files) {
      const {secure_url, public_id} = await cloudinary.uploader.upload(file.path,{folder:`user/${req.user._id}/cover`}) 
      images.push({secure_url,public_id})
    }
    
    const user= await userModel.findByIdAndUpdate({_id:req.user._id},{coverPic:images},{new:true})
    successResponse({ res, status: 200, data: { file:req.files,user } });
});
///////////////////////////////////Delete profile Pic and set it by default Picture
export const deleteImage= asyncHandler(async (req, res, next) => {

    const user= await userModel.findOne({_id:req.user._id,isDeleted:{$exists:false}})
    //delete profile picture from cloudinary
    if(user.profilePic?.public_id){
        console.log(user.profilePic.public_id);
        const results=await cloudinary.uploader.destroy(user.profilePic.public_id)
        console.log(results);
      
      //set the default profile picture for the user
        const newUser= await userModel.findByIdAndUpdate({_id:req.user._id},{profilePic:{secure_url:defaultSecureUrl,public_id:defaultPublicId}},{new:false})
        successResponse({ res, status: 200, data: { newUser } });   
    }
    return next(new Error("no profile picture exist", { cause: 404 }))
});
///////////////////////////////////////Delete Cover Pic and set it by default Picture
export const deleteCoverImage= asyncHandler(async (req, res, next) => {

    const user= await userModel.findOne({_id:req.user._id,isDeleted:{$exists:false}})
    //delete profile picture from cloudinary
    if(user.coverPic?.public_id){
        const results=await cloudinary.uploader.destroy(user.coverPic.public_id)
      
      //set the default cover picture for the user
      if(results.result=='ok'){
            const newUser= await userModel.findByIdAndUpdate(req.user._id,{coverPic:{secure_url:defaultSecureUrl,public_id:defaultPublicId}},{new:true})
            successResponse({ res, status: 200, data: { newUser } });
       }
    }
    return next(new Error("no cover exist", { cause: 404 }))
});
//////////////////////////////////////////////////////admin ban or unban specific user account 
export const banOrUnbanUserAccount = asyncHandler(async (req,res,next)=>{
    const {userId} = req.params
    const{ action }= req.query

    const user = await userModel.findOne({ _id: userId, isDeleted: {$exists:false} })
  
    if (!user) {
      return next(new Error("user not found ", { cause: 404 }));
    }
    
    const data = action?.toLowerCase() === "ban"?{bannedAt:Date.now()} : {$unset:{bannedAt:0}}  
    
    const Newuser = await userModel.findOneAndUpdate({_id:userId,isDeleted:{$exists:false}},data,{new:true})

    return successResponse({res,message:"done successfully",status:200,data:{user:Newuser}})
});
//////////////////////////////////////////////////////admin ban or unban specific company 
export const banOrUnbanCompany = asyncHandler(async (req,res,next)=>{
    const {companyId} = req.params
    const{ action }= req.query

    const company = await companyModel.findOne({ _id: companyId, isDeleted: {$exists:false} })
  
    if (!company) {
      return next(new Error("company not found ", { cause: 404 }));
    }
    
    const data = action?.toLowerCase() === "ban"?{bannedAt:Date.now()} : {$unset:{bannedAt:0}}  
    
    const newCompany= await companyModel.findOneAndUpdate({_id:companyId,isDeleted:{$exists:false}},data,{new:true})

    return successResponse({res,message:"done successfully",status:200,data:{company:newCompany}})
});
//////////////////////////////////////////////////////admin approve specific company 
export const approveCompany = asyncHandler(async (req,res,next)=>{
    const {companyId} = req.params
    
    const company = await companyModel.findOne({ _id: companyId, isDeleted: {$exists:false} })
  
    if (!company) {
      return next(new Error("company not found ", { cause: 404 }));
    } 
    
    const updatedCompany= await companyModel.findOneAndUpdate({_id:companyId,isDeleted:{$exists:false}},{approvedByAdmin:true},{new:true})

    return successResponse({res,message:"company approved successfully",status:200,data:{company:updatedCompany}})
});