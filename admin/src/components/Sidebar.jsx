import React, { useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import { assets } from "./../assets/assets";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const { aToken } = useContext(AdminContext);

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200  flex flex-col pt-6">
      {aToken && (
        <ul className="flex flex-col gap-2">
          <NavLink
            to="/admin-dashboard"
            className={({ isActive }) =>
              `flex items-center gap-4 px-6 py-3 rounded-lg font-medium transition-all duration-200 
              ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-800 hover:bg-gray-100"
              }`
            }
          >
            <img src={assets.home_icon} alt="" className="w-6 h-6" />
            <p>Dashboard</p>
          </NavLink>

          <NavLink
            to="/all-appointments"
            className={({ isActive }) =>
              `flex items-center gap-4 px-6 py-3 rounded-lg font-medium transition-all duration-200 
              ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-800 hover:bg-gray-100"
              }`
            }
          >
            <img src={assets.appointment_icon} alt="" className="w-6 h-6" />
            <p>Appointments</p>
          </NavLink>

          <NavLink
            to="/add-doctor"
            className={({ isActive }) =>
              `flex items-center gap-4 px-6 py-3 rounded-lg font-medium transition-all duration-200 
              ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-800 hover:bg-gray-100"
              }`
            }
          >
            <img src={assets.add_icon} alt="" className="w-6 h-6" />
            <p>Add Doctor</p>
          </NavLink>

          <NavLink
            to="/doctor-list"
            className={({ isActive }) =>
              `flex items-center gap-4 px-6 py-3 rounded-lg font-medium transition-all duration-200 
              ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-800 hover:bg-gray-100"
              }`
            }
          >
            <img src={assets.people_icon} alt="" className="w-6 h-6" />
            <p>Doctor List</p>
          </NavLink>
        </ul>
      )}
    </div>
  );
};

export default Sidebar;
