import React from "react";
import { Mail, MapPin, Phone } from "lucide-react";

const Contact = () => {
  return (
    <section className="section-shell px-6 py-10 sm:px-8">
      <div className="max-w-3xl space-y-4">
        <span className="section-kicker">Contact us</span>
        <h1 className="section-title">
          We’re here to help with appointments and access
        </h1>
        <p className="section-copy">
          Reach out for help with booking, account questions, or support using the
          healthcare platform.
        </p>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        <div className="rounded-[28px] border border-slate-200 bg-slate-50/80 p-5">
          <Phone className="h-5 w-5 text-sky-700" />
          <h2 className="mt-4 text-lg font-semibold text-slate-900">Call</h2>
          <p className="mt-2 text-sm text-slate-600">+91 99350 76320</p>
        </div>
        <div className="rounded-[28px] border border-slate-200 bg-slate-50/80 p-5">
          <Mail className="h-5 w-5 text-sky-700" />
          <h2 className="mt-4 text-lg font-semibold text-slate-900">Email</h2>
          <p className="mt-2 text-sm text-slate-600">support@doctorplus.app</p>
        </div>
        <div className="rounded-[28px] border border-slate-200 bg-slate-50/80 p-5">
          <MapPin className="h-5 w-5 text-sky-700" />
          <h2 className="mt-4 text-lg font-semibold text-slate-900">
            Availability
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Digital care support across India
          </p>
        </div>
      </div>
    </section>
  );
};

export default Contact;
