"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLink {
  href: string;
  label: string;
}

interface NavItem extends Partial<NavLink> {
  label: string;
  /** Present on a plain link or on a parent whose own label is also a page (e.g. "About Me" → /about). Omit for a pure dropdown trigger like "Learn With Us". */
  href?: string;
  children?: NavLink[];
}

const navItems: NavItem[] = [
  { href: "/", label: "Home" },
  {
    label: "Learn With Us",
    children: [
      { href: "/chinese-lessons", label: "Chinese Lessons" },
      { href: "/chinese-dance-lessons", label: "Dance Lessons" },
      { href: "/testimonials", label: "Testimonials" },
    ],
  },
  { href: "/guides", label: "Guides" },
  {
    label: "Digital Resources",
    children: [
      { href: "/guides/hsk-levels", label: "HSK" },
      { href: "/guides/hsk-levels#new-system", label: "New HSK 3.0" },
      { href: "/resources/hanzi-stroke-order", label: "Hanzi & Stroke Order" },
      { href: "/resources/hsk-vocabulary", label: "HSK Vocabulary" },
    ],
  },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About Me", children: [{ href: "/contact", label: "Contact" }] },
  // Business Cards isn't launched yet — left out of the nav until it's ready.
  // The route and feature code are untouched; re-add here to show it again:
  // { href: "/business-cards", label: "Business Cards" },
];

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      aria-hidden
    >
      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
    </svg>
  );
}

/** True if `pathname` is the item's own page or one of its children's pages. */
function isActiveGroup(item: NavItem, pathname: string): boolean {
  if (item.href === pathname) return true;
  return item.children?.some((c) => c.href === pathname) ?? false;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDesktopMenu, setOpenDesktopMenu] = useState<string | null>(null);
  const [openMobileGroup, setOpenMobileGroup] = useState<string | null>(null);
  const pathname = usePathname();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setOpenDesktopMenu(null);
    setOpenMobileGroup(null);
  }, [pathname]);

  function openMenu(label: string) {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenDesktopMenu(label);
  }

  function scheduleCloseMenu() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenDesktopMenu(null), 150);
  }

  const linkStyle = (active: boolean) => ({
    color: active ? "#F8ECE1" : "white",
    backgroundColor: active ? "rgba(0,0,0,0.2)" : "transparent",
  });

  // Hover highlight has to be applied via JS, not a Tailwind `hover:` class —
  // the inline `style` above always wins the specificity fight over a
  // pseudo-class, so a `hover:` class on these elements would silently do nothing.
  function handleHoverEnter(e: React.MouseEvent<HTMLElement>) {
    e.currentTarget.style.color = "#F8ECE1";
    e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.2)";
  }
  function handleHoverLeave(e: React.MouseEvent<HTMLElement>, active: boolean) {
    e.currentTarget.style.color = active ? "#F8ECE1" : "white";
    e.currentTarget.style.backgroundColor = active ? "rgba(0,0,0,0.2)" : "transparent";
  }

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-shadow duration-300 ${
        scrolled ? "shadow-xl" : "shadow-md"
      }`}
      style={{ backgroundColor: "#B668BD" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <span
              className="text-3xl font-bold"
              style={{ color: "#F8ECE1", fontFamily: "serif" }}
            >
              杨
            </span>
            <div>
              <p className="text-white font-bold text-sm leading-tight">
                Chinese Tutor Yang
              </p>
              <p className="text-xs leading-tight" style={{ color: "#F8ECE1" }}>
                中文 &amp; 中国舞蹈
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-0.5">
            {navItems.map((item) => {
              if (!item.children) {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href!}
                    className="px-3 py-1.5 text-sm font-medium rounded transition-colors duration-200"
                    style={linkStyle(active)}
                    onMouseEnter={handleHoverEnter}
                    onMouseLeave={(e) => handleHoverLeave(e, active)}
                  >
                    {item.label}
                  </Link>
                );
              }

              const active = isActiveGroup(item, pathname);
              const open = openDesktopMenu === item.label;

              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => openMenu(item.label)}
                  onMouseLeave={scheduleCloseMenu}
                >
                  <div
                    className="flex items-center rounded transition-colors duration-200"
                    style={linkStyle(active)}
                    onMouseEnter={handleHoverEnter}
                    onMouseLeave={(e) => handleHoverLeave(e, active)}
                  >
                    {item.href ? (
                      <Link href={item.href} className="pl-3 pr-1 py-1.5 text-sm font-medium">
                        {item.label}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        className="pl-3 pr-1 py-1.5 text-sm font-medium"
                        aria-haspopup="true"
                        aria-expanded={open}
                        onClick={() => setOpenDesktopMenu(open ? null : item.label)}
                      >
                        {item.label}
                      </button>
                    )}
                    <button
                      type="button"
                      className="pr-2.5 py-1.5"
                      aria-label={`Toggle ${item.label} menu`}
                      aria-haspopup="true"
                      aria-expanded={open}
                      onClick={() => setOpenDesktopMenu(open ? null : item.label)}
                    >
                      <ChevronIcon open={open} />
                    </button>
                  </div>

                  {open && (
                    <div
                      className="absolute left-0 top-full pt-2 min-w-[180px]"
                      role="menu"
                    >
                      <div className="bg-white rounded-lg shadow-lg overflow-hidden border" style={{ borderColor: "#F8ECE1" }}>
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            role="menuitem"
                            className="block px-4 py-2.5 text-sm font-medium transition-colors"
                            style={{
                              color: pathname === child.href ? "#B668BD" : "#4b5563",
                              backgroundColor: pathname === child.href ? "#FCF9F5" : "transparent",
                            }}
                            onMouseEnter={(e) => {
                              (e.target as HTMLAnchorElement).style.backgroundColor = "#FCF9F5";
                            }}
                            onMouseLeave={(e) => {
                              (e.target as HTMLAnchorElement).style.backgroundColor =
                                pathname === child.href ? "#FCF9F5" : "transparent";
                            }}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            <Link
              href="/booking"
              className="ml-3 px-4 py-2 text-sm font-bold rounded transition-opacity duration-200 hover:opacity-90"
              style={{ backgroundColor: "#CD8136", color: "white" }}
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
            {navItems.map((item) => {
              if (!item.children) {
                return (
                  <Link
                    key={item.href}
                    href={item.href!}
                    className="block px-4 py-2.5 text-sm font-medium rounded transition-colors"
                    style={linkStyle(pathname === item.href)}
                  >
                    {item.label}
                  </Link>
                );
              }

              const active = isActiveGroup(item, pathname);
              const expanded = openMobileGroup === item.label;

              return (
                <div key={item.label}>
                  <button
                    type="button"
                    className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium rounded transition-colors"
                    style={linkStyle(active)}
                    aria-expanded={expanded}
                    onClick={() => setOpenMobileGroup(expanded ? null : item.label)}
                  >
                    {item.label}
                    <ChevronIcon open={expanded} />
                  </button>
                  {expanded && (
                    <div className="pl-4 space-y-1 mt-1">
                      {item.href && (
                        <Link
                          href={item.href}
                          className="block px-4 py-2 text-sm rounded transition-colors"
                          style={linkStyle(pathname === item.href)}
                        >
                          {item.label}
                        </Link>
                      )}
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-2 text-sm rounded transition-colors"
                          style={linkStyle(pathname === child.href)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            <Link
              href="/booking"
              className="block mx-4 mt-3 px-4 py-2.5 text-center text-sm font-bold rounded"
              style={{ backgroundColor: "#CD8136", color: "white" }}
            >
              Book a Lesson
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
