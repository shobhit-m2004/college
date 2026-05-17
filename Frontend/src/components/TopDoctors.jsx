import React, { useContext } from "react";
import Card from "./ui/card";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/context";
import { ArrowRight } from "lucide-react";

const TopDoctors = () => {
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);

  return (
    <section className="section-shell px-6 py-10 sm:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <span className="section-kicker">Popular bookings</span>
          <h2 className="section-title">Top doctors to book now</h2>
          <p className="section-copy max-w-2xl">
            Meet specialists patients reach for most often, with profiles designed
            to help you decide quickly.
          </p>
        </div>
        <button className="secondary-cta" onClick={() => navigate("/doctors")}>
          Explore All Doctors
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {doctors?.length ? (
          doctors.slice(0, 8).map((item, index) => <Card key={index} item={item} />)
        ) : (
          <p className="text-slate-500">No doctors available at the moment.</p>
        )}
      </div>
    </section>
  );
};

export default TopDoctors;
