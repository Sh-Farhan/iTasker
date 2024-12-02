// import nodemailer from 'nodemailer'
// import User from '@/models/userModel';
// import bcrypt from 'bcryptjs/dist/bcrypt';
// import bcryptjs from 'bcryptjs';

// export const sendEmail = async({email, emailType, userId}) =>
// {
//     try {
//         const hashedToken = await bcrypt.hash(userId.toString(), 10)
//         console.log("hashed token is", hashedToken)

//         if(emailType === "VERIFY"){
//           await User.findByIdAndUpdate(userId, 
//             {verifyToken: hashedToken, verifyTokenExpiry: Date.now() + 3600000}
//           )
//         } else if(emailType === "RESET"){
//           await User.findByIdAndUpdate(userId, 
//             {forgotPasswordToken: hashedToken, forgotPasswordTokenExpiry: Date.now() + 3600000}
//           )
//         }

// // Looking to send emails in production? Check out our Email API/SMTP product!
// var transport = nodemailer.createTransport({
//   host: "sandbox.smtp.mailtrap.io",
//   port: 2525,
//   auth: {
//     user: "7b8305a53c017d",
//     pass: "13f0fa67c6951b"
//   }
// });

//           const mailOptions = {
//             from: 'xyz', // sender address
//             to: email, // list of receivers
//             subject: emailType === 'VERIFY' ? "Verify your email" : "Reset your password",
//             html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to 
//             ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
//             or copy paste the link below in your browser.<br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
//             </p>`, // html body
//           }

//          const mailResponse =  await transport.sendMail(mailOptions)
//          return mailResponse
//     } catch (error) {
//         throw new Error(error.message)
//     }
// }

import nodemailer from 'nodemailer';
import mongoose from 'mongoose';
import { userSchema } from '@/models/userModel';
import bcrypt from 'bcryptjs/dist/bcrypt';

// Function to send an email
export const sendEmail = async ({ email, emailType, userId }) => {
  try {
    // Generate a hashed token
    const hashedToken = await bcrypt.hash(userId.toString(), 10);
    console.log("Hashed token:", hashedToken);

    // Dynamically use the correct database
    const db = mongoose.connection.useDb('iTasker-userdata');
    const User = db.model('users', userSchema); // Bind schema to the specific database

    // Update the user record based on email type
    let updateFields;
    if (emailType === "VERIFY") {
      updateFields = {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000, // 1 hour
      };
    } else if (emailType === "RESET") {
      updateFields = {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000, // 1 hour
      };
    }

    // Update user in the database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedUser) {
      throw new Error("Failed to update user.");
    }

    console.log("User updated successfully:", updatedUser);

    // Set up email transport
    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "7b8305a53c017d", // Replace with your Mailtrap user
        pass: "13f0fa67c6951b", // Replace with your Mailtrap password
      },
    });

    // Email content
    const mailOptions = {
      from: 'your-email@example.com', // Replace with your email
      to: email,
      subject: emailType === "VERIFY" ? "Verify Your Email" : "Reset Your Password",
      html: `
        <p>
          Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">
          here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}.
          <br>
          Or copy and paste the following link into your browser:
          <br>
          ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
        </p>
      `,
    };

    // Send email
    const mailResponse = await transport.sendMail(mailOptions);
    console.log("Email sent successfully:", mailResponse);

    return mailResponse;
  } catch (error) {
    console.error("Error in sendEmail:", error);
    throw new Error(error.message);
  }
};
