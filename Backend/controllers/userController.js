import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "./../models/userModel.js";
import jwt from "jsonwebtoken";
//import upload from "./../middlewares/multer";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "./../models/doctorModel.js";
import appointmentModel from "./../models/appointmentModel.js";

const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // --- Basic validation ---
    if (!firstName || !email || !password) {
      return res.json({ success: false, message: "Missing details" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Enter a valid email" });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Enter a strong password (min 8 chars)",
      });
    }

    // --- Check if user already exists ---
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }

    // --- Hash password ---
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // --- Save new user ---
    const newUser = new userModel({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    const user = await newUser.save();

    // --- Generate JWT token ---
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ success: true, token });
  } catch (err) {
    console.log("Register Error:", err.message);
    res.json({ success: false, message: err.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check for missing fields
    if (!email || !password) {
      return res.json({ success: false, message: "Missing email or password" });
    }

    // 2. Await user lookup
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "Entered email is not registered",
      });
    }

    // 3. Compare password with bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Incorrect Password" });
    }

    // 4. Create JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d", // optional: set expiry
    });

    // 5. Respond with success
    return res.json({
      success: true,
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const getProfile = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await userModel.findById(userId).select(-"password");

    if (!user) {
      res.json({ success: false, message: "user not found" });
    }
    res.json({ success: true, user });
  } catch (err) {
    console.log(err.message);

    res.json({ success: false, message: err.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { userId, firstName, lastName, phone, address, dob, gender } =
      req.body;
    const imageFile = req.file;
    if (!firstName || !phone || !dob || !gender) {
      return res.json({ success: false, messsage: "Data Missing" });
    }
    await userModel.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        phone,
        address: JSON.parse(address),
        dob,
      },
      {
        new: true,
      }
    );

    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      const imageUrl = imageUpload.secure_url;
      await userModel.findByIdAndUpdate(userId, {
        image: imageUrl,
      });
      res.json({ success: true, message: "profile updated" });
    }
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err.message });
  }
};

const bookAppointment = async (req, res) => {
  try {
    // ye hume aarha hai frontend se ;

    const { userId, docId, slotDate, slotTime } = req.body;
    const docData = await doctorModel.findById(docId).select("-password");

    const slots_booked = docData.slots_booked;
    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].include(slotTime)) {
        res.json({ success: false, message: err.message });
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      slots_booked[slotDate] = [];
      slots_booked[slotDate].push(slotTime);
    }

    const userData = await userModel.find(userId);

    delete docData.slots_booked;

    const appointmentData = {
      userId,
      docId,
      userData,
      docData,
      amount: docData.fees,
      slotTime,
      slotDate,
      date: Date.now(),
    };
    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, message: err.message });
  }
};

export { registerUser, loginUser, getProfile, updateProfile, bookAppointment };
