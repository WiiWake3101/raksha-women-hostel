"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// ── Hooks ──────────────────────────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

// ── Animated wrapper ───────────────────────────────────────────────────────
function Reveal({ children, delay = 0, direction = "up", className = "" }) {
  const [ref, inView] = useInView();
  const transforms = { up: "translateY(40px)", down: "translateY(-40px)", left: "translateX(-40px)", right: "translateX(40px)" };
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translate(0)" : transforms[direction],
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s cubic-bezier(.22,.68,0,1.2) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

// ── Animated counter ───────────────────────────────────────────────────────
function Counter({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView(0.5);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const num = parseInt(target) || 0;
    if (num === 0) { setCount(target); return; }
    const step = Math.ceil(num / 40);
    const timer = setInterval(() => {
      start += step;
      if (start >= num) { setCount(num); clearInterval(timer); }
      else setCount(start);
    }, 35);
    return () => clearInterval(timer);
  }, [inView, target]);
  return <span ref={ref}>{typeof count === "number" ? count + suffix : target}</span>;
}

// ── Data ───────────────────────────────────────────────────────────────────
const features = [
  { icon: "🔒", title: "24/7 Security",    desc: "Round-the-clock security guards and CCTV surveillance to keep you safe at all times." },
  { icon: "🍽️", title: "Meals Provided",   desc: "Nutritious and homely meals served fresh every day so you never miss a home-cooked bite." },
  { icon: "📶", title: "High-Speed Wi-Fi", desc: "Stay connected with fast, reliable internet throughout the hostel premises." },
  { icon: "⚡", title: "Power Backup",     desc: "Uninterrupted power supply so your routine is never disrupted." },
  { icon: "👗", title: "Laundry Service",  desc: "Convenient in-house laundry facilities to keep your wardrobe fresh and clean." },
  { icon: "🏠", title: "Homely Ambience",  desc: "A warm, friendly environment designed to make you feel right at home." },
];

const stats = [
  { value: "18", suffix: "+", label: "Facilities" },
  { value: "100", suffix: "%", label: "Safe & Secure" },
  { value: "24", suffix: "/7", label: "Security" },
  { value: "500", suffix: "+", label: "Happy Residents" },
];

// ── Floating orb ──────────────────────────────────────────────────────────
function FloatingOrb({ style }) {
  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{ animation: "float 6s ease-in-out infinite", ...style }}
    />
  );
}

// ── Carousel slides ────────────────────────────────────────────────────────
// Put your real photos in /public/images/ and update the src values below.
const carouselSlides = [
  {
    src:   "/images/hostel-hero.jpg",
    emoji: "🏠",
    label: "Welcome to Raksha",
    tag:   "Your Home Away from Home",
    bg:    "linear-gradient(135deg,#fce7f3,#fbcfe8,#fce7f3)",
  },
  {
    src:   "/images/hostel-room.jpg",
    emoji: "🛏️",
    label: "Furnished Rooms",
    tag:   "Spacious · Ventilated · Comfortable",
    bg:    "linear-gradient(135deg,#e0f2fe,#bae6fd,#e0f2fe)",
  },
  {
    src:   "/images/hostel-food.jpg",
    emoji: "🍽️",
    label: "Homemade Food",
    tag:   "Fresh · Nutritious · Daily",
    bg:    "linear-gradient(135deg,#fef3c7,#fde68a,#fef3c7)",
  },
  {
    src:   "/images/hostel-security.jpg",
    emoji: "🔒",
    label: "24/7 Security",
    tag:   "CCTV · Guards · Safe Always",
    bg:    "linear-gradient(135deg,#dcfce7,#bbf7d0,#dcfce7)",
  },
];

// ── Hero Carousel ──────────────────────────────────────────────────────────
function HeroCarousel() {
  const [current,  setCurrent]  = useState(0);
  const [animDir,  setAnimDir]  = useState("next");
  const timerRef = useRef(null);
  const total    = carouselSlides.length;

  const goTo = (idx, dir = "next") => { setAnimDir(dir); setCurrent(idx); };
  const goNext = () => goTo((current + 1) % total, "next");
  const goPrev = () => goTo((current - 1 + total) % total, "prev");
  const resetTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setCurrent(c => (c + 1) % total), 4000);
  };

  useEffect(() => {
    timerRef.current = setInterval(() => setCurrent(c => (c + 1) % total), 4000);
    return () => clearInterval(timerRef.current);
  }, []);

  const slide = carouselSlides[current];

  return (
    <div className="relative w-full max-w-md select-none">
      {/* Decorative offset ring */}
      <div className="absolute inset-0 rounded-3xl border-2 border-pink-200 translate-x-3 translate-y-3 opacity-50 pointer-events-none" />

      {/* Slide window */}
      <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl shadow-pink-200">
        <div
          key={current}
          className={`absolute inset-0 ${animDir === "next" ? "carousel-next" : "carousel-prev"}`}
          style={{ background: slide.bg }}
        >
          {/*
            ── TO USE REAL IMAGES ─────────────────────────────────────────
            1. Remove the placeholder <div> below.
            2. Uncomment one of these:
               • Plain <img>:
                 <img src={slide.src} alt={slide.label} className="w-full h-full object-cover" />
               • Next.js <Image> (recommended — add `import Image from "next/image"` at top):
                 <Image src={slide.src} alt={slide.label} fill className="object-cover" />
            ──────────────────────────────────────────────────────────────
          */}
          {/* Placeholder — remove once real images are added */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6">
            <span className="text-6xl" style={{ animation: "floatB 3s ease-in-out infinite" }}>
              {slide.emoji}
            </span>
            <p className="text-[#9b0066] font-semibold text-sm text-center">Replace with your image</p>
            <code className="text-xs text-gray-400 bg-white/70 px-2.5 py-1 rounded-lg">{slide.src}</code>
          </div>

          {/* Caption overlay */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent p-5">
            <div className="caption-anim">
              <p className="text-white font-bold text-base leading-tight">{slide.label}</p>
              <p className="text-white/70 text-xs mt-0.5">{slide.tag}</p>
            </div>
          </div>

          {/* Counter chip */}
          <div className="absolute top-3 right-3 bg-black/30 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            {current + 1} / {total}
          </div>
        </div>

        {/* Prev arrow */}
        <button
          onClick={() => { goPrev(); resetTimer(); }}
          aria-label="Previous slide"
          className="carousel-arrow absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Next arrow */}
        <button
          onClick={() => { goNext(); resetTimer(); }}
          aria-label="Next slide"
          className="carousel-arrow absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Dot indicators */}
      <div className="flex items-center justify-center gap-1.5 mt-4">
        {carouselSlides.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => { goTo(i, i > current ? "next" : "prev"); resetTimer(); }}
            className="carousel-dot h-2 rounded-full"
            style={{
              width:      i === current ? 24 : 8,
              background: i === current ? "linear-gradient(90deg,#8b005c,#f72c6e)" : "#f9a8d4",
            }}
          />
        ))}
      </div>

      {/* Floating badges */}
      <div
        className="absolute -bottom-4 -right-4 bg-gradient-to-r from-[#8b005c] to-[#f72c6e] text-white text-xs font-bold px-5 py-3 rounded-2xl shadow-lg"
        style={{ animation: "floatB 4s ease-in-out infinite", animationDelay: "1s" }}
      >
        Trusted by Women ✓
      </div>
      <div
        className="absolute -top-4 -left-4 bg-white border border-pink-100 text-[#9b0066] text-xs font-bold px-4 py-2.5 rounded-2xl shadow-md"
        style={{ animation: "floatB 5s ease-in-out infinite", animationDelay: "0.5s" }}
      >
        🔒 24/7 Security
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────
export default function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 50); }, []);

  return (
    <>
      <Navbar />
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33%       { transform: translateY(-18px) rotate(2deg); }
          66%       { transform: translateY(10px) rotate(-2deg); }
        }
        @keyframes floatB {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-24px); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(1);   opacity: .6; }
          100% { transform: scale(1.5); opacity:  0; }
        }
        @keyframes gradient-shift {
          0%, 100% { background-position: 0%   50%; }
          50%       { background-position: 100% 50%; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes card-glow {
          0%, 100% { box-shadow: 0 0 0 0   rgba(194,0,106,0); }
          50%       { box-shadow: 0 0 30px 4px rgba(194,0,106,0.15); }
        }
        @keyframes slide-in-next {
          from { opacity: 0; transform: translateX(56px) scale(.97); }
          to   { opacity: 1; transform: none; }
        }
        @keyframes slide-in-prev {
          from { opacity: 0; transform: translateX(-56px) scale(.97); }
          to   { opacity: 1; transform: none; }
        }
        @keyframes caption-up {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: none; }
        }

        /* Carousel */
        .carousel-next  { animation: slide-in-next .42s cubic-bezier(.22,.68,0,1.2) both; }
        .carousel-prev  { animation: slide-in-prev .42s cubic-bezier(.22,.68,0,1.2) both; }
        .caption-anim   { animation: caption-up .5s ease .12s both; }
        .carousel-dot   { transition: width .3s ease, background .3s ease; }
        .carousel-arrow {
          transition: background .2s ease, transform .2s ease;
          backdrop-filter: blur(6px);
        }
        .carousel-arrow:hover {
          background: rgba(255,255,255,.28);
          transform: translateY(-50%) scale(1.12);
        }

        /* General */
        .hero-badge        { animation: shimmer 3s linear infinite; background-size: 200% auto; }
        .animated-gradient { background-size: 200% 200%; animation: gradient-shift 4s ease infinite; }
        .feature-card      { transition: transform .35s cubic-bezier(.22,.68,0,1.3), box-shadow .35s ease, border-color .3s ease; }
        .feature-card:hover { transform: translateY(-8px) scale(1.02); animation: card-glow 2s ease infinite; }
        .feature-card:hover .feature-icon { animation: floatB 1s ease-in-out infinite; }
        .cta-btn           { position: relative; overflow: hidden; transition: transform .2s ease, box-shadow .2s ease; }
        .cta-btn::before   { content: ''; position: absolute; inset: 0; background: linear-gradient(120deg,transparent 0%,rgba(255,255,255,.25) 50%,transparent 100%); transform: translateX(-100%); transition: transform .5s ease; }
        .cta-btn:hover::before { transform: translateX(100%); }
        .cta-btn:hover     { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(194,0,106,.35); }
        .stat-card         { transition: transform .3s ease, box-shadow .3s ease; }
        .stat-card:hover   { transform: translateY(-4px) scale(1.03); box-shadow: 0 20px 40px rgba(139,0,92,.2); }
        .dot-pulse         { display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #22c55e; position: relative; }
        .dot-pulse::after  { content: ''; position: absolute; inset: 0; border-radius: 50%; background: #22c55e; animation: pulse-ring 1.5s cubic-bezier(0.215,.61,.355,1) infinite; }
      `}</style>

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="relative bg-white overflow-hidden">
        <FloatingOrb style={{ top: "-10%", right: "-8%", width: 520, height: 520, background: "radial-gradient(circle, rgba(247,44,110,0.12) 0%, transparent 70%)", animationDuration: "7s" }} />
        <FloatingOrb style={{ bottom: "-5%", left: "-6%", width: 380, height: 380, background: "radial-gradient(circle, rgba(139,0,92,0.08) 0%, transparent 70%)", animationDuration: "9s", animationDelay: "2s" }} />
        <FloatingOrb style={{ top: "40%", left: "35%", width: 200, height: 200, background: "radial-gradient(circle, rgba(194,0,106,0.06) 0%, transparent 70%)", animationDuration: "5s", animationDelay: "1s" }} />

        <div className="absolute top-16 right-16 w-64 h-64 opacity-[0.04] pointer-events-none" style={{ animation: "spin-slow 20s linear infinite" }}>
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="90" stroke="#8b005c" strokeWidth="2" strokeDasharray="8 8" />
            <circle cx="100" cy="100" r="70" stroke="#c2006a" strokeWidth="1" strokeDasharray="4 12" />
            <circle cx="100" cy="100" r="50" stroke="#f72c6e" strokeWidth="2" strokeDasharray="2 6" />
          </svg>
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-10 md:py-16 flex flex-col md:flex-row items-center gap-12 w-full">

          {/* LEFT — copy */}
          <div className="flex-1 flex flex-col gap-6">
            <div style={{ opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(24px)", transition: "opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s" }}>
              <span className="inline-block w-fit text-xs font-semibold uppercase tracking-widest text-[#c2006a] bg-pink-50 border border-pink-100 px-4 py-1.5 rounded-full hero-badge"
                style={{ background: "linear-gradient(90deg, #fce7f3, #fdf2f8, #fce7f3)", backgroundSize: "200% auto" }}>
                Women's Hostel · Coimbatore
              </span>
            </div>

            <div style={{ opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(32px)", transition: "opacity 0.7s ease 0.2s, transform 0.7s cubic-bezier(.22,.68,0,1.2) 0.2s" }}>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight tracking-tight">
                A Safe &amp; Homely Stay<br />
                <span className="text-transparent bg-clip-text animated-gradient"
                  style={{ backgroundImage: "linear-gradient(90deg, #8b005c, #c2006a, #f72c6e, #c2006a, #8b005c)" }}>
                  Just for Women
                </span>
              </h1>
            </div>

            <div style={{ opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(24px)", transition: "opacity 0.7s ease 0.35s, transform 0.7s ease 0.35s" }}>
              <p className="text-gray-500 text-base md:text-lg leading-relaxed max-w-lg">
                Raksha Women Hostel offers you a safe and homely stay where you can enjoy a secured and friendly ambience. Experience luxurious accommodation at an affordable price.
              </p>
            </div>

            <div style={{ opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(24px)", transition: "opacity 0.7s ease 0.5s, transform 0.7s ease 0.5s" }}
              className="flex flex-wrap gap-3 mt-2">
              <Link href="/contact" className="cta-btn bg-gradient-to-r from-[#8b005c] via-[#c2006a] to-[#f72c6e] text-white font-semibold px-7 py-3 rounded-lg shadow-md shadow-pink-200">
                Book a Room
              </Link>
              <a href="https://wa.me/918220018000" target="_blank" rel="noopener noreferrer"
                className="cta-btn border border-[#c2006a] text-[#c2006a] font-semibold px-7 py-3 rounded-lg hover:bg-pink-50">
                WhatsApp Us
              </a>
            </div>

            <div style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.7s ease 0.65s" }}
              className="flex flex-wrap gap-6 mt-2 text-sm text-gray-500">
              {["Affordable Pricing", "Safe & Secure", "Homely Environment"].map((label) => (
                <span key={label} className="flex items-center gap-2">
                  <span className="dot-pulse" />
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* RIGHT — Carousel (replaces the old static image at lines 294–297) */}
          <div
            className="flex-1 w-full flex justify-center"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateX(0) scale(1)" : "translateX(40px) scale(0.95)",
              transition: "opacity 0.8s ease 0.3s, transform 0.8s cubic-bezier(.22,.68,0,1.2) 0.3s",
            }}
          >
            <HeroCarousel />
          </div>
        </div>
      </section>

      {/* ── STATS BANNER ── */}
      <section className="bg-gradient-to-r from-[#8b005c] via-[#c2006a] to-[#f72c6e] py-12">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.1}>
                <div className="stat-card bg-white/10 border border-white/20 rounded-2xl px-4 py-6 text-center backdrop-blur-sm cursor-default">
                  <p className="text-4xl font-bold text-white">
                    <Counter target={s.value} suffix={s.suffix} />
                  </p>
                  <p className="text-white/70 text-sm mt-1">{s.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT SECTION ── */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <Reveal direction="left">
              <div className="relative">
                <div className="bg-gradient-to-br from-pink-50 to-rose-100 rounded-3xl p-10 border border-pink-100"
                  style={{ transition: "transform 0.4s ease, box-shadow 0.4s ease" }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "rotate(-1deg) scale(1.01)"; e.currentTarget.style.boxShadow = "0 24px 48px rgba(194,0,106,0.12)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>
                  <p className="text-5xl mb-4" style={{ animation: "floatB 4s ease-in-out infinite" }}>🏠</p>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">Your Home Away<br />From Home</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    Designed with the utmost security of women residents and their belongings in mind — with round-the-clock security guards and a warm, welcoming community.
                  </p>
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    {["Safe Stay", "Friendly Ambience", "Affordable", "Peaceful"].map((tag, i) => (
                      <span key={tag} className="text-xs font-semibold text-[#9b0066] bg-white border border-pink-100 rounded-lg px-3 py-2 text-center shadow-sm"
                        style={{ transition: "transform 0.2s ease, box-shadow 0.2s ease", transitionDelay: `${i * 0.05}s` }}
                        onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.05)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(194,0,106,0.15)"; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-[#8b005c] to-[#f72c6e] text-white text-xs font-bold px-5 py-3 rounded-2xl shadow-lg"
                  style={{ animation: "floatB 5s ease-in-out infinite", animationDelay: "0.5s" }}>
                  Trusted by Women ✓
                </div>
              </div>
            </Reveal>

            <Reveal direction="right" delay={0.1}>
              <div className="flex flex-col gap-5">
                <span className="inline-block w-fit text-xs font-semibold uppercase tracking-widest text-[#c2006a] bg-pink-50 border border-pink-100 px-4 py-1.5 rounded-full">About Us</span>
                <h2 className="text-3xl font-bold text-gray-900 leading-snug">
                  Empowering Women with a<br />
                  <span className="text-transparent bg-clip-text animated-gradient"
                    style={{ backgroundImage: "linear-gradient(90deg, #8b005c, #c2006a, #f72c6e, #c2006a, #8b005c)" }}>
                    Safe Place to Call Home
                  </span>
                </h2>
                <p className="text-gray-500 text-base leading-relaxed">
                  The times have changed and today women are increasingly venturing out of their homes and families in search of bettering their education or careers.
                </p>
                <p className="text-gray-500 text-base leading-relaxed">
                  Raksha Women Hostel was opened to give you a comfortable, peaceful and enjoyable stay at a reasonable price — a place designed keeping in mind the utmost security of women residents and their belongings.
                </p>
                <Link href="/about" className="cta-btn inline-block w-fit text-sm font-semibold text-[#9b0066] border border-[#c2006a] px-6 py-2.5 rounded-lg hover:bg-pink-50 mt-2">
                  Read More →
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── FEATURES SECTION ── */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-12">
              <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#c2006a] bg-pink-50 border border-pink-100 px-4 py-1.5 rounded-full mb-4">
                Why Choose Us
              </span>
              <h2 className="text-3xl font-bold text-gray-900">
                Everything You Need,{" "}
                <span className="text-transparent bg-clip-text animated-gradient"
                  style={{ backgroundImage: "linear-gradient(90deg, #8b005c, #c2006a, #f72c6e, #c2006a, #8b005c)" }}>
                  All in One Place
                </span>
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.08} direction="up">
                <div className="feature-card group bg-gray-50 border border-gray-100 rounded-2xl p-6 hover:border-pink-100 h-full">
                  <span className="feature-icon text-3xl block mb-4">{f.icon}</span>
                  <h3 className="text-gray-900 font-semibold text-base mb-2 group-hover:text-[#9b0066] transition-colors duration-200">{f.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <div className="flex justify-center mt-12">
              <Link
                href="/facilities"
                className="cta-btn inline-flex items-center gap-2 bg-gradient-to-r from-[#8b005c] via-[#c2006a] to-[#f72c6e] text-white font-semibold px-8 py-3.5 rounded-xl shadow-md shadow-pink-200"
              >
                View All Facilities
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="relative animated-gradient py-16 overflow-hidden"
        style={{ backgroundImage: "linear-gradient(135deg, #8b005c, #c2006a, #f72c6e, #c2006a, #8b005c)" }}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[
            { w: 300, top: "-30%", right: "-5%", dur: "8s" },
            { w: 200, bottom: "-20%", left: "5%", dur: "10s", delay: "2s" },
            { w: 150, top: "20%", left: "30%", dur: "6s", delay: "1s" },
          ].map((o, i) => (
            <div key={i} className="absolute rounded-full bg-white/5"
              style={{ width: o.w, height: o.w, top: o.top, right: o.right, bottom: o.bottom, left: o.left, animation: `float ${o.dur} ease-in-out infinite`, animationDelay: o.delay || "0s" }} />
          ))}
        </div>

        <Reveal>
          <div className="relative max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-5">
            <h2 className="text-3xl font-bold text-white leading-snug">Ready for a Safe &amp; Comfortable Stay?</h2>
            <p className="text-white/80 text-base max-w-xl">
              Contact us today and book your room at Raksha Women Hostel — where security meets comfort at an affordable price.
            </p>
            <div className="flex flex-wrap gap-3 justify-center mt-2">
              <Link href="/contact" className="cta-btn bg-white text-[#9b0066] font-semibold px-8 py-3 rounded-lg shadow-md hover:bg-pink-50">Book a Room</Link>
              <a href="tel:+918220018000" className="cta-btn border border-white/40 text-white font-semibold px-8 py-3 rounded-lg hover:bg-white/10">Call Us Now</a>
            </div>
          </div>
        </Reveal>
      </section>

      <Footer />
    </>
  );
}