import React from "react";
import { specialityData } from "../assets/assets";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const SpecialityMenu = () => {
  return (
    <section id="speciality" className="section-shell px-6 py-10 sm:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl space-y-3">
          <span className="section-kicker">Find your care path</span>
          <h2 className="section-title">Browse by speciality</h2>
          <p className="section-copy">
            Choose the department you need and move straight into a more focused,
            more confident appointment journey.
          </p>
        </div>
        <p className="soft-chip">Multiple specialties. One calm booking flow.</p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {specialityData.map((item) => (
          <Link
            key={item.speciality}
            to={`/doctors/${item.speciality}`}
            className="group rounded-[28px] border border-slate-200 bg-gradient-to-br from-white to-sky-50/70 p-5 shadow-sm transition hover:-translate-y-1 hover:border-sky-200 hover:shadow-[0_20px_45px_rgba(56,109,176,0.12)]"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm">
              <img className="w-11" src={item.image} alt={item.speciality} />
            </div>
            <div className="mt-5 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-slate-800">
                {item.speciality}
              </p>
              <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:text-sky-700" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default SpecialityMenu;
