import express from "express";
import Customer from "../models/customer.js";
import Professional from "../models/professional.js";
import nodemailer from "nodemailer";
import OTP from "../models/otp.js";

const userRoutes = express.Router();

const transporter = nodemailer.createTransport({
  // secure:true,
  service: "gmail",
  auth: {
    user: "ketankumar147856@gmail.com",
    pass: "aalg larh xjpi jhjq",
  },
});

//for customer
userRoutes.post("/customer_signup", async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const { name, email, mobile, city, address } = req.body;

    const newCustomer = new Customer({
      name,
      email,
      mob_no: mobile,
      city,
      address,
    });

    await newCustomer.save();

    console.log("register");

    res.status(201).json({
      message: "User created successfully",
      customer: newCustomer,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});
//for professional
userRoutes.post("/pro_signup", async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const {
      name,
      email,
      mob,
      profession,
      experience,
      qualification,
      service_area,
      bio,
    } = req.body;

    const newProfessional = new Professional({
      name,
      email,
      mob,
      profession,
      experience,
      qualification,
      service_area,
      bio,
    });

    await newProfessional.save();

    console.log("register");

    res.status(201).json({
      message: "User created successfully",
      newProfessional,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});

//login route

userRoutes.post("/login", async (req, res) => {
  const { email } = req.body;
  const otp=Math.floor(Math.random()*1000000);
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
  console.log("Email received:", email);
  const htmlContent = `
    Subject: Email verification

    Hello,

    Your One-Time Password (OTP) is:

    🔐 ${otp}

    This code will expire in 5 minutes.

    For your security, do not share this code with anyone.

    If you did not request this, please ignore this email.

    Best regards,  
    proconnect Team
  `;
  const mailOptions = {
    from: "ketankumar147856@gmail.com",
    to: email,
    subject: "OTP Verification",
    text: htmlContent,
  };
  await transporter.sendMail(mailOptions);
  await OTP.deleteMany({ email });
  await OTP.create({
    email,
    otp,
    expiresAt,
  });
  res.json({ message: "Email sent successfully" });
});

//verify function
const verifyOTP = async (email, userOtp) => {
  const record = await OTP.findOne({ email });
  if (!record) {
    return { success: false, message: "No OTP found" };
  }

  // check expiry
  if (record.expiresAt < new Date()) {
    return { success: false, message: "OTP expired" };
  }

  // check match
  if (record.otp !== userOtp) {
    return { success: false, message: "Invalid OTP" };
  }
  await OTP.deleteMany({ email });
  return { success: true, message: "OTP verified" };
};

//login verification
userRoutes.post("/verify", async (req, res) => {
  try {
    const { email, otp } = req.body; 
    const result = await verifyOTP(email, otp); 
    console.log(result);

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});



export default userRoutes;
