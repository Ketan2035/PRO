import Booking from "../models/bookingSchema.js";

export const createBooking = async (req, res) => {
    console.log("BODY:", req.body);
  try {
    const { professionalId, service, address, date, time } = req.body;
    const booking = new Booking({
      user: req.user.id,
      professional: professionalId,
      service,
      address,
      date,
      time,
    });
    console.log("hitted");
    await booking.save();

    res.status(201).json({
      success: true,
      message: "Booking created",
      booking,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


