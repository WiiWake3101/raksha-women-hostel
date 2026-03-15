"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const quickLinks = [
  { href: "/",           label: "Home" },
  { href: "/about",      label: "About Us" },
  { href: "/facilities", label: "Facilities" },
  { href: "/gallery",    label: "Gallery" },
  { href: "/contact",    label: "Contact" },
];

const facilities = [
  "24/7 Security",
  "Wi-Fi Included",
  "Meals Provided",
  "Laundry Service",
  "Power Backup",
  "CCTV Surveillance",
];

// ── Modal content ─────────────────────────────────────────────────────────────
const privacyContent = {
  title: "Privacy Policy",
  lastUpdated: "February 2026",
  sections: [
    {
      heading: "Information We Collect",
      body: "When you contact us or book a room, we may collect personal information such as your name, phone number, email address, and residential address. This information is collected only when voluntarily provided by you.",
    },
    {
      heading: "How We Use Your Information",
      body: "The information you provide is used solely to respond to your enquiries, process room bookings, and communicate important updates related to your stay at Raksha Women Hostel. We do not use your data for unsolicited marketing.",
    },
    {
      heading: "Data Sharing",
      body: "We do not sell, trade, or transfer your personal information to third parties. Your data may only be shared with trusted staff members who assist in operating the hostel and are bound by confidentiality.",
    },
    {
      heading: "Data Security",
      body: "We take reasonable precautions to protect your personal information. However, no method of transmission over the internet is 100% secure. We strive to use commercially acceptable means to protect your data.",
    },
    {
      heading: "Cookies",
      body: "Our website may use basic cookies to improve your browsing experience. These cookies do not store any personally identifiable information and can be disabled through your browser settings.",
    },
    {
      heading: "Your Rights",
      body: "You have the right to request access to, correction of, or deletion of your personal data held by us. To exercise these rights, please contact us at rakshawomenhostel@gmail.com.",
    },
    {
      heading: "Contact Us",
      body: "If you have any questions about this Privacy Policy, please reach out to us at rakshawomenhostel@gmail.com or call +91 82200 18000.",
    },
  ],
};

const termsContent = {
  title: "Terms of Use",
  lastUpdated: "February 2026",
  sections: [
    {
      heading: "Acceptance of Terms",
      body: "By accessing and using the Raksha Women Hostel website or booking a room, you agree to be bound by these Terms of Use. If you do not agree with any part of these terms, please do not use our services.",
    },
    {
      heading: "Eligibility",
      body: "Raksha Women Hostel is exclusively for women residents. By booking or enquiring, you confirm that you meet this requirement. We reserve the right to verify eligibility before confirming any booking.",
    },
    {
      heading: "Booking & Payments",
      body: "All bookings are subject to availability. A confirmation will be provided upon successful booking and receipt of any required advance payment. We reserve the right to cancel bookings that violate our policies.",
    },
    {
      heading: "House Rules",
      body: "Residents are expected to maintain cleanliness, respect fellow residents, and adhere to hostel timings and rules. Any behaviour deemed disruptive or harmful to other residents may result in termination of stay without refund.",
    },
    {
      heading: "Liability",
      body: "Raksha Women Hostel is not liable for loss or damage to personal belongings. Residents are advised to take responsibility for their valuables. We take all reasonable precautions for safety but cannot guarantee against unforeseen incidents.",
    },
    {
      heading: "Website Use",
      body: "The content on this website is for general informational purposes only. We reserve the right to modify or remove content at any time without prior notice. Unauthorized use of this website may give rise to a claim for damages.",
    },
    {
      heading: "Changes to Terms",
      body: "We reserve the right to update these Terms of Use at any time. Continued use of our services following any changes constitutes your acceptance of the revised terms.",
    },
    {
      heading: "Contact Us",
      body: "For any questions regarding these Terms of Use, please contact us at rakshawomenhostel@gmail.com or call +91 82200 18000.",
    },
  ],
};

// ── Reusable Modal ────────────────────────────────────────────────────────────
function PolicyModal({ content, onClose }) {
  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center px-0 sm:px-4">

      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal panel */}
      <div className="relative bg-white w-full sm:max-w-2xl sm:rounded-3xl rounded-t-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{content.title}</h2>
            <p className="text-xs text-gray-400 mt-0.5">Last updated: {content.lastUpdated}</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 text-xl font-bold transition-colors shrink-0"
          >
            &times;
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto px-6 py-6 flex flex-col gap-6">
          {content.sections.map((s, i) => (
            <div key={i}>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-gradient-to-br from-[#8b005c] to-[#f72c6e] text-white text-xs font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <h3 className="font-semibold text-gray-800 text-sm">{s.heading}</h3>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed pl-8">{s.body}</p>
            </div>
          ))}

          {/* Bottom note */}
          <div className="bg-pink-50 border border-pink-100 rounded-2xl p-4 mt-2">
            <p className="text-xs text-gray-500 leading-relaxed">
              For any questions, contact us at{" "}
              <a href="mailto:rakshawomenhostel@gmail.com" className="text-[#c2006a] font-semibold">rakshawomenhostel@gmail.com</a>
              {" "}or call{" "}
              <a href="tel:+918220018000" className="text-[#c2006a] font-semibold">+91 82200 18000</a>.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 shrink-0">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-[#8b005c] via-[#c2006a] to-[#f72c6e] text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity"
          >
            I Understand
          </button>
        </div>

      </div>
    </div>
  );
}

// ── Main Footer ───────────────────────────────────────────────────────────────
export default function Footer() {
  const [modal, setModal] = useState(null); // "privacy" | "terms" | null

  return (
    <>
      <footer className="bg-white border-t border-gray-100">

        {/* Gradient top rule */}
        <div className="h-1 bg-gradient-to-r from-[#8b005c] via-[#c2006a] to-[#f72c6e]" />

        <div className="max-w-6xl mx-auto px-6 py-14">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* ── Col 1: Brand + Contact ── */}
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-[#8b005c] via-[#c2006a] to-[#f72c6e] font-bold text-2xl tracking-tight">
                  Raksha Women Hostel
                </h2>
                <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                  A safe, comfortable, and homely stay for women. Your home away from home.
                </p>
              </div>

              <div className="flex flex-col gap-3 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <span className="text-[#c2006a] mt-0.5 shrink-0">📍</span>
                  <span className="leading-relaxed">
                    7/138.1, Therkku Thottam,<br />
                    Near Chil-Sez IT Park, Keeranatham,<br />
                    Coimbatore, Tamil Nadu – 641035
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#c2006a] shrink-0 mt-0.5">📞</span>
                  <div className="flex flex-col gap-0.5">
                    <a href="tel:+918220018000" className="hover:text-[#9b0066] transition-colors">+91 82200 18000</a>
                    <a href="tel:+918220609999" className="hover:text-[#9b0066] transition-colors">+91 82206 09999</a>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#c2006a] shrink-0">💬</span>
                  <a href="https://wa.me/918220018000" target="_blank" rel="noopener noreferrer" className="hover:text-[#9b0066] transition-colors">
                    +91 82200 18000 (WhatsApp)
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#c2006a] shrink-0">✉️</span>
                  <a href="mailto:rakshawomenhostel@gmail.com" className="hover:text-[#9b0066] transition-colors break-all">
                    rakshawomenhostel@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#c2006a] shrink-0">🌐</span>
                  <a href="https://www.rakshawomenhostel.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#9b0066] transition-colors">
                    www.rakshawomenhostel.com
                  </a>
                </div>
              </div>

              <Link href="/contact" className="inline-block w-fit bg-gradient-to-r from-[#8b005c] via-[#c2006a] to-[#f72c6e] text-white text-sm font-semibold px-6 py-2.5 rounded-lg hover:opacity-90 transition-opacity">
                Book a Room
              </Link>
            </div>

            {/* ── Col 2: Quick Links + Facilities ── */}
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-gray-800 font-semibold text-xs uppercase tracking-widest mb-4">Quick Links</h3>
                <div className="flex flex-col gap-2.5">
                  {quickLinks.map((link) => (
                    <Link key={link.href} href={link.href} className="text-gray-500 hover:text-[#9b0066] text-sm transition-colors flex items-center gap-2 group">
                      <span className="text-[#c2006a] text-base leading-none group-hover:translate-x-0.5 transition-transform">›</span>
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-gray-800 font-semibold text-xs uppercase tracking-widest mb-4">Facilities</h3>
                <div className="flex flex-col gap-2.5">
                  {facilities.map((f) => (
                    <span key={f} className="text-gray-500 text-sm flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#8b005c] to-[#f72c6e] shrink-0" />
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Col 3: Map ── */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-800 font-semibold text-xs uppercase tracking-widest">Our Locations</h3>
                <span className="bg-gradient-to-r from-[#8b005c] to-[#f72c6e] text-white text-xs font-semibold px-3 py-1 rounded-full">Coimbatore</span>
              </div>
              <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm" style={{ height: "240px" }}>
                <iframe
                  title="Raksha Women Hostel Coimbatore Locations"
                  src="https://maps.google.com/maps?q=Raksha+Women+Hostel+Coimbatore&output=embed&z=14&ll=11.0881468,76.9962663"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <a
                href="https://www.google.com/maps/search/Raksha+Women+Hostel+Coimbatore/@11.0881468,76.9962663,15z"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-[#9b0066] hover:underline flex items-center gap-1"
              >
                <span>↗</span> View all branches on Google Maps
              </a>
            </div>

          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="border-t border-gray-100">
          <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-gray-400 text-xs">© {new Date().getFullYear()} Raksha Women Hostel. All rights reserved.</p>
            <div className="flex gap-4">
              <button
                onClick={() => setModal("privacy")}
                className="text-gray-400 text-xs hover:text-[#9b0066] transition-colors"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => setModal("terms")}
                className="text-gray-400 text-xs hover:text-[#9b0066] transition-colors"
              >
                Terms of Use
              </button>
            </div>
          </div>
        </div>

      </footer>

      {/* ── Modals ── */}
      {modal === "privacy" && (
        <PolicyModal content={privacyContent} onClose={() => setModal(null)} />
      )}
      {modal === "terms" && (
        <PolicyModal content={termsContent} onClose={() => setModal(null)} />
      )}
    </>
  );
}