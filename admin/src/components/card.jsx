import React from "react";

const Card = ({ item, changeAvailability }) => {
  return (
    <div className="admin-panel-soft overflow-hidden">
      <div className="relative aspect-[1/1] overflow-hidden bg-gradient-to-br from-sky-50 via-white to-emerald-50">
        <img
          className="h-full w-full object-cover"
          src={item.image}
          alt={`${item.firstName} ${item.lastName}`}
        />

        <div
          className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-bold ${
            item.available
              ? "bg-emerald-100 text-emerald-700"
              : "bg-rose-100 text-rose-700"
          }`}
        >
          {item.available ? "Available" : "Unavailable"}
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            {item.firstName} {item.lastName}
          </h2>
          <p className="mt-1 text-sm text-slate-500">{item.speciality}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
              Experience
            </p>
            <p className="mt-1 font-semibold text-slate-700">{item.experience}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
              Fees
            </p>
            <p className="mt-1 font-semibold text-slate-700">Rs. {item.fees}</p>
          </div>
        </div>

        <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3">
          <span className="text-sm font-semibold text-slate-700">
            Currently Available
          </span>
          <input
            onChange={() => changeAvailability(item._id)}
            type="checkbox"
            checked={item.available}
            className="h-4 w-4 accent-sky-600"
          />
        </label>
      </div>
    </div>
  );
};

export default Card;
