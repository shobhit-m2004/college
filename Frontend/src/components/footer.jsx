import { assets } from "../assets/assets";
import React from "react";
import { NavLink } from "react-router-dom";
import { CalendarHeart, MapPin, Phone } from "lucide-react";
import { diseasePredictionUrl } from "../lib/diseasePrediction";
import { adminPanelUrl } from "../lib/adminPanel";

const Footer = () => {
  return (
    <footer className="mt-10">
      <div className="section-shell px-6 py-10 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div className="space-y-4">
            <img src={assets.mylogo} alt="Logo" className="w-36" />
            <p className="max-w-md text-sm leading-7 text-slate-600">
              A modern healthcare booking experience built to help patients find
              the right doctor, lock in a slot faster, and stay confident through
              every step of care.
            </p>
            <a
              href={diseasePredictionUrl}
              target="_blank"
              rel="noreferrer"
              className="secondary-cta"
            >
              <CalendarHeart className="h-4 w-4" />
              Open Disease Prediction
            </a>
            <a
              href={adminPanelUrl}
              target="_blank"
              rel="noreferrer"
              className="secondary-cta"
            >
              Open Admin Panel
            </a>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
              Navigate
            </p>
            <div className="mt-4 space-y-3 text-sm font-medium text-slate-600">
              <NavLink className="block hover:text-sky-700" to="/">
                Home
              </NavLink>
              <NavLink className="block hover:text-sky-700" to="/doctors">
                All Doctors
              </NavLink>
              <NavLink className="block hover:text-sky-700" to="/about">
                About Us
              </NavLink>
              <NavLink className="block hover:text-sky-700" to="/contact">
                Contact
              </NavLink>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
              Reach us
            </p>
            <div className="mt-4 space-y-4 text-sm text-slate-600">
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 text-sky-700" />
                <span>+91 99350 76320</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-sky-700" />
                <span>Patient-first digital care, available wherever you are.</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-slate-200 pt-5 text-sm text-slate-500">
          Copyright reserved by Shobhit Mishra.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
