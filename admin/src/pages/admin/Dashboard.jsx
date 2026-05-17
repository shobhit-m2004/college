import React, { useContext, useEffect } from "react";
import { AdminContext } from "./../../context/AdminContext";
import { assets } from "./../../assets/assets";

const Dashboard = () => {
  const { aToken, getDashData, dashData, cancelAppointment } =
    useContext(AdminContext);

  useEffect(() => {
    if (aToken) getDashData();
  }, [aToken]);

  if (!dashData) return null;

  const stats = [
    { label: "Doctors", value: dashData.doctors, icon: assets.doctor_icon },
    {
      label: "Appointments",
      value: dashData.appointments,
      icon: assets.appointment_icon,
    },
    { label: "Patients", value: dashData.patients, icon: assets.patients_icon },
  ];

  return (
    <div className="space-y-6">
      <section className="admin-panel px-6 py-8 sm:px-8">
        <div className="space-y-3">
          <span className="admin-kicker">Operations overview</span>
          <h1 className="admin-title">Monitor doctors, patients, and fresh bookings</h1>
          <p className="admin-copy max-w-3xl">
            Stay on top of platform activity with a cleaner dashboard designed for
            quick reviews and faster appointment handling.
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
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
            <h2 className="text-xl font-semibold text-slate-900">Latest bookings</h2>
            <p className="text-sm text-slate-500">
              Review the newest appointment activity and take action quickly.
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          {dashData.latestAppointments.map((item, index) => (
            <div
              key={index}
              className="admin-table-row flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.docData.image}
                  alt=""
                  className="h-14 w-14 rounded-2xl border border-slate-200 object-cover"
                />

                <div>
                  <p className="font-semibold text-slate-900">
                    {item.docData.firstName} {item.docData.lastName}
                  </p>
                  <p className="text-sm text-slate-500">{item.slotDate}</p>
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
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
