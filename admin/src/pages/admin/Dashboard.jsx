import React, { useContext, useEffect } from "react";
import { AdminContext } from "./../../context/AdminContext";
import { assets } from "./../../assets/assets";

const Dashboard = () => {
  const { aToken, getDashData, dashData, cancelAppointment } =
    useContext(AdminContext);

  useEffect(() => {
    if (aToken) getDashData();
  }, [aToken]);

  return (
    dashData && (
      <div className="p-6 space-y-10">
        {/* Top Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Doctors */}
          <div className="flex items-center gap-4 p-5 bg-white shadow-md rounded-xl hover:shadow-lg transition">
            <img src={assets.doctor_icon} className="w-14 h-14" />
            <div>
              <p className="text-3xl font-bold text-gray-800">
                {dashData.doctors}
              </p>
              <p className="text-gray-500 text-sm">Doctors</p>
            </div>
          </div>

          {/* Appointments */}
          <div className="flex items-center gap-4 p-5 bg-white shadow-md rounded-xl hover:shadow-lg transition">
            <img src={assets.appointment_icon} className="w-14 h-14" />
            <div>
              <p className="text-3xl font-bold text-gray-800">
                {dashData.appointments}
              </p>
              <p className="text-gray-500 text-sm">Appointments</p>
            </div>
          </div>

          {/* Patients */}
          <div className="flex items-center gap-4 p-5 bg-white shadow-md rounded-xl hover:shadow-lg transition">
            <img src={assets.patients_icon} className="w-14 h-14" />
            <div>
              <p className="text-3xl font-bold text-gray-800">
                {dashData.patients}
              </p>
              <p className="text-gray-500 text-sm">Patients</p>
            </div>
          </div>
        </div>

        {/* Latest Bookings */}
        <div className="bg-white shadow-md rounded-xl">
          <div className="flex items-center gap-3 px-5 py-4 border-b rounded-t-xl bg-gray-50">
            <img src={assets.list_icon} className="w-5" />
            <p className="font-semibold text-gray-700">Latest Bookings</p>
          </div>

          <div className="divide-y">
            {dashData.latestAppointments.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition"
              >
                {/* Left - Doctor Info */}
                <div className="flex items-center gap-4">
                  <img
                    src={item.docData.image}
                    alt=""
                    className="w-14 h-14 rounded-full object-cover border"
                  />

                  <div>
                    <p className="font-semibold text-gray-800">
                      {item.docData.firstName} {item.docData.lastName}
                    </p>
                    <p className="text-sm text-gray-500">{item.slotDate}</p>
                  </div>
                </div>

                {/* Right - Buttons */}
                {!item.cancelled && (
                  <button
                    onClick={() => cancelAppointment(item._id)}
                    className="px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    Cancel
                  </button>
                )}

                {item.cancelled && (
                  <button
                    disabled
                    className="px-4 py-2 text-sm bg-gray-400 text-white rounded-md cursor-not-allowed"
                  >
                    Cancelled
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  );
};

export default Dashboard;
