import CryptoJS from "crypto-js"
import mongoose, { Schema, Types, model } from "mongoose";
import { generateHash } from "../../utils/security/hash.security.js";
import { decryption, generateEncryption } from "../../utils/security/encryption.security.js";
export const genderTypes = { male: "male", female: "female" };
export const providerTypes = { system: "system", google: "google" };
export const otpTypes = { confirmEmail: "confirmEmail", forgetPassword: "forgetPassword" };
export const roleTypes = {
  user: "user",
  admin: "admin"
};
export const defaultSecureUrl ="https://res.cloudinary.com/dkexqgamt/image/upload/v1740476711/defaultProfilePicture_itdjfg.png";
export const defaultPublicId = "defaultProfilePicture_itdjfg";
export const userSchema = new Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, },
        provider: {
            type: String,
            enum: Object.values(providerTypes),
            default: providerTypes.system,
        },
        gender: { 
            type: String, 
            enum: Object.values(genderTypes), 
         },
        DOB: { 
            type: Date, 
            min: new Date("1930-01-01"),
            max: new Date(),
            validate: {
                validator: function (value) {
                  const today = new Date();
                  const age = today.getFullYear() - value.getFullYear();
                  return age >= 18 ;
                },
                message: "You must be at least 18 years old to register.",
            }

         },
        mobileNumber:{ type:String},
        role: { type: String, enum: Object.values(roleTypes), default:roleTypes.user },
        isConfirmed:{type: Boolean},
        deletedAt: { type: Date},
        bannedAt: { type: Date},
        updatedBy: { type: Types.ObjectId, ref: "User" },
        changeCredentialsTime: { type: Date },
        profilePic:{
            secure_url: { type: String, default: defaultSecureUrl },
            public_id: { type: String, default: defaultPublicId }
        },
        coverPic:{ 
            secure_url: { type: String }, 
            public_id: { type: String } 
        },
        OTP:[{
            code:{type:String},
            otpType:{type:String,enum:Object.values(otpTypes)},
            expiresIn:{type:Date}
        }],
    },
    {
        timestamps:true,
        toJSON:{virtuals:true},
        toObject:{virtuals:true}
    }
);
//virtual setter and getter
userSchema.virtual('userName').set(function(value){
    
    this.firstName=value.split(" ")[0]
    this.lastName=value.split(" ")[1]
    
}).get(function(){
    return this.firstName + " " + this.lastName
})
//pre save  document middleware hook
userSchema.pre('save',function(){

    if (this.isModified("password")) {
        if (this.provider==providerTypes.system) {
            this.password=generateHash({plainText:this.password})
        }
    }
    if (this.isModified("mobileNumber")) {
        this.mobileNumber=generateEncryption(this.mobileNumber)
    }
    return next();
})

userSchema.post('find',async function(docs){
     console.log("===========================hook");     
     console.log(docs);
     docs[0].mobileNumber=decryption({cipherText:docs[0].mobileNumber})

    //doc.mobileNumber = CryptoJS.AES.decrypt(doc.mobileNumber,process.env.ENCRYPTION_SIGNATURE).toString(CryptoJS.enc.Utf8)
    // this.mobileNumber=decryption({cipherText:this.mobileNumber})
    // console.log(JSON.stringify(this.mobileNumber))
    //return next();
})
export const userModel = mongoose.models.User || model("User", userSchema);
export const socketConnections = new Map()