import React from "react";
import { useContext } from "react";
import { AdminContext } from "../../context/AdminContext";
import { useEffect } from "react";
import Card from "../../components/card";

const DoctorsList = () => {
  const { doctors, aToken, getAllDoctors, changeAvailability } =
    useContext(AdminContext);
  useEffect(() => {
    getAllDoctors();
  }, [aToken]);
  return (
    <div>
      <h1>ALL Doctors</h1>
      <div className="grid md:grid-cols-3 sm:grid-cols-1 lg:grid-cols-3">
        {doctors.map((item, index) => (
          <Card
            item={item}
            key={index}
            changeAvailability={changeAvailability}
          />
        ))}
      </div>
    </div>
  );
};

export default DoctorsList;
