import { companyModel } from "../../../DB/models/company.model.js";
import { roleTypes } from "../../../DB/models/User.model.js";
import cloudinary from "../../../utils/multer/cloudinary.config.js";
import { asyncHandler } from "../../../utils/response/error.response.js";
import { successResponse } from "../../../utils/response/success.response.js";
import ExcelJS from 'exceljs';
import XLSX from"xlsx";
import fs from "fs" ;

export const populateList=[
    {path:"jobs",match:{closed:{$exists:false}},select:"jobTitle",populate:{path:"applications",match:{createdAt:'2025-03-01T00:00:00.000+00:00'},select:"userId status",populate:{path:"userId",select:"userName email"} }},
]

export const addCompany=asyncHandler(async(req,res,next)=>{
    const {companyName,numberOfEmployees,companyEmail}=req.body
    //check if company exist before
    const checkCompany = await companyModel.findOne({$or:[ {companyEmail},{companyName} ],deletedAt:{$exists:false}});

    if (checkCompany) return next(new Error("company already exist", { cause: 409 }));
    //upload logo by cloudinary and save url in req.body to save in DB
    // if(req.files.logo){
    //     let images =[]
    //     for (const image of req.files.logo) {
    //         const {secure_url,public_id}=await cloudinary.uploader.upload(image.path,{folder:`company/${companyName}`})
    //         images.push({secure_url,public_id})
    //     }
    //     req.body.logo=images
    // }
    // //upload legalAttachment
    // if(req.files.legalAttachment){
    //     let images =[]
    //     for (const image of req.files.logo) {
    //         const {secure_url,public_id}=await cloudinary.uploader.upload(image.path,{folder:`company/${companyName}`})
    //         images.push({secure_url,public_id})
    //     }
    //     req.body.legalAttachment=images
    // }
    // //upload cover pics
    // if(req.files.coverPic){
    //     let images =[]
    //     for (const image of req.files.logo) {
    //         const {secure_url,public_id}=await cloudinary.uploader.upload(image.path,{folder:`company/${companyName}`})
    //         images.push({secure_url,public_id})
    //     }
    //     req.body.coverPic=images
    // }
    const company = new companyModel({...req.body,createdBy:req.user._id})
    await company.save()
    return successResponse({res,status:201,data:{company:company}})
})
/////////////////////////////////////////owner update company data 
export const updateCompany = asyncHandler(async (req, res, next) => {
    const{companyId}=req.params
    const{companyName,description,numberOfEmployees,industry,address,companyEmail}=req.body

    //name and email should be unique
    const checkCompanyData = await companyModel.findOne({$or:[ {companyEmail},{companyName} ],deletedAt:{$exists:false}});
    if (checkCompanyData) return next(new Error("it is invalid input data (company name and email..it is already exist)", { cause: 400 }));

    const checkCompany = await companyModel.findOne({_id:companyId,deletedAt:{$exists:false}});
    if (!checkCompany) return next(new Error("company not exist", { cause: 404 }));
    
    //only owner of company is authorized to update
    if (req.user._id.toString()!==checkCompany.createdBy.toString()) {
        return next(new Error("you are not authorized", { cause: 403 }));
    }
    //it is forbidden to update legalAttachment
    if(req.files.legalAttachment){
        return next(new Error("it is forbidden to update legal attachment of company ", { cause: 403 }));
    }
    //update logo
    if(req.files.logo){
        let images =[]
        for (const image of req.files.logo) {
            const {secure_url,public_id}=await cloudinary.uploader.upload(image.path,{folder:`company/${companyName}`})
            images.push({secure_url,public_id})
        }
        req.body.logo=images
    }
    
    //update cover pics
    if(req.files.coverPic){
        let images =[]
        for (const image of req.files.logo) {
            const {secure_url,public_id}=await cloudinary.uploader.upload(image.path,{folder:`company/${companyName}`})
            images.push({secure_url,public_id})
        }
        req.body.coverPic=images
    }
    
    const company=await companyModel.findOneAndUpdate({ _id:companyId , deletedAt:{$exists:false}},{...req.body},{new:true})
    successResponse({ res, status: 200, data:{company} });

});
///////////////////////////freeze company by owner
export const freezeCompany=asyncHandler(async(req,res,next)=>{
    
    const {companyId}=req.params
    const company =await companyModel.findOne({_id:req.params.companyId,deletedAt:{$exists:false}})
    if (!company) {
        return next(new Error("company not found",{cause:404}))
    }
    //admin and owner only are authorized to freeze company
    if (req.user.role !==roleTypes.admin && company.createdBy.toString()!==req.user._id.toString()) {
        return next(new Error("not authorized to delete company",{cause:403}))
    }
    await company.updateOne({deletedAt:Date.now()},{new:true})
    await company.save()

    return successResponse({res,message:"deleted successfully",status:200 })
});
///////////////////////////get specific company by id with related jobs by virtual populate
export const getCompany=asyncHandler(async(req,res,next)=>{
    const {companyId}=req.params
    const company = await companyModel.findOne({_id:companyId,deletedAt:{$exists:false}}).sort({createdAt:-1}).populate(populateList)
    return successResponse({res,message:"done",status:200,data:{company} })
});
///////////////////////////get specific company by name with related jobs by virtual populate
export const getCompanyByName=asyncHandler(async(req,res,next)=>{
    const {name}=req.query
    const company = await companyModel.findOne({companyName:name,deletedAt:{$exists:false}}).populate(populateList)
    return successResponse({res,message:"done",status:200,data:{company} })
});

/////////////////////////////////////////////////Upload logo by cloudinary
export const updateLogo= asyncHandler(async (req, res, next) => {
    const company= await companyModel.findOne({_id:req.params.companyId,deletedAt:{$exists:false}})
    if (!company) return next(new Error("company not exist", { cause: 404 }));

    //upload file in cloudinary req.file.path
    const {secure_url, public_id} = await cloudinary.uploader.upload(req.file.path, {
        folder:`company/${req.params.companyId}`
      })
    //to remove old profile picture
    if(company.logo?.public_id){
        await cloudinary.uploader.destroy(company.logo.public_id)
    }
    //save url of image in DB
    const updatedCompany= await companyModel.findByIdAndUpdate({_id:req.params.companyId,deletedAt:{$exists:false}},{logo:{secure_url,public_id}},{new:true})
    
    successResponse({ res, status: 200, data: { updatedCompany } });
});
//////////////////////////////////////////////////////Upload Cover Pic  by cloudinary
export const updateCover= asyncHandler(async (req, res, next) => {
    const company= await companyModel.findOne({_id:req.params.companyId,deletedAt:{$exists:false}})
    if (!company) return next(new Error("company not exist", { cause: 404 }));
    const images =[]
    for (const file of req.files) {
      const {secure_url, public_id} = await cloudinary.uploader.upload(file.path,{folder:`company/${req.params.companyId}/cover`}) 
      images.push({secure_url,public_id})
    }
    
    const updatedCompany= await companyModel.findOneAndUpdate({_id:req.params.companyId,deletedAt:{$exists:false}},{coverPic:images},{new:true})
    successResponse({ res, status: 200, data: {updatedCompany} });
});
///////////////////////////////////Delete logo
export const deleteLogo= asyncHandler(async (req, res, next) => {

    const company= await companyModel.findOne({_id:req.params.companyId,deletedAt:{$exists:false}})

    if (!company) return next(new Error("company not exist", { cause: 404 }));
    //delete logo from cloudinary
    if(company.logo?.public_id){
        const results=await cloudinary.uploader.destroy(company.logo.public_id)
        if(results.result=='ok'){
            //remove logo from DB
              const updatedCompany= await companyModel.findOneAndUpdate({_id:req.params.companyId,deletedAt:{$exists:false}},{$unset:{logo:0}},{new:true})
              successResponse({ res, status: 200, data: { updatedCompany } });   
        }
    }
    
    return next(new Error("no logo exist", { cause: 404 }))
});
///////////////////////////////////////Delete Cover Pic and set it by default Picture
export const deleteCover= asyncHandler(async (req, res, next) => {

    const company= await companyModel.findOne({_id:req.params.companyId,deletedAt:{$exists:false}})
    
    if (!company) return next(new Error("company not exist", { cause: 404 }));
    //delete cover picture from cloudinary
    if(company.coverPic?.length){
        for (const attachment of company.coverPic) {
            await cloudinary.uploader.destroy(attachment.public_id)  
        }
        
        //remove cover picture from DB
        const updatedCompany= await companyModel.findOneAndUpdate({_id:req.params.companyId,deletedAt:{$exists:false}},{$unset:{coverPic:0}},{new:true})
        successResponse({ res, status: 200, data: { updatedCompany } });   
        
    }
    
    return next(new Error("no cover exist", { cause: 404 }))
});
//bonus task:Add an endpoint that collects the applications for a specific company on a specific day and creates an Excel sheet with this data

export const getApplicationsOfCompany=asyncHandler(async(req,res,next)=>{
    const {companyId}=req.params
    const company = await companyModel.findOne({_id:companyId,deletedAt:{$exists:false}}).select('-legalAttachment -numberOfEmployees').populate(
        [
            {path:"jobs",match:{closed:{$exists:false}},select:"jobTitle",populate:{path:"applications",match:{ createdAt: { $gte: new Date('2025-03-01T00:00:00.000Z'), $lt: new Date('2025-03-02T00:00:00.000Z') } },select:"userId status",populate:{path:"userId",select:"userName email"} }},
        ]
    );
    if (!company) {
        return res.status(404).json({ message: 'Company not found' });
    }
     // Create a new Excel workbook and worksheet
     const workbook = new ExcelJS.Workbook();
     const worksheet = workbook.addWorksheet("Applications of company");

    // Define columns
    worksheet.columns = [
        { header: "Company", key: "company", width: 30 },
        { header: "Job Title", key: "jobTitle", width: 25 },
        { header: "Applicant Name", key: "applicantName", width: 25 },
        { header: "Applicant Email", key: "applicantEmail", width: 30 },
        { header: "Application Status", key: "status", width: 20 }
    ];

    // Populate data
    company.jobs.forEach(job => {
        job.applications.forEach(app => {
            worksheet.addRow({
                company: company.companyName,  // Assuming company has a "name" field
                jobTitle: job.jobTitle,
                applicantName: app.userId?.userName || "N/A",
                applicantEmail: app.userId?.email || "N/A",
                status: app.status
            });
        });
    });
// Apply styling (optional)
worksheet.getRow(1).font = { bold: true }; // Make header bold

// Save to file
const filePath = `company_${companyId}_applications.xlsx`;
await workbook.xlsx.writeFile(filePath);

console.log(`✅ Excel file generated: ${filePath}`);

//return successResponse({res,message:"done",status:200,data:{company} })
});