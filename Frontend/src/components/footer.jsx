import { assets } from "../assets/assets";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 p-8">
      {/* Top section */}
      <div className="flex flex-wrap justify-between gap-8">
        {/* Left */}
        <div className="flex-1 min-w-[200px]">
          <img src={assets.mylogo} alt="Logo" className="w-32 mb-4" />
          <p className="text-gray-700 text-sm">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti
            libero nulla, quos veniam necessitatibus expedita, illo enim iure
            labore unde suscipit.
          </p>
        </div>

        {/* Center */}
        <div className="flex-1 min-w-[150px]">
          <p className="font-semibold mb-2">COMPANY</p>
          <ul className="space-y-1 text-gray-700 text-sm">
            <li>Home</li>
            <li>About us</li>
            <li>Contact us</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        {/* Right */}
        <div className="flex-1 min-w-[150px]">
          <p className="font-semibold mb-2">GET IN TOUCH</p>
          <ul className="space-y-1 text-gray-700 text-sm">
            <li>9935076320</li>
            <li>Email</li>
          </ul>
        </div>
      </div>

      {/* Bottom section */}
      <div className="mt-6 border-t pt-4 text-center text-gray-500 text-sm">
        all copyright reserved Shobhit Mishra
      </div>
    </footer>
  );
};

export default Footer;
