import React from "react";
import { assets } from "./../assets/assets";

const About = () => {
  return (
    <div className="flex flex-col md:flex-row items-center gap-10 px-8 md:px-20 py-16 bg-gray-50">
      {/* Left Text Section */}
      <div className="md:w-1/2 space-y-6">
        <h2 className="text-blue-600 font-semibold text-lg">ABOUT US</h2>
        <h1 className="text-4xl font-bold text-gray-800">
          Your Health, Our Priority
        </h1>
        <p className="text-gray-600 leading-relaxed">
          Welcome to{" "}
          <span className="font-semibold text-blue-600">Doctor+</span> — your
          trusted digital healthcare platform where you can easily find and
          consult with the right doctors anytime, anywhere. We bring together
          verified medical professionals across multiple specialties to ensure
          that you get the best care from the comfort of your home.
        </p>
        <p className="text-gray-600 leading-relaxed">
          Whether you need a quick consultation, a prescription, or continuous
          care, Prescripto helps you connect with top doctors instantly. We aim
          to make healthcare more accessible, secure, and efficient for
          everyone.
        </p>
        {/* <button className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
          Learn More
        </button> */}
      </div>

      {/* Right Image Section */}
      <div className="md:w-1/2 flex justify-center">
        <img
          src={assets.about_image}
          alt="About Prescripto"
          className="rounded-2xl shadow-lg w-full max-w-md"
        />
      </div>
    </div>
  );
};

export default About;
