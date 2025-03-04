import joi from "joi";
import DateExtension from '@joi/date';
import { isValidObjectId } from "mongoose";
import { genderTypes } from "../DB/models/User.model.js";

const validateObjectId = (value, helper) => {
  return isValidObjectId(value) ? true : helper.message("invalid ObjectId");
};
export const fileObject={
  fieldname: joi.string(),
  originalname: joi.string(),
  encoding: joi.string(),
  mimetype: joi.string(),
  destination: joi.string(),
  filename: joi.string(),
  path: joi.string(),
  size:joi.number(),
}
export const generalsFields = {
  userName: joi.string().min(2).max(20).trim(),
  email: joi.string().email({
      minDomainSegments: 2,
      maxDomainSegments: 3,
      tlds: { allow: ["com", "net", "edu"] },
    })
    .pattern(
      new RegExp(
        /^[a-zA-Z]{1,}\d{0,}[a-zA-Z0-9]{1,}[@][a-z]{1,}(\.com|\.edu|\.net){1,3}$/
      )
    ),
  password: joi.string().pattern(
      new RegExp(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[a-zA-Z0-9]).{4,16}$/)
    ),
  confirmationPassword: joi.string().valid(joi.ref("password")).messages({
    "any.only": "password and confirmPassword mismatch",
  }),
  id: joi.string().custom(validateObjectId),
  mobileNumber: joi.string().pattern(new RegExp(/^(002|\+2)?01[0125][0-9]{8}$/)),
  DOB: joi.string().pattern(new RegExp(/^\d{4}\-\d{1,2}\-\d{1,2}$/)).message("DOB must be in format 2023-12-4 "),
  numberRange:joi.string().pattern(new RegExp(/^\d{1,2}\-\d{1,4}$/)).message("range must be in format 11-60 "),
  gender:joi.string().valid(...Object.values(genderTypes)).default("male"),
  code: joi.string().pattern(new RegExp(/^[0-9]{4}$/)),
  file: joi.object(fileObject),
  fileObject,
};

export const validation = (schema) => {
  return (req, res, next) => {
    const inputData = { ...req.body, ...req.params, ...req.query };
    if(req.file||req.files?.length>0){
        inputData.file=req.file||req.files
    }
    const validationResults = schema.validate(inputData, { abortEarly: false });
    if (validationResults.error) {
      return res.status(400).json({
        message: "validation result",
        validationError: validationResults.error.details,
      });
    }
    return next();
  };
};
export const validationGraphql = async({schema,args={}}={}) => {

    const validationResults = schema.validate(args, { abortEarly: false });
    if (validationResults.error) {
      throw new Error(JSON.stringify({message: "validation result", validationError: validationResults.error.details }));
    }
    return true
};

