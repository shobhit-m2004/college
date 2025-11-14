import { assets } from "../assets/assets";
import { AppContext } from "../context/context";
import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RelatedDoctors from "./../components/RelatedDoctors";
import { toast } from "react-toastify";
import axios from "axios";
const Appointment = () => {
  const { docId } = useParams();
  const { doctors, getDoctorsData, token, backendUrl } = useContext(AppContext);
  const dayOfWeek = ["Sun", "Mun", "tue", "Wed", "Thurs", "Fri", "Sat", "Sun"];
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
    let today = new Date();
    let allSlots = [];

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      let endTime = new Date(currentDate);
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

      let timeSlots = [];

      if (i === 0 && currentDate >= endTime) {
        timeSlots.push({
          datetime: new Date(today),
          time: "No Slots",
        });
      }

      while (currentDate <= endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], {
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
    console.log(docSlots);
  }, [docSlots]);

  const bookAppointment = async () => {
    if (!token) {
      toast.warn("Login to book appointment");
      return navigate("./login");
    }

    try {
      const date = docSlots[slotIndex][0].datetime;
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      const slotDate = day + "_" + month + "_" + year;
      console.log(slotDate);

      const { data } = await axios.post(
        backendUrl + "/api/user/book-appointment",
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
      console.log(err.message);
      toast.error(err.message);
    }
  };
  return (
    docInfo && (
      <div>
        {/* ------------doctor detail--------- */}
        <div className="flex flex-col md:flex-row lg:flex-row mb-4  gap-4">
          <div className="bg-blue-500 w-100 h-60  mr-3.5 rounded-2xl shadow shadow-blue-500 hover:shadow-2xl">
            <img
              className="h-full w-full object-contain "
              src={docInfo.image}
              alt=""
            />
          </div>
          <div>
            <div className="w-100 gap-4 md:w-auto lg:w-auto  px-3.5 py-3.5 border border-amber-950 rounded-2xl">
              {/* doctor info : name, degree, experience */}
              <p className="text-2xl font-semibold">
                {docInfo.firstName + " " + docInfo.lastName}{" "}
                <img src={assets.verified_icon} alt="" />
              </p>
              <div className="flex">
                <p>
                  {docInfo.degree} - {docInfo.speciality}
                  <button>{docInfo.experience}</button>
                </p>
              </div>
              {/* Doctor About */}
              <div>
                <p className="flex gap-2">
                  <p className="font-semibold"> About </p>

                  <img src={assets.info_icon} alt="" />
                </p>
                <p>{docInfo.about}</p>
              </div>

              <div className="flex font-bold">
                <p> Appointment Fee :</p>
                <p className="text-blue-500">{docInfo.fees}</p>
              </div>
            </div>
            {/* Booking slot  */}
            <div>
              <p>Booking Slots</p>

              <div className="flex gap-3 items-center w-full font-medium text-gray-700">
                {docSlots.length &&
                  docSlots.map((item, index) => (
                    <div
                      key={index}
                      className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                        slotIndex == index
                          ? "bg-blue-500 text-white"
                          : "border border-green-200"
                      }`}
                      onClick={() => {
                        setSlotIndex(index);
                      }}
                    >
                      <p>{item[0] && dayOfWeek[item[0].datetime.getDay()]}</p>
                      <p>{item[0] && item[0].datetime.getDate()}</p>
                    </div>
                  ))}
              </div>
              <div className="h-20 w-100 flex overflow-x-auto gap-4 mt-4 ">
                {docSlots.length &&
                  docSlots[slotIndex].map((item, index) => (
                    <div
                      onClick={() => setSlotTime(item.time)}
                      className={`border border-green-300 px-1.5 py-1.5 rounded-full cursor-pointer ${
                        item.time === slotTime
                          ? "bg-blue-500  text-white"
                          : "text-gray-400 border border-gray-300"
                      }`}
                      key={index}
                    >
                      {item.time.toLowerCase()}
                    </div>
                  ))}
              </div>

              <button
                className="bg-blue-500 hover:bg-blue-400 text-white px-3 py-1.5 my-4 rounded-full "
                onClick={bookAppointment}
              >
                Book Appointment
              </button>
            </div>
          </div>
        </div>
        <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
      </div>
    )
  );
};

export default Appointment;
