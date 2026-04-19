import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import appointmentModel from "./../models/appointmentModel.js";

const chnangeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;
    const docData = await doctorModel.findById(docId);
    await doctorModel.findByIdAndUpdate(
      docId,
      {
        available: !docData.available,
      },
      { new: true, runValidators: true }
    );
    res.json({ success: true, message: "Availabilty Changed" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select(["-password", "-email"]);

    // console.log(doctors);

    res.json({ success: true, doctors });
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, message: err.message });
  }
};

const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await doctorModel.findOne({ email });

    if (!doctor) {
      return res.json({ success: false, message: "Invalid credential" });
    }

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (isMatch) {
      const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET);

      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credential" });
    }
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, message: err.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const { DocId } = req.body;

    const doctor = await doctorModel.findById(DocId);

    if (!doctor) {
      return res.json({ success: false, message: "Doctor Not Found" });
    }

    return res.json({ success: true, doctor });
  } catch {
    console.log(err.message);
    return res.json({ success: false, message: err.message });
  }
};

const updateDoctorProfile = async (req, res) => {
  try {
    const {
      userId,
      firstName,
      lastName,
      phone,
      address,
      dob,
      gender,
      speciality,
      email,
      degree,
      experience,
      about,
      fees,
    } = req.body;

    const imageFile = req.file;

    // Validation
    // if (!firstName || !phone || !dob || !gender) {
    //   return res.json({ success: false, message: "Required data missing" });
    // }

    // Build update object
    const updateData = {
      firstName,
      lastName,
      phone,
      dob,
      gender,
      speciality,
      email,
      degree,
      experience,
      about,
      fees,
    };

    // Parse address if needed
    if (address) {
      try {
        updateData.address = JSON.parse(address);
      } catch (err) {
        return res.json({ success: false, message: "Invalid address format" });
      }
    }

    // Handle image upload
    if (imageFile) {
      const upload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });

      updateData.image = upload.secure_url;
    }

    // Update user in a SINGLE query
    await doctorModel.findByIdAndUpdate(userId, updateData, { new: true });

    return res.json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (err) {
    console.log(err);
    return res.json({ success: false, message: err.message });
  }
};

const myAppointments = async (req, res) => {
  try {
    const docId = req.body.DocId;

    const appointments = await appointmentModel.find({ docId: docId });
    if (!appointments) {
      res.json({ success: false, message: "Do not have Any appointment" });
    }
    res.json({ success: true, appointments });
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, message: err.message });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    const { docId, slotDate, slotTime } = appointmentData;

    const doctorData = await doctorModel.findById(docId);

    let slots_booked = doctorData.slots_booked;

    slots_booked[slotDate] = slots_booked[slotDate].filter(
      (e) => e !== slotTime
    );

    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({ success: true, message: "Appointment Cancelled Succesfully" });
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, message: err.message });
  }
};

const completeAppointments = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      isCompleted: true,
    });

    const { docId, slotDate, slotTime } = appointmentData;

    const doctorData = await doctorModel.findById(docId);

    let slots_booked = doctorData.slots_booked;

    slots_booked[slotDate] = slots_booked[slotDate].filter(
      (e) => e !== slotTime
    );

    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({ success: true, message: "Appointment Completed Succesfully" });
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, message: err.message });
  }
};
export {
  chnangeAvailability,
  doctorList,
  loginDoctor,
  getProfile,
  updateDoctorProfile,
  myAppointments,
  completeAppointments,
  cancelAppointment,
};
