import { AppContext } from "../context/context";
import React, { useContext, useEffect, useState } from "react";
import Card from "./ui/card";

const RelatedDoctors = ({ docId, speciality }) => {
  const { doctors } = useContext(AppContext);
  const [relDoc, setRelDoc] = useState([]);

  useEffect(() => {
    if (doctors.length > 0 && speciality) {
      const doctorData = doctors.filter(
        (doc) => doc.speciality === speciality && doc._id !== docId
      );
      setRelDoc(doctorData);
    }
  }, [doctors, speciality, docId]);

  if (!relDoc.length) {
    return null;
  }

  return (
    <section className="mt-10 space-y-5">
      <div>
        <span className="section-kicker">More options</span>
        <h2 className="mt-3 text-2xl font-semibold text-slate-900">
          Related doctors in this speciality
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {relDoc.slice(0, 3).map((item, index) => (
          <Card key={index} item={item} />
        ))}
      </div>
    </section>
  );
};

export default RelatedDoctors;
