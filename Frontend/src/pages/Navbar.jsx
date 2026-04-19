import React, { useContext, useEffect, useState } from "react";
import { assets } from "./../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/context";

const Navbar = () => {
  const navLinks = [
    { name: "HOME", path: "/" },
    { name: "ALL DOCTORS", path: "/doctors" },
    { name: "ABOUT", path: "/about" },
    { name: "CONTACT", path: "/contact" },
  ];

  const navigate = useNavigate();
  const { token, setToken, userData } = useContext(AppContext);
  const [showMenu, setShowMenu] = useState(false);

  const logout = () => {
    setToken("");
    localStorage.removeItem("token");
  };

  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-gray-400">
      {/* ✅ Added onClick to logo to navigate home */}
      <img
        className="w-44 cursor-pointer"
        src={assets.mylogo}
        alt="Logo"
        onClick={() => navigate("/")}
      />

      {/* ✅ Fixed responsive nav links */}
      <ul className="gap-6 pr-6 hidden md:flex">
        {navLinks.map((link, index) => (
          <li key={index}>
            <NavLink
              to={link.path}
              className={({ isActive }) =>
                `${
                  isActive
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "hover:text-blue-500"
                }`
              }
            >
              {link.name}
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-4">
        {token ? (
          <div
            className="flex items-center gap-2 cursor-pointer group relative"
            onClick={() => setShowMenu((prev) => !prev)}
          >
            <img
              className="w-8 rounded-full"
              src={userData.image || "/DefaultPic.jpg"}
              alt="Profile"
            />
            <img src={assets.dropdown_icon} alt="Dropdown" />

            {showMenu && (
              <div className="absolute top-12 right-0 w-44 bg-stone-100 border border-gray-300 rounded-2xl shadow-md p-3 space-y-2 z-10">
                <p
                  onClick={() => navigate("/my-profile")}
                  className="hover:text-black cursor-pointer text-cyan-800"
                >
                  My Profile
                </p>
                <p
                  onClick={() => navigate("/my-appointments")}
                  className="hover:text-black cursor-pointer text-cyan-800"
                >
                  My Appointments
                </p>
                <p
                  onClick={logout}
                  className="hover:text-black cursor-pointer text-cyan-800"
                >
                  Logout
                </p>
              </div>
            )}
          </div>
        ) : (
          <button
            className="btn btn-outline btn-info"
            onClick={() => navigate("/login")}
          >
            Create Account
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
