"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminNavbar from "@/components/AdminNavbar";
import { Pencil, Plus, X } from "lucide-react";

export default function TripsPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal & Form States
  const [showModal, setShowModal] = useState(false);
  const [editingTripId, setEditingTripId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    destination: "",
    start_date: "",
    end_date: "",
    price: "",
    total_seats: "",
    status: "open",
    description: "",
  });

  useEffect(() => {
    fetchTrips();
  }, []);

  async function fetchTrips() {
    setLoading(true);
    const { data } = await supabase
      .from("trips")
      .select("*")
      .order("created_at", { ascending: false });
    setTrips(data || []);
    setLoading(false);
  }

  // Open modal for creating a new trip
  function handleNewTripClick() {
    setEditingTripId(null);
    setForm({
      name: "",
      destination: "",
      start_date: "",
      end_date: "",
      price: "",
      total_seats: "",
      status: "open",
      description: "",
    });
    setShowModal(true);
  }

  // Open modal for editing an existing trip
  function handleEditClick(trip) {
    setEditingTripId(trip.id);
    setForm({
      name: trip.name || "",
      destination: trip.destination || "",
      start_date: trip.start_date || "",
      end_date: trip.end_date || "",
      price: trip.price || "",
      total_seats: trip.total_seats || "",
      status: trip.status || "open",
      description: trip.description || "",
    });
    setShowModal(true);
  }

  // Quick toggle status directly from the card
  async function handleToggleStatus(tripId, currentStatus) {
    const nextStatus = currentStatus === "open" ? "closed" : "open";
    const { error } = await supabase
      .from("trips")
      .update({ status: nextStatus })
      .eq("id", tripId);

    if (error) {
      alert(error.message);
      return;
    }
    fetchTrips();
  }

  // Handle Form Submission (Create or Edit)
  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.name || !form.destination || !form.price) {
      alert("Name, Destination and Price are required.");
      return;
    }

    const payload = {
      name: form.name,
      destination: form.destination,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
      price: parseFloat(form.price),
      total_seats: form.total_seats ? parseInt(form.total_seats) : null,
      status: form.status,
      description: form.description,
    };

    let error;
    if (editingTripId) {
      // Edit mode
      const result = await supabase
        .from("trips")
        .update(payload)
        .eq("id", editingTripId);
      error = result.error;
    } else {
      // Create mode
      const result = await supabase
        .from("trips")
        .insert([payload]);
      error = result.error;
    }

    if (error) {
      alert(error.message);
      return;
    }

    setShowModal(false);
    fetchTrips();
  }

  // Format date range nicely: "21 Jun 2026 → 25 Jun 2026"
  function formatTripDates(start, end) {
    if (!start && !end) return "Dates TBA";
    const options = { day: "numeric", month: "short", year: "numeric" };
    const formatStr = (str) => {
      if (!str) return "?";
      return new Date(str).toLocaleDateString("en-IN", options);
    };
    return `${formatStr(start)} → ${formatStr(end)}`;
  }

  return (
    <div className="bg-[#FFFBF5] min-h-screen text-[#1C1B1A]">
      <AdminNavbar />

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1.5">
            <span className="text-[10px] tracking-[0.25em] font-bold text-gray-400 uppercase">
              Trip Desk
            </span>
            <h1 className="font-serif font-extrabold text-4xl text-ink">Trips</h1>
            <p className="text-xs text-gray-500 font-light">
              Open trips show up on the public page. Closed ones don't.
            </p>
          </div>

          <button
            onClick={handleNewTripClick}
            className="bg-[#1C1B1A] text-white hover:bg-rust transition-colors rounded-xl px-5 py-2.5 text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Plus size={14} />
            <span>New trip</span>
          </button>
        </div>

        {/* Trips Grid list */}
        {loading ? (
          <div className="text-center py-20 text-sm text-gray-400 font-light">
            Loading
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <div
                key={trip.id}
                className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative min-h-[300px]"
              >
                <div>
                  {/* Status & Edit row */}
                  <div className="flex items-center justify-between">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      trip.status === "open" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
                    }`}>
                      {trip.status}
                    </span>
                    <button
                      onClick={() => handleEditClick(trip)}
                      className="text-gray-400 hover:text-[#1C1B1A] transition-colors cursor-pointer"
                    >
                      <Pencil size={14} />
                    </button>
                  </div>

                  {/* Details */}
                  <div className="mt-4 space-y-1">
                    <h3 className="font-serif font-bold text-xl text-ink leading-snug">
                      {trip.name}
                    </h3>
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                      {trip.destination}
                    </p>
                    <p className="text-xs text-gray-600 leading-relaxed font-light pt-2 line-clamp-3">
                      {trip.description || "No description provided."}
                    </p>
                  </div>
                </div>

                {/* Footer block */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <p className="text-[10px] font-semibold text-gray-400">
                        {formatTripDates(trip.start_date, trip.end_date)}
                      </p>
                      <p className="text-[10px] font-bold text-gray-500">
                        {trip.total_seats ? `${trip.total_seats} seats` : "Flexible seats"}
                      </p>
                    </div>

                    <div className="text-right space-y-1">
                      <p className="font-sans font-bold text-base text-ink tracking-tight">
                        <span className="text-xs font-semibold mr-0.5 text-gray-400">₹</span>
                        {trip.price?.toLocaleString("en-IN")}
                      </p>
                      <button
                        onClick={() => handleToggleStatus(trip.id, trip.status)}
                        className="text-xs font-bold text-rust hover:underline block cursor-pointer transition-all uppercase tracking-wider text-[10px]"
                      >
                        {trip.status === "open" ? "Close trip" : "Open trip"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {trips.length === 0 && (
              <div className="col-span-full text-center py-20 text-sm text-gray-400 font-light">
                No trips curated yet.
              </div>
            )}
          </div>
        )}
      </main>

      {/* Create / Edit Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gray-100 relative space-y-5 animate-in zoom-in-95 duration-200">
            {/* Close icon */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-ink cursor-pointer transition-colors"
            >
              <X size={18} />
            </button>

            {/* Title */}
            <div>
              <h2 className="font-serif font-bold text-2xl text-ink">
                {editingTripId ? "Edit Trip" : "Create New Trip"}
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {editingTripId ? "Update details for this route." : "Add a new curated route to the desk."}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1">
                  Trip Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Spiti Slow Circuit"
                  className="border border-gray-200 rounded-xl px-4 py-2.5 w-full text-sm focus:outline-none focus:border-rust transition-colors"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1">
                  Destination
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Spiti Valley, Himachal Pradesh"
                  className="border border-gray-200 rounded-xl px-4 py-2.5 w-full text-sm focus:outline-none focus:border-rust transition-colors"
                  value={form.destination}
                  onChange={(e) => setForm({ ...form, destination: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    className="border border-gray-200 rounded-xl px-4 py-2.5 w-full text-sm focus:outline-none focus:border-rust transition-colors"
                    value={form.start_date}
                    onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    className="border border-gray-200 rounded-xl px-4 py-2.5 w-full text-sm focus:outline-none focus:border-rust transition-colors"
                    value={form.end_date}
                    onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 58000"
                    className="border border-gray-200 rounded-xl px-4 py-2.5 w-full text-sm focus:outline-none focus:border-rust transition-colors"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1">
                    Total Seats
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 12"
                    className="border border-gray-200 rounded-xl px-4 py-2.5 w-full text-sm focus:outline-none focus:border-rust transition-colors"
                    value={form.total_seats}
                    onChange={(e) => setForm({ ...form, total_seats: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1">
                  Status
                </label>
                <select
                  className="border border-gray-200 rounded-xl px-3 py-2.5 w-full text-sm focus:outline-none focus:border-rust bg-white appearance-none"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1">
                  Description
                </label>
                <textarea
                  placeholder="Ten quiet days across the cold desert..."
                  rows={3}
                  className="border border-gray-200 rounded-xl px-4 py-2.5 w-full text-sm focus:outline-none focus:border-rust resize-none transition-colors"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="border border-gray-200 rounded-xl px-5 py-2.5 text-xs font-semibold text-gray-500 hover:bg-gray-50 hover:text-ink transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#1C1B1A] text-white hover:bg-rust transition-colors rounded-xl px-6 py-2.5 text-xs font-semibold cursor-pointer shadow-sm"
                >
                  Save Trip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
