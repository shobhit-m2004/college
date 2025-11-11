import doctorModel from "../models/doctorModel.js";

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

export { chnangeAvailability, doctorList };
