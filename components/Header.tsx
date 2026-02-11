"use client";

import { Logo } from "./Logo";
import { useState, useEffect } from "react";

const navLinks = [
  { href: "/", label: "Главная" },
  { href: "/#quality", label: "Почему мы" },
  { href: "/#catalog", label: "Каталог" },
  { href: "/#calculator", label: "Калькулятор" },
  { href: "/#reviews", label: "Отзывы" },
  { href: "/#contacts", label: "Контакты" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (menuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className="border-b border-gray-200/80 bg-white/95 backdrop-blur-sm sticky top-0 z-20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <a href="/" className="hover:opacity-90 transition-opacity shrink-0">
          <Logo />
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="text-[var(--nevblock-blue)] font-medium hover:text-[var(--nevblock-brown)] transition-colors py-2"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          className="md:hidden p-2 -mr-2 rounded-lg text-[var(--nevblock-blue)] hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[var(--nevblock-blue)]/30 min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
        >
          {menuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu overlay */}
      <div
        className={`md:hidden fixed inset-x-0 bottom-0 top-0 z-10 bg-white transition-opacity duration-200 pt-[57px] ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!menuOpen}
        style={{ minHeight: "calc(100dvh - 57px)" }}
      >
        <nav className="flex flex-col h-full overflow-y-auto p-4 gap-0 pb-[env(safe-area-inset-bottom,0)]">
          {navLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="py-4 px-4 rounded-xl text-[var(--nevblock-blue)] font-medium hover:bg-gray-100 active:bg-gray-200 text-lg min-h-[48px] flex items-center border-b border-gray-100 last:border-b-0"
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
