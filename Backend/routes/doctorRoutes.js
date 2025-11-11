import express from "express";

const doctorRouter = express.Router();
import { doctorList } from "../controllers/doctorController.js";

doctorRouter.get("/list", doctorList);

export default doctorRouter;
