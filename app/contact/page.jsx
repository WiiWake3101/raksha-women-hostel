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
const contactDetails = [
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    label: "Address", value: "7/138.1, Therkku Thottam, Near Chil-Sez IT Park,\nKeeranatham, Coimbatore, Tamil Nadu – 641035",
    href: "https://www.google.com/maps/search/Raksha+Women+Hostel+Coimbatore/@11.0881468,76.9962663,15z", action: "Get Directions →",
  },
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
    label: "Phone", value: "+91 82200 18000\n+91 82206 09999", href: "tel:+918220018000", action: "Call Now →",
  },
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
    label: "Email", value: "rakshawomenhostel@gmail.com", href: "mailto:rakshawomenhostel@gmail.com", action: "Send Email →",
  },
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
    label: "WhatsApp", value: "+91 82200 18000", href: "https://wa.me/918220018000", action: "Chat Now →",
  },
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>,
    label: "Website", value: "www.rakshawomenhostel.com", href: "https://www.rakshawomenhostel.com", action: "Visit Site →",
  },
];

// ── Animated Input ─────────────────────────────────────────────────────────
function AnimatedInput({ label, required, type = "text", name, value, onChange, placeholder, as = "input", rows }) {
  const [focused, setFocused] = useState(false);
  const Tag = as;
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-widest text-gray-500">{label}{required && " *"}</label>
      <div className="relative">
        <Tag
          type={type}
          name={name}
          required={required}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full border rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none resize-none"
          style={{
            borderColor: focused ? "#c2006a" : "#e5e7eb",
            boxShadow: focused ? "0 0 0 3px rgba(194,0,106,0.1)" : "none",
            transition: "border-color 0.2s ease, box-shadow 0.2s ease",
          }}
        />
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────
export default function ContactPage() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setTimeout(() => setMounted(true), 60); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => { e.preventDefault(); setSubmitted(true); };

  return (
    <>
      <Navbar />
      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
        @keyframes gradient-shift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes success-pop { 0%{transform:scale(0);opacity:0} 60%{transform:scale(1.15)} 100%{transform:scale(1);opacity:1} }
        @keyframes check-draw { to { stroke-dashoffset: 0; } }
        @keyframes card-in { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes ripple { 0%{transform:scale(0);opacity:0.4} 100%{transform:scale(2.5);opacity:0} }

        .animated-gradient { background-size: 200% 200%; animation: gradient-shift 4s ease infinite; }
        .contact-card {
          transition: transform 0.3s cubic-bezier(.22,.68,0,1.3), box-shadow 0.3s ease, border-color 0.2s ease;
        }
        .contact-card:hover {
          transform: translateY(-4px) scale(1.01);
          box-shadow: 0 16px 32px rgba(194,0,106,0.12);
          border-color: #fecdd3;
        }
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
        .whatsapp-btn { transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .whatsapp-btn:hover { transform: translateY(-3px) scale(1.01); box-shadow: 0 12px 24px rgba(37,211,102,0.3); }
        .success-icon { animation: success-pop 0.5s cubic-bezier(.22,.68,0,1.3) 0.1s both; }
        .submit-btn {
          position: relative; overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
        }
        .submit-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(194,0,106,0.35); opacity: 0.95; }
        .submit-btn:active { transform: translateY(0); }
        .action-arrow { display: inline-block; transition: transform 0.2s ease; }
        .contact-card:hover .action-arrow { transform: translateX(4px); }
      `}</style>

      {/* ── HERO ── */}
      <section className="relative bg-gradient-to-br from-[#8b005c] via-[#c2006a] to-[#f72c6e] overflow-hidden">
        <div className="absolute top-8 right-8 w-60 h-60 opacity-[0.06] pointer-events-none" style={{ animation: "spin-slow 20s linear infinite" }}>
          <svg viewBox="0 0 200 200" fill="none"><circle cx="100" cy="100" r="90" stroke="white" strokeWidth="2" strokeDasharray="8 8" /><circle cx="100" cy="100" r="60" stroke="white" strokeWidth="1" strokeDasharray="4 12" /></svg>
        </div>
        {[{ s: 280, top: "-15%", right: "-4%", dur: "7s" }, { s: 180, bottom: "-12%", left: "2%", dur: "9s", delay: "2s" }].map((o, i) => (
          <div key={i} className="absolute rounded-full bg-white/5 pointer-events-none" style={{ width: o.s, height: o.s, top: o.top, right: o.right, bottom: o.bottom, left: o.left, animation: `float ${o.dur} ease-in-out infinite`, animationDelay: o.delay || "0s" }} />
        ))}
        <div className="relative max-w-6xl mx-auto px-6 py-20 text-center">
          <Reveal>
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-white/70 bg-white/10 border border-white/20 px-4 py-1.5 rounded-full mb-5">Get in Touch</span>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              We'd Love to Hear<br />From You
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-white/75 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
              Have a question or want to book a room? Reach out to us — we're happy to help you find your perfect stay.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

            {/* LEFT: Contact Details */}
            <div className="lg:col-span-2 flex flex-col gap-5">
              <Reveal>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">Contact Information</h2>
                  <p className="text-gray-500 text-sm leading-relaxed">Reach us through any of the channels below — we're available to assist you.</p>
                </div>
              </Reveal>

              {contactDetails.map((c, i) => (
                <Reveal key={c.label} delay={i * 0.07}>
                  <a
                    href={c.href}
                    target={c.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="contact-card group bg-white border border-gray-100 rounded-2xl p-5 flex gap-4 items-start block"
                  >
                    <div className="w-12 h-12 shrink-0 rounded-xl bg-pink-50 border border-pink-100 flex items-center justify-center text-[#c2006a] group-hover:bg-gradient-to-br group-hover:from-[#8b005c] group-hover:to-[#f72c6e] group-hover:text-white group-hover:border-transparent group-hover:scale-110 transition-all duration-300">
                      {c.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">{c.label}</p>
                      <p className="text-gray-700 text-sm font-medium leading-relaxed whitespace-pre-line">{c.value}</p>
                      <p className="text-[#c2006a] text-xs font-semibold mt-2 inline-block">
                        <span className="action-arrow">{c.action}</span>
                      </p>
                    </div>
                  </a>
                </Reveal>
              ))}

              <Reveal delay={0.35}>
                <a
                  href="https://wa.me/918220018000?text=Hi%2C%20I%20am%20interested%20in%20booking%20a%20room%20at%20Raksha%20Women%20Hostel"
                  target="_blank" rel="noopener noreferrer"
                  className="whatsapp-btn flex items-center justify-center gap-3 bg-[#25d366] text-white font-semibold py-4 rounded-2xl shadow-md shadow-green-200 mt-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Chat with us on WhatsApp
                </a>
              </Reveal>
            </div>

            {/* RIGHT: Form */}
            <div className="lg:col-span-3">
              <Reveal direction="right">
                <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm"
                  style={{ transition: "box-shadow 0.3s ease" }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 20px 48px rgba(194,0,106,0.08)"; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = ""; }}>
                  {!submitted ? (
                    <>
                      <h2 className="text-2xl font-bold text-gray-900 mb-1">Send Us a Message</h2>
                      <p className="text-gray-500 text-sm mb-8">Fill in the form below and we'll get back to you as soon as possible.</p>

                      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <AnimatedInput label="Full Name" required name="name" value={form.name} onChange={handleChange} placeholder="Your full name" />
                          <AnimatedInput label="Phone Number" required type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" />
                        </div>
                        <AnimatedInput label="Email Address" type="email" name="email" value={form.email} onChange={handleChange} placeholder="your@email.com" />
                        <AnimatedInput label="Message" required as="textarea" name="message" value={form.message} onChange={handleChange} placeholder="Tell us about your requirements, preferred room type, move-in date..." rows={5} />

                        <button type="submit" className="submit-btn bg-gradient-to-r from-[#8b005c] via-[#c2006a] to-[#f72c6e] text-white font-semibold py-4 rounded-xl shadow-md shadow-pink-200 flex items-center justify-center gap-2">
                          Send Message
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                        </button>

                        <p className="text-gray-400 text-xs text-center">
                          We'll respond within 24 hours · Or call us directly at{" "}
                          <a href="tel:+918220018000" className="text-[#c2006a] font-semibold hover:underline">+91 82200 18000</a>
                        </p>
                      </form>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center gap-5">
                      <div className="success-icon w-20 h-20 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900" style={{ animation: "card-in 0.5s ease 0.3s both" }}>Message Sent!</h3>
                      <p className="text-gray-500 text-sm max-w-sm leading-relaxed" style={{ animation: "card-in 0.5s ease 0.4s both" }}>
                        Thank you for reaching out, <span className="font-semibold text-gray-700">{form.name}</span>! We'll get back to you shortly on <span className="font-semibold text-gray-700">{form.phone}</span>.
                      </p>
                      <div className="flex gap-3 mt-2" style={{ animation: "card-in 0.5s ease 0.5s both" }}>
                        <button
                          onClick={() => { setSubmitted(false); setForm({ name: "", phone: "", email: "", message: "" }); }}
                          className="cta-btn border border-gray-200 text-gray-600 font-semibold px-6 py-2.5 rounded-xl hover:bg-gray-50 text-sm"
                        >
                          Send Another
                        </button>
                        <Link href="/" className="cta-btn bg-gradient-to-r from-[#8b005c] to-[#f72c6e] text-white font-semibold px-6 py-2.5 rounded-xl text-sm">
                          Back to Home
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </Reveal>

              {/* Map */}
              <Reveal delay={0.15}>
                <div className="mt-6 rounded-2xl overflow-hidden border border-gray-200 shadow-sm" style={{ height: "220px", transition: "box-shadow 0.3s ease" }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)"}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = ""}>
                  <iframe
                    title="Raksha Women Hostel Location"
                    src="https://maps.google.com/maps?q=Raksha+Women+Hostel+Coimbatore&output=embed&z=15&ll=11.0881468,76.9962663"
                    width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}