import express from "express";

const doctorRouter = express.Router();
import { doctorList, loginDoctor } from "../controllers/doctorController.js";

doctorRouter.get("/list", doctorList);
doctorRouter.post("/login", loginDoctor);

export default doctorRouter;
