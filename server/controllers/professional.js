import Professional from "../models/professional.js";

export const getProfessionals = async (req, res) => {
  try {
    const pro = await Professional.find();

    res.status(200).json({
      success: true,
      data: pro,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProfessionalById = async (req, res) => {
  try {
    const pro = await Professional.findById(req.params.id);

    res.json({ data: pro });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
