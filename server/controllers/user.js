import Customer from "../models/customer.js";
import Professional from "../models/professional.js";
import nodemailer from "nodemailer";
import OTP from "../models/otp.js";

export const registerCustomer = async (req, res) => {
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
};

export const registerPro = async (req, res) => {
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
};
