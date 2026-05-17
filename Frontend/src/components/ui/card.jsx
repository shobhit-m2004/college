import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, BriefcaseMedical, CircleDollarSign } from "lucide-react";
import {
  getDoctorExperience,
  getDoctorFee,
  getDoctorImage,
  getDoctorName,
} from "../../lib/doctor";

const Card = ({ item }) => {
  const navigate = useNavigate();
  const doctorName = getDoctorName(item);
  const doctorImage = getDoctorImage(item);
  const doctorExperience = getDoctorExperience(item);
  const doctorFee = getDoctorFee(item);

  return (
    <button
      onClick={() => navigate(`/appointment/${item._id}`)}
      className="group text-left"
    >
      <div className="h-full overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:border-sky-200 hover:shadow-[0_24px_60px_rgba(56,109,176,0.14)]">
        <div className="relative overflow-hidden rounded-b-[28px] bg-gradient-to-br from-sky-50 via-white to-emerald-50 px-5 pt-5">
          <div
            className={`absolute right-5 top-5 rounded-full px-3 py-1 text-xs font-semibold ${
              item.available
                ? "bg-emerald-100 text-emerald-700"
                : "bg-rose-100 text-rose-700"
            }`}
          >
            {item.available ? "Available" : "Unavailable"}
          </div>
          <img
            className="mx-auto aspect-square w-full max-w-[220px] object-contain transition duration-300 group-hover:scale-[1.03]"
            src={doctorImage}
            alt={doctorName}
          />
        </div>

        <div className="space-y-4 p-5">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{doctorName}</h3>
            <p className="mt-1 text-sm text-slate-500">{item.speciality}</p>
          </div>

          <div className="flex flex-wrap gap-2 text-sm">
            <span className="soft-chip">
              <BriefcaseMedical className="h-4 w-4 text-sky-700" />
              {doctorExperience}
            </span>
            <span className="soft-chip">
              <CircleDollarSign className="h-4 w-4 text-emerald-700" />
              {doctorFee}
            </span>
          </div>

          <div className="flex items-center justify-between pt-1 text-sm font-semibold text-sky-700">
            <span>View booking slots</span>
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </button>
  );
};

export default Card;
