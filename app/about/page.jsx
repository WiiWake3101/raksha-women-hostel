"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

// ── Intersection Observer hook ─────────────────────────────────────────────
function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function Reveal({ children, delay = 0, direction = "up", className = "" }) {
  const [ref, inView] = useInView();
  const t = { up: "translateY(40px)", left: "translateX(-40px)", right: "translateX(40px)", down: "translateY(-40px)" };
  return (
    <div ref={ref} className={className} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "translate(0)" : t[direction],
      transition: `opacity 0.7s ease ${delay}s, transform 0.7s cubic-bezier(.22,.68,0,1.2) ${delay}s`,
    }}>
      {children}
    </div>
  );
}

// ── Data ───────────────────────────────────────────────────────────────────
const facilities = [
  { icon: "🛏️", label: "Furnished Room" },
  { icon: "🚿", label: "Attached Bathrooms" },
  { icon: "🔥", label: "Hot Water Supply" },
  { icon: "👗", label: "Washing Machine" },
  { icon: "📺", label: "LED TV" },
  { icon: "🍽️", label: "Homemade Food" },
  { icon: "💪", label: "Fitness Centre" },
  { icon: "🔒", label: "Safe & Secure" },
];

const pillars = [
  {
    icon: "🏠",
    title: "Feel at Home",
    desc: "Fully furnished rooms with wardrobe, LED TV, chair and bed. Spacious, well-ventilated and designed to keep the ambience fresh and breezy.",
  },
  {
    icon: "💧",
    title: "Health First",
    desc: "Aquaguard for clean drinking water, 24-hour hot water supply and hygienic homemade food — because your health is our priority.",
  },
  {
    icon: "📶",
    title: "Seamless Living",
    desc: "High-speed Wi-Fi and 24/7 power backup keep you connected and productive — the perfect space for working women.",
  },
  {
    icon: "🛡️",
    title: "Always Safe",
    desc: "CCTV surveillance and round-the-clock security guards ensure you and your belongings are always protected.",
  },
];

const stats = [
  { value: "24/7", label: "Security" },
  { value: "18+", label: "Amenities" },
  { value: "100%", label: "Safe Stay" },
  { value: "₹", label: "Budget Friendly" },
];

export default function AboutPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 60); }, []);

  return (
    <>
      <Navbar />

      <style>{`
        @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-16px)} }
        @keyframes floatB   { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-20px) rotate(3deg)} }
        @keyframes spin-slow{ from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes gradient-shift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes pulse-ring { 0%{transform:scale(1);opacity:.5} 100%{transform:scale(1.6);opacity:0} }
        @keyframes draw-line { from{width:0} to{width:100%} }
        @keyframes card-in  { from{opacity:0;transform:translateY(20px) scale(.97)} to{opacity:1;transform:none} }
        @keyframes marquee  { from{transform:translateX(0)} to{transform:translateX(-50%)} }

        .animated-gradient {
          background-size: 200% 200%;
          animation: gradient-shift 4s ease infinite;
        }
        .cta-btn {
          position:relative; overflow:hidden;
          transition: transform .2s ease, box-shadow .2s ease;
        }
        .cta-btn::before {
          content:''; position:absolute; inset:0;
          background: linear-gradient(120deg,transparent 0%,rgba(255,255,255,.25) 50%,transparent 100%);
          transform: translateX(-100%); transition: transform .5s ease;
        }
        .cta-btn:hover::before { transform:translateX(100%); }
        .cta-btn:hover { transform:translateY(-2px); box-shadow: 0 12px 32px rgba(194,0,106,.3); }

        .pillar-card {
          transition: transform .35s cubic-bezier(.22,.68,0,1.3), box-shadow .35s ease, border-color .2s ease;
        }
        .pillar-card:hover {
          transform: translateY(-8px) scale(1.015);
          box-shadow: 0 24px 48px rgba(194,0,106,.13);
          border-color: #fecdd3;
        }
        .pillar-card:hover .pillar-icon {
          animation: floatB 2s ease-in-out infinite;
        }
        .facility-chip {
          transition: transform .25s cubic-bezier(.22,.68,0,1.3), box-shadow .25s ease, background .2s ease;
        }
        .facility-chip:hover {
          transform: translateY(-4px) scale(1.04);
          box-shadow: 0 10px 24px rgba(194,0,106,.15);
          background: linear-gradient(135deg,#8b005c,#f72c6e);
          color: white;
          border-color: transparent;
        }
        .stat-card {
          transition: transform .3s ease, box-shadow .3s ease;
        }
        .stat-card:hover {
          transform: translateY(-4px) scale(1.04);
          box-shadow: 0 20px 40px rgba(0,0,0,.18);
        }
        .quote-mark {
          font-family: Georgia, serif;
          font-size: 8rem;
          line-height: 0;
          color: rgba(194,0,106,.12);
          position: absolute;
          top: 2rem;
          left: 1.5rem;
          pointer-events: none;
          user-select: none;
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee 22s linear infinite;
        }
        .marquee-track:hover { animation-play-state: paused; }
        .section-divider {
          height: 2px;
          background: linear-gradient(90deg, transparent, #f0abcc, #c2006a, #f0abcc, transparent);
          border: none;
          margin: 0;
        }
        .diagonal-strip {
          clip-path: polygon(0 8%, 100% 0%, 100% 92%, 0% 100%);
        }
      `}</style>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-[#8b005c] via-[#c2006a] to-[#f72c6e] overflow-hidden">
        {/* Decorative spinning ring */}
        <div className="absolute top-6 right-6 w-72 h-72 opacity-[0.06] pointer-events-none" style={{ animation: "spin-slow 24s linear infinite" }}>
          <svg viewBox="0 0 200 200" fill="none">
            <circle cx="100" cy="100" r="90" stroke="white" strokeWidth="2" strokeDasharray="8 8" />
            <circle cx="100" cy="100" r="65" stroke="white" strokeWidth="1" strokeDasharray="4 14" />
            <circle cx="100" cy="100" r="40" stroke="white" strokeWidth="2" strokeDasharray="2 6" />
          </svg>
        </div>
        {/* Floating orbs */}
        {[
          { s: 360, top: "-18%", right: "-6%", dur: "8s" },
          { s: 220, bottom: "-14%", left: "2%", dur: "10s", delay: "2s" },
          { s: 160, top: "35%", left: "42%", dur: "6s", delay: "1s" },
        ].map((o, i) => (
          <div key={i} className="absolute rounded-full bg-white/5 pointer-events-none"
            style={{ width: o.s, height: o.s, top: o.top, right: o.right, bottom: o.bottom, left: o.left, animation: `float ${o.dur} ease-in-out infinite`, animationDelay: o.delay || "0s" }} />
        ))}

        <div className="relative max-w-6xl mx-auto px-6 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center gap-12">
            {/* LEFT: Hero copy */}
            <div className="flex-1">
              <div style={{ opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(24px)", transition: "opacity .6s ease .1s, transform .6s ease .1s" }}>
                <span className="inline-block text-xs font-semibold uppercase tracking-widest text-white/70 bg-white/10 border border-white/20 px-4 py-1.5 rounded-full mb-5">
                  Our Story
                </span>
              </div>
              <div style={{ opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(32px)", transition: "opacity .7s ease .2s, transform .7s cubic-bezier(.22,.68,0,1.2) .2s" }}>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                  More Than a Hostel —<br />
                  <span className="text-white/80">A Home for</span><br />
                  <span className="italic font-bold">Ambitious Women.</span>
                </h1>
              </div>
              <div style={{ opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(24px)", transition: "opacity .7s ease .35s, transform .7s ease .35s" }}>
                <p className="text-white/75 text-base md:text-lg leading-relaxed max-w-lg">
                  We built Raksha Women Hostel for women who are brave enough to chase their dreams — offering comfort, security and community at a price that makes sense.
                </p>
              </div>
              <div style={{ opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(20px)", transition: "opacity .7s ease .5s, transform .7s ease .5s" }}
                className="flex flex-wrap gap-3 mt-8">
                <Link href="/contact" className="cta-btn bg-white text-[#9b0066] font-semibold px-7 py-3 rounded-lg shadow-md">Book a Room</Link>
                <Link href="/facilities" className="cta-btn border border-white/40 text-white font-semibold px-7 py-3 rounded-lg hover:bg-white/10">View Facilities</Link>
              </div>
            </div>

            {/* RIGHT: Stat cards */}
            <div className="flex-shrink-0 grid grid-cols-2 gap-4 w-full max-w-xs"
              style={{ opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateX(40px)", transition: "opacity .8s ease .3s, transform .8s cubic-bezier(.22,.68,0,1.2) .3s" }}>
              {stats.map((s, i) => (
                <div key={s.label} className="stat-card bg-white/10 border border-white/20 rounded-2xl px-4 py-6 text-center backdrop-blur-sm cursor-default"
                  style={{ animationDelay: `${i * 0.08}s` }}>
                  <p className="text-3xl md:text-4xl font-bold text-white">{s.value}</p>
                  <p className="text-white/65 text-xs mt-1 font-medium uppercase tracking-wider">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE STRIP ──────────────────────────────────────────────────── */}
      <div className="bg-[#8b005c] py-3 overflow-hidden border-y border-pink-900/30">
        <div className="marquee-track">
          {[...Array(2)].map((_, ri) => (
            <div key={ri} className="flex items-center gap-0">
              {["Safe & Secure", "Homemade Food", "High-Speed Wi-Fi", "24/7 Security", "Power Backup", "Fitness Centre", "Hot Water", "Affordable Stay", "Furnished Rooms", "CCTV Surveillance"].map((item, i) => (
                <span key={i} className="flex items-center gap-3 text-white/80 text-sm font-semibold px-6 whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-300 inline-block flex-shrink-0" />
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── STORY SECTION ──────────────────────────────────────────────────── */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

            {/* Left: Pull quote + visual block */}
            <Reveal direction="left">
              <div className="relative">
                {/* Big decorative quote block */}
                <div className="relative bg-gradient-to-br from-[#8b005c] via-[#c2006a] to-[#f72c6e] rounded-3xl p-10 text-white overflow-hidden"
                  style={{ minHeight: 320 }}>
                  <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/8 translate-x-12 -translate-y-12" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white/5 -translate-x-8 translate-y-8" />
                  <span className="quote-mark">"</span>
                  <div className="relative mt-10">
                    <p className="text-xl md:text-2xl font-semibold leading-relaxed italic">
                      We thrive on making your busy life as safe and comfortable as we can.
                    </p>
                    <div className="mt-6 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl">🏠</div>
                      <div>
                        <p className="font-bold text-sm">Raksha Women Hostel</p>
                        <p className="text-white/60 text-xs">Coimbatore, Tamil Nadu</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info cards below */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {[
                    { icon: "📍", label: "Location", val: "Keeranatham, Coimbatore" },
                    { icon: "💰", label: "Pricing", val: "Budget Friendly" },
                  ].map((c) => (
                    <div key={c.label} className="bg-pink-50 border border-pink-100 rounded-2xl p-4"
                      style={{ transition: "transform .25s ease, box-shadow .25s ease" }}
                      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 20px rgba(194,0,106,.12)"; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>
                      <span className="text-2xl block mb-1">{c.icon}</span>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#c2006a]">{c.label}</p>
                      <p className="text-gray-700 text-sm font-medium mt-0.5">{c.val}</p>
                    </div>
                  ))}
                </div>

                {/* Floating badge */}
                <div className="absolute -top-4 -right-4 bg-white border border-pink-100 rounded-2xl shadow-lg px-4 py-2.5 flex items-center gap-2"
                  style={{ animation: "float 5s ease-in-out infinite" }}>
                  <span className="w-2 h-2 rounded-full bg-green-400 inline-block relative">
                    <span className="absolute inset-0 rounded-full bg-green-400" style={{ animation: "pulse-ring 1.5s infinite" }} />
                  </span>
                  <span className="text-xs font-semibold text-gray-700">Accepting Residents</span>
                </div>
              </div>
            </Reveal>

            {/* Right: Story paragraphs */}
            <Reveal direction="right" delay={0.1}>
              <div className="flex flex-col gap-6">
                <div>
                  <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#c2006a] bg-pink-50 border border-pink-100 px-4 py-1.5 rounded-full mb-4">
                    About Us
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-snug">
                    Built for Women<br />Who Dream{" "}
                    <span className="text-transparent bg-clip-text animated-gradient"
                      style={{ backgroundImage: "linear-gradient(90deg,#8b005c,#c2006a,#f72c6e,#c2006a,#8b005c)" }}>
                      Big.
                    </span>
                  </h2>
                </div>

                <div className="space-y-4 text-gray-500 text-[15px] leading-relaxed">
                  <p>
                    Raksha Women Hostel is a place for women who are venturing out of their homes and families in search of bettering their education or careers. Our hostel gives you a <span className="text-gray-800 font-semibold">comfortable, peaceful and enjoyable stay</span> at a reasonable, budget-friendly accommodation — a true value-for-money proposition for passionate working women.
                  </p>
                  <p>
                    We provide accommodation with all the amenities required for working women. Your affordable room comes <span className="text-gray-800 font-semibold">fully furnished</span> with a chair, wardrobe, LED TV and bed. All rooms are well-ventilated, spacious and convenient — keeping the ambience fresh and breezy.
                  </p>
                  <p>
                    Raksha Women Hostel also provides Aquaguard for clean drinking water, 24-hour hot water supply, high-speed Wi-Fi and power backup — making it the <span className="text-gray-800 font-semibold">perfect space for a seamless experience.</span>
                  </p>
                  <p>
                    The hostel has been designed keeping in mind the <span className="text-gray-800 font-semibold">utmost security of women residents</span> and their belongings. CCTV surveillance and security guards are available round-the-clock so you can focus on what matters — your growth.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <Link href="/contact" className="cta-btn inline-flex items-center gap-2 bg-gradient-to-r from-[#8b005c] via-[#c2006a] to-[#f72c6e] text-white font-semibold px-7 py-3 rounded-lg shadow-md shadow-pink-200">
                    Book Your Room
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                  <a href="https://wa.me/918220018000" target="_blank" rel="noopener noreferrer"
                    className="cta-btn border border-[#c2006a] text-[#c2006a] font-semibold px-7 py-3 rounded-lg hover:bg-pink-50">
                    WhatsApp Us
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      {/* ── FOUR PILLARS ───────────────────────────────────────────────────── */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-12">
              <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#c2006a] bg-pink-50 border border-pink-100 px-4 py-1.5 rounded-full mb-4">
                Why Raksha
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Four Pillars of Your{" "}
                <span className="text-transparent bg-clip-text animated-gradient"
                  style={{ backgroundImage: "linear-gradient(90deg,#8b005c,#c2006a,#f72c6e,#c2006a,#8b005c)" }}>
                  Perfect Stay
                </span>
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.1}>
                <div className="pillar-card bg-white border border-gray-100 rounded-2xl p-7 h-full flex flex-col gap-4 cursor-default">
                  <span className="pillar-icon text-4xl block">{p.icon}</span>
                  <h3 className="text-gray-900 font-bold text-lg">{p.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed flex-1">{p.desc}</p>
                  <div className="h-0.5 w-10 rounded-full bg-gradient-to-r from-[#8b005c] to-[#f72c6e] mt-auto" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      {/* ── FACILITIES GRID ────────────────────────────────────────────────── */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-14 items-center">

            {/* Left: heading + description */}
            <Reveal direction="left" className="flex-1">
              <div className="flex flex-col gap-5 max-w-md">
                <span className="inline-block w-fit text-xs font-semibold uppercase tracking-widest text-[#c2006a] bg-pink-50 border border-pink-100 px-4 py-1.5 rounded-full">
                  Our Facilities
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-snug">
                  Everything You Need,{" "}
                  <span className="text-transparent bg-clip-text animated-gradient"
                    style={{ backgroundImage: "linear-gradient(90deg,#8b005c,#c2006a,#f72c6e,#c2006a,#8b005c)" }}>
                    All Included.
                  </span>
                </h2>
                <p className="text-gray-500 text-base leading-relaxed">
                  You can easily find the right balance between budget and privacy — comfort, security and luxurious living all under one roof to make residents feel completely at home and happy.
                </p>
                <Link href="/facilities"
                  className="cta-btn inline-flex items-center gap-2 w-fit bg-gradient-to-r from-[#8b005c] via-[#c2006a] to-[#f72c6e] text-white font-semibold px-7 py-3 rounded-xl shadow-md shadow-pink-200 mt-2">
                  View All Facilities
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </Reveal>

            {/* Right: chips grid */}
            <Reveal direction="right" delay={0.1} className="flex-1 w-full">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                {facilities.map((f, i) => (
                  <div key={f.label}
                    className="facility-chip bg-gray-50 border border-gray-100 rounded-2xl px-4 py-4 flex items-center gap-3 cursor-default"
                    style={{ animation: "card-in 0.4s ease both", animationDelay: `${i * 0.07}s` }}>
                    <span className="text-2xl flex-shrink-0">{f.icon}</span>
                    <span className="text-gray-700 text-sm font-semibold leading-tight">{f.label}</span>
                  </div>
                ))}
                {/* View all chip */}
                <Link href="/facilities"
                  className="facility-chip bg-gradient-to-br from-[#8b005c] to-[#f72c6e] border-transparent rounded-2xl px-4 py-4 flex items-center gap-3 text-white"
                  style={{ animation: "card-in 0.4s ease both", animationDelay: `${facilities.length * 0.07}s` }}>
                  <span className="text-2xl flex-shrink-0">✨</span>
                  <span className="text-sm font-bold leading-tight">View All<br />Facilities</span>
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── MISSION STRIP ──────────────────────────────────────────────────── */}
      <section className="diagonal-strip bg-gradient-to-r from-[#8b005c] via-[#c2006a] to-[#f72c6e] py-24 my-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          {[{ s: 260, top:"-20%", right:"2%", dur:"9s" }, { s: 180, bottom:"-15%", left:"5%", dur:"7s", delay:"2s" }].map((o,i)=>(
            <div key={i} className="absolute rounded-full bg-white/5" style={{ width:o.s, height:o.s, top:o.top, right:o.right, bottom:o.bottom, left:o.left, animation:`float ${o.dur} ease-in-out infinite`, animationDelay:o.delay||"0s" }} />
          ))}
        </div>
        <Reveal>
          <div className="relative max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-6">
            <span className="text-5xl" style={{ animation:"float 4s ease-in-out infinite" }}>💜</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-snug">
              "Your comfort is our commitment.<br />Your safety is our promise."
            </h2>
            <p className="text-white/75 text-base max-w-xl">
              At Raksha Women Hostel, we don't just provide accommodation — we provide a community where women support and uplift each other every single day.
            </p>
            <div className="flex flex-wrap gap-3 justify-center mt-2">
              <Link href="/contact" className="cta-btn bg-white text-[#9b0066] font-semibold px-8 py-3.5 rounded-xl shadow-md hover:bg-pink-50">Book a Room</Link>
              <a href="tel:+918220018000" className="cta-btn border border-white/40 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/10">Call Us Now</a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── CONTACT NUDGE ──────────────────────────────────────────────────── */}
      <section className="bg-gray-50 py-16">
        <Reveal>
          <div className="max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-4">
            <h3 className="text-2xl font-bold text-gray-900">Ready to Make Raksha Your Home?</h3>
            <p className="text-gray-500 text-sm max-w-md">
              Reach out to us and we'll help you get settled in — quickly, easily and affordably.
            </p>
            <div className="flex flex-wrap gap-3 justify-center mt-2">
              <Link href="/contact" className="cta-btn bg-gradient-to-r from-[#8b005c] via-[#c2006a] to-[#f72c6e] text-white font-semibold px-7 py-3 rounded-xl shadow-md shadow-pink-200">Get in Touch</Link>
              <a href="https://wa.me/918220018000" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#25d366] text-white font-semibold px-7 py-3 rounded-xl shadow-md shadow-green-200 hover:bg-[#1ebe5d] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp Us
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      <Footer />
    </>
  );
}