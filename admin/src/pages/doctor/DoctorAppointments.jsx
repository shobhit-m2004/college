import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { DoctorContext } from "../../context/DoctorContext";
import { toast } from "react-toastify";

const DoctorAppointments = () => {
  const { backendUrl, dToken } = useContext(DoctorContext);
  const [appointments, setAppointments] = useState([]);

  const getAppointments = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/doctor/my-appointments",
        {
          headers: {
            dtoken: dToken,
          },
        }
      );

      if (data.success) {
        setAppointments(data.appointments);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  // --------------------------
  //  CANCEL APPOINTMENT (POST)
  // --------------------------
  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/doctor/cancel-appointment",
        { appointmentId },
        {
          headers: {
            dtoken: dToken,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        getAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  // ------------------------------
  //  MARK APPOINTMENT COMPLETED
  // ------------------------------
  const AppointmentCompleted = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/doctor/appointment-completed",
        { appointmentId },
        {
          headers: {
            dtoken: dToken,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        getAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    getAppointments();
  }, [dToken]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">My Appointments</h2>

      {!appointments?.length && (
        <p className="text-gray-400">No appointments available.</p>
      )}

      <div className="grid gap-4">
        {appointments.map(
          (item, index) =>
            !item?.isCompleted && (
              <div
                key={index}
                className="flex gap-4 bg-white p-4 rounded-xl shadow border hover:shadow-lg transition"
              >
                {/* IMAGE */}
                <div>
                  <img
                    src={
                      item?.userData?.image ||
                      "https://img.freepik.com/free-psd/3d-rendered-user-icon-blue-circle_84443-55891.jpg"
                    }
                    className="w-20 h-20 rounded-full object-cover border"
                    alt="user"
                  />
                </div>

                {/* DETAILS */}
                <div className="flex flex-col justify-between">
                  <div>
                    <p className="font-semibold text-lg">
                      {item?.userData?.firstName} {item?.userData?.lastName}
                    </p>
                    <p className="text-gray-600">Slot Date: {item?.slotDate}</p>
                    <p className="text-gray-600">Slot Time: {item?.slotTime}</p>
                  </div>

                  {/* BUTTONS */}
                  {!item.cancelled ? (
                    <div className="flex gap-3 mt-3">
                      <button
                        onClick={() => cancelAppointment(item._id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        Cancel
                      </button>

                      <button
                        onClick={() => AppointmentCompleted(item._id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        Completed
                      </button>
                    </div>
                  ) : (
                    <div className="mt-3">
                      <span className="px-4 py-2 bg-gray-400 text-white rounded-lg">
                        Cancelled
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )
        )}
      </div>
    </div>
  );
};

export default DoctorAppointments;
