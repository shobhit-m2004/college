import React from "react";
import { assets } from "./../assets/assets";
import { diseasePredictionUrl } from "../lib/diseasePrediction";
import {
  ArrowRight,
  CalendarCheck2,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";

const Header = () => {
  return (
    <section className="section-shell subtle-grid relative overflow-hidden px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
      <div className="absolute -left-12 top-12 h-40 w-40 rounded-full bg-sky-200/40 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-emerald-200/40 blur-3xl" />

      <div className="relative grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-7">
          <span className="section-kicker">
            <ShieldCheck className="h-4 w-4" />
            Verified doctors. Faster booking.
          </span>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl md:leading-[1.05]">
              Modern appointment booking for
              <span className="block text-sky-700">everyday healthcare.</span>
            </h1>
            <p className="max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
              Discover specialists, compare availability, and secure your next
              visit in minutes with a calmer, cleaner patient experience.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <a href="#speciality" className="primary-cta">
              <CalendarCheck2 className="h-4 w-4" />
              Book Appointment
            </a>
            <a
              href={diseasePredictionUrl}
              target="_blank"
              rel="noreferrer"
              className="secondary-cta"
            >
              <Stethoscope className="h-4 w-4" />
              Disease Prediction
            </a>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/80 bg-white/85 p-4 shadow-sm">
              <p className="text-2xl font-semibold text-slate-900">50+</p>
              <p className="mt-1 text-sm text-slate-600">
                Specialists across key departments
              </p>
            </div>
            <div className="rounded-3xl border border-white/80 bg-white/85 p-4 shadow-sm">
              <p className="text-2xl font-semibold text-slate-900">24/7</p>
              <p className="mt-1 text-sm text-slate-600">
                Simple access to doctor discovery
              </p>
            </div>
            <div className="rounded-3xl border border-white/80 bg-white/85 p-4 shadow-sm">
              <p className="text-2xl font-semibold text-slate-900">Secure</p>
              <p className="mt-1 text-sm text-slate-600">
                Designed for trusted patient journeys
              </p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-6 top-10 hidden rounded-3xl border border-white/70 bg-white/90 p-4 shadow-xl md:block">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Trusted Care</p>
                <p className="text-xs text-slate-500">Book with confidence</p>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-[32px] bg-slate-900 p-3 shadow-[0_30px_80px_rgba(15,23,42,0.3)]">
            <div className="rounded-[26px] bg-gradient-to-br from-sky-500 via-sky-600 to-teal-500 p-6">
              <div className="mb-6 flex items-center justify-between text-white/85">
                <img
                  src={assets.group_profiles}
                  alt="Group profiles"
                  className="w-32"
                />
                <span className="soft-chip border-white/20 bg-white/10 text-white shadow-none">
                  <ArrowRight className="h-4 w-4" />
                  Rapid booking
                </span>
              </div>
              <img
                src={assets.header_img}
                alt="Doctor consultation"
                className="h-full w-full rounded-[22px] object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Header;
