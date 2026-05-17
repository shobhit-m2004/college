import React, { useContext } from "react";
import { assets } from "./../assets/assets";
import { AdminContext } from "./../context/AdminContext";
import { useNavigate } from "react-router-dom";
import { DoctorContext } from "../context/DoctorContext";

const Navbar = () => {
  const { aToken, setAToken } = useContext(AdminContext);
  const { dToken, setDtoken } = useContext(DoctorContext);
  const navigate = useNavigate();

  const currentRole = aToken ? "Admin Workspace" : "Doctor Workspace";

  return (
    <header className="admin-panel px-5 py-4 sm:px-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="rounded-[24px] border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <img src={assets.admin_logo} alt="Admin logo" className="h-10" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-700">
              Care operations
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-slate-950">
              {currentRole}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="admin-chip">{aToken ? "Admin access" : "Doctor access"}</div>
          <button
            className="admin-primary-btn"
            onClick={() => {
              if (aToken) {
                localStorage.removeItem("aToken");
                setAToken("");
              }
              if (dToken) {
                localStorage.removeItem("dToken");
                setDtoken("");
              }
              navigate("/");
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
