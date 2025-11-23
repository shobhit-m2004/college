import React from "react";
import { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/context";
import axios from "axios";
import { toast } from "react-toastify";
import Appointment from "./Appointment";
import { replace, useNavigate } from "react-router-dom";

const MyAppointments = () => {
  const { backendUrl, token, getDoctorsData } = useContext(AppContext);

  const [appointments, setAppointments] = useState([]);

  const navigate = useNavigate();

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/appointments", {
        headers: { token },
      });

      if (data.success) {
        setAppointments(data.appointments.reverse());
      }
    } catch (error) {
      console.log(error.message);

      toast.error(error.message);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/cancel-appointment",
        {
          appointmentId,
        },
        {
          headers: { token },
        }
      );

      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error.message);

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
        console.log(response);

        try {
          const { data } = await axios.post(
            backendUrl + "/api/user/verifyRazorpay",
            response,
            {
              headers: {
                token,
              },
            }
          );

          if (data.success) {
            getUserAppointments();
            navigate("/my-appoinments", { replace: true });
          }
        } catch (err) {
          console.log(err.message);
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
        backendUrl + "/api/user/payment-razorpay",
        {
          appointmentId,
        },
        {
          headers: { token },
        }
      );

      if (data.success) {
        initPay(data.order);
      }

      console.log(data);
    } catch (error) {
      console.log(error.message);

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
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-6 space-y-6">
      <p className="text-2xl font-semibold text-gray-800 border-b pb-3">
        My Appointments
      </p>

      <div className="space-y-6">
        {appointments.slice(0, 2).map((item, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 border rounded-xl p-5 shadow-sm hover:shadow-md transition"
          >
            {/* Doctor Image */}
            <div className="flex-shrink-0">
              <img
                src={item?.docData?.image}
                alt=""
                className="w-28 h-28 rounded-full object-cover border-2 border-gray-300"
              />
            </div>

            {/* Doctor Info */}
            <div className="flex-1 space-y-1 text-center md:text-left">
              <p className="text-lg font-semibold text-gray-800">
                {item?.docData?.firstName + " " + item?.docData?.lastName}
              </p>
              <p className="text-gray-600">{item?.docData?.speciality}</p>
              <p className="text-gray-500">{item?.docData?.address?.line1}</p>
              <p className="text-gray-500">{item?.docData?.address?.line2}</p>

              <p className="text-sm text-gray-700 mt-2">
                <span className="font-medium text-gray-800">DATE & TIME: </span>
                {item.slotDate} | {item.slotTime}
              </p>
            </div>

            {/* Action Buttons */}
            {!item.cancelled && (
              <div className="flex flex-col gap-3 md:gap-2">
                {!item.payment && (
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                    onClick={() => appointmentRazorpay(item._id)}
                  >
                    Pay Online
                  </button>
                )}
                {item.payment && (
                  <button className="bg-stone-500 text-white px-4 py-2 rounded-lg ">
                    Paid
                  </button>
                )}

                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                  onClick={() => cancelAppointment(item._id)}
                >
                  Cancel Appointment
                </button>
              </div>
            )}
            {item.cancelled && (
              <button className="bg-stone-300 text-white px-4 py-2 rounded-lg ">
                Appointment Cancelled
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAppointments;
