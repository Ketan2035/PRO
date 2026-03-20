import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//connect db
connectDb();

// middleware
app.use(cors({
  origin: "http://localhost:5173"
}));

app.use("/users", userRoutes);
// test route
app.get("/ketan", (req, res) => {
  console.log("route hit")
  res.send("API is running...");
});

// start server
const PORT = process.env.PORT||5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});