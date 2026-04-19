import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { DoctorContext } from "../../context/DoctorContext";
import { assets } from "../../assets/assets"; // your icons
import { toast } from "react-toastify";

const DoctorDashboard = () => {
  const {
    backendUrl,
    dToken,
    cancelAppointment: cancelApi,
  } = useContext(DoctorContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // -------------------------
  // FETCH ALL APPOINTMENTS
  // -------------------------
  const getAppointments = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/doctor/my-appointments`,
        {
          headers: { dtoken: dToken },
        }
      );

      if (data.success) setAppointments(data.appointments);
      else toast.error(data.message);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (dToken) getAppointments();
  }, [dToken]);

  // -------------------------
  // DASHBOARD STATS
  // -------------------------
  const today = new Date();
  const todayFormatted = `${today.getDate()}_${
    today.getMonth() + 1
  }_${today.getFullYear()}`;

  const todaysAppointments = appointments.filter(
    (a) => a.slotDate === todayFormatted
  );
  const completedAppointments = appointments.filter((a) => a.isCompleted);
  const cancelledAppointments = appointments.filter((a) => a.cancelled);
  const todaysEarnings = todaysAppointments
    .filter((a) => a.isCompleted)
    .reduce((sum, a) => sum + (a.amount || 0), 0);

  // -------------------------
  // CANCEL APPOINTMENT
  // -------------------------
  const cancelAppointment = async (id) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/cancel-appointment`,
        { appointmentId: id },
        { headers: { dtoken: dToken } }
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

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 space-y-10">
      {/* Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="flex items-center gap-4 p-5 bg-white shadow-md rounded-xl hover:shadow-lg transition">
          <img src={assets.appointment_icon} className="w-14 h-14" />
          <div>
            <p className="text-3xl font-bold text-gray-800">
              {todaysAppointments.length}
            </p>
            <p className="text-gray-500 text-sm">Today's Appointments</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-5 bg-white shadow-md rounded-xl hover:shadow-lg transition">
          <img src={assets.tick_icon} className="w-14 h-14" />
          <div>
            <p className="text-3xl font-bold text-gray-800">
              {completedAppointments.length}
            </p>
            <p className="text-gray-500 text-sm">Completed</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-5 bg-white shadow-md rounded-xl hover:shadow-lg transition">
          <img src={assets.cancel_icon} className="w-14 h-14" />
          <div>
            <p className="text-3xl font-bold text-gray-800">
              {cancelledAppointments.length}
            </p>
            <p className="text-gray-500 text-sm">Cancelled</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-5 bg-white shadow-md rounded-xl hover:shadow-lg transition">
          <img src={assets.earning_icon} className="w-14 h-14" />
          <div>
            <p className="text-3xl font-bold text-gray-800">
              ₹{todaysEarnings}
            </p>
            <p className="text-gray-500 text-sm">Today's Earnings</p>
          </div>
        </div>
      </div>

      {/* Latest Appointments */}
      <div className="bg-white shadow-md rounded-xl">
        <div className="flex items-center gap-3 px-5 py-4 border-b rounded-t-xl bg-gray-50">
          <img src={assets.list_icon} className="w-5" />
          <p className="font-semibold text-gray-700">Latest Appointments</p>
        </div>

        <div className="divide-y">
          {appointments
            .slice(-5)
            .reverse()
            .map(
              (item) =>
                !item.isCompleted && (
                  <div
                    key={item._id}
                    className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition"
                  >
                    {/* Left - Patient Info */}
                    <div className="flex items-center gap-4">
                      <img
                        src={
                          item.userData?.image ||
                          "https://img.freepik.com/free-psd/3d-rendered-user-icon-blue-circle_84443-55891.jpg"
                        }
                        alt=""
                        className="w-14 h-14 rounded-full object-cover border"
                      />
                      <div>
                        <p className="font-semibold text-gray-800">
                          {item.userData.firstName} {item.userData.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{item.slotDate}</p>
                      </div>
                    </div>

                    {/* Right - Buttons */}
                    {!item.cancelled ? (
                      <button
                        onClick={() => cancelAppointment(item._id)}
                        className="px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
                      >
                        Cancel
                      </button>
                    ) : (
                      <button
                        disabled
                        className="px-4 py-2 text-sm bg-gray-400 text-white rounded-md cursor-not-allowed"
                      >
                        Cancelled
                      </button>
                    )}
                  </div>
                )
            )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
