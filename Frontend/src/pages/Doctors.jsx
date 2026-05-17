import React, { useEffect, useMemo, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/context";
import Card from "../components/ui/card";
import { Filter } from "lucide-react";

const Doctors = () => {
  const { speciality } = useParams();
  const [filterDoc, setFilterDoc] = useState([]);
  const { doctors } = useContext(AppContext);

  const specialities = useMemo(
    () => [...new Set(doctors.map((doctor) => doctor.speciality).filter(Boolean))],
    [doctors]
  );

  const applyFilter = (selected) => {
    if (selected) {
      const filtered = doctors.filter(
        (item) => item.speciality.toLowerCase() === selected.toLowerCase()
      );
      setFilterDoc(filtered);
    } else {
      setFilterDoc(doctors);
    }
  };

  useEffect(() => {
    applyFilter(speciality);
  }, [doctors, speciality]);

  return (
    <section className="section-shell px-6 py-8 sm:px-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <span className="section-kicker">
            <Filter className="h-4 w-4" />
            Explore specialists
          </span>
          <h1 className="section-title">Choose the right doctor for your next visit</h1>
          <p className="section-copy max-w-2xl">
            Filter by speciality, compare profiles, and move from browsing to booking
            with less friction.
          </p>
        </div>
        <div className="soft-chip">
          {filterDoc.length} doctor{filterDoc.length === 1 ? "" : "s"} available
        </div>
      </div>

      <div className="mb-8 flex flex-wrap gap-3">
        <button
          onClick={() => applyFilter("")}
          className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
            !speciality
              ? "bg-sky-600 text-white shadow-[0_14px_30px_rgba(14,96,172,0.24)]"
              : "border border-slate-200 bg-white text-slate-600 hover:border-sky-200 hover:text-sky-700"
          }`}
        >
          All Doctors
        </button>
        {specialities.map((spec) => (
          <button
            key={spec}
            onClick={() => applyFilter(spec)}
            className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
              spec.toLowerCase() === speciality?.toLowerCase()
                ? "bg-sky-600 text-white shadow-[0_14px_30px_rgba(14,96,172,0.24)]"
                : "border border-slate-200 bg-white text-slate-600 hover:border-sky-200 hover:text-sky-700"
            }`}
          >
            {spec}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filterDoc.length > 0 ? (
          filterDoc.map((item, index) => <Card key={index} item={item} />)
        ) : (
          <div className="rounded-[28px] border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500">
            No doctors found for this filter yet.
          </div>
        )}
      </div>
    </section>
  );
};

export default Doctors;
