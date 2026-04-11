import express from "express";
import { createBooking } from "../controllers/booking.controller.js";
import {isLoggedIn} from "../middleware/isUserLoggedIn.js";


const bookingRoutes = express.Router();

bookingRoutes.post("/booking",  createBooking);

export default bookingRoutes;