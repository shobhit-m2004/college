import { AppContext } from "../context/context";
import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RelatedDoctors from "./../components/RelatedDoctors";
import { toast } from "react-toastify";
import axios from "axios";
import {
  CalendarDays,
  CircleDollarSign,
  Clock3,
  Info,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import {
  getDoctorAddressLines,
  getDoctorExperience,
  getDoctorFee,
  getDoctorImage,
  getDoctorName,
} from "../lib/doctor";

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, getDoctorsData, token, backendUrl } = useContext(AppContext);
  const dayOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  const navigate = useNavigate();

  const fetchDocInfo = async () => {
    const info = doctors.find((doc) => doc._id === docId);
    setDocInfo(info);
  };

  const getAvailableSlots = async () => {
    setDocSlots([]);
    const today = new Date();
    const allSlots = [];

    for (let i = 0; i < 7; i += 1) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      const endTime = new Date(currentDate);
      endTime.setHours(21, 0, 0, 0);

      if (i === 0) {
        currentDate.setHours(
          currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10
        );
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      const timeSlots = [];

      if (i === 0 && currentDate >= endTime) {
        timeSlots.push({
          datetime: new Date(today),
          time: "No Slots",
        });
      }

      while (currentDate <= endTime) {
        const formattedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        timeSlots.push({
          datetime: new Date(currentDate),
          time: formattedTime,
        });

        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      allSlots.push(timeSlots);
    }

    setDocSlots(allSlots);
  };

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    getAvailableSlots();
  }, [docInfo]);

  useEffect(() => {
    if (docSlots[slotIndex]?.[0]?.time === "No Slots") {
      setSlotTime("");
    }
  }, [docSlots, slotIndex]);

  const bookAppointment = async () => {
    if (!token) {
      toast.warn("Login to book appointment");
      return navigate("/login");
    }

    if (!slotTime) {
      toast.warn("Please select an available time slot");
      return;
    }

    try {
      const date = docSlots[slotIndex][0].datetime;
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const slotDate = `${day}_${month}_${year}`;

      const { data } = await axios.post(
        `${backendUrl}/api/user/book-appointment`,
        {
          docId,
          slotDate,
          slotTime,
        },
        {
          headers: { token },
        }
      );

      if (data.success) {
        toast.success(data.message);
        getDoctorsData();
        navigate("/my-appointments");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (!docInfo) {
    return null;
  }

  const doctorName = getDoctorName(docInfo);
  const doctorImage = getDoctorImage(docInfo);
  const doctorExperience = getDoctorExperience(docInfo);
  const doctorFee = getDoctorFee(docInfo);
  const addressLines = getDoctorAddressLines(docInfo);

  return (
    <div className="space-y-10">
      <section className="section-shell overflow-hidden px-6 py-8 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-[30px] bg-gradient-to-br from-sky-500 to-teal-500 p-4 shadow-[0_22px_60px_rgba(32,90,143,0.26)]">
            <div className="flex h-full items-center justify-center rounded-[26px] bg-white/90 px-4 py-6">
              <img
                className="h-full max-h-[340px] w-full object-contain"
                src={doctorImage}
                alt={doctorName}
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="section-kicker">
                  <ShieldCheck className="h-4 w-4" />
                  Verified appointment profile
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-sm font-semibold ${
                    docInfo.available
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {docInfo.available ? "Currently available" : "Unavailable today"}
                </span>
              </div>

              <div>
                <h1 className="text-3xl font-semibold text-slate-950 md:text-4xl">
                  {doctorName}
                </h1>
                <p className="mt-2 text-lg text-slate-600">
                  {docInfo.degree} • {docInfo.speciality}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <span className="soft-chip">
                  <Clock3 className="h-4 w-4 text-sky-700" />
                  {doctorExperience}
                </span>
                <span className="soft-chip">
                  <CircleDollarSign className="h-4 w-4 text-emerald-700" />
                  {doctorFee}
                </span>
              </div>
            </div>

            <div className="grid gap-5 rounded-[28px] border border-slate-200 bg-slate-50/80 p-5 md:grid-cols-2">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <Info className="h-4 w-4 text-sky-700" />
                  About this doctor
                </div>
                <p className="text-sm leading-7 text-slate-600">{docInfo.about}</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <MapPin className="h-4 w-4 text-sky-700" />
                  Clinic location
                </div>
                <div className="space-y-1 text-sm leading-7 text-slate-600">
                  {addressLines.length ? (
                    addressLines.map((line) => <p key={line}>{line}</p>)
                  ) : (
                    <p>Address details will be shared on booking confirmation.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                <CalendarDays className="h-4 w-4 text-sky-700" />
                Booking slots
              </div>

              <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                {docSlots.length > 0 &&
                  docSlots.map((item, index) => (
                    <button
                      key={index}
                      className={`min-w-[86px] rounded-[24px] border px-4 py-4 text-center transition ${
                        slotIndex === index
                          ? "border-sky-600 bg-sky-600 text-white shadow-[0_16px_35px_rgba(14,96,172,0.24)]"
                          : "border-slate-200 bg-slate-50 text-slate-700 hover:border-sky-200 hover:bg-white"
                      }`}
                      onClick={() => setSlotIndex(index)}
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.18em]">
                        {item[0] && dayOfWeek[item[0].datetime.getDay()]}
                      </p>
                      <p className="mt-2 text-2xl font-semibold">
                        {item[0] && item[0].datetime.getDate()}
                      </p>
                    </button>
                  ))}
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                {docSlots.length > 0 &&
                  docSlots[slotIndex].map((item, index) => {
                    const isNoSlot = item.time === "No Slots";

                    return (
                      <button
                        key={index}
                        disabled={isNoSlot}
                        onClick={() => !isNoSlot && setSlotTime(item.time)}
                        className={`rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                          isNoSlot
                            ? "cursor-not-allowed border border-dashed border-slate-300 bg-slate-100 text-slate-400"
                            : item.time === slotTime
                              ? "bg-sky-600 text-white shadow-[0_16px_30px_rgba(14,96,172,0.2)]"
                              : "border border-slate-200 bg-white text-slate-600 hover:border-sky-200 hover:text-sky-700"
                        }`}
                      >
                        {item.time.toLowerCase()}
                      </button>
                    );
                  })}
              </div>

              <button className="primary-cta mt-6" onClick={bookAppointment}>
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      </section>

      <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
    </div>
  );
};

export default Appointment;
