import express from "express";
import Customer from "../models/customer.js";
import Professional from "../models/professional.js";

const userRoutes = express.Router();
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

export default userRoutes;
