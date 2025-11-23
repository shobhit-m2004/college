import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/Appcontext";

const AllAppointments = () => {
  const { aToken, appointments, getAllAppointments, cancelAppointment } =
    useContext(AdminContext);
  const { calculateAge } = useContext(AppContext);

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken]);

  return (
    <div className="p-5 w-full">
      <h2 className="text-xl font-semibold mb-4">All Appointments</h2>

      {/* ----- Desktop Header ----- */}
      <div className="hidden md:grid grid-cols-7 bg-gray-100 font-semibold p-4 rounded-t-lg text-sm">
        <p>#</p>
        <p>Patient</p>
        <p>Age</p>
        <p>Date & Time</p>
        <p>Doctor</p>
        <p>Fees</p>
        <p>Action</p>
      </div>

      {/* ----- Rows ----- */}
      {appointments.map((item, index) => (
        <div
          key={index}
          className="
            grid md:grid-cols-7 
            grid-cols-1 gap-3 
            p-4 border-b 
            hover:bg-gray-50 transition 
            text-sm
          "
        >
          {/* Index */}
          <p className="md:hidden text-gray-500 text-xs">#</p>
          <p className="font-semibold">{index + 1}</p>

          {/* Patient */}
          <div className="flex items-center gap-3">
            <img
              src={item?.userData?.image}
              className="w-10 h-10 rounded-full object-cover"
              alt=""
            />
            <p>
              {item?.userData?.firstName} {item?.userData?.lastName}
            </p>
          </div>

          {/* Age */}
          <div>
            <p className="md:hidden text-gray-500 text-xs">Age</p>
            <p>
              {item?.userData?.dob ? calculateAge(item.userData.dob) : "--"}
            </p>
          </div>

          {/* Date & Time */}
          <div>
            <p className="md:hidden text-gray-500 text-xs">Date & Time</p>
            <p>
              {item?.slotDate}
              <br />
              <span className="text-gray-500">{item?.slotTime}</span>
            </p>
          </div>

          {/* Doctor */}
          <div>
            <p className="md:hidden text-gray-500 text-xs">Doctor</p>
            <p>
              {item?.docData?.firstName} {item?.docData?.lastName}
            </p>
          </div>

          {/* Fees */}
          <div>
            <p className="md:hidden text-gray-500 text-xs">Fees</p>
            <p>₹{item?.amount}</p>
          </div>

          {/* Action Button */}
          <div>
            <p className="md:hidden text-gray-500 text-xs">Action</p>
            {!item.cancelled && (
              <button
                className="px-3 py-1 text-sm bg-green-500 text-white rounded-md hover:bg-green-600"
                onClick={() => cancelAppointment(item._id)}
              >
                Cancel
              </button>
            )}
            {item.cancelled && (
              <button
                className="px-3 py-1 text-sm bg-stone-400 text-white rounded-md"
                onClick={() => cancelAppointment(item._id)}
              >
                Cancelled
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AllAppointments;
