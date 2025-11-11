import React, { useContext, useState } from "react";
import { assets } from "./../../assets/assets";
import { AdminContext } from "./../../context/AdminContext";
import { toast } from "react-toastify";
import axios from "axios";

const AddDoctor = () => {
  const [docImg, setDocImg] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [speciality, setSpeciality] = useState("General Physician");
  const [experience, setExperince] = useState("");
  const [education, setEducation] = useState("");
  const [fees, setFees] = useState("");
  const [about, setAbout] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const { backendUrl, aToken } = useContext(AdminContext);
  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (!docImg) {
        return toast.error("Image Not Selected");
      }

      const formData = new FormData();
      formData.append("image", docImg);
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("speciality", speciality);
      formData.append("experience", experience);
      formData.append("degree", education);
      formData.append("about", about);
      formData.append("fees", fees);
      formData.append(
        "address",
        JSON.stringify({ line1: address1, line2: address2 })
      );

      formData.forEach((value, key) => {
        console.log(`${value}`);
      });

      const res = await axios.post(
        backendUrl + "/api/admin/add-doctor",
        formData,
        {
          headers: { aToken },
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        setDocImg("");
        setFirstName("");
        setLastName("");
        setEducation("");
        setEmail("");
        setExperince("");
        setPassword("");
        setAbout("");
        setAddress1("");
        setAddress2("");
        setFees("");
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.message);
      console.log(err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form
        className="bg-white p-8 rounded-2xl shadow-md w-full max-w-3xl"
        onSubmit={onSubmitHandler}
      >
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          Add Doctor
        </h2>

        <div className="flex flex-col items-center mb-6">
          <label htmlFor="doc-img" className="cursor-pointer">
            <img
              src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
              alt="Upload"
              className="w-28 h-28 object-cover rounded-full border-2 border-dashed border-gray-400 hover:border-blue-500"
            />
          </label>

          <input
            type="file"
            id="doc-img"
            onChange={(e) => setDocImg(e.target.files[0])}
            hidden
          />
          <p className="text-gray-500 text-sm mt-2">Click to upload image</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-700 mb-1">First Name</p>
            <input
              type="text"
              placeholder="First name"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div>
            <p className="text-gray-700 mb-1">Last Name</p>
            <input
              type="text"
              placeholder="Last name"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div>
            <p className="text-gray-700 mb-1">Email</p>
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div>
            <p className="text-gray-700 mb-1">Password</p>
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div>
            <p className="text-gray-700 mb-1">Experience (in years)</p>
            <input
              type="text"
              placeholder="Experience"
              required
              value={experience}
              onChange={(e) => setExperince(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div>
            <p className="text-gray-700 mb-1">Fees</p>
            <input
              type="number"
              placeholder="Fees"
              required
              value={fees}
              onChange={(e) => setFees(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div>
            <p className="text-gray-700 mb-1">Speciality</p>
            <select
              required
              value={speciality}
              onChange={(e) => setSpeciality(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              <option value="General Physician">General Physician</option>
              <option value="Gynocologist">Gynocologist</option>
              <option value="Gastroenterologist">Gastroenterologist</option>
              <option value="Neurologist">Neurologist</option>
              <option value="Pediatricians">Pediatricians</option>
              <option value="Dermatologist">Dermatologist</option>
            </select>
          </div>

          <div>
            <p className="text-gray-700 mb-1">Education</p>
            <input
              type="text"
              placeholder="Education"
              required
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-4">
          <p className="text-gray-700 mb-1">Address</p>
          <input
            type="text"
            placeholder="Address line 1"
            required
            value={address1}
            onChange={(e) => setAddress1(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Address line 2"
            required
            value={address2}
            onChange={(e) => setAddress2(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        <div className="mt-4">
          <p className="text-gray-700 mb-1">About</p>
          <textarea
            placeholder="Write about doctor..."
            rows={5}
            required
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:ring-2 focus:outline-none"
          ></textarea>
        </div>

        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all"
          >
            Add Doctor
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDoctor;
