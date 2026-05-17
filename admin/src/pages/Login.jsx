import React, { useState, useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import axios from "axios";
import { toast } from "react-toastify";
import { DoctorContext } from "../context/DoctorContext";

const Login = () => {
  const [state, setState] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setAToken, backendUrl } = useContext(AdminContext);
  const { setDtoken } = useContext(DoctorContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (state === "Admin") {
        const { data } = await axios.post(`${backendUrl}/api/admin/login`, {
          email,
          password,
        });

        if (data.success) {
          localStorage.setItem("aToken", data.token);
          setAToken(data.token);
        } else {
          toast.error(data.message || "Login failed!");
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/api/doctor/login`, {
          email,
          password,
        });

        if (data.success) {
          localStorage.setItem("dToken", data.token);
          setDtoken(data.token);
          toast.success("Login successfully");
        } else {
          toast.error(data.message);
        }
      }
    } catch (err) {
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-[1fr_0.9fr]">
        <section className="admin-panel hidden px-8 py-10 lg:block">
          <span className="admin-kicker">Care administration</span>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight text-slate-950">
            Modern control for hospital and clinic operations.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-slate-600">
            Access a cleaner admin and doctor workspace for appointments, profiles,
            onboarding, and daily care coordination.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="admin-stat-card">
              <p className="text-2xl font-semibold text-slate-900">Fast</p>
              <p className="mt-2 text-sm leading-7 text-slate-500">
                Move between dashboards, appointments, and profile work without clutter.
              </p>
            </div>
            <div className="admin-stat-card">
              <p className="text-2xl font-semibold text-slate-900">Clear</p>
              <p className="mt-2 text-sm leading-7 text-slate-500">
                Use a single interface for both operations teams and doctors.
              </p>
            </div>
          </div>
        </section>

        <form className="admin-panel w-full px-8 py-10" onSubmit={onSubmitHandler}>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-700">
            Secure access
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-950">
            {state} login
          </h2>
          <p className="mt-2 text-sm leading-7 text-slate-500">
            Sign in to manage appointments, doctors, and care operations.
          </p>

          <div className="mt-8 space-y-5">
            <div>
              <label className="admin-label">Email</label>
              <input
                type="email"
                required
                placeholder="Enter your email"
                className="admin-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="admin-label">Password</label>
              <input
                type="password"
                required
                placeholder="Enter your password"
                className="admin-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="admin-primary-btn mt-8 w-full">
            Login
          </button>

          <p className="mt-5 text-sm text-slate-600">
            {state === "Admin" ? "Doctor login?" : "Admin login?"}{" "}
            <span
              className="cursor-pointer font-semibold text-sky-700"
              onClick={() => setState(state === "Admin" ? "Doctor" : "Admin")}
            >
              Switch here
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
