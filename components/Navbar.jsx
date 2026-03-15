"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/facilities", label: "Facilities" },
    { href: "/gallery", label: "Gallery" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      <style>{`
        .grad-text {
          background: linear-gradient(110deg, #8b005c, #c2006a, #f72c6e);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .grad-btn {
          background: linear-gradient(110deg, #8b005c, #c2006a, #f72c6e);
          transition: opacity 0.2s ease, transform 0.2s ease;
        }

        .grad-btn:hover {
          opacity: 0.88;
          transform: translateY(-1px);
        }

        .nav-link-item {
          position: relative;
          color: #444;
          font-size: 0.875rem;
          font-weight: 500;
          padding: 6px 14px;
          text-decoration: none;
          transition: color 0.2s ease;
          white-space: nowrap;
        }

        .nav-link-item::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 14px;
          right: 14px;
          height: 2px;
          background: linear-gradient(110deg, #8b005c, #c2006a, #f72c6e);
          border-radius: 2px;
          transform: scaleX(0);
          transition: transform 0.25s ease;
        }

        .nav-link-item:hover { color: #9b0066; }
        .nav-link-item:hover::after { transform: scaleX(1); }

        .fullscreen-menu {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: #fff;
          display: flex;
          flex-direction: column;
          transform: translateX(100%);
          transition: transform 0.45s cubic-bezier(0.77, 0, 0.18, 1);
          overflow: hidden;
        }

        .fullscreen-menu.open {
          transform: translateX(0);
        }

        .mobile-link {
          font-size: 1.6rem;
          font-weight: 700;
          color: #222;
          text-decoration: none;
          padding: 14px 0;
          border-bottom: 1px solid #f0f0f0;
          transition: color 0.2s ease;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .mobile-link:hover {
          background: linear-gradient(110deg, #8b005c, #c2006a, #f72c6e);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .mobile-link:last-of-type {
          border-bottom: none;
        }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav className="sticky top-0 z-[9998] w-full bg-white border-b border-gray-100 shadow-sm">
        <div className="w-full px-6 flex items-center justify-between h-16">

          {/* Brand — far left */}
          <Link href="/" className="grad-text font-bold text-xl tracking-tight shrink-0">
            Raksha Women Hostel
          </Link>

          {/* Desktop: links + CTA — far right */}
          <div className="hidden md:flex items-center gap-1 ml-auto">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="nav-link-item">
                {link.label}
              </a>
            ))}
            <Link
              href="/contact"
              className="grad-btn ml-3 text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow-sm shrink-0"
            >
              Book a Room
            </Link>
          </div>

          {/* Hamburger — mobile only */}
          <button
            className="md:hidden flex flex-col justify-center gap-[5px] w-9 h-9 p-1 shrink-0 ml-auto"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
          >
            <span className="block w-full h-0.5 bg-gray-700 rounded" />
            <span className="block w-full h-0.5 bg-gray-700 rounded" />
            <span className="block w-6 h-0.5 bg-gray-700 rounded" />
          </button>

        </div>
      </nav>

      {/* ── FULLSCREEN MOBILE MENU ── */}
      <div className={`fullscreen-menu md:hidden ${menuOpen ? "open" : ""}`}>

        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <span className="grad-text font-bold text-lg">Raksha Women Hostel</span>
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 text-xl font-bold transition-colors"
          >
            &times;
          </button>
        </div>

        <div className="flex flex-col flex-1 justify-center px-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="mobile-link"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="px-8 pb-10">
          <a
            href="/contact"
            onClick={() => setMenuOpen(false)}
            className="grad-btn block w-full text-white text-base font-semibold text-center py-4 rounded-xl shadow-md"
          >
            Book a Room
          </a>
          <p className="text-center text-xs text-gray-400 mt-3">Safe · Comfortable · Homely</p>
        </div>

      </div>
    </>
  );
}