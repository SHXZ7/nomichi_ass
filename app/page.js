import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import HomepageEnquiryForm from "@/components/HomepageEnquiryForm";

export default async function Home() {
  // Fetch open trips from database
  const { data: dbTrips } = await supabase
    .from("trips")
    .select("*")
    .eq("status", "open")
    .order("created_at", { ascending: false });

  const openTrips = dbTrips || [];

  // Fallback demo trips if DB is empty to ensure gorgeous UI out of the box
  const demoTrips = [
    {
      id: "demo-1",
      name: "Spiti Slow Circuit",
      destination: "SPITI VALLEY, HIMACHAL PRADESH",
      description: "Ten quiet days across the cold desert. Monastery mornings, river-bend lunches, and a long stretch of nothing but sky.",
      price: 58000,
      dates: "12 Jul — 21 Jul",
      index: "01/03"
    },
    {
      id: "demo-2",
      name: "Ladakh Pangong Slow Lap",
      destination: "LEH, NUBRA AND PANGONG",
      description: "A small group, two acclimatisation days, and a route built for breath. Cold lakes, warm tea, slow drives.",
      price: 72000,
      dates: "9 Aug — 18 Aug",
      index: "02/03"
    },
    {
      id: "demo-3",
      name: "Meghalaya Living Roots",
      destination: "CHERRAPUNJEE AND NONGRIAT",
      description: "Seven days of rain, root bridges and Khasi kitchens. Walks that ask for patience, evenings that ask for none.",
      price: 42000,
      dates: "5 Sept — 11 Sept",
      index: "03/03"
    }
  ];

  const formatTripDates = (start, end) => {
    if (!start && !end) return "Dates TBA";
    const options = { day: "numeric", month: "short" };
    const startD = start ? new Date(start) : null;
    const endD = end ? new Date(end) : null;
    
    if (startD && endD) {
      if (startD.getFullYear() === endD.getFullYear()) {
        const startStr = startD.toLocaleDateString("en-IN", options);
        const endStr = endD.toLocaleDateString("en-IN", options);
        return `${startStr} — ${endStr}`;
      }
    }
    const formatStr = (d) => d ? d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "?";
    return `${formatStr(startD)} — ${formatStr(endD)}`;
  };

  const tripsToDisplay = openTrips.length > 0 
    ? openTrips.map((t, idx) => ({
        id: t.id,
        name: t.name,
        destination: t.destination.toUpperCase(),
        description: t.description || "A custom curated journey designed to let you experience the destination at a slow, deliberate pace.",
        price: t.price,
        dates: formatTripDates(t.start_date, t.end_date),
        index: `0${idx + 1}/0${openTrips.length}`
      }))
    : demoTrips;


  return (
    <div className="bg-[#FFFBF5] text-[#1C1B1A] min-h-screen selection:bg-rust selection:text-white">
      {/* Header Navigation */}
      <header className="max-w-7xl mx-auto px-6 md:px-12 py-6 flex items-center justify-between">
        <div className="flex items-baseline">
          <span className="font-serif font-extrabold text-2xl tracking-tight text-ink">nomichi</span>
          <span className="font-sans text-[9px] font-bold tracking-[0.25em] text-gray-400 ml-2 uppercase">
            Trip Desk
          </span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-ink/80">
          <a href="#open-trips" className="hover:text-rust transition-colors">Open trips</a>
          <a href="#how-we-work" className="hover:text-rust transition-colors">How we work</a>
          <a href="#enquire" className="hover:text-rust transition-colors">Enquire</a>
          <Link
            href="/admin/login"
            className="border border-ink/30 hover:border-ink hover:bg-ink hover:text-white transition-all rounded-full px-5 py-2 text-xs font-semibold"
          >
            Team sign in
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 pt-10 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Side: Headline & Intro */}
        <div className="lg:col-span-7 space-y-6">
          <div className="text-[10px] tracking-[0.2em] font-semibold text-rust uppercase flex items-center gap-2">
            <span className="w-6 h-[1px] bg-rust"></span>
            A trip desk, est. 2024
          </div>
          
          <h1 
            style={{ fontVariantLigatures: "none" }}
            className="font-serif font-extrabold text-5xl md:text-[5.5rem] leading-[1.05] tracking-tight text-ink"
          >
            Travel that f<span className="ml-[0.08em]">i</span>nds <br className="hidden md:block"/>
            <span className="italic text-rust font-normal">you,</span> not the other <br className="hidden md:block"/>
            way around.
          </h1>
          
          <p className="text-gray-600 max-w-xl text-base md:text-lg leading-relaxed font-light">
            Small groups. Slow days. Trips screened, curated and run end to end by our own team. 
            Tell us where you are, and we'll find your shape of a trip.
          </p>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-4">
            <a
              href="#open-trips"
              className="bg-ink hover:bg-rust text-white transition-all rounded-full px-7 py-4 text-sm font-semibold inline-flex items-center gap-2 shadow-sm"
            >
              See open trips →
            </a>
            <a
              href="#enquire"
              className="font-semibold text-sm hover:text-rust transition-colors flex items-center gap-1.5"
            >
              Or start a conversation ↗
            </a>
          </div>
        </div>

        {/* Right Side: Image Card */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div className="relative w-full max-w-md aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl group">
            <Image
              src="/sandakphu.jpg"
              alt="A morning on the Sandakphu ridge"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
            {/* Card Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            {/* Overlay Text */}
            <div className="absolute bottom-8 left-8 text-white">
              <span className="text-[9px] tracking-[0.2em] font-bold text-white/75 uppercase block mb-1">
                Trip · 2025
              </span>
              <h3 className="font-serif font-bold text-xl leading-tight">
                A morning on the Sandakphu ridge.
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* Stats row & Brand Values */}
      <section id="how-we-work" className="bg-[#FFFBF5] border-t border-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Stats Bar */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-16 border-b border-gray-100">
            <div className="flex gap-12 md:gap-16">
              <div>
                <span className="font-serif text-3xl md:text-4xl font-bold block text-ink">12</span>
                <span className="text-[9px] tracking-widest font-semibold text-gray-500 uppercase mt-1 block">Max Group</span>
              </div>
              <div>
                <span className="font-serif text-3xl md:text-4xl font-bold block text-ink">48h</span>
                <span className="text-[9px] tracking-widest font-semibold text-gray-500 uppercase mt-1 block">Reply Window</span>
              </div>
              <div>
                <span className="font-serif text-3xl md:text-4xl font-bold block text-ink">100%</span>
                <span className="text-[9px] tracking-widest font-semibold text-gray-500 uppercase mt-1 block">In-house Run</span>
              </div>
            </div>
            
            <div>
              <span className="bg-[#FFFE00] text-ink font-sans text-[10px] tracking-widest font-bold px-5 py-2 rounded-full shadow-sm uppercase">
                Small group · every time
              </span>
            </div>
          </div>

          {/* Three columns values */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-16">
            <div className="lg:col-span-4 space-y-4">
              <div className="text-[10px] tracking-[0.2em] font-semibold text-rust uppercase flex items-center gap-2">
                <span className="w-6 h-[1px] bg-rust"></span>
                The House Style
              </div>
              <h2 className="font-serif font-extrabold text-3xl md:text-4xl leading-tight text-ink">
                How we work, <br />
                in three lines.
              </h2>
            </div>
            
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3 p-6 rounded-2xl bg-white/40 hover:bg-white transition-all">
                <span className="font-serif text-2xl font-bold text-rust block">01</span>
                <h3 className="font-serif font-bold text-lg text-ink">Screened, not scraped</h3>
                <p className="text-sm text-gray-600 leading-relaxed font-light">
                  Every trip is walked by someone on our team before a single seat is sold. No marketplace inventory.
                </p>
              </div>

              <div className="space-y-3 p-6 rounded-2xl bg-white/40 hover:bg-white transition-all">
                <span className="font-serif text-2xl font-bold text-rust block">02</span>
                <h3 className="font-serif font-bold text-lg text-ink">Small by design</h3>
                <p className="text-sm text-gray-600 leading-relaxed font-light">
                  Eight to twelve travellers. Enough for company, few enough for the road to still feel like yours.
                </p>
              </div>

              <div className="space-y-3 p-6 rounded-2xl bg-white/40 hover:bg-white transition-all">
                <span className="font-serif text-2xl font-bold text-rust block">03</span>
                <h3 className="font-serif font-bold text-lg text-ink">Slow on purpose</h3>
                <p className="text-sm text-gray-600 leading-relaxed font-light">
                  Mornings without alarms. Evenings without itineraries. Days shaped to let a place actually land.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Open Trips Grid */}
      <section id="open-trips" className="bg-[#FFFBF5] border-t border-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-3">
              <div className="text-[10px] tracking-[0.2em] font-semibold text-rust uppercase flex items-center gap-2">
                <span className="w-6 h-[1px] bg-rust"></span>
                Open Trips
              </div>
              <h2 className="font-serif font-extrabold text-3xl md:text-4xl text-ink">
                The next few we're running
              </h2>
            </div>
            
            <div className="max-w-xs text-xs text-gray-500 leading-relaxed">
              Prices include GST. Seats are kept small on purpose — most trips close two weeks before departure.
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tripsToDisplay.map((trip) => (
              <div
                key={trip.id}
                className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow min-h-[380px]"
              >
                <div className="space-y-4">
                  <span className="text-[9px] font-semibold tracking-wider text-rust block uppercase">
                    {trip.index} {trip.destination}
                  </span>
                  <h3 className="font-serif font-bold text-2xl text-ink">
                    {trip.name}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed font-light">
                    {trip.description}
                  </p>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-50 flex flex-col gap-4">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-gray-500 font-medium">{trip.dates}</span>
                    <span className="font-sans text-xl font-bold text-ink tracking-tight">
                      <span className="text-xs font-semibold mr-0.5 text-gray-400">₹</span>
                      {trip.price.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <a
                    href="#enquire"
                    className="text-sm font-semibold hover:text-rust text-ink inline-flex items-center gap-1.5 transition-colors self-start"
                  >
                    Enquire about this trip →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enquiry Form Section */}
      <section id="enquire" className="bg-[#FFFBF5] border-t border-gray-100 py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left: Description Info */}
          <div className="space-y-6">
            <div className="text-[10px] tracking-[0.2em] font-semibold text-rust uppercase flex items-center gap-2">
              <span className="w-6 h-[1px] bg-rust"></span>
              Enquire
            </div>

            <h2 className="font-serif font-extrabold text-3xl md:text-5xl leading-tight text-ink">
              Tell us a little <br className="hidden md:block" />
              about you.
            </h2>

            <p className="text-gray-600 text-sm md:text-base leading-relaxed font-light max-w-sm">
              No forms with thirty fields. A few honest answers help us find out if a trip is your kind of quiet. We read every reply.
            </p>

            <ul className="space-y-3.5 pt-2 text-sm text-ink/90 font-medium">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-rust mt-1.5 shrink-0"></span>
                <span>You hear from a real person, usually within a day.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-rust mt-1.5 shrink-0"></span>
                <span>We'll only suggest a trip if we think it fits.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-rust mt-1.5 shrink-0"></span>
                <span>No spam, no broadcast lists.</span>
              </li>
            </ul>
          </div>

          {/* Right: Form Card */}
          <div className="w-full">
            <HomepageEnquiryForm trips={openTrips} />
          </div>

        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-[#1C1B1A] text-[#FFFBF5] pt-16 pb-12 mt-auto border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Logo & Description */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-baseline">
              <span className="font-serif font-extrabold text-2xl tracking-tight text-white">nomichi</span>
              <span className="font-sans text-[9px] font-bold tracking-[0.25em] text-[#FFFBF5]/65 ml-2 uppercase">
                Trip Desk
              </span>
            </div>
            <p className="text-sm text-[#FFFBF5]/75 leading-relaxed max-w-sm">
              A small trip desk run by people who'd rather walk a route twice than sell it once.
            </p>
          </div>

          {/* Links Column 1 */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-[10px] tracking-[0.2em] font-bold text-[#FFFBF5]/50 uppercase">
              Visit
            </h4>
            <ul className="space-y-2.5 text-sm text-[#FFFBF5]/85">
              <li>
                <a href="#open-trips" className="hover:text-rust transition-colors">Open trips</a>
              </li>
              <li>
                <a href="#how-we-work" className="hover:text-rust transition-colors">How we work</a>
              </li>
              <li>
                <a href="#enquire" className="hover:text-rust transition-colors">Enquire</a>
              </li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-[10px] tracking-[0.2em] font-bold text-[#FFFBF5]/50 uppercase">
              Reach
            </h4>
            <ul className="space-y-2.5 text-sm text-[#FFFBF5]/85">
              <li>
                <a href="mailto:hi@nomichi.in" className="hover:text-rust transition-colors">hi@nomichi.in</a>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-rust transition-colors">Team sign in</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Separator and Bottom Row */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#FFFBF5]/50">
          <p>&copy; {new Date().getFullYear()} Nomichi Explorers Pvt Ltd</p>
          <div className="tracking-[0.25em] text-[10px] font-semibold uppercase">
            Wander &middot; Connect &middot; Belong
          </div>
        </div>
      </footer>

    </div>
  );
}
