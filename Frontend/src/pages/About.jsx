import React from "react";
import { assets } from "./../assets/assets";

const About = () => {
  return (
    <section className="section-shell grid items-center gap-10 px-6 py-10 sm:px-8 lg:grid-cols-2">
      <div className="space-y-5">
        <span className="section-kicker">About the platform</span>
        <h1 className="section-title">
          Your health, guided by a cleaner digital experience
        </h1>
        <p className="section-copy">
          Doctor+ helps patients move from searching to scheduling without the
          noise. We bring verified doctors, structured profiles, and a calmer
          appointment flow into one modern experience.
        </p>
        <p className="section-copy">
          Whether you need a quick consultation or ongoing specialist care, the
          platform is designed to make access feel simpler, more personal, and
          more reliable.
        </p>
      </div>

      <div className="flex justify-center">
        <img
          src={assets.about_image}
          alt="About Prescripto"
          className="w-full max-w-xl rounded-[32px] shadow-[0_28px_80px_rgba(15,23,42,0.16)]"
        />
      </div>
    </section>
  );
};

export default About;
