import express from "express";
import {
  cancelAppointment,
  getProfile,
  paymentRazorPay,
  registerUser,
  verifyRazorpay,
} from "../controllers/userController.js";
import { loginUser } from "../controllers/userController.js";
import authUser from "../middlewares/authUser.js";
import { updateProfile } from "../controllers/userController.js";
import upload from "../middlewares/multer.js";
const userRouter = express.Router();
import { bookAppointment } from "../controllers/userController.js";
import { listAppointment } from "../controllers/userController.js";

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/get-profile", authUser, getProfile);
userRouter.post(
  "/update-profile",
  upload.single("image"),
  authUser,
  updateProfile
);
userRouter.post("/book-appointment", authUser, bookAppointment);
userRouter.get("/appointments", authUser, listAppointment);

userRouter.post("/cancel-appointment", authUser, cancelAppointment);

userRouter.post("/payment-razorpay", authUser, paymentRazorPay);
userRouter.post("/verify-razorpay", authUser, verifyRazorpay);

export default userRouter;
