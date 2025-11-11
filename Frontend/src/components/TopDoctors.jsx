import React, { useContext } from "react";
import Card from "./ui/card";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/context";
const TopDoctors = () => {
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-2">Top Doctors to Book</h1>
      <p className="text-gray-600 mb-6">
        Simply browse through our extensive list of trusted doctors.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-4 gap-x-2 ">
        {doctors?.length ? (
          doctors
            .slice(0, 10)
            .map((item, index) => <Card key={index} item={item} />)
        ) : (
          <p>No doctors available at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default TopDoctors;
