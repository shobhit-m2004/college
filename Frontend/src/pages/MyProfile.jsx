import React, { useContext, useState } from "react";
import { AppContext } from "../context/context";
import axios from "axios";
import { toast } from "react-toastify";

const MyProfile = () => {
  const { userData, setUserData, token, loadProfileData, backendUrl } =
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
        await loadProfileData();
        setIsEdit(false);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log(err.message);
      toast.error(err.message);
    }
  };

  return (
    userData && (
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
                        userData.image ||
                        "https://img.freepik.com/premium-vector/gray-picture-person-with-gray-background_1197690-22.jpg?semt=ais_hybrid&w=740&q=80"
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
                userData.image ||
                "https://img.freepik.com/premium-vector/gray-picture-person-with-gray-background_1197690-22.jpg?semt=ais_hybrid&w=740&q=80"
              }
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
            />
          )}

          {isEdit ? (
            <div className="flex gap-2 mt-4">
              <input
                value={userData.firstName}
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    firstName: e.target.value,
                  }))
                }
                type="text"
                className="border rounded-md px-2 py-1"
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
                className="border rounded-md px-2 py-1"
              />
            </div>
          ) : (
            <p className="mt-4 text-xl font-semibold">
              {userData.firstName + " " + userData.lastName}
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
              <p className="text-gray-800">{userData.email}</p>
            </div>

            <div>
              <p className="text-gray-600 font-medium">Phone:</p>
              {isEdit ? (
                <input
                  value={userData.phone}
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  type="text"
                  className="border rounded-md px-2 py-1 w-full"
                />
              ) : (
                <p className="text-gray-800">{userData.phone}</p>
              )}
            </div>

            <div>
              <p className="text-gray-600 font-medium">Address:</p>
              {isEdit ? (
                <div className="space-y-2">
                  <p>Line 1:</p>
                  <input
                    value={userData.address.line1 || ""}
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line1: e.target.value },
                      }))
                    }
                    type="text"
                    className="border rounded-md px-2 py-1 w-full"
                  />
                  <p>Line 2:</p>
                  <input
                    value={userData.address.line2 || ""}
                    onChange={(e) =>
                      setUserData((prev) => ({
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
                  <p>{userData.address.line1}</p>
                  <p>{userData.address.line2}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="space-y-2">
          <p className="text-lg font-semibold text-gray-700">
            Basic Information
          </p>
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <div>
              <p className="text-gray-600 font-medium">Gender:</p>
              {isEdit ? (
                <select
                  value={userData.gender}
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, gender: e.target.value }))
                  }
                  className="border rounded-md px-2 py-1 w-full"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Not To Say">Not to say</option>
                </select>
              ) : (
                <p className="text-gray-800">{userData.gender}</p>
              )}
            </div>

            <div>
              <p className="text-gray-600 font-medium">Birth Date:</p>
              {isEdit ? (
                <input
                  value={userData.dob}
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, dob: e.target.value }))
                  }
                  type="date"
                  className="border rounded-md px-2 py-1 w-full"
                />
              ) : (
                <p className="text-gray-800">{userData.dob}</p>
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
                onClick={() => (updateUserProfileData(), setIsEdit(false))}
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

export default MyProfile;
