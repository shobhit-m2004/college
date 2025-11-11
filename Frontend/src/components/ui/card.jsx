import React from "react";
import { useNavigate } from "react-router-dom";

const Card = ({ item }) => {
  const navigate = useNavigate();

  return (
    <div onClick={() => navigate(`/appointment/${item._id}`)}>
      <div className="card bg-base-100 w-full h-full shadow-md hover:shadow-2xl rounded-2xl">
        <figure>
          <img
            className="w-full h-full aspect-square object-contain"
            src={item.image}
            alt="doctor"
          />
        </figure>

        <div className="card-body">
          <h2 className="card-title flex justify-between items-center">
            <p>
              {item.firstName} {item.lastName}
            </p>

            <div
              className={`px-2 py-1 w-auto h-7 rounded-3xl text-xs flex items-center text-white ${
                item.available ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {item.available ? "Available" : "Unavailable"}
            </div>
          </h2>

          <p>{item.speciality}</p>
        </div>
      </div>
    </div>
  );
};

export default Card;
