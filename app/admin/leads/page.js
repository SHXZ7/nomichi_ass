"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import AdminNavbar from "@/components/AdminNavbar";
import { Search, Download, User } from "lucide-react";

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [tripFilter, setTripFilter] = useState("All trips");
  const [ownerFilter, setOwnerFilter] = useState("All owners");

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    // Fetch leads with trips name
    const { data: leadsData } = await supabase
      .from("leads")
      .select(`
        *,
        trips(name)
      `)
      .order("created_at", { ascending: false });

    // Fetch trips
    const { data: tripsData } = await supabase
      .from("trips")
      .select("id, name");

    setLeads(leadsData || []);
    setTrips(tripsData || []);
    setLoading(false);
  }

  // Get unique list of owners from leads to populate the owner dropdown filter dynamically
  const uniqueOwners = Array.from(
    new Set(leads.map((l) => l.owner_email).filter(Boolean))
  );

  // Filter leads based on user selections
  const filteredLeads = leads.filter((lead) => {
    // 1. Search Query (Name, Email, Phone)
    const query = search.toLowerCase().trim();
    const matchesSearch =
      !query ||
      lead.name?.toLowerCase().includes(query) ||
      lead.email?.toLowerCase().includes(query) ||
      lead.phone?.toLowerCase().includes(query);

    // 2. Status Filter
    const matchesStatus =
      statusFilter === "All statuses" ||
      lead.status?.toUpperCase() === statusFilter.toUpperCase();

    // 3. Trip Filter
    const matchesTrip =
      tripFilter === "All trips" || lead.trip_id === tripFilter;

    // 4. Owner Filter
    const matchesOwner =
      ownerFilter === "All owners" ||
      (ownerFilter === "Unassigned" && !lead.owner_email) ||
      lead.owner_email === ownerFilter;

    return matchesSearch && matchesStatus && matchesTrip && matchesOwner;
  });

  // Export filtered leads to CSV
  function exportToCSV() {
    const headers = [
      "Name",
      "Email",
      "Phone",
      "Trip",
      "Group Type",
      "Status",
      "Owner",
      "Preferred Month",
      "Expectations",
      "Submitted At",
    ];

    const rows = filteredLeads.map((lead) => [
      lead.name || "",
      lead.email || "",
      lead.phone || "",
      lead.trips?.name || "",
      lead.group_type || "",
      lead.status || "",
      lead.owner_email || "Unassigned",
      lead.preferred_month || "",
      lead.expectations || "",
      lead.created_at ? new Date(lead.created_at).toLocaleString() : "",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((r) =>
        r
          .map((val) => `"${String(val).replace(/"/g, '""')}"`)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `nomichi_leads_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Format date to local readable format
  function formatDate(dateString) {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <div className="bg-[#FFFBF5] min-h-screen text-[#1C1B1A]">
      <AdminNavbar />

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-8">
        {/* Title and Export Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1.5">
            <span className="text-[10px] tracking-[0.25em] font-bold text-gray-400 uppercase">
              Trip Desk
            </span>
            <h1 className="font-serif font-extrabold text-4xl text-ink">Leads</h1>
            <p className="text-xs text-gray-500 font-semibold mt-1">
              {filteredLeads.length} of {leads.length}
            </p>
          </div>

          <button
            onClick={exportToCSV}
            disabled={filteredLeads.length === 0}
            className="border border-gray-300 hover:border-ink hover:bg-ink hover:text-white transition-all rounded-xl px-4 py-2 text-xs font-semibold text-gray-700 flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
        </div>

        {/* Controls Bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search bar */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search name, email, phone"
              className="border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 w-full text-xs bg-white focus:outline-none focus:border-rust shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Status Dropdown */}
          <div className="md:col-span-2">
            <select
              className="border border-gray-200 rounded-xl px-3 py-2.5 w-full text-xs bg-white focus:outline-none focus:border-rust shadow-sm appearance-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All statuses">All statuses</option>
              <option value="NEW">New</option>
              <option value="CONTACTED">Contacted</option>
              <option value="QUALIFIED">Qualified</option>
              <option value="VIBE CHECK SENT">Vibe Checked</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="NOT A FIT">Not a Fit</option>
            </select>
          </div>

          {/* Trips Dropdown */}
          <div className="md:col-span-2">
            <select
              className="border border-gray-200 rounded-xl px-3 py-2.5 w-full text-xs bg-white focus:outline-none focus:border-rust shadow-sm appearance-none"
              value={tripFilter}
              onChange={(e) => setTripFilter(e.target.value)}
            >
              <option value="All trips">All trips</option>
              {trips.map((trip) => (
                <option key={trip.id} value={trip.id}>
                  {trip.name}
                </option>
              ))}
            </select>
          </div>

          {/* Owners Dropdown */}
          <div className="md:col-span-2">
            <select
              className="border border-gray-200 rounded-xl px-3 py-2.5 w-full text-xs bg-white focus:outline-none focus:border-rust shadow-sm appearance-none"
              value={ownerFilter}
              onChange={(e) => setOwnerFilter(e.target.value)}
            >
              <option value="All owners">All owners</option>
              <option value="Unassigned">Unassigned</option>
              {uniqueOwners.map((owner) => (
                <option key={owner} value={owner}>
                  {owner}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Leads Table Container */}
        <div className="bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="py-3.5 px-6 text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
                    Lead
                  </th>
                  <th className="py-3.5 px-6 text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
                    Trip
                  </th>
                  <th className="py-3.5 px-6 text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
                    Group
                  </th>
                  <th className="py-3.5 px-6 text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
                    Status
                  </th>
                  <th className="py-3.5 px-6 text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
                    Owner
                  </th>
                  <th className="py-3.5 px-6 text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
                    Submitted
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100/60">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-20 text-sm text-gray-400 font-light">
                      Loading
                    </td>
                  </tr>
                ) : filteredLeads.length > 0 ? (
                  filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50/40 transition-colors">
                      {/* LEAD column: Name, Email & Phone */}
                      <td className="py-4 px-6">
                        <div className="space-y-0.5">
                          <Link
                            href={`/admin/leads/${lead.id}`}
                            className="text-rust hover:underline font-bold text-sm block"
                          >
                            {lead.name}
                          </Link>
                          <span className="text-[10px] text-gray-500 block">
                            {lead.email} &middot; {lead.phone}
                          </span>
                        </div>
                      </td>

                      {/* TRIP column */}
                      <td className="py-4 px-6 text-sm font-semibold text-gray-800">
                        {lead.trips?.name || "-"}
                      </td>

                      {/* GROUP column */}
                      <td className="py-4 px-6 text-xs font-semibold text-gray-500">
                        {lead.group_type || "-"}
                      </td>

                      {/* STATUS column */}
                      <td className="py-4 px-6">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          lead.status === "CONFIRMED" 
                            ? "bg-green-100 text-green-800" 
                            : lead.status === "NEW" 
                            ? "bg-blue-100 text-blue-800"
                            : lead.status === "NOT A FIT" 
                            ? "bg-gray-100 text-gray-800"
                            : "bg-amber-100 text-amber-800"
                        }`}>
                          {lead.status || "NEW"}
                        </span>
                      </td>

                      {/* OWNER column */}
                      <td className="py-4 px-6">
                        {lead.owner_email ? (
                          <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                            <User size={12} className="text-gray-400" />
                            <span>{lead.owner_email}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 italic">Unassigned</span>
                        )}
                      </td>

                      {/* SUBMITTED column */}
                      <td className="py-4 px-6 text-xs text-gray-500 font-semibold">
                        {formatDate(lead.created_at)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-20 text-sm text-gray-400 font-light">
                      No leads match the filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
