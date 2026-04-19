import React from "react";
import { specialityData } from "../assets/assets";
import { Link } from "react-router-dom";

const SpecialityMenu = () => {
  return (
    <div id="speciality">
      {/* {console.log(specialityData)} */}
      <h1
        style={{ fontFamily: "'Comic Sans MS', cursive" }}
        className="text-4xl flex justify-center mt-10"
      >
        Find by speciality
      </h1>
      <p className="text-xl mt-4 flex justify-center">
        Simply browse through our extensive list of trusted doctors, schedule
        your appointment hassle-free
      </p>
      <div className="flex flex-col justify-center md:flex-row md:justify-between mt-9">
        {specialityData.map((item, index) => (
          <Link
            key={index}
            to={`/doctors/${item.speciality}`}
            className="flex  flex-col items-center"
          >
            <img className="w-[100px]" src={item.image} alt="" />
            <p style={{ fontFamily: "'Comic Sans MS', cursive" }} className="">
              {item.speciality}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SpecialityMenu;
