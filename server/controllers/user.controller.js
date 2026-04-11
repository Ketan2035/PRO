import Customer from "../models/customerSchema.js";
import Professional from "../models/professionalSchema.js";
import generateToken from "../utils/generateToken.js";

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
    generateToken(newCustomer._id, res);
    console.log("register");
    res.status(201).json({
      message: "User created successfully",
      user: newCustomer,
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

export const sendData = async (req, res) => {
  try {
    const user = await Customer.findById(req.user.id);
    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

//save address
export const addAddress = async (req, res) => {
  try {
    const { address } = req.body;
    const userId = req.user.id;
    // Find customer
    const customer = await Customer.findById(userId);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }
    customer.address.push(address);
    await customer.save();
    // console.log("hitted");
    res.status(200).json({
      success: true,
      message: "Address added successfully",
      addresses: customer.address,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

//delete address
export const deleteAddress = async (req, res) => {
  try {
    const { index } = req.params;
    const userId = req.user.id;

    const customer = await Customer.findById(userId);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    customer.address.splice(index, 1);
    await customer.save();

    res.status(200).json({
      success: true,
      message: "Address deleted",
      addresses: customer.address,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
