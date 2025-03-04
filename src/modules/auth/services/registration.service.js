import { userModel } from "../../../DB/models/User.model.js";
import { checkOtpValidation } from "../../../utils/checkOtpValidation.js";
import { emailEvent } from "../../../utils/events/sendEmail.event.js";
import { asyncHandler } from "../../../utils/response/error.response.js";
import { successResponse } from "../../../utils/response/success.response.js";
import { generateHash } from "../../../utils/security/hash.security.js";
import cron from "node-cron";
import fs from"fs";
import path from "path";

export const signup = asyncHandler(async (req, res, next) => {
    const { userName, email, password, mobileNumber,DOB } = req.body;
    console.log(userName, email, password, mobileNumber,DOB);
    
    const checkUser = await userModel.findOne({ email });
    if (checkUser) return next(new Error("email already exist", { cause: 409 }));
    const user = await userModel.create({
      userName,
      email,
      password,
      mobileNumber,
      DOB
    });
    emailEvent.emit("sendConfirmEmail", { id: user._id, email });
    return successResponse({ res, status: 201, data: { user } });
});
export const confirmEmail = asyncHandler(async (req, res, next) => {
    const { otp, email } = req.body;
    console.log(otp, email);
    const  isValid=await checkOtpValidation({code:req.body.otp, email:req.body.email, otpType:"confirmEmail",next});
    if (isValid) {
      const newUser = await userModel.findOneAndUpdate(
        { email },
        {
            isConfirmed: true,
        },
        { new: true }
      );
      return successResponse({
        res,
        message: "done",
        status: 200,
        data: { newUser },
      });
    }
    
  });

  ////////////////////cron job to delete expires otp every 6 hours
  //Log file path
  const logFilePath = path.resolve('./src/logs/otp_cleanup.log')
  
  
  // Function to log messages to a file
  const logToFile = (message) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    
    // Append log to file
    fs.appendFile(logFilePath, logMessage, (err) => {
      if (err) console.error(" Error writing to log file:", err);
    });
  };
  
// Schedule cron job to run every 6 hours
cron.schedule("0 */6 * * *", async () => {
  try {
    const now = new Date();

    // Find users who have expired OTPs
    const usersWithExpiredOTPs = await userModel.find({
      "OTP.expiresIn": { $lt: now },
    });

    if (usersWithExpiredOTPs.length === 0) {
      logToFile("No expired OTPs found.");
      console.log("No expired OTPs found.");
      return;
    }

    // Log expired OTPs before deleting
    usersWithExpiredOTPs.forEach((user) => {
      const expiredOTPs = user.OTP.filter((otp) => otp.expiresIn < now);
      expiredOTPs.forEach((otp) => {
        const logEntry = `User: ${user.email} | OTP Code: ${otp.code} | Type: ${otp.otpType} | Expired At: ${otp.expiresIn}`;
        logToFile(logEntry);
        console.log(logEntry);
      });
    });

    // Remove expired OTPs
    const result = await userModel.updateMany(
      {},
      { $pull: { OTP: { expiresIn: { $lt: now } } } }
    );

    logToFile(`✅ Deleted expired OTPs from ${result.modifiedCount} users.`);
    console.log(`✅ Deleted expired OTPs from ${result.modifiedCount} users.`);
  } catch (error) {
    console.error("Error removing expired OTPs:", error);
    logToFile(`Error: ${error.message}`);
  }
});

console.log("🔄 Cron job scheduled to clean expired OTPs every 6 hours.");
logToFile("🔄 Cron job started to clean expired OTPs every 6 hours.");
