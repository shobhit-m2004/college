import React, { useState, useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [state, setState] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setAToken, backendUrl } = useContext(AdminContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (state === "Admin") {
        const { data } = await axios.post(backendUrl + "/api/admin/login", {
          email,
          password,
        });

        if (data.success) {
          localStorage.setItem("aToken", data.token);
          setAToken(data.token);
          console.log(data.token);
        } else {
          toast.error(data.message || "Login failed!");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen to-indigo-700">
      <form
        className="bg-white p-8 rounded-2xl shadow-xl w-80"
        onSubmit={onSubmitHandler}
      >
        <p className="text-center text-2xl font-semibold text-gray-800 mb-6">
          <span className="text-indigo-600">{state}</span> Login
        </p>

        <div className="mb-4">
          <p className="mb-1 font-medium text-gray-700">Email</p>
          <input
            type="email"
            required
            placeholder="Enter your email"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <p className="mb-1 font-medium text-gray-700">Password</p>
          <input
            type="password"
            required
            placeholder="Enter your password"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition-all duration-200"
        >
          Login
        </button>

        {state === "Admin" ? (
          <p className="mt-4">
            Doctor Login?{" "}
            <span className="cursor-pointer" onClick={() => setState("Doctor")}>
              click here
            </span>
          </p>
        ) : (
          <p className="mt-4">
            Admin Login?{" "}
            <span className="cursor-pointer" onClick={() => setState("Admin")}>
              click here
            </span>
          </p>
        )}
      </form>
    </div>
  );
};

export default Login;
