import { AppContext } from "../context/context";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { backendUrl, token, setToken } = useContext(AppContext);
  const [state, setState] = useState("Sign Up");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (state === "Sign Up") {
      //  console.log("Sign Up:", { firstName, lastName, email, password });

      try {
        const { data } = await axios.post(backendUrl + "/api/user/register", {
          firstName,
          lastName,
          email,
          password,
        });

        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
          toast.success("user Registered Succesfully");
        } else {
          toast.error(data.message);
        }
      } catch (err) {
        console.log(err.message);
        toast.error(err.message);
      }
    } else {
      // console.log("Login:", { email, password });

      try {
        const { data } = await axios.post(backendUrl + "/api/user/login", {
          email,
          password,
        });

        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
          toast.success("Login successfull");
        } else {
          toast.error(data.message);
        }
      } catch (err) {
        console.log(err.message);
        toast.error(err.message);
      }
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50">
      <form
        onSubmit={onSubmitHandler}
        className="bg-white shadow-md rounded-2xl p-8 w-full max-w-md space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-blue-600">
          {state === "Sign Up" ? "Create Account" : "Welcome Back"}
        </h2>

        {state === "Sign Up" && (
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-1/2 border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-1/2 border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
        )}

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {state === "Sign Up" ? "Sign Up" : "Login"}
        </button>

        <p className="text-center text-gray-600 text-sm">
          {state === "Sign Up" ? (
            <>
              Already have an account?{" "}
              <span
                onClick={() => setState("Login")}
                className="text-blue-600 font-semibold cursor-pointer"
              >
                Login
              </span>
            </>
          ) : (
            <>
              Don’t have an account?{" "}
              <span
                onClick={() => setState("Sign Up")}
                className="text-blue-600 font-semibold cursor-pointer"
              >
                Sign Up
              </span>
            </>
          )}
        </p>
      </form>
    </div>
  );
};

export default Login;
