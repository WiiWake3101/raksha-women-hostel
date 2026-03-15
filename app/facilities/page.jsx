"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

// ── Hooks ──────────────────────────────────────────────────────────────────
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
  const t = { up: "translateY(36px)", down: "translateY(-36px)", left: "translateX(-36px)", right: "translateX(36px)" };
  return (
    <div ref={ref} className={className} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "translate(0)" : t[direction],
      transition: `opacity 0.65s ease ${delay}s, transform 0.65s cubic-bezier(.22,.68,0,1.2) ${delay}s`,
    }}>
      {children}
    </div>
  );
}

// ── Data ───────────────────────────────────────────────────────────────────
const categories = ["All", "Room", "Food", "Safety", "Comfort", "Services"];

const facilities = [
  { title: "Furnished Room", desc: "Fully furnished rooms with comfortable beds, wardrobes, study tables and chairs — move in with ease.", category: "Room", highlight: true, icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
  { title: "Attached Bathrooms", desc: "Private attached bathrooms in each room for your comfort and hygiene.", category: "Room", icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}><path strokeLinecap="round" strokeLinejoin="round" d="M6 2v4m0 0a2 2 0 000 4h12a2 2 0 000-4H6zm0 0h12M4 10v8a2 2 0 002 2h12a2 2 0 002-2v-8" /></svg> },
  { title: "Hot Water Supply", desc: "24/7 hot water supply available so you can shower comfortably at any time of the day.", category: "Room", icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-1 2-2 3-2 5a2 2 0 004 0c0-2-1-3-2-5zM6 9c-1 2-2 3-2 5a2 2 0 004 0c0-2-1-3-2-5zM18 9c-1 2-2 3-2 5a2 2 0 004 0c0-2-1-3-2-5zM5 21h14" /></svg> },
  { title: "Spacious Bed Rooms", desc: "Well-ventilated, spacious bedrooms designed for comfort, privacy and a great night's sleep.", category: "Room", highlight: true, icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18M3 12V8a2 2 0 012-2h5v4H3zm18 0v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4m7-4V6a2 2 0 012-2h0a2 2 0 012 2v2h-4z" /></svg> },
  { title: "Homemade Food", desc: "Freshly prepared, nutritious homemade meals served daily — just like your mother's cooking.", category: "Food", highlight: true, icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg> },
  { title: "Dining Area", desc: "A clean, spacious dining area where residents enjoy meals together in a warm, homely setting.", category: "Food", icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}><path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M3 12h18M3 18h18" /><path strokeLinecap="round" strokeLinejoin="round" d="M8 6V4m4 2V4m4 2V4" /></svg> },
  { title: "Water Purifier", desc: "Clean, purified drinking water available at all times to keep you healthy and hydrated.", category: "Food", icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3C12 3 5 10 5 15a7 7 0 0014 0c0-5-7-12-7-12z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 16a3 3 0 006 0" /></svg> },
  { title: "Security Camera", desc: "CCTV surveillance cameras installed throughout the premises for your safety and peace of mind.", category: "Safety", highlight: true, icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.89L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" /></svg> },
  { title: "Safe & Secure", desc: "Fully secured premises with guards, CCTV and controlled entry — your safety is our top priority.", category: "Safety", icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg> },
  { title: "Doctor on Call", desc: "Medical assistance available on call so you are never far from professional healthcare support.", category: "Safety", icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 10v4m-2-2h4" /></svg> },
  { title: "Free & Unlimited Wi-Fi", desc: "High-speed unlimited Wi-Fi throughout the hostel — perfect for studies, work and streaming.", category: "Comfort", highlight: true, icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}><path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" /></svg> },
  { title: "Power Backup", desc: "24/7 power backup ensures uninterrupted electricity supply — no disruptions to your routine.", category: "Comfort", icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> },
  { title: "LED TV", desc: "LED TV in common areas for relaxation and entertainment after a long day.", category: "Comfort", icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}><rect x="2" y="4" width="20" height="14" rx="2" strokeLinecap="round" strokeLinejoin="round" /><path strokeLinecap="round" strokeLinejoin="round" d="M8 20h8M12 18v2" /></svg> },
  { title: "Fitness Centre", desc: "On-site fitness centre to help you stay active and healthy throughout your stay.", category: "Comfort", icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}><path strokeLinecap="round" strokeLinejoin="round" d="M4 8h2m0 0V6a1 1 0 012 0v8a1 1 0 01-2 0v-2H4m0 0v0M20 8h-2m0 0V6a1 1 0 00-2 0v8a1 1 0 002 0v-2h2m0 0v0M8 12h8" /></svg> },
  { title: "Washing Machine", desc: "In-house washing machines available for residents to keep their clothes fresh and clean.", category: "Services", icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}><rect x="3" y="3" width="18" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round" /><circle cx="12" cy="13" r="4" strokeLinecap="round" strokeLinejoin="round" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.01M9 6h.01" /></svg> },
  { title: "Housekeeping", desc: "Regular housekeeping to maintain cleanliness and hygiene across all rooms and common areas.", category: "Services", icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg> },
  { title: "Ironing", desc: "Ironing facilities available so you always step out looking neat and professional.", category: "Services", icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}><path strokeLinecap="round" strokeLinejoin="round" d="M3 17h13a5 5 0 005-5v0a5 5 0 00-5-5H9l-6 6v4z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 17V9" /></svg> },
  { title: "Parking", desc: "Dedicated and secure parking space available for residents with two-wheelers and four-wheelers.", category: "Services", icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}><rect x="3" y="3" width="18" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7h4a3 3 0 010 6H9" /></svg> },
];

const stats = [
  { number: "18+", label: "Facilities" },
  { number: "24/7", label: "Security" },
  { number: "100%", label: "Safe & Secure" },
  { number: "₹", label: "Affordable" },
];

export default function FacilitiesPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [animKey, setAnimKey] = useState(0);

  const filtered = activeCategory === "All" ? facilities : facilities.filter(f => f.category === activeCategory);

  const handleCategory = (cat) => {
    setActiveCategory(cat);
    setAnimKey(k => k + 1);
  };

  return (
    <>
      <Navbar />
      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
        @keyframes gradient-shift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes card-in {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes number-pop { 0%{transform:scale(0.7);opacity:0} 60%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }

        .animated-gradient {
          background-size: 200% 200%;
          animation: gradient-shift 4s ease infinite;
        }
        .highlight-card {
          transition: transform 0.35s cubic-bezier(.22,.68,0,1.3), box-shadow 0.35s ease;
        }
        .highlight-card:hover {
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 28px 56px rgba(139,0,92,0.3);
        }
        .regular-card {
          transition: transform 0.3s cubic-bezier(.22,.68,0,1.3), box-shadow 0.3s ease, border-color 0.2s ease;
        }
        .regular-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 32px rgba(194,0,106,0.12);
          border-color: #fecdd3;
        }
        .filter-btn {
          transition: all 0.25s cubic-bezier(.22,.68,0,1.3);
        }
        .filter-btn:hover { transform: scale(1.05); }
        .filter-btn:active { transform: scale(0.97); }
        .cta-btn {
          position: relative; overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .cta-btn::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%);
          transform: translateX(-100%); transition: transform 0.5s ease;
        }
        .cta-btn:hover::before { transform: translateX(100%); }
        .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(194,0,106,0.3); }
        .stat-num { animation: number-pop 0.6s cubic-bezier(.22,.68,0,1.3) both; }
      `}</style>

      {/* ── HERO ── */}
      <section className="relative bg-gradient-to-br from-[#8b005c] via-[#c2006a] to-[#f72c6e] overflow-hidden">
        {/* Decorative spinning ring */}
        <div className="absolute top-8 right-8 w-72 h-72 opacity-[0.06] pointer-events-none" style={{ animation: "spin-slow 25s linear infinite" }}>
          <svg viewBox="0 0 200 200" fill="none"><circle cx="100" cy="100" r="90" stroke="white" strokeWidth="2" strokeDasharray="8 8" /><circle cx="100" cy="100" r="65" stroke="white" strokeWidth="1" strokeDasharray="4 12" /></svg>
        </div>
        {/* Floating orbs */}
        {[{ s: 320, top: "-20%", right: "-5%", dur: "8s" }, { s: 200, bottom: "-15%", left: "3%", dur: "10s", delay: "2s" }, { s: 140, top: "30%", left: "40%", dur: "6s", delay: "1s" }].map((o, i) => (
          <div key={i} className="absolute rounded-full bg-white/5 pointer-events-none" style={{ width: o.s, height: o.s, top: o.top, right: o.right, bottom: o.bottom, left: o.left, animation: `float ${o.dur} ease-in-out infinite`, animationDelay: o.delay || "0s" }} />
        ))}

        <div className="relative max-w-6xl mx-auto px-6 py-20 text-center">
          <Reveal>
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-white/70 bg-white/10 border border-white/20 px-4 py-1.5 rounded-full mb-6">
              What We Offer
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-5 leading-tight">
              World-Class Facilities<br />
              <span className="text-white/80 text-3xl md:text-4xl font-medium">at Affordable Prices</span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-white/75 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-12">
              Everything you need for a comfortable, safe and enjoyable stay — all included under one roof at Raksha Women Hostel.
            </p>
          </Reveal>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={0.3 + i * 0.08}>
                <div className="bg-white/10 border border-white/20 rounded-2xl px-4 py-5 backdrop-blur-sm"
                  style={{ transition: "transform 0.3s ease, box-shadow 0.3s ease" }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px) scale(1.04)"; e.currentTarget.style.boxShadow = "0 16px 32px rgba(0,0,0,0.2)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>
                  <p className="text-3xl font-bold text-white stat-num" style={{ animationDelay: `${0.3 + i * 0.08}s` }}>{s.number}</p>
                  <p className="text-white/70 text-sm mt-1">{s.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORY FILTER ── */}
      <section className="bg-white border-b border-gray-100 sticky top-16 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategory(cat)}
              className={`filter-btn shrink-0 text-sm font-semibold px-5 py-2 rounded-full
                ${activeCategory === cat
                  ? "bg-gradient-to-r from-[#8b005c] to-[#f72c6e] text-white shadow-md shadow-pink-200"
                  : "bg-gray-100 text-gray-600 hover:bg-pink-50 hover:text-[#9b0066]"
                }`}
            >
              {cat}
            </button>
          ))}
          <span className="shrink-0 text-xs text-gray-400 ml-auto pl-4 whitespace-nowrap">
            {filtered.length} facilities
          </span>
        </div>
      </section>

      {/* ── FACILITIES GRID ── */}
      <section className="bg-gray-50 py-14">
        <div className="max-w-6xl mx-auto px-6">

          {/* Highlighted row */}
          {activeCategory === "All" && (
            <Reveal>
              <div className="mb-10">
                <p className="text-xs font-semibold uppercase tracking-widest text-[#c2006a] mb-5">⭐ Top Highlights</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {facilities.filter(f => f.highlight).map((f, i) => (
                    <div
                      key={f.title}
                      className="highlight-card group relative bg-gradient-to-br from-[#8b005c] via-[#c2006a] to-[#f72c6e] rounded-2xl p-6 text-white overflow-hidden cursor-default"
                      style={{ animation: "card-in 0.5s ease both", animationDelay: `${i * 0.1}s` }}
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/10 translate-x-10 -translate-y-10" style={{ transition: "transform 0.4s ease" }} />
                      <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full bg-white/5 -translate-x-6 translate-y-6" />
                      <div className="relative">
                        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-white/30 transition-all duration-300">
                          {f.icon}
                        </div>
                        <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                        <p className="text-white/75 text-sm leading-relaxed">{f.desc}</p>
                        <span className="inline-block mt-4 text-xs font-semibold bg-white/20 text-white px-3 py-1 rounded-full">{f.category}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          )}

          {/* All / filtered cards */}
          <div>
            {activeCategory === "All" && (
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-5">All Facilities</p>
            )}
            <div key={animKey} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {(activeCategory === "All" ? facilities.filter(f => !f.highlight) : filtered).map((f, i) => (
                <div
                  key={f.title}
                  className="regular-card group bg-white border border-gray-100 rounded-2xl p-6 flex gap-4 items-start"
                  style={{ animation: "card-in 0.45s ease both", animationDelay: `${i * 0.06}s` }}
                >
                  <div className="w-12 h-12 shrink-0 rounded-xl bg-pink-50 border border-pink-100 flex items-center justify-center text-[#c2006a] group-hover:bg-gradient-to-br group-hover:from-[#8b005c] group-hover:to-[#f72c6e] group-hover:text-white group-hover:border-transparent group-hover:scale-110 transition-all duration-300">
                    {f.icon}
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#c2006a] bg-pink-50 px-2 py-0.5 rounded-full">{f.category}</span>
                    <h3 className="text-gray-900 font-semibold text-base mt-1.5 mb-1 group-hover:text-[#9b0066] transition-colors">{f.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-white py-16 border-t border-gray-100">
        <Reveal>
          <div className="max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-5">
            <span className="text-4xl" style={{ animation: "float 4s ease-in-out infinite" }}>🏠</span>
            <h2 className="text-3xl font-bold text-gray-900">
              Loved What You Saw?{" "}
              <span className="text-transparent bg-clip-text animated-gradient" style={{ backgroundImage: "linear-gradient(90deg, #8b005c, #c2006a, #f72c6e, #c2006a, #8b005c)" }}>
                Come Stay With Us!
              </span>
            </h2>
            <p className="text-gray-500 text-base max-w-xl">
              Book your room today and enjoy all 18+ facilities at an affordable price in a safe and homely environment.
            </p>
            <div className="flex flex-wrap gap-3 justify-center mt-2">
              <Link href="/contact" className="cta-btn bg-gradient-to-r from-[#8b005c] via-[#c2006a] to-[#f72c6e] text-white font-semibold px-8 py-3.5 rounded-xl shadow-md shadow-pink-200">Book a Room</Link>
              <a href="https://wa.me/918220018000" target="_blank" rel="noopener noreferrer" className="cta-btn border border-[#c2006a] text-[#c2006a] font-semibold px-8 py-3.5 rounded-xl hover:bg-pink-50">WhatsApp Us</a>
              <Link href="/" className="cta-btn border border-gray-200 text-gray-600 font-semibold px-8 py-3.5 rounded-xl hover:bg-gray-50">Back to Home</Link>
            </div>
          </div>
        </Reveal>
      </section>

      <Footer />
    </>
  );
}