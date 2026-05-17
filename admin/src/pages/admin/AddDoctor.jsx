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
        return toast.error("Image not selected");
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

      const res = await axios.post(`${backendUrl}/api/admin/add-doctor`, formData, {
        headers: { aToken },
      });

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
    }
  };

  return (
    <div className="space-y-6">
      <section className="admin-panel px-6 py-8 sm:px-8">
        <span className="admin-kicker">Doctor onboarding</span>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950">Add a new doctor</h1>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
          Build complete doctor profiles with credentials, consultation details, and
          clinic information from one polished intake flow.
        </p>
      </section>

      <form className="admin-panel px-6 py-8 sm:px-8" onSubmit={onSubmitHandler}>
        <div className="grid gap-8 xl:grid-cols-[0.42fr_1fr]">
          <div className="admin-panel-soft p-6">
            <h2 className="text-xl font-semibold text-slate-900">Profile image</h2>
            <p className="mt-2 text-sm leading-7 text-slate-500">
              Upload a clear professional photo for the doctor's public profile.
            </p>

            <div className="mt-6 flex flex-col items-center">
              <label htmlFor="doc-img" className="cursor-pointer">
                <img
                  src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
                  alt="Upload"
                  className="h-36 w-36 rounded-[28px] border border-dashed border-slate-300 bg-slate-50 object-cover p-2 transition hover:border-sky-400"
                />
              </label>

              <input
                type="file"
                id="doc-img"
                onChange={(e) => setDocImg(e.target.files[0])}
                hidden
              />
              <p className="mt-3 text-sm font-medium text-slate-500">
                Click to upload image
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="admin-label">First Name</label>
                <input
                  type="text"
                  placeholder="First name"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="admin-input"
                />
              </div>

              <div>
                <label className="admin-label">Last Name</label>
                <input
                  type="text"
                  placeholder="Last name"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="admin-input"
                />
              </div>

              <div>
                <label className="admin-label">Email</label>
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="admin-input"
                />
              </div>

              <div>
                <label className="admin-label">Password</label>
                <input
                  type="password"
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="admin-input"
                />
              </div>

              <div>
                <label className="admin-label">Experience</label>
                <input
                  type="text"
                  placeholder="Experience in years"
                  required
                  value={experience}
                  onChange={(e) => setExperince(e.target.value)}
                  className="admin-input"
                />
              </div>

              <div>
                <label className="admin-label">Fees</label>
                <input
                  type="number"
                  placeholder="Fees"
                  required
                  value={fees}
                  onChange={(e) => setFees(e.target.value)}
                  className="admin-input"
                />
              </div>

              <div>
                <label className="admin-label">Speciality</label>
                <select
                  required
                  value={speciality}
                  onChange={(e) => setSpeciality(e.target.value)}
                  className="admin-input"
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
                <label className="admin-label">Education</label>
                <input
                  type="text"
                  placeholder="Education"
                  required
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  className="admin-input"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="admin-label">Address Line 1</label>
                <input
                  type="text"
                  placeholder="Address line 1"
                  required
                  value={address1}
                  onChange={(e) => setAddress1(e.target.value)}
                  className="admin-input"
                />
              </div>
              <div>
                <label className="admin-label">Address Line 2</label>
                <input
                  type="text"
                  placeholder="Address line 2"
                  required
                  value={address2}
                  onChange={(e) => setAddress2(e.target.value)}
                  className="admin-input"
                />
              </div>
            </div>

            <div>
              <label className="admin-label">About</label>
              <textarea
                placeholder="Write about doctor..."
                rows={6}
                required
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                className="admin-input resize-none"
              ></textarea>
            </div>

            <div className="flex justify-end">
              <button type="submit" className="admin-primary-btn">
                Add Doctor
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddDoctor;
