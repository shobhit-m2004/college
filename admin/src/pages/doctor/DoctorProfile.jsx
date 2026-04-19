import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { DoctorContext } from "../../context/DoctorContext";
import { toast } from "react-toastify";

const DoctorProfile = () => {
  const { backendUrl, dToken, doctorData, setDoctorData, getProfile } =
    useContext(DoctorContext);
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(null);
  const updateProfile = async () => {
    const formData = new FormData();

    formData.append("userId", doctorData._id);
    formData.append("image", image);
    formData.append("firstName", doctorData.firstName);
    formData.append("lastName", doctorData.lastName);
    formData.append("email", doctorData.email);
    formData.append("address", JSON.stringify(doctorData.address));
    formData.append("speciality", doctorData.speciality);
    formData.append("degree", doctorData.degree);
    formData.append("experience", doctorData.experience);
    formData.append("fees", doctorData.fees);
    formData.append("about", doctorData.about);

    try {
      const { data } = await axios.patch(
        backendUrl + "/api/doctor/update-profile",
        formData, // <-- SEND DIRECTLY
        {
          headers: {
            dtoken: dToken,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        toast.success("Profile updated successfully");
        getProfile();
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    if (dToken) getProfile();
  }, [dToken]);

  return (
    doctorData && (
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-6 space-y-6">
        {/* Profile Image */}
        <div className="flex flex-col items-center">
          {isEdit ? (
            <div>
              <label htmlFor="profileimage">
                <div>
                  {image ? (
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
                    />
                  ) : (
                    <img
                      src={
                        doctorData.image ||
                        "https://img.freepik.com/premium-vector/gray-picture-person-with-gray-background_1197690-22.jpg"
                      }
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
                    />
                  )}
                </div>
              </label>
              <input
                onChange={(e) => setImage(e.target.files[0])}
                className="hidden"
                type="file"
                id="profileimage"
                accept="image/*"
              />
            </div>
          ) : (
            <img
              src={
                doctorData.image ||
                "https://img.freepik.com/premium-vector/gray-picture-person-with-gray-background_1197690-22.jpg"
              }
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
            />
          )}

          {isEdit ? (
            <div className="flex gap-2 mt-4">
              <input
                value={doctorData.firstName || ""}
                onChange={(e) =>
                  setDoctorData((prev) => ({
                    ...prev,
                    firstName: e.target.value,
                  }))
                }
                type="text"
                className="border rounded-md px-2 py-1"
              />
              <input
                value={doctorData.lastName || ""}
                onChange={(e) =>
                  setDoctorData((prev) => ({
                    ...prev,
                    lastName: e.target.value,
                  }))
                }
                type="text"
                className="border rounded-md px-2 py-1"
              />
            </div>
          ) : (
            <p className="mt-4 text-xl font-semibold">
              {doctorData.firstName + " " + doctorData.lastName}
            </p>
          )}
        </div>

        <hr className="border-gray-300" />

        {/* Contact Info */}
        <div className="space-y-2">
          <p className="text-lg font-semibold text-gray-700">
            Contact Information
          </p>
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <div>
              <p className="text-gray-600 font-medium">Email ID:</p>
              <p className="text-gray-800">{doctorData.email}</p>
            </div>

            <div>
              <p className="text-gray-600 font-medium">Phone:</p>
              {isEdit ? (
                <input
                  value={doctorData.phone || ""}
                  onChange={(e) =>
                    setDoctorData((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                  type="text"
                  className="border rounded-md px-2 py-1 w-full"
                />
              ) : (
                <p className="text-gray-800">{doctorData.phone || "N/A"}</p>
              )}
            </div>

            <div>
              <p className="text-gray-600 font-medium">Address:</p>
              {isEdit ? (
                <div className="space-y-2">
                  <p>Line 1:</p>
                  <input
                    value={doctorData.address?.line1 || ""}
                    onChange={(e) =>
                      setDoctorData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line1: e.target.value },
                      }))
                    }
                    type="text"
                    className="border rounded-md px-2 py-1 w-full"
                  />
                  <p>Line 2:</p>
                  <input
                    value={doctorData.address?.line2 || ""}
                    onChange={(e) =>
                      setDoctorData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line2: e.target.value },
                      }))
                    }
                    type="text"
                    className="border rounded-md px-2 py-1 w-full"
                  />
                </div>
              ) : (
                <div className="text-gray-800">
                  <p>{doctorData.address?.line1}</p>
                  <p>{doctorData.address?.line2}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Basic Info */}

        {/* NEW — Professional Details */}
        <div className="space-y-2">
          <p className="text-lg font-semibold text-gray-700">
            Professional Details
          </p>

          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            {/* Speciality */}
            <div>
              <p className="text-gray-600 font-medium">Speciality:</p>
              {isEdit ? (
                <input
                  value={doctorData.speciality || ""}
                  onChange={(e) =>
                    setDoctorData((prev) => ({
                      ...prev,
                      speciality: e.target.value,
                    }))
                  }
                  type="text"
                  className="border rounded-md px-2 py-1 w-full"
                />
              ) : (
                <p className="text-gray-800">
                  {doctorData.speciality || "N/A"}
                </p>
              )}
            </div>

            {/* Degree */}
            <div>
              <p className="text-gray-600 font-medium">Degree:</p>
              {isEdit ? (
                <input
                  value={doctorData.degree || ""}
                  onChange={(e) =>
                    setDoctorData((prev) => ({
                      ...prev,
                      degree: e.target.value,
                    }))
                  }
                  type="text"
                  className="border rounded-md px-2 py-1 w-full"
                />
              ) : (
                <p className="text-gray-800">{doctorData.degree || "N/A"}</p>
              )}
            </div>

            {/* Experience */}
            <div>
              <p className="text-gray-600 font-medium">Experience (Years):</p>
              {isEdit ? (
                <input
                  value={doctorData.experience || ""}
                  onChange={(e) =>
                    setDoctorData((prev) => ({
                      ...prev,
                      experience: e.target.value,
                    }))
                  }
                  type="number"
                  className="border rounded-md px-2 py-1 w-full"
                />
              ) : (
                <p className="text-gray-800">
                  {doctorData.experience || "N/A"} years
                </p>
              )}
            </div>

            {/* Fees */}
            <div>
              <p className="text-gray-600 font-medium">Consultation Fees:</p>
              {isEdit ? (
                <input
                  value={doctorData.fees || ""}
                  onChange={(e) =>
                    setDoctorData((prev) => ({
                      ...prev,
                      fees: e.target.value,
                    }))
                  }
                  type="number"
                  className="border rounded-md px-2 py-1 w-full"
                />
              ) : (
                <p className="text-gray-800">₹{doctorData.fees || "N/A"}</p>
              )}
            </div>

            {/* About */}
            <div>
              <p className="text-gray-600 font-medium">About:</p>
              {isEdit ? (
                <textarea
                  value={doctorData.about || ""}
                  onChange={(e) =>
                    setDoctorData((prev) => ({
                      ...prev,
                      about: e.target.value,
                    }))
                  }
                  className="border rounded-md px-2 py-1 w-full"
                  rows="4"
                ></textarea>
              ) : (
                <p className="text-gray-800">{doctorData.about || "N/A"}</p>
              )}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          {!isEdit ? (
            <button
              onClick={() => setIsEdit(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Edit
            </button>
          ) : (
            <>
              <button
                onClick={() => setIsEdit(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => (setIsEdit(false), updateProfile())}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
              >
                Save Info
              </button>
            </>
          )}
        </div>
      </div>
    )
  );
};

export default DoctorProfile;
