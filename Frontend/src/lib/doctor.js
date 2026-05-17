export const getDoctorName = (doctor = {}) => {
  if (doctor.firstName || doctor.lastName) {
    return [doctor.firstName, doctor.lastName].filter(Boolean).join(" ");
  }

  return doctor.name || "Doctor";
};

export const getDoctorImage = (doctor = {}) =>
  doctor.image || "/DefaultPic.jpg";

export const getDoctorExperience = (doctor = {}) =>
  doctor.experience || "Expert Care";

export const getDoctorFee = (doctor = {}) =>
  doctor.fees ? `Rs. ${doctor.fees}` : "Custom pricing";

export const getDoctorAddressLines = (doctor = {}) => {
  const address = doctor.address || {};

  return [address.line1, address.line2].filter(Boolean);
};
