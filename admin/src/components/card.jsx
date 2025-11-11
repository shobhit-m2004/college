import React from "react";

const Card = ({ item, changeAvailability }) => {
  return (
    <div className="w-full max-w-sm bg-white shadow-lg rounded-2xl overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl mx-4 my-4">
      {/* Image Section */}
      <div className="relative w-full aspect-square overflow-hidden">
        <img
          className="w-full h-full object-cover"
          src={item.image}
          alt={`${item.firstName} ${item.lastName}`}
        />

        {/* Availability Badge */}
        <div
          className={`absolute top-3 right-3 px-3 py-1 text-sm font-medium rounded-full ${
            item.available
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {item.available ? "Available" : "Unavailable"}
        </div>
      </div>

      {/* Info Section */}
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800">
          {item.firstName} {item.lastName}
        </h2>
        <p className="text-gray-600 mt-1">{item.speciality}</p>

        <div className="mt-4 flex items-center gap-2">
          <input
            onChange={() => changeAvailability(item._id)}
            type="checkbox"
            checked={item.available}
            className="w-4 h-4 accent-green-600"
          />
          <span className="text-sm text-gray-700">Currently Available</span>
        </div>
      </div>
    </div>
  );
};

export default Card;
