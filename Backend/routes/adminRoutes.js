import express from "express";
import { addDoctors, allDoctors } from "../controllers/AdminController.js";
import { loginAdmin } from "../controllers/AdminController.js";
import upload from "../middlewares/multer.js";
import authAdmin from "../middlewares/authAdmin.js";
import { chnangeAvailability } from "../controllers/doctorController.js";

const adminRouter = express.Router();

adminRouter.post("/add-doctor", authAdmin, upload.single("image"), addDoctors);
adminRouter.post("/login", loginAdmin);
adminRouter.post("/all-doctors", authAdmin, allDoctors);
adminRouter.patch("/change-availability", authAdmin, chnangeAvailability);

export default adminRouter;
