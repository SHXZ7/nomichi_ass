import { supabase } from "@/lib/supabase";
import WelcomeToast from "@/components/WelcomeToast";
import AdminNavbar from "@/components/AdminNavbar";
import Link from "next/link";
import { ArrowRight, Layers, Users, Map } from "lucide-react";

export default async function Dashboard() {
  // Fetch total count
  const { count: totalLeads } = await supabase
    .from("leads")
    .select("*", { count: "exact", head: true });

  // Fetch all leads to do counts by status and by trip
  const { data: leads } = await supabase
    .from("leads")
    .select("status, trip_id, trips(name)");

  // Fetch all trips to list leads per trip
  const { data: trips } = await supabase
    .from("trips")
    .select("id, name");

  // Calculate status counts
  const statusCounts = {
    NEW: 0,
    CONTACTED: 0,
    QUALIFIED: 0,
    "VIBE CHECK SENT": 0,
    CONFIRMED: 0,
    "NOT A FIT": 0,
  };

  leads?.forEach((lead) => {
    const status = lead.status?.toUpperCase();
    if (statusCounts[status] !== undefined) {
      statusCounts[status]++;
    } else if (status) {
      // Handle dynamically if there's any unexpected status
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    }
  });

  // Calculate leads per trip
  const tripLeadsMap = {};
  trips?.forEach((t) => {
    tripLeadsMap[t.name] = 0;
  });

  leads?.forEach((lead) => {
    const tripName = lead.trips?.name;
    if (tripName) {
      tripLeadsMap[tripName] = (tripLeadsMap[tripName] || 0) + 1;
    }
  });

  return (
    <div className="bg-[#FFFBF5] min-h-screen text-[#1C1B1A]">
      <AdminNavbar />

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-10">
        
        {/* Header Block */}
        <div className="space-y-2">
          <div className="text-[10px] tracking-[0.2em] font-semibold text-rust uppercase flex items-center gap-2">
            <span className="w-6 h-[1px] bg-rust"></span>
            Management Desk
          </div>
          <h1 className="font-serif font-extrabold text-4xl text-ink">Nomichi Dashboard</h1>
          <p className="text-sm text-gray-500 font-light max-w-xl">
            Overview of traveller enquiries, pipeline statuses, and active curated trips.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {/* Total Leads */}
          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-rust" />
            <h3 className="text-[10px] tracking-wider font-semibold text-gray-500 uppercase">
              Total Leads
            </h3>
            <p className="text-4xl font-extrabold mt-2 text-ink">{totalLeads || 0}</p>
            <div className="text-[10px] text-gray-400 mt-2">All submissions</div>
          </div>

          {/* New Leads */}
          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-blue-400" />
            <h3 className="text-[10px] tracking-wider font-semibold text-gray-500 uppercase">
              New Leads
            </h3>
            <p className="text-4xl font-extrabold mt-2 text-ink">{statusCounts.NEW || 0}</p>
            <div className="text-[10px] text-gray-400 mt-2">Awaiting reply</div>
          </div>

          {/* Contacted */}
          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-sand" />
            <h3 className="text-[10px] tracking-wider font-semibold text-gray-500 uppercase">
              Contacted
            </h3>
            <p className="text-4xl font-extrabold mt-2 text-ink">{statusCounts.CONTACTED || 0}</p>
            <div className="text-[10px] text-gray-400 mt-2">First response sent</div>
          </div>

          {/* Qualified */}
          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-orange-400" />
            <h3 className="text-[10px] tracking-wider font-semibold text-gray-500 uppercase">
              Qualified
            </h3>
            <p className="text-4xl font-extrabold mt-2 text-ink">{statusCounts.QUALIFIED || 0}</p>
            <div className="text-[10px] text-gray-400 mt-2">Fits our vibe</div>
          </div>

          {/* Vibe Check Sent */}
          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-indigo-400" />
            <h3 className="text-[10px] tracking-wider font-semibold text-gray-500 uppercase">
              Vibe Checked
            </h3>
            <p className="text-4xl font-extrabold mt-2 text-ink">{statusCounts["VIBE CHECK SENT"] || 0}</p>
            <div className="text-[10px] text-gray-400 mt-2">Forms sent out</div>
          </div>

          {/* Confirmed */}
          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-green-500" />
            <h3 className="text-[10px] tracking-wider font-semibold text-gray-500 uppercase">
              Confirmed
            </h3>
            <p className="text-4xl font-extrabold mt-2 text-ink">{statusCounts.CONFIRMED || 0}</p>
            <div className="text-[10px] text-gray-400 mt-2">Booked and ready</div>
          </div>
        </div>

        {/* Lower Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Leads Per Trip Card (Left - lg:col-span-8) */}
          <div className="lg:col-span-8 bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-ink font-serif flex items-center gap-2">
                  <Map className="w-5 h-5 text-rust shrink-0" />
                  Leads Per Trip
                </h2>
                <p className="text-xs text-gray-400 font-light">Enquiries received for each curated route</p>
              </div>
            </div>

            <div className="space-y-6">
              {Object.entries(tripLeadsMap).map(([tripName, count]) => {
                const percentage = totalLeads > 0 ? (count / totalLeads) * 100 : 0;
                return (
                  <div key={tripName} className="space-y-2">
                    <div className="flex justify-between items-baseline text-sm">
                      <span className="font-semibold text-ink">{tripName}</span>
                      <span className="text-xs font-bold bg-gray-100 text-gray-600 rounded-full px-2.5 py-0.5">
                        {count} leads
                      </span>
                    </div>
                    {/* Visual Bar */}
                    <div className="w-full bg-cream rounded-full h-2 overflow-hidden border border-gray-100/40">
                      <div 
                        className="bg-rust h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              {Object.keys(tripLeadsMap).length === 0 && (
                <div className="text-center py-12 text-gray-400 text-sm font-light">
                  No active trips have received enquiries yet.
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions & Pipeline Info (Right - lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Quick Actions Card */}
            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-ink font-serif flex items-center gap-2">
                <Layers className="w-5 h-5 text-rust shrink-0" />
                Desk Tasks
              </h2>
              
              <div className="space-y-3">
                <Link
                  href="/admin/leads"
                  className="flex items-center justify-between p-4 bg-cream/40 hover:bg-cream/90 rounded-2xl border border-gray-100/60 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-rust" />
                    <span className="text-sm font-semibold text-ink">Manage Leads</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/admin/trips"
                  className="flex items-center justify-between p-4 bg-cream/40 hover:bg-cream/90 rounded-2xl border border-gray-100/60 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Map className="w-4 h-4 text-rust" />
                    <span className="text-sm font-semibold text-ink">Curate Trips</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Pipeline Quality Notice */}
            <div className="bg-[#1C1B1A] text-white rounded-3xl p-8 shadow-sm space-y-4 relative overflow-hidden">
              {/* Decorative design dot */}
              <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-rust/10" />
              
              <h3 className="text-xs tracking-[0.2em] font-semibold text-rust uppercase">
                The House Style
              </h3>
              <h4 className="font-serif font-bold text-lg text-white">
                Walk the route twice.
              </h4>
              <p className="text-xs text-[#FFFBF5]/70 leading-relaxed font-light">
                Screen every traveller. Verify their vibe. We only suggest a trip if we think it fits. No marketplace shortcuts.
              </p>
              <div className="text-[10px] text-white/30 italic">
                Travel that finds you.
              </div>
            </div>

          </div>

        </div>

      </main>

      <WelcomeToast />
    </div>
  );
}