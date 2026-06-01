import Link from "next/link";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Me" },
  { href: "/chinese-lessons", label: "Chinese Lessons" },
  { href: "/chinese-dance-lessons", label: "Dance Lessons" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/pricing", label: "Pricing" },
  { href: "/booking", label: "Book a Lesson" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#1A0A0F" }} className="text-gray-300">
      {/* Top border accent */}
      <div className="h-1" style={{ backgroundColor: "#D4AF37" }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span
                className="text-4xl font-bold"
                style={{ color: "#D4AF37", fontFamily: "serif" }}
              >
                杨
              </span>
              <div>
                <p className="text-white font-bold">Chinese Tutor Yang</p>
                <p className="text-sm" style={{ color: "#D4AF37" }}>
                  中文 &amp; 中国舞蹈
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Professional Mandarin Chinese and Chinese Dance lessons tailored
              to every age and learning style.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3
              className="font-playfair font-bold text-lg mb-4"
              style={{ color: "#D4AF37" }}
            >
              Quick Links
            </h3>
            <ul className="grid grid-cols-2 gap-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3
              className="font-playfair font-bold text-lg mb-4"
              style={{ color: "#D4AF37" }}
            >
              Get in Touch
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <span style={{ color: "#D4AF37" }}>✉</span>
                <span>contact@chinesetutoryang.com</span>
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: "#D4AF37" }}>📍</span>
                <span>Online &amp; In-Person Lessons Available</span>
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: "#D4AF37" }}>⏰</span>
                <span>Mon – Sat: 9 AM – 7 PM</span>
              </li>
            </ul>

            <Link
              href="/booking"
              className="inline-block mt-6 px-5 py-2.5 text-sm font-bold rounded transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#D4AF37", color: "#9B1830" }}
            >
              Book a Lesson
            </Link>
          </div>
        </div>

        <div
          className="mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500"
          style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
        >
          <p>
            © {new Date().getFullYear()} Chinese Tutor Yang. All rights
            reserved.
          </p>
          <p style={{ color: "#D4AF37" }}>学无止境 — Learning Has No Limits</p>
        </div>
      </div>
    </footer>
  );
}
