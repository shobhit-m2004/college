import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/context";
import Card from "../components/ui/card";

const Doctors = () => {
  const { speciality } = useParams();
  const [filterDoc, setFilterDoc] = useState([]);
  const { doctors } = useContext(AppContext);

  const specialities = [
    "General Physician",
    "Gynecologist",
    "Pediatrician",
    "Neurologist",
    "Gastroenterologist",
  ];

  const applyFilter = (selected) => {
    if (selected) {
      const filtered = doctors.filter(
        (item) => item.speciality.toLowerCase() === selected.toLowerCase()
      );
      setFilterDoc(filtered);
    } else {
      setFilterDoc(doctors);
    }
  };

  useEffect(() => {
    applyFilter(speciality);
  }, [doctors, speciality]);

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4">
      {/* Left Sidebar */}
      <div className="w-full md:w-1/4 flex flex-col gap-3">
        <p className="font-bold text-lg mb-2">Browse Doctors</p>
        {specialities.map((spec, index) => (
          <button
            key={index}
            onClick={() => applyFilter(spec)}
            className={`px-4 py-2 rounded-full border transition ${
              spec.toLowerCase() === speciality?.toLowerCase()
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-700 border-gray-300 hover:bg-blue-100"
            }`}
          >
            {spec}
          </button>
        ))}
      </div>

      {/* Right Content */}
      <div className="w-full md:w-3/4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filterDoc.length > 0 ? (
          filterDoc.map((item, index) => <Card key={index} item={item} />)
        ) : (
          <p>No doctors found.</p>
        )}
      </div>
    </div>
  );
};

export default Doctors;
