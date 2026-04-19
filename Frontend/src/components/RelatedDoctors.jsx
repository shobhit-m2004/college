import { AppContext } from "../context/context";
import React, { useContext, useEffect, useState } from "react";
import Card from "./ui/card";

const RelatedDoctors = ({ docId, speciality }) => {
  const { doctors } = useContext(AppContext);
  const [relDoc, setRelDoc] = useState([]);

  useEffect(() => {
    if (doctors.length > 0 && speciality) {
      const doctorData = doctors.filter(
        (doc) => doc.speciality === speciality && doc._id != docId
      );
      setRelDoc(doctorData);
    }
  }, [doctors, speciality, docId]);
  return (
    <div className="flex h-70 w-70 gap-10 mt-4 mb-4">
      {relDoc.map((item, index) => (
        <Card key={index} item={item} />
      ))}
    </div>
  );
};

export default RelatedDoctors;
