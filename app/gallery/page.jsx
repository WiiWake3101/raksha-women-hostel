"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

// ── Intersection Observer hook ─────────────────────────────────────────────
function useInView(threshold = 0.1) {
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
  const t = { up: "translateY(36px)", left: "translateX(-36px)", right: "translateX(36px)", down: "translateY(-36px)" };
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

// ── Gallery data ───────────────────────────────────────────────────────────
// Replace src values with your actual image paths in /public/gallery/
const categories = ["All", "Rooms", "Food", "Common Areas", "Safety", "Exterior"];

const photos = [
  // Rooms
  { id: 1,  src: "/gallery/room-1.jpg",    alt: "Furnished double room",         category: "Rooms",         span: "col-span-2 row-span-2" },
  { id: 2,  src: "/gallery/room-2.jpg",    alt: "Single room with wardrobe",      category: "Rooms",         span: "" },
  { id: 3,  src: "/gallery/room-3.jpg",    alt: "Room interior view",             category: "Rooms",         span: "" },
  { id: 4,  src: "/gallery/room-4.jpg",    alt: "Attached bathroom",              category: "Rooms",         span: "col-span-2" },
  // Food
  { id: 5,  src: "/gallery/food-1.jpg",    alt: "Homemade meal spread",           category: "Food",          span: "col-span-2 row-span-2" },
  { id: 6,  src: "/gallery/food-2.jpg",    alt: "Fresh breakfast",                category: "Food",          span: "" },
  { id: 7,  src: "/gallery/food-3.jpg",    alt: "Dining area setup",              category: "Food",          span: "" },
  // Common Areas
  { id: 8,  src: "/gallery/common-1.jpg",  alt: "Common lounge area",             category: "Common Areas",  span: "" },
  { id: 9,  src: "/gallery/common-2.jpg",  alt: "Fitness centre",                 category: "Common Areas",  span: "" },
  { id: 10, src: "/gallery/common-3.jpg",  alt: "Study / work area",              category: "Common Areas",  span: "col-span-2" },
  // Safety
  { id: 11, src: "/gallery/safety-1.jpg",  alt: "CCTV monitoring setup",          category: "Safety",        span: "" },
  { id: 12, src: "/gallery/safety-2.jpg",  alt: "Security entrance",              category: "Safety",        span: "" },
  // Exterior
  { id: 13, src: "/gallery/exterior-1.jpg",alt: "Hostel building front view",     category: "Exterior",      span: "col-span-2 row-span-2" },
  { id: 14, src: "/gallery/exterior-2.jpg",alt: "Hostel entrance gate",           category: "Exterior",      span: "" },
  { id: 15, src: "/gallery/exterior-3.jpg",alt: "Parking area",                   category: "Exterior",      span: "" },
];

// Emoji placeholders per category (shown until real images are added)
const placeholderEmoji = {
  "Rooms": "🛏️", "Food": "🍽️", "Common Areas": "🏠",
  "Safety": "🔒", "Exterior": "🏢",
};
const placeholderBg = {
  "Rooms":        "linear-gradient(135deg,#fce7f3,#fbcfe8)",
  "Food":         "linear-gradient(135deg,#fef3c7,#fde68a)",
  "Common Areas": "linear-gradient(135deg,#e0f2fe,#bae6fd)",
  "Safety":       "linear-gradient(135deg,#dcfce7,#bbf7d0)",
  "Exterior":     "linear-gradient(135deg,#f3e8ff,#e9d5ff)",
};

const stats = [
  { value: "15+", label: "Gallery Photos" },
  { value: "5",   label: "Categories" },
  { value: "18+", label: "Amenities" },
  { value: "100%", label: "Transparency" },
];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [animKey, setAnimKey]               = useState(0);
  const [lightbox, setLightbox]             = useState(null); // index into filtered
  const [mounted, setMounted]               = useState(false);

  useEffect(() => { setTimeout(() => setMounted(true), 60); }, []);

  const filtered = activeCategory === "All"
    ? photos
    : photos.filter(p => p.category === activeCategory);

  const handleCategory = (cat) => {
    setActiveCategory(cat);
    setAnimKey(k => k + 1);
  };

  // Lightbox navigation
  const prev = useCallback(() => setLightbox(i => (i - 1 + filtered.length) % filtered.length), [filtered.length]);
  const next = useCallback(() => setLightbox(i => (i + 1) % filtered.length), [filtered.length]);

  useEffect(() => {
    if (lightbox === null) return;
    const handler = (e) => {
      if (e.key === "ArrowLeft")  prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape")     setLightbox(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, prev, next]);

  // Prevent body scroll when lightbox open
  useEffect(() => {
    document.body.style.overflow = lightbox !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightbox]);

  return (
    <>
      <Navbar />

      <style>{`
        @keyframes float        { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-16px)} }
        @keyframes spin-slow    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes gradient-shift{ 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes card-in      { from{opacity:0;transform:translateY(22px) scale(.96)} to{opacity:1;transform:none} }
        @keyframes lightbox-in  { from{opacity:0;transform:scale(.92)} to{opacity:1;transform:scale(1)} }
        @keyframes overlay-in   { from{opacity:0} to{opacity:1} }
        @keyframes pulse-ring   { 0%{transform:scale(1);opacity:.5} 100%{transform:scale(1.7);opacity:0} }
        @keyframes marquee      { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes shimmer-img  { 0%{background-position:-200% 0} 100%{background-position:200% 0} }

        .animated-gradient { background-size:200% 200%; animation:gradient-shift 4s ease infinite; }

        .photo-card {
          transition: transform .35s cubic-bezier(.22,.68,0,1.3), box-shadow .35s ease;
          cursor: pointer;
        }
        .photo-card:hover { transform: translateY(-6px) scale(1.02); box-shadow: 0 24px 48px rgba(0,0,0,.18); }
        .photo-card:hover .photo-overlay { opacity: 1; }
        .photo-card:hover .photo-zoom    { transform: scale(1.08); }

        .photo-overlay {
          opacity: 0;
          transition: opacity .3s ease;
          background: linear-gradient(to top, rgba(139,0,92,.85) 0%, transparent 60%);
        }
        .photo-zoom { transition: transform .5s cubic-bezier(.22,.68,0,1.2); }

        .filter-btn { transition: all .25s cubic-bezier(.22,.68,0,1.3); }
        .filter-btn:hover { transform: scale(1.05); }
        .filter-btn:active { transform: scale(.97); }

        .cta-btn { position:relative; overflow:hidden; transition: transform .2s ease, box-shadow .2s ease; }
        .cta-btn::before { content:''; position:absolute; inset:0; background:linear-gradient(120deg,transparent 0%,rgba(255,255,255,.25) 50%,transparent 100%); transform:translateX(-100%); transition:transform .5s ease; }
        .cta-btn:hover::before { transform:translateX(100%); }
        .cta-btn:hover { transform:translateY(-2px); box-shadow:0 12px 32px rgba(194,0,106,.3); }

        .lightbox-overlay { animation: overlay-in .25s ease; }
        .lightbox-panel   { animation: lightbox-in .3s cubic-bezier(.22,.68,0,1.2); }

        .lb-btn {
          transition: background .2s ease, transform .2s ease;
          backdrop-filter: blur(8px);
        }
        .lb-btn:hover { background: rgba(255,255,255,.2); transform: scale(1.1); }

        .shimmer-placeholder {
          background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.5) 50%, rgba(255,255,255,0) 100%);
          background-size: 200% 100%;
          animation: shimmer-img 2s linear infinite;
        }
        .marquee-track { display:flex; width:max-content; animation:marquee 22s linear infinite; }
        .marquee-track:hover { animation-play-state:paused; }
        .stat-card { transition:transform .3s ease, box-shadow .3s ease; }
        .stat-card:hover { transform:translateY(-4px) scale(1.04); box-shadow:0 20px 40px rgba(0,0,0,.18); }
      `}</style>

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-[#8b005c] via-[#c2006a] to-[#f72c6e] overflow-hidden">
        {/* Spinning ring */}
        <div className="absolute top-6 right-6 w-72 h-72 opacity-[0.06] pointer-events-none" style={{ animation:"spin-slow 24s linear infinite" }}>
          <svg viewBox="0 0 200 200" fill="none">
            <circle cx="100" cy="100" r="90" stroke="white" strokeWidth="2" strokeDasharray="8 8"/>
            <circle cx="100" cy="100" r="60" stroke="white" strokeWidth="1" strokeDasharray="4 14"/>
          </svg>
        </div>
        {[
          { s:320, top:"-18%", right:"-5%", dur:"8s" },
          { s:200, bottom:"-14%", left:"2%", dur:"10s", delay:"2s" },
          { s:140, top:"40%", left:"38%", dur:"6s", delay:"1s" },
        ].map((o,i)=>(
          <div key={i} className="absolute rounded-full bg-white/5 pointer-events-none"
            style={{ width:o.s, height:o.s, top:o.top, right:o.right, bottom:o.bottom, left:o.left, animation:`float ${o.dur} ease-in-out infinite`, animationDelay:o.delay||"0s" }} />
        ))}

        <div className="relative max-w-6xl mx-auto px-6 py-16 md:py-22">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <div style={{ opacity:mounted?1:0, transform:mounted?"none":"translateY(24px)", transition:"opacity .6s ease .1s, transform .6s ease .1s" }}>
                <span className="inline-block text-xs font-semibold uppercase tracking-widest text-white/70 bg-white/10 border border-white/20 px-4 py-1.5 rounded-full mb-5">
                  Photo Gallery
                </span>
              </div>
              <div style={{ opacity:mounted?1:0, transform:mounted?"none":"translateY(32px)", transition:"opacity .7s ease .2s, transform .7s cubic-bezier(.22,.68,0,1.2) .2s" }}>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-5">
                  See Your Future<br />
                  <span className="italic font-bold text-white/85">Home First.</span>
                </h1>
              </div>
              <div style={{ opacity:mounted?1:0, transform:mounted?"none":"translateY(20px)", transition:"opacity .7s ease .35s" }}>
                <p className="text-white/75 text-base md:text-lg leading-relaxed max-w-lg">
                  Take a look inside Raksha Women Hostel — your rooms, dining area, common spaces and more. No surprises, just a warm welcome.
                </p>
              </div>
              <div style={{ opacity:mounted?1:0, transform:mounted?"none":"translateY(20px)", transition:"opacity .7s ease .5s" }}
                className="flex flex-wrap gap-3 mt-8">
                <Link href="/contact" className="cta-btn bg-white text-[#9b0066] font-semibold px-7 py-3 rounded-lg shadow-md">Book a Room</Link>
                <a href="https://wa.me/918220018000" target="_blank" rel="noopener noreferrer"
                  className="cta-btn border border-white/40 text-white font-semibold px-7 py-3 rounded-lg hover:bg-white/10">WhatsApp Us</a>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 flex-shrink-0 w-full max-w-xs"
              style={{ opacity:mounted?1:0, transform:mounted?"none":"translateX(40px)", transition:"opacity .8s ease .3s, transform .8s cubic-bezier(.22,.68,0,1.2) .3s" }}>
              {stats.map((s, i) => (
                <div key={s.label} className="stat-card bg-white/10 border border-white/20 rounded-2xl px-4 py-6 text-center backdrop-blur-sm cursor-default">
                  <p className="text-3xl font-bold text-white">{s.value}</p>
                  <p className="text-white/65 text-xs mt-1 font-medium uppercase tracking-wider">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE ─────────────────────────────────────────────────────── */}
      <div className="bg-[#8b005c] py-3 overflow-hidden border-y border-pink-900/30">
        <div className="marquee-track">
          {[...Array(2)].map((_, ri) => (
            <div key={ri} className="flex items-center gap-0">
              {["Furnished Rooms","Homemade Food","Fitness Centre","24/7 Security","Hot Water","High-Speed Wi-Fi","Power Backup","CCTV Surveillance","Attached Bathrooms","Washing Machine"].map((item,i)=>(
                <span key={i} className="flex items-center gap-3 text-white/80 text-sm font-semibold px-6 whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-300 inline-block flex-shrink-0" />
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── FILTER BAR ──────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100 sticky top-16 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {categories.map((cat) => (
            <button key={cat} onClick={() => handleCategory(cat)}
              className={`filter-btn shrink-0 text-sm font-semibold px-5 py-2 rounded-full
                ${activeCategory === cat
                  ? "bg-gradient-to-r from-[#8b005c] to-[#f72c6e] text-white shadow-md shadow-pink-200"
                  : "bg-gray-100 text-gray-600 hover:bg-pink-50 hover:text-[#9b0066]"}`}>
              {cat}
            </button>
          ))}
          <span className="shrink-0 text-xs text-gray-400 ml-auto pl-4 whitespace-nowrap">
            {filtered.length} photos
          </span>
        </div>
      </section>

      {/* ── PHOTO GRID ──────────────────────────────────────────────────── */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-6">
          {/* Masonry-style grid */}
          <div key={animKey} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[200px] gap-4">
            {filtered.map((photo, i) => {
              // Derive grid span classes
              const isWide = photo.span.includes("col-span-2");
              const isTall = photo.span.includes("row-span-2");
              const colSpan = isWide ? "col-span-2" : "col-span-1";
              const rowSpan = isTall ? "row-span-2" : "row-span-1";

              return (
                <div
                  key={photo.id}
                  className={`photo-card relative rounded-2xl overflow-hidden ${colSpan} ${rowSpan}`}
                  style={{ animation: `card-in 0.45s ease both`, animationDelay: `${i * 0.06}s` }}
                  onClick={() => setLightbox(i)}
                >
                  {/* Placeholder (replace with <Image> when you have photos) */}
                  <div className="absolute inset-0 photo-zoom"
                    style={{ background: placeholderBg[photo.category] }}>
                    {/* Shimmer overlay */}
                    <div className="absolute inset-0 shimmer-placeholder opacity-40" />
                    {/* Centered emoji placeholder */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                      <span className="text-4xl" style={{ filter:"drop-shadow(0 2px 6px rgba(0,0,0,.1))" }}>
                        {placeholderEmoji[photo.category]}
                      </span>
                      <span className="text-xs font-semibold text-gray-500 text-center px-3">{photo.alt}</span>
                    </div>
                  </div>

                  {/* Hover overlay */}
                  <div className="photo-overlay absolute inset-0 flex flex-col justify-end p-4 z-10">
                    <span className="text-white text-xs font-semibold bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full w-fit mb-1">
                      {photo.category}
                    </span>
                    <p className="text-white text-sm font-medium leading-tight">{photo.alt}</p>
                  </div>

                  {/* Zoom icon */}
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 photo-overlay transition-opacity">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              <p className="text-4xl mb-3">📷</p>
              <p className="font-semibold">No photos in this category yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-[#8b005c] via-[#c2006a] to-[#f72c6e] py-16">
        <Reveal>
          <div className="max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-5">
            <h2 className="text-3xl font-bold text-white">Like What You See?</h2>
            <p className="text-white/80 text-base max-w-xl">
              Come visit us in person or book your room today — Raksha Women Hostel is waiting to welcome you home.
            </p>
            <div className="flex flex-wrap gap-3 justify-center mt-2">
              <Link href="/contact" className="cta-btn bg-white text-[#9b0066] font-semibold px-8 py-3.5 rounded-xl shadow-md hover:bg-pink-50">Book a Room</Link>
              <a href="tel:+918220018000" className="cta-btn border border-white/40 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/10">Call Us Now</a>
            </div>
          </div>
        </Reveal>
      </section>

      <Footer />

      {/* ── LIGHTBOX ────────────────────────────────────────────────────── */}
      {lightbox !== null && (
        <div
          className="lightbox-overlay fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <div
            className="lightbox-panel relative max-w-4xl w-full"
            onClick={e => e.stopPropagation()}
          >
            {/* Image / placeholder */}
            <div className="relative rounded-2xl overflow-hidden"
              style={{ background: placeholderBg[filtered[lightbox].category], minHeight: 420, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <div className="flex flex-col items-center gap-3 p-12">
                <span className="text-8xl">{placeholderEmoji[filtered[lightbox].category]}</span>
                <p className="text-gray-600 font-semibold text-center">{filtered[lightbox].alt}</p>
                <p className="text-xs text-gray-400">Replace placeholder with your actual image</p>
              </div>
            </div>

            {/* Caption bar */}
            <div className="mt-3 flex items-center justify-between px-1">
              <div>
                <span className="text-xs font-semibold text-pink-300 uppercase tracking-widest">{filtered[lightbox].category}</span>
                <p className="text-white font-semibold text-sm mt-0.5">{filtered[lightbox].alt}</p>
              </div>
              <span className="text-white/50 text-sm">{lightbox + 1} / {filtered.length}</span>
            </div>

            {/* Nav buttons */}
            <button onClick={prev}
              className="lb-btn absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button onClick={next}
              className="lb-btn absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Close */}
            <button onClick={() => setLightbox(null)}
              className="lb-btn absolute top-3 right-3 w-10 h-10 rounded-full bg-black/40 border border-white/20 flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}