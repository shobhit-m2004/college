import React, { useContext } from "react";
import { assets } from "./../assets/assets";
import { AdminContext } from "./../context/AdminContext";
import { useNavigate } from "react-router-dom";
import { DoctorContext } from "../context/DoctorContext";

const Navbar = () => {
  const { aToken, setAToken } = useContext(AdminContext);
  const { dToken, setDtoken } = useContext(DoctorContext);
  const navigate = useNavigate();
  return (
    <div className="flex justify-between border-b border-blue-200 bg-white px-2 py-1.5">
      <div className="flex gap-5 ml-4">
        <img src={assets.admin_logo} alt="" />
        <p
          className="flex  mt-4 border-2 px-2  border-blue-500 rounded-full  bg-gray-100 text-xs h-5
        "
        >
          {aToken ? "Admin" : "Doctor"}
        </p>
      </div>

      <button
        className="mt-4 bg-blue-500 mr-4 px-4 text-white rounded-full"
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
  );
};

export default Navbar;
