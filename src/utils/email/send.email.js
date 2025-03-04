import nodemailer from "nodemailer";

export const generateEmailTemplate=async(emailLink)=>{}
  
  // async..await is not allowed in global scope, must use a wrapper
  export const sendEmail= async({to=[],cc=[],bcc=['shaimaragab2017@gmail.com'],subject="confirmEmail",text="",html="",attachments=[]}={})=> {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: `"Route" 👻" <${process.env.EMAIL}>`, // sender address
      to, // list of receivers
      bcc,
      subject, // Subject line
      text, // plain text body
      html, // html body
      attachments
    });
  
    console.log("Message sent: %s", info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
  }