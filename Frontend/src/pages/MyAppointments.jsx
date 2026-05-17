import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/context";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { CalendarClock, CircleCheckBig, Wallet } from "lucide-react";
import { getDoctorImage, getDoctorName } from "../lib/doctor";

const MyAppointments = () => {
  const { backendUrl, token, getDoctorsData } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/appointments`, {
        headers: { token },
      });

      if (data.success) {
        setAppointments(data.appointments.reverse());
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/cancel-appointment`,
        { appointmentId },
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Appointment Payment",
      description: "Appointment Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        try {
          const { data } = await axios.post(
            `${backendUrl}/api/user/verifyRazorpay`,
            response,
            {
              headers: { token },
            }
          );

          if (data.success) {
            getUserAppointments();
            navigate("/my-appointments", { replace: true });
          }
        } catch (err) {
          toast.error(err.message);
        }
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const appointmentRazorpay = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/payment-razorpay`,
        { appointmentId },
        { headers: { token } }
      );

      if (data.success) {
        initPay(data.order);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      getUserAppointments();
      getDoctorsData();
    }
  }, [token]);

  return (
    <section className="section-shell mx-auto max-w-5xl p-6 sm:p-8">
      <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="section-kicker">
            <CalendarClock className="h-4 w-4" />
            Appointment history
          </span>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">
            My appointments
          </h1>
        </div>
        <div className="soft-chip">{appointments.length} booking records</div>
      </div>

      <div className="mt-8 space-y-5">
        {appointments.map((item, index) => (
          <div
            key={index}
            className="grid gap-5 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-[0_18px_45px_rgba(15,23,42,0.08)] md:grid-cols-[auto_1fr_auto]"
          >
            <div className="flex-shrink-0">
              <img
                src={getDoctorImage(item?.docData)}
                alt=""
                className="h-24 w-24 rounded-[24px] border border-slate-200 bg-slate-50 object-cover"
              />
            </div>

            <div className="space-y-2">
              <p className="text-xl font-semibold text-slate-900">
                {getDoctorName(item?.docData)}
              </p>
              <p className="text-slate-600">{item?.docData?.speciality}</p>
              <p className="text-sm text-slate-500">{item?.docData?.address?.line1}</p>
              <p className="text-sm text-slate-500">{item?.docData?.address?.line2}</p>
              <p className="pt-2 text-sm text-slate-700">
                <span className="font-semibold text-slate-900">Date & Time:</span>{" "}
                {item.slotDate} | {item.slotTime}
              </p>
            </div>

            {!item.cancelled ? (
              <div className="flex flex-col gap-3">
                {!item.payment ? (
                  <button
                    className="primary-cta"
                    onClick={() => appointmentRazorpay(item._id)}
                  >
                    <Wallet className="h-4 w-4" />
                    Pay Online
                  </button>
                ) : (
                  <button className="secondary-cta bg-emerald-50 text-emerald-700">
                    <CircleCheckBig className="h-4 w-4" />
                    Paid
                  </button>
                )}

                <button
                  className="rounded-full border border-rose-200 bg-rose-50 px-5 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-100"
                  onClick={() => cancelAppointment(item._id)}
                >
                  Cancel Appointment
                </button>
              </div>
            ) : (
              <button className="rounded-full border border-slate-200 bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-500">
                Appointment Cancelled
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default MyAppointments;
