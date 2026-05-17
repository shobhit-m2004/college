import React, { useContext, useState } from "react";
import { assets } from "./../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/context";
import { diseasePredictionUrl } from "../lib/diseasePrediction";
import { adminPanelUrl } from "../lib/adminPanel";
import { CalendarHeart, Menu, Sparkles, X } from "lucide-react";

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
  const [mobileOpen, setMobileOpen] = useState(false);

  const logout = () => {
    setToken("");
    localStorage.removeItem("token");
    setShowMenu(false);
  };

  return (
    <header className="sticky top-4 z-30 mb-6">
      <div className="section-shell flex items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <img
            className="w-36 cursor-pointer sm:w-40"
            src={assets.mylogo}
            alt="Logo"
            onClick={() => navigate("/")}
          />
          <div className="hidden rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 lg:flex">
            <Sparkles className="mr-2 h-4 w-4" />
            Smarter care journeys
          </div>
        </div>

        <ul className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50/80 p-2 md:flex">
          {navLinks.map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "bg-white text-sky-700 shadow-sm"
                      : "text-slate-600 hover:text-sky-700"
                  }`
                }
              >
                {link.name}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href={adminPanelUrl}
            target="_blank"
            rel="noreferrer"
            className="secondary-cta"
          >
            Admin Panel
          </a>
          <a
            href={diseasePredictionUrl}
            target="_blank"
            rel="noreferrer"
            className="secondary-cta"
          >
            <CalendarHeart className="h-4 w-4" />
            Disease Prediction
          </a>
          {token ? (
            <div className="relative">
              <button
                className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-2 py-2 shadow-sm transition hover:border-sky-200"
                onClick={() => setShowMenu((prev) => !prev)}
              >
                <img
                  className="h-9 w-9 rounded-full object-cover"
                  src={userData.image || "/DefaultPic.jpg"}
                  alt="Profile"
                />
                <span className="pr-2 text-sm font-semibold text-slate-700">
                  Account
                </span>
              </button>

              {showMenu && (
                <div className="absolute right-0 top-14 w-52 rounded-3xl border border-slate-200 bg-white p-3 shadow-[0_22px_60px_rgba(15,23,42,0.12)]">
                  <button
                    onClick={() => navigate("/my-profile")}
                    className="w-full rounded-2xl px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    My Profile
                  </button>
                  <button
                    onClick={() => navigate("/my-appointments")}
                    className="w-full rounded-2xl px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    My Appointments
                  </button>
                  <button
                    onClick={logout}
                    className="w-full rounded-2xl px-4 py-3 text-left text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="primary-cta" onClick={() => navigate("/login")}>
              Create Account
            </button>
          )}
        </div>

        <button
          className="rounded-full border border-slate-200 bg-white p-3 text-slate-700 md:hidden"
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="section-shell mt-3 space-y-3 p-4 md:hidden">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `block rounded-2xl px-4 py-3 text-sm font-semibold ${
                  isActive
                    ? "bg-sky-50 text-sky-700"
                    : "text-slate-700 hover:bg-slate-50"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
          <a
            href={adminPanelUrl}
            target="_blank"
            rel="noreferrer"
            className="secondary-cta w-full"
          >
            Admin Panel
          </a>
          <a
            href={diseasePredictionUrl}
            target="_blank"
            rel="noreferrer"
            className="secondary-cta w-full"
          >
            <CalendarHeart className="h-4 w-4" />
            Disease Prediction
          </a>
          {!token && (
            <button
              className="primary-cta w-full"
              onClick={() => {
                setMobileOpen(false);
                navigate("/login");
              }}
            >
              Create Account
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
