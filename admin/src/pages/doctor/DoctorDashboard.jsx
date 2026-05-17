import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { DoctorContext } from "../../context/DoctorContext";
import { assets } from "../../assets/assets";
import { toast } from "react-toastify";

const DoctorDashboard = () => {
  const { backendUrl, dToken } = useContext(DoctorContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <div className="admin-panel px-6 py-8 text-slate-500">Loading...</div>;
  }

  const stats = [
    {
      label: "Today's Appointments",
      value: todaysAppointments.length,
      icon: assets.appointment_icon,
    },
    { label: "Completed", value: completedAppointments.length, icon: assets.tick_icon },
    { label: "Cancelled", value: cancelledAppointments.length, icon: assets.cancel_icon },
    { label: "Today's Earnings", value: `Rs. ${todaysEarnings}`, icon: assets.earning_icon },
  ];

  return (
    <div className="space-y-6">
      <section className="admin-panel px-6 py-8 sm:px-8">
        <span className="admin-kicker">Doctor overview</span>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950">
          Stay on top of your appointment day
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
          Review today's schedule, track progress, and manage patient bookings from
          one modern doctor workspace.
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="admin-stat-card flex items-center gap-4">
              <div className="rounded-[24px] bg-white p-4 shadow-sm">
                <img src={stat.icon} className="h-12 w-12" alt="" />
              </div>
              <div>
                <p className="text-3xl font-semibold text-slate-900">{stat.value}</p>
                <p className="mt-1 text-sm font-medium text-slate-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="admin-panel px-6 py-6 sm:px-8">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
          <img src={assets.list_icon} className="h-5 w-5" alt="" />
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Latest appointments</h2>
            <p className="text-sm text-slate-500">Recent appointment activity that still needs attention.</p>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          {appointments
            .slice(-5)
            .reverse()
            .map(
              (item) =>
                !item.isCompleted && (
                  <div
                    key={item._id}
                    className="admin-table-row flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={
                          item.userData?.image ||
                          "https://img.freepik.com/free-psd/3d-rendered-user-icon-blue-circle_84443-55891.jpg"
                        }
                        alt=""
                        className="h-14 w-14 rounded-2xl border border-slate-200 object-cover"
                      />
                      <div>
                        <p className="font-semibold text-slate-900">
                          {item.userData.firstName} {item.userData.lastName}
                        </p>
                        <p className="text-sm text-slate-500">
                          {item.slotDate} • {item.slotTime}
                        </p>
                      </div>
                    </div>

                    {!item.cancelled ? (
                      <button
                        onClick={() => cancelAppointment(item._id)}
                        className="admin-danger-btn"
                      >
                        Cancel
                      </button>
                    ) : (
                      <span className="admin-chip bg-slate-100 text-slate-500">
                        Cancelled
                      </span>
                    )}
                  </div>
                )
            )}
        </div>
      </section>
    </div>
  );
};

export default DoctorDashboard;
