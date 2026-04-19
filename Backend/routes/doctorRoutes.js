import express from "express";

const doctorRouter = express.Router();
import {
  cancelAppointment,
  completeAppointments,
  doctorList,
  getProfile,
  loginDoctor,
  myAppointments,
  updateDoctorProfile,
} from "../controllers/doctorController.js";
import authDoctor from "../middlewares/authDoctor.js";
import upload from "../middlewares/multer.js";

doctorRouter.get("/list", doctorList);
doctorRouter.post("/login", loginDoctor);
doctorRouter.get("/profile", authDoctor, getProfile);
doctorRouter.patch(
  "/update-profile",
  upload.single("image"),
  authDoctor,
  updateDoctorProfile
);

doctorRouter.get("/my-appointments", authDoctor, myAppointments);
doctorRouter.post("/cancel-appointment", authDoctor, cancelAppointment);
doctorRouter.post("/appointment-completed", authDoctor, completeAppointments);

export default doctorRouter;
