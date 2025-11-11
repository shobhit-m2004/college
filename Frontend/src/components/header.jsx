// import React from "react";
// import { assets } from "./../assets/assets";

// const Header = () => {
//   return (
//     <div className="flex flex-col md:flex-row flex-wrap bg-black rounded-lg px-6 md:px-10">
//       {/* Left side */}
//       <div className="md:w-1/2 flex flex-col items-start justify-center gap-4 py-10 m-auto md:py-[10vw]">
//         <p className="text-3xl md:text-4xl lg:text-5xl text-white font-extrabold">
//           Book Appointment <br /> With Trusted Doctors
//         </p>
//         <div>
//           <img src={assets.group_profiles} alt="Group profiles" />
//           <p className="text-white mt-2">
//             Simply browse through our extensive list of trusted doctors,
//             <br />
//             and schedule your appointment easily.
//           </p>
//         </div>
//         <div>
//           <a
//             href="#speciality"
//             className="inline-flex items-center gap-2 bg-white text-blue-600 font-semibold px-4 py-2 mt-4 rounded-full shadow hover:bg-gray-100 transition"
//           >
//             Book Appointment
//             <img src={assets.arrow_icon} alt="Arrow icon" className="w-4 h-4" />
//           </a>
//         </div>
//       </div>

//       {/* Right side */}
//       <div className="md:w-1/2 relative">
//         <img
//           src={assets.header_img}
//           alt="Doctor consultation"
//           className="w-full md:absolute bottom-0 h-auto rounded-lg"
//         />
//       </div>
//     </div>
//   );
// };

// export default Header;

import React from "react";
import { assets } from "./../assets/assets";

const Header = () => {
  return (
    <div className="relative bg-black rounded-2xl overflow-hidden flex flex-col items-center justify-center px-6 md:px-12 py-16 text-center">
      {/* Decorative Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-800/20 to-transparent blur-3xl pointer-events-none"></div>

      {/* Top Text Section */}
      <div className="max-w-3xl z-10">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
          Book Appointment <br /> With Trusted Doctors
        </h1>

        <div className="mt-6">
          <img
            src={assets.group_profiles}
            alt="Group profiles"
            className="mx-auto"
          />
          <p className="text-gray-200 mt-4 text-lg">
            Simply browse through our extensive list of trusted doctors,
            <br className="hidden md:block" />
            and schedule your appointment easily.
          </p>
        </div>

        <a
          href="#speciality"
          className="inline-flex items-center gap-2 bg-white text-blue-600 font-semibold px-6 py-3 mt-8 rounded-full shadow-md hover:bg-gray-100 transition animate-spin"
          style={{ animationDuration: "2s" }}
        >
          Book Appointment
          <img src={assets.arrow_icon} alt="Arrow icon" className="w-4 h-4" />
        </a>
      </div>

      {/* Doctor Image Floating at Bottom */}
      <div className="relative mt-12 w-full max-w-4xl">
        <img
          src={assets.header_img}
          alt="Doctor consultation"
          className="rounded-xl w-full h-auto shadow-2xl"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl"></div>
      </div>
    </div>
  );
};

export default Header;
