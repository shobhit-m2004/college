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
    if (image) formData.append("image", image);
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
        `${backendUrl}/api/doctor/update-profile`,
        formData,
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
      <section className="admin-panel mx-auto max-w-4xl px-6 py-8 sm:px-8">
        <div className="flex flex-col items-center">
          {isEdit ? (
            <div>
              <label htmlFor="profileimage">
                <div>
                  {image ? (
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Profile"
                      className="h-24 w-24 rounded-full border-2 border-slate-200 object-cover"
                    />
                  ) : (
                    <img
                      src={
                        doctorData.image ||
                        "https://img.freepik.com/premium-vector/gray-picture-person-with-gray-background_1197690-22.jpg"
                      }
                      alt="Profile"
                      className="h-24 w-24 rounded-full border-2 border-slate-200 object-cover"
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
              className="h-24 w-24 rounded-full border-2 border-slate-200 object-cover"
            />
          )}

          {isEdit ? (
            <div className="mt-4 flex gap-2">
              <input
                value={doctorData.firstName || ""}
                onChange={(e) =>
                  setDoctorData((prev) => ({
                    ...prev,
                    firstName: e.target.value,
                  }))
                }
                type="text"
                className="admin-input"
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
                className="admin-input"
              />
            </div>
          ) : (
            <p className="mt-4 text-2xl font-semibold text-slate-900">
              {doctorData.firstName + " " + doctorData.lastName}
            </p>
          )}
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="admin-panel-soft p-5">
            <h2 className="text-lg font-semibold text-slate-900">Contact Information</h2>
            <div className="mt-4 space-y-4 text-sm text-slate-600">
              <div>
                <p className="font-semibold text-slate-900">Email ID</p>
                <p>{doctorData.email}</p>
              </div>

              <div>
                <p className="font-semibold text-slate-900">Phone</p>
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
                    className="admin-input mt-2"
                  />
                ) : (
                  <p>{doctorData.phone || "N/A"}</p>
                )}
              </div>

              <div>
                <p className="font-semibold text-slate-900">Address</p>
                {isEdit ? (
                  <div className="mt-2 space-y-2">
                    <input
                      value={doctorData.address?.line1 || ""}
                      onChange={(e) =>
                        setDoctorData((prev) => ({
                          ...prev,
                          address: { ...prev.address, line1: e.target.value },
                        }))
                      }
                      type="text"
                      className="admin-input"
                    />
                    <input
                      value={doctorData.address?.line2 || ""}
                      onChange={(e) =>
                        setDoctorData((prev) => ({
                          ...prev,
                          address: { ...prev.address, line2: e.target.value },
                        }))
                      }
                      type="text"
                      className="admin-input"
                    />
                  </div>
                ) : (
                  <div>
                    <p>{doctorData.address?.line1}</p>
                    <p>{doctorData.address?.line2}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="admin-panel-soft p-5">
            <h2 className="text-lg font-semibold text-slate-900">Professional Details</h2>

            <div className="mt-4 space-y-4 text-sm text-slate-600">
              <div>
                <p className="font-semibold text-slate-900">Speciality</p>
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
                    className="admin-input mt-2"
                  />
                ) : (
                  <p>{doctorData.speciality || "N/A"}</p>
                )}
              </div>

              <div>
                <p className="font-semibold text-slate-900">Degree</p>
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
                    className="admin-input mt-2"
                  />
                ) : (
                  <p>{doctorData.degree || "N/A"}</p>
                )}
              </div>

              <div>
                <p className="font-semibold text-slate-900">Experience (Years)</p>
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
                    className="admin-input mt-2"
                  />
                ) : (
                  <p>{doctorData.experience || "N/A"} years</p>
                )}
              </div>

              <div>
                <p className="font-semibold text-slate-900">Consultation Fees</p>
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
                    className="admin-input mt-2"
                  />
                ) : (
                  <p>Rs. {doctorData.fees || "N/A"}</p>
                )}
              </div>

              <div>
                <p className="font-semibold text-slate-900">About</p>
                {isEdit ? (
                  <textarea
                    value={doctorData.about || ""}
                    onChange={(e) =>
                      setDoctorData((prev) => ({
                        ...prev,
                        about: e.target.value,
                      }))
                    }
                    className="admin-input mt-2 resize-none"
                    rows="5"
                  ></textarea>
                ) : (
                  <p>{doctorData.about || "N/A"}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          {!isEdit ? (
            <button onClick={() => setIsEdit(true)} className="admin-primary-btn">
              Edit
            </button>
          ) : (
            <>
              <button
                onClick={() => setIsEdit(false)}
                className="admin-secondary-btn"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsEdit(false);
                  updateProfile();
                }}
                className="admin-primary-btn bg-emerald-600 hover:bg-emerald-500"
              >
                Save Info
              </button>
            </>
          )}
        </div>
      </section>
    )
  );
};

export default DoctorProfile;
