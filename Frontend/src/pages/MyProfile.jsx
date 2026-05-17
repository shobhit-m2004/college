import React, { useContext, useState } from "react";
import { AppContext } from "../context/context";
import axios from "axios";
import { toast } from "react-toastify";
import { Mail, MapPin, Phone, UserRound } from "lucide-react";

const MyProfile = () => {
  const { userData, setUserData, token, loadUserProfileData, backendUrl } =
    useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(null);

  const updateUserProfileData = async () => {
    const formData = new FormData();

    formData.append("firstName", userData.firstName);
    formData.append("lastName", userData.lastName);
    formData.append("address", JSON.stringify(userData.address));
    if (image) formData.append("image", image);
    formData.append("gender", userData.gender);
    formData.append("dob", userData.dob);
    formData.append("phone", userData.phone);

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/update-profile`,
        formData,
        { headers: { token } }
      );

      if (data.success) {
        toast.success("Profile updated successfully");
        await loadUserProfileData();
        setIsEdit(false);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    userData && (
      <section className="section-shell mx-auto max-w-3xl p-6 sm:p-8">
        <div className="flex flex-col items-center">
          {isEdit ? (
            <div>
              <label htmlFor="profileimage">
                <div>
                  {image ? (
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Profile"
                      className="h-24 w-24 rounded-full border-2 border-gray-300 object-cover"
                    />
                  ) : (
                    <img
                      src={
                        userData.image ||
                        "https://img.freepik.com/premium-vector/gray-picture-person-with-gray-background_1197690-22.jpg?semt=ais_hybrid&w=740&q=80"
                      }
                      alt="Profile"
                      className="h-24 w-24 rounded-full border-2 border-gray-300 object-cover"
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
                userData.image ||
                "https://img.freepik.com/premium-vector/gray-picture-person-with-gray-background_1197690-22.jpg?semt=ais_hybrid&w=740&q=80"
              }
              alt="Profile"
              className="h-24 w-24 rounded-full border-2 border-gray-300 object-cover"
            />
          )}

          {isEdit ? (
            <div className="mt-4 flex gap-2">
              <input
                value={userData.firstName}
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    firstName: e.target.value,
                  }))
                }
                type="text"
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3"
              />
              <input
                value={userData.lastName}
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    lastName: e.target.value,
                  }))
                }
                type="text"
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3"
              />
            </div>
          ) : (
            <p className="mt-4 text-2xl font-semibold text-slate-900">
              {userData.firstName + " " + userData.lastName}
            </p>
          )}
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-[28px] border border-slate-200 bg-slate-50/80 p-5">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              <Mail className="h-4 w-4 text-sky-700" />
              Contact information
            </div>
            <div className="space-y-4 text-sm text-slate-600">
              <div>
                <p className="font-semibold text-slate-900">Email</p>
                <p>{userData.email}</p>
              </div>
              <div>
                <p className="flex items-center gap-2 font-semibold text-slate-900">
                  <Phone className="h-4 w-4 text-sky-700" />
                  Phone
                </p>
                {isEdit ? (
                  <input
                    value={userData.phone}
                    onChange={(e) =>
                      setUserData((prev) => ({ ...prev, phone: e.target.value }))
                    }
                    type="text"
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
                  />
                ) : (
                  <p>{userData.phone}</p>
                )}
              </div>
              <div>
                <p className="flex items-center gap-2 font-semibold text-slate-900">
                  <MapPin className="h-4 w-4 text-sky-700" />
                  Address
                </p>
                {isEdit ? (
                  <div className="mt-2 space-y-2">
                    <input
                      value={userData.address.line1 || ""}
                      onChange={(e) =>
                        setUserData((prev) => ({
                          ...prev,
                          address: { ...prev.address, line1: e.target.value },
                        }))
                      }
                      type="text"
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
                    />
                    <input
                      value={userData.address.line2 || ""}
                      onChange={(e) =>
                        setUserData((prev) => ({
                          ...prev,
                          address: { ...prev.address, line2: e.target.value },
                        }))
                      }
                      type="text"
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
                    />
                  </div>
                ) : (
                  <div>
                    <p>{userData.address.line1}</p>
                    <p>{userData.address.line2}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-slate-50/80 p-5">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              <UserRound className="h-4 w-4 text-sky-700" />
              Basic information
            </div>
            <div className="space-y-4 text-sm text-slate-600">
              <div>
                <p className="font-semibold text-slate-900">Gender</p>
                {isEdit ? (
                  <select
                    value={userData.gender}
                    onChange={(e) =>
                      setUserData((prev) => ({ ...prev, gender: e.target.value }))
                    }
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Not To Say">Not to say</option>
                  </select>
                ) : (
                  <p>{userData.gender}</p>
                )}
              </div>

              <div>
                <p className="font-semibold text-slate-900">Birth Date</p>
                {isEdit ? (
                  <input
                    value={userData.dob}
                    onChange={(e) =>
                      setUserData((prev) => ({ ...prev, dob: e.target.value }))
                    }
                    type="date"
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
                  />
                ) : (
                  <p>{userData.dob}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          {!isEdit ? (
            <button onClick={() => setIsEdit(true)} className="primary-cta">
              Edit
            </button>
          ) : (
            <>
              <button onClick={() => setIsEdit(false)} className="secondary-cta">
                Cancel
              </button>
              <button
                onClick={() => {
                  updateUserProfileData();
                }}
                className="primary-cta bg-emerald-600 hover:bg-emerald-500"
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

export default MyProfile;
