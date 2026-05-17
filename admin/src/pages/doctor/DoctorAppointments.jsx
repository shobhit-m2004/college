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
        `${backendUrl}/api/doctor/my-appointments`,
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

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/cancel-appointment`,
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

  const appointmentCompleted = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/appointment-completed`,
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

  const activeAppointments = appointments.filter((item) => !item?.isCompleted);

  return (
    <section className="space-y-6">
      <div className="admin-panel px-6 py-8 sm:px-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="admin-kicker">Doctor appointment desk</span>
            <h1 className="mt-3 text-3xl font-semibold text-slate-950">
              My appointments
            </h1>
          </div>
          <div className="admin-chip">{activeAppointments.length} active bookings</div>
        </div>
      </div>

      {!activeAppointments.length && (
        <div className="admin-panel px-6 py-8 text-slate-400">No appointments available.</div>
      )}

      <div className="grid gap-4">
        {activeAppointments.map((item, index) => (
          <div key={index} className="admin-table-row flex flex-col gap-4 md:flex-row">
            <div>
              <img
                src={
                  item?.userData?.image ||
                  "https://img.freepik.com/free-psd/3d-rendered-user-icon-blue-circle_84443-55891.jpg"
                }
                className="h-20 w-20 rounded-[24px] border border-slate-200 object-cover"
                alt="user"
              />
            </div>

            <div className="flex flex-1 flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <p className="text-lg font-semibold text-slate-900">
                  {item?.userData?.firstName} {item?.userData?.lastName}
                </p>
                <p className="mt-1 text-slate-600">Slot Date: {item?.slotDate}</p>
                <p className="text-slate-600">Slot Time: {item?.slotTime}</p>
              </div>

              {!item.cancelled ? (
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => cancelAppointment(item._id)}
                    className="admin-danger-btn"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={() => appointmentCompleted(item._id)}
                    className="admin-primary-btn bg-emerald-600 hover:bg-emerald-500"
                  >
                    Completed
                  </button>
                </div>
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

export default DoctorAppointments;
