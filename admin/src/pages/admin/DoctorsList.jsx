import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import Card from "../../components/card";

const DoctorsList = () => {
  const { doctors, aToken, getAllDoctors, changeAvailability } =
    useContext(AdminContext);

  useEffect(() => {
    getAllDoctors();
  }, [aToken]);

  return (
    <section className="space-y-6">
      <div className="admin-panel px-6 py-8 sm:px-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="admin-kicker">Doctor directory</span>
            <h1 className="mt-3 text-3xl font-semibold text-slate-950">
              All doctors
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
              Review doctor profiles, inspect specialities, and update availability
              without leaving the admin workspace.
            </p>
          </div>
          <div className="admin-chip">{doctors.length} doctors listed</div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {doctors.map((item, index) => (
          <Card
            item={item}
            key={index}
            changeAvailability={changeAvailability}
          />
        ))}
      </div>
    </section>
  );
};

export default DoctorsList;
