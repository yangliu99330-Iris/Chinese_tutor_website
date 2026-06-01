"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Me" },
  { href: "/chinese-lessons", label: "Chinese Lessons" },
  { href: "/chinese-dance-lessons", label: "Dance Lessons" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-shadow duration-300 ${
        scrolled ? "shadow-xl" : "shadow-md"
      }`}
      style={{ backgroundColor: "#C41E3A" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <span
              className="text-3xl font-bold"
              style={{ color: "#D4AF37", fontFamily: "serif" }}
            >
              杨
            </span>
            <div>
              <p className="text-white font-bold text-sm leading-tight">
                Chinese Tutor Yang
              </p>
              <p className="text-xs leading-tight" style={{ color: "#D4AF37" }}>
                中文 &amp; 中国舞蹈
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 text-sm font-medium rounded transition-colors duration-200"
                style={{
                  color: pathname === link.href ? "#D4AF37" : "white",
                  backgroundColor:
                    pathname === link.href
                      ? "rgba(0,0,0,0.2)"
                      : "transparent",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLAnchorElement).style.color = "#D4AF37";
                  (e.target as HTMLAnchorElement).style.backgroundColor =
                    "rgba(0,0,0,0.2)";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLAnchorElement).style.color =
                    pathname === link.href ? "#D4AF37" : "white";
                  (e.target as HTMLAnchorElement).style.backgroundColor =
                    pathname === link.href ? "rgba(0,0,0,0.2)" : "transparent";
                }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/booking"
              className="ml-3 px-4 py-2 text-sm font-bold rounded transition-opacity duration-200 hover:opacity-90"
              style={{ backgroundColor: "#D4AF37", color: "#9B1830" }}
            >
              Book a Lesson
            </Link>
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded text-white"
            aria-label="Toggle menu"
          >
            <span
              className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
                isOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-white my-1.5 transition-all duration-300 ${
                isOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
                isOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div
            className="lg:hidden py-4 space-y-1 border-t"
            style={{ borderColor: "rgba(255,255,255,0.2)" }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-2.5 text-sm font-medium rounded transition-colors"
                style={{
                  color: pathname === link.href ? "#D4AF37" : "white",
                  backgroundColor:
                    pathname === link.href ? "rgba(0,0,0,0.2)" : "transparent",
                }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/booking"
              className="block mx-4 mt-3 px-4 py-2.5 text-center text-sm font-bold rounded"
              style={{ backgroundColor: "#D4AF37", color: "#9B1830" }}
            >
              Book a Lesson
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
