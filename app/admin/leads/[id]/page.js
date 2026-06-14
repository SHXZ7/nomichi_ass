import { supabase } from "@/lib/supabase";
import StatusSelector from "@/components/StatusSelector";
import OwnerSelector from "@/components/OwnerSelector";
import AddNote from "@/components/AddNote";
import WhatsAppDraft from "@/components/WhatsAppDraft";
import VibeAdvisor from "@/components/VibeAdvisor";
import AdminNavbar from "@/components/AdminNavbar";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, Calendar, Users, MapPin, Sparkles, Clock } from "lucide-react";

export default async function LeadDetail({ params }) {
  const { id } = await params;

  // Fetch lead data with trip details
  const { data: lead } = await supabase
    .from("leads")
    .select(`
      *,
      trips(name,destination)
    `)
    .eq("id", id)
    .single();

  // Fetch notes/logs for this lead
  const { data: notes } = await supabase
    .from("notes")
    .select("*")
    .eq("lead_id", id)
    .order("created_at", {
      ascending: false,
    });

  // Fetch unique owners for the selector
  const { data: allLeads } = await supabase
    .from("leads")
    .select("owner_email");

  const uniqueOwners = Array.from(
    new Set(allLeads?.map((l) => l.owner_email).filter(Boolean) || [])
  );

  if (!lead) {
    return (
      <div className="bg-[#FFFBF5] min-h-screen text-[#1C1B1A]">
        <AdminNavbar />
        <main className="max-w-4xl mx-auto p-12 text-center space-y-4">
          <h1 className="font-serif text-2xl font-bold">Lead Not Found</h1>
          <p className="text-sm text-gray-500">The lead you are trying to view does not exist or has been removed.</p>
          <Link
            href="/admin/leads"
            className="inline-block bg-ink text-white px-4 py-2 rounded-xl text-xs font-semibold"
          >
            Back to Leads
          </Link>
        </main>
      </div>
    );
  }

  function formatDateTime(dateString) {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  return (
    <div className="bg-[#FFFBF5] min-h-screen text-[#1C1B1A]">
      <AdminNavbar />

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/admin/leads"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-ink transition-colors group cursor-pointer uppercase tracking-wider"
          >
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
            <span>Back to Leads</span>
          </Link>
        </div>

        {/* Lead Header Title & Quick Actions */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-gray-150">
          <div className="space-y-1">
            <span className="text-[10px] tracking-[0.25em] font-bold text-gray-400 uppercase">
              Lead Profile
            </span>
            <h1 className="font-serif font-extrabold text-4xl text-ink">
              {lead.name}
            </h1>
            <p className="text-xs text-gray-400 font-semibold flex items-center gap-1">
              <Clock size={12} /> Submitted on {formatDateTime(lead.created_at)}
            </p>
          </div>

          {/* Quick Selectors */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Status</span>
              <StatusSelector leadId={lead.id} currentStatus={lead.status} />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Lead Owner</span>
              <OwnerSelector leadId={lead.id} currentOwner={lead.owner_email} uniqueOwners={uniqueOwners} />
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10">
          
          {/* LEFT COLUMN: Lead & Trip details (Col-span 7) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Contact Details Card */}
            <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-50 pb-3">
                <Users size={16} className="text-rust" />
                <h2 className="text-sm font-bold text-ink uppercase tracking-wide">Contact Information</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Mail size={10} className="text-gray-400" />
                    <span>Email Address</span>
                  </span>
                  <a
                    href={`mailto:${lead.email}`}
                    className="text-xs font-semibold text-rust hover:underline block break-all"
                  >
                    {lead.email || "-"}
                  </a>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Phone size={10} className="text-gray-400" />
                    <span>Phone Number</span>
                  </span>
                  <a
                    href={`tel:${lead.phone}`}
                    className="text-xs font-semibold text-rust hover:underline block"
                  >
                    {lead.phone || "-"}
                  </a>
                </div>
              </div>
            </div>

            {/* Trip Request Preferences */}
            <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-50 pb-3">
                <MapPin size={16} className="text-rust" />
                <h2 className="text-sm font-bold text-ink uppercase tracking-wide">Trip Inquiry Details</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Selected Trip</span>
                  <span className="text-xs font-bold text-ink">
                    {lead.trips?.name || "-"}
                    {lead.trips?.destination && (
                      <span className="text-gray-400 font-medium block text-[10px]">
                        {lead.trips.destination}
                      </span>
                    )}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Travel Group</span>
                  <span className="text-xs font-bold text-ink capitalize">
                    {lead.group_type || "-"}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Calendar size={10} className="text-gray-400" />
                    <span>Preferred Month</span>
                  </span>
                  <span className="text-xs font-bold text-ink">
                    {lead.preferred_month || "-"}
                  </span>
                </div>
              </div>
            </div>

            {/* Traveler Expectations */}
            <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-50 pb-3">
                <Sparkles size={16} className="text-rust" />
                <h2 className="text-sm font-bold text-ink uppercase tracking-wide">Traveler Expectations</h2>
              </div>
              {lead.expectations ? (
                <>
                  <div className="bg-[#FFFBF5] border-l-2 border-rust p-4 rounded-r-xl">
                    <p className="text-xs md:text-sm text-ink leading-relaxed italic whitespace-pre-wrap">
                      "{lead.expectations}"
                    </p>
                  </div>
                  <VibeAdvisor
                    name={lead.name}
                    expectations={lead.expectations}
                    tripName={lead.trips?.name}
                  />
                </>
              ) : (
                <p className="text-xs text-gray-400 italic">No specific expectations provided by the traveler.</p>
              )}
            </div>

          </div>

          {/* RIGHT COLUMN: AI Assistant & Call Log Feed (Col-span 5) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* WhatsApp Draft Generator */}
            <WhatsAppDraft lead={lead} />

            {/* Call Logs & Notes Timeline */}
            <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm space-y-6">
              <div className="border-b border-gray-50 pb-3">
                <h2 className="text-sm font-bold text-ink uppercase tracking-wide">Call Log & Timeline</h2>
                <p className="text-[10px] text-gray-400 font-medium">Add records of calls, emails, or notes</p>
              </div>

              {/* Add Note/Log Form */}
              <AddNote leadId={lead.id} />

              {/* Notes List */}
              <div className="space-y-4 pt-2">
                <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  Timeline
                </span>

                {notes && notes.length > 0 ? (
                  <div className="relative pl-5 border-l border-gray-150 space-y-6 ml-2 pt-1 pb-1">
                    {notes.map((note) => (
                      <div key={note.id} className="relative group">
                        {/* Timeline Bullet */}
                        <span className="absolute -left-[26px] top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white border border-gray-300 group-hover:border-rust transition-colors duration-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-gray-400 group-hover:bg-rust transition-colors duration-200" />
                        </span>
                        
                        <div className="space-y-1">
                          <p className="text-xs text-ink leading-relaxed whitespace-pre-wrap">
                            {note.content}
                          </p>
                          <span className="block text-[10px] text-gray-400 font-semibold">
                            {formatDateTime(note.created_at)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                    <p className="text-xs text-gray-400 italic">No notes logged yet. Log your first action above.</p>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
