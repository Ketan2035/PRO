import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import professionalRoutes from "./routes/professionalRoutes.js";
dotenv.config();
import cookieParser from "cookie-parser";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
//connect db
connectDb();

// middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials:true
}));

app.use("/api", userRoutes);
app.use("/api/professionals", professionalRoutes);


// start server
const PORT = process.env.PORT||5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});