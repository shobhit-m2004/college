import React, { useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import { assets } from "./../assets/assets";
import { NavLink } from "react-router-dom";
import { DoctorContext } from "../context/DoctorContext";

const SidebarLink = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-4 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
        isActive
          ? "bg-sky-600 text-white shadow-[0_14px_30px_rgba(14,96,172,0.22)]"
          : "text-slate-700 hover:bg-slate-50 hover:text-sky-700"
      }`
    }
  >
    <img src={icon} alt="" className="h-5 w-5" />
    <span>{label}</span>
  </NavLink>
);

const Sidebar = () => {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);

  return (
    <aside className="admin-panel h-fit w-full p-4 lg:sticky lg:top-6 lg:w-72">
      <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-700">
          Navigation
        </p>
        <p className="mt-2 text-sm leading-7 text-slate-600">
          Switch between dashboards, appointments, profiles, and doctor management
          from one unified control panel.
        </p>
      </div>

      {aToken && (
        <ul className="mt-4 space-y-2">
          <SidebarLink
            to="/admin-dashboard"
            icon={assets.home_icon}
            label="Dashboard"
          />
          <SidebarLink
            to="/all-appointments"
            icon={assets.appointment_icon}
            label="Appointments"
          />
          <SidebarLink
            to="/add-doctor"
            icon={assets.add_icon}
            label="Add Doctor"
          />
          <SidebarLink
            to="/doctor-list"
            icon={assets.people_icon}
            label="Doctor List"
          />
        </ul>
      )}

      {dToken && (
        <ul className="mt-4 space-y-2">
          <SidebarLink
            to="/doctor-dashboard"
            icon={assets.home_icon}
            label="Dashboard"
          />
          <SidebarLink
            to="/doctor-appointments"
            icon={assets.appointment_icon}
            label="Appointments"
          />
          <SidebarLink
            to="/doctor-profile"
            icon={assets.people_icon}
            label="My Profile"
          />
        </ul>
      )}
    </aside>
  );
};

export default Sidebar;
