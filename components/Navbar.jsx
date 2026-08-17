"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [residentName, setResidentName] = useState('');

  // Check login status
  useEffect(() => {
    const token = localStorage.getItem('residentToken');
    if (token) {
      setIsLoggedIn(true);
      // Get resident name from localStorage or use default
      const name = localStorage.getItem('residentName') || 'Resident';
      setResidentName(name);
    }
  }, []);

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

  const handleLogout = () => {
    localStorage.removeItem('residentToken');
    localStorage.removeItem('residentName');
    localStorage.removeItem('profileComplete');
    setIsLoggedIn(false);
    setShowProfileDropdown(false);
    router.push('/');
  };

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

        .profile-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          min-width: 220px;
          overflow: hidden;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-10px);
          transition: all 0.2s ease;
          z-index: 50;
        }

        .profile-dropdown.show {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          color: #374151;
          text-decoration: none;
          font-size: 0.875rem;
          transition: background 0.2s ease;
          cursor: pointer;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
        }

        .dropdown-item:hover {
          background: #f9fafb;
        }

        .dropdown-divider {
          height: 1px;
          background: #e5e7eb;
          margin: 4px 0;
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
            
            {/* Show profile dropdown if logged in, otherwise show login button */}
            {isLoggedIn ? (
              <div className="relative ml-3">
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  onBlur={() => setTimeout(() => setShowProfileDropdown(false), 200)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  aria-label="Profile menu"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-400 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                    {residentName.charAt(0).toUpperCase()}
                  </div>
                  <svg className={`h-4 w-4 text-gray-600 transition-transform ${showProfileDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <div className={`profile-dropdown ${showProfileDropdown ? 'show' : ''}`}>
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">{residentName}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Resident</p>
                  </div>
                  
                  <Link href="/resident/dashboard" className="dropdown-item">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Dashboard
                  </Link>
                  
                  <Link href="/resident/profile" className="dropdown-item">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    My Profile
                  </Link>
                  
                  <Link href="/resident/settings" className="dropdown-item">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Settings
                  </Link>
                  
                  <div className="dropdown-divider" />
                  
                  <button onClick={handleLogout} className="dropdown-item text-red-600">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/resident/login"
                className="ml-3 text-sm font-semibold px-5 py-2.5 rounded-lg border-2 border-pink-600 text-pink-600 hover:bg-pink-50 transition-colors shrink-0 flex items-center gap-2"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Resident Login
              </Link>
            )}
            
            <Link
              href="/contact"
              className="grad-btn ml-2 text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow-sm shrink-0"
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

        <div className="px-8 pb-10 space-y-3">
          {isLoggedIn ? (
            <>
              <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                  {residentName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{residentName}</p>
                  <p className="text-xs text-gray-500">Resident</p>
                </div>
              </div>
              
              <a
                href="/resident/dashboard"
                onClick={() => setMenuOpen(false)}
                className="block w-full text-gray-700 text-base font-semibold text-center py-4 rounded-xl shadow-md border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
              >
                Dashboard
              </a>
              
              <a
                href="/resident/profile"
                onClick={() => setMenuOpen(false)}
                className="block w-full text-gray-700 text-base font-semibold text-center py-4 rounded-xl shadow-md border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
              >
                My Profile
              </a>
              
              <a
                href="/resident/settings"
                onClick={() => setMenuOpen(false)}
                className="block w-full text-gray-700 text-base font-semibold text-center py-4 rounded-xl shadow-md border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
              >
                Settings
              </a>
              
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="block w-full text-red-600 text-base font-semibold text-center py-4 rounded-xl shadow-md border-2 border-red-600 bg-white hover:bg-red-50 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <a
              href="/resident/login"
              onClick={() => setMenuOpen(false)}
              className="block w-full text-pink-600 text-base font-semibold text-center py-4 rounded-xl shadow-md border-2 border-pink-600 bg-white hover:bg-pink-50 transition-colors"
            >
              Resident Login
            </a>
          )}
          
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
