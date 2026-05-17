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
    <section className="admin-panel px-6 py-8 sm:px-8">
      <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="admin-kicker">Appointment management</span>
          <h1 className="mt-3 text-3xl font-semibold text-slate-950">
            All appointments
          </h1>
        </div>
        <div className="admin-chip">{appointments.length} records</div>
      </div>

      <div className="mt-6 hidden grid-cols-[70px_1.4fr_0.7fr_1fr_1fr_0.7fr_0.9fr] gap-4 rounded-[24px] border border-slate-200 bg-slate-50 px-5 py-4 text-sm font-bold uppercase tracking-[0.12em] text-slate-500 lg:grid">
        <p>#</p>
        <p>Patient</p>
        <p>Age</p>
        <p>Date & Time</p>
        <p>Doctor</p>
        <p>Fees</p>
        <p>Action</p>
      </div>

      <div className="mt-4 space-y-4">
        {appointments.map((item, index) => (
          <div
            key={index}
            className="admin-table-row grid gap-4 lg:grid-cols-[70px_1.4fr_0.7fr_1fr_1fr_0.7fr_0.9fr] lg:items-center"
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400 lg:hidden">
                Number
              </p>
              <p className="font-semibold text-slate-700">{index + 1}</p>
            </div>

            <div className="flex items-center gap-3">
              <img
                src={item?.userData?.image}
                className="h-11 w-11 rounded-2xl border border-slate-200 object-cover"
                alt=""
              />
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400 lg:hidden">
                  Patient
                </p>
                <p className="font-semibold text-slate-900">
                  {item?.userData?.firstName} {item?.userData?.lastName}
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400 lg:hidden">
                Age
              </p>
              <p className="font-medium text-slate-700">
                {item?.userData?.dob ? calculateAge(item.userData.dob) : "--"}
              </p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400 lg:hidden">
                Date & Time
              </p>
              <p className="font-medium text-slate-900">{item?.slotDate}</p>
              <p className="text-sm text-slate-500">{item?.slotTime}</p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400 lg:hidden">
                Doctor
              </p>
              <p className="font-medium text-slate-700">
                {item?.docData?.firstName} {item?.docData?.lastName}
              </p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400 lg:hidden">
                Fees
              </p>
              <p className="font-semibold text-slate-900">Rs. {item?.amount}</p>
            </div>

            <div>
              {!item.cancelled ? (
                <button
                  className="admin-danger-btn"
                  onClick={() => cancelAppointment(item._id)}
                >
                  Cancel
                </button>
              ) : (
                <span className="admin-chip bg-slate-100 text-slate-500">
                  Cancelled
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AllAppointments;
