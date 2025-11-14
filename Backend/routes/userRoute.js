import express from "express";
import { getProfile, registerUser } from "../controllers/userController.js";
import { loginUser } from "../controllers/userController.js";
import authUser from "../middlewares/authUser.js";
import { updateProfile } from "../controllers/userController.js";
import upload from "../middlewares/multer.js";
const userRouter = express.Router();
import { bookAppointment } from "../controllers/userController.js";

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

export default userRouter;
