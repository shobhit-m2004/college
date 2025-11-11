import React from "react";
import { useContext } from "react";
import { AppContext } from "../context/context";

const MyAppointments = () => {
  const { doctors } = useContext(AppContext);
  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-6 space-y-6">
      <p className="text-2xl font-semibold text-gray-800 border-b pb-3">
        My Appointments
      </p>

      <div className="space-y-6">
        {doctors.slice(0, 2).map((item, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 border rounded-xl p-5 shadow-sm hover:shadow-md transition"
          >
            {/* Doctor Image */}
            <div className="flex-shrink-0">
              <img
                src={item.image}
                alt=""
                className="w-28 h-28 rounded-full object-cover border-2 border-gray-300"
              />
            </div>

            {/* Doctor Info */}
            <div className="flex-1 space-y-1 text-center md:text-left">
              <p className="text-lg font-semibold text-gray-800">{item.name}</p>
              <p className="text-gray-600">{item.speciality}</p>
              <p className="text-gray-500">{item.address.line1}</p>
              <p className="text-gray-500">{item.address.line2}</p>
              <p className="text-sm text-gray-700 mt-2">
                <span className="font-medium text-gray-800">DATE & TIME: </span>
                25 July 2025 | 8:30 PM
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 md:gap-2">
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
                Pay Online
              </button>
              <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">
                Cancel Appointment
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAppointments;
