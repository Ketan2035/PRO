import express from "express";
import {
  getProfessionals,
  getProfessionalById,
} from "../controllers/professional.js";

const professionalRoutes = express.Router();

professionalRoutes.get("/", getProfessionals);
professionalRoutes.get("/:id",getProfessionalById );

export default professionalRoutes;

