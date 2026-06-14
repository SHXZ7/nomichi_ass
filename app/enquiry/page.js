"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function EnquiryPage() {
  const [trips, setTrips] = useState([]);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    trip_id: "",
    group_type: "",
    preferred_month: "",
    expectations: "",
  });

  useEffect(() => {
    getTrips();
  }, []);

  async function getTrips() {
    const { data } = await supabase
      .from("trips")
      .select("*")
      .eq("status", "open");

    setTrips(data || []);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const { error } = await supabase
      .from("leads")
      .insert([form]);

    if (error) {
      alert(error.message);
      return;
    }

    setSuccess(true);
  }

  if (success) {
    return (
      <main className="max-w-xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-4">
          Thanks for reaching out
        </h1>

        <p>
          We've received your enquiry and
          will be in touch soon.
        </p>
      </main>
    );
  }

  return (
    <main className="max-w-xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">
        Plan your next trip
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <input
          placeholder="Name"
          className="border p-3 w-full"
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
        />

        <input
          placeholder="Phone"
          className="border p-3 w-full"
          onChange={(e) =>
            setForm({
              ...form,
              phone: e.target.value,
            })
          }
        />

        <input
          placeholder="Email"
          type="email"
          className="border p-3 w-full"
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value,
            })
          }
        />

        <select
          className="border p-3 w-full"
          onChange={(e) =>
            setForm({
              ...form,
              trip_id: e.target.value,
            })
          }
        >
          <option>Select Trip</option>

          {trips.map((trip) => (
            <option
              key={trip.id}
              value={trip.id}
            >
              {trip.name}
            </option>
          ))}
        </select>

        <select
          className="border p-3 w-full"
          onChange={(e) =>
            setForm({
              ...form,
              group_type: e.target.value,
            })
          }
        >
          <option value="">
            Group Type
          </option>

          <option>Solo</option>
          <option>Couple</option>
          <option>Friends</option>
          <option>Family</option>
        </select>

        <input
          placeholder="Preferred Month"
          className="border p-3 w-full"
          onChange={(e) =>
            setForm({
              ...form,
              preferred_month:
                e.target.value,
            })
          }
        />

        <textarea
          placeholder="What are you hoping this trip feels like?"
          className="border p-3 w-full"
          rows={4}
          onChange={(e) =>
            setForm({
              ...form,
              expectations:
                e.target.value,
            })
          }
        />

        <button className="bg-black text-white px-5 py-3">
          Submit Enquiry
        </button>
      </form>
    </main>
  );
}
