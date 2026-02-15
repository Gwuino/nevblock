"use client";

import { Logo } from "./Logo";

const navLinks = [
  { href: "/", label: "Главная" },
  { href: "/#quality", label: "О нас" },
  { href: "/#catalog", label: "Каталог" },
  { href: "/#calculator", label: "Калькулятор" },
  { href: "/#reviews", label: "Отзывы" },
  { href: "/#contacts", label: "Контакты" },
];

export function Header() {
  return (
    <header className="border-b border-gray-200/80 bg-white/95 backdrop-blur-sm sticky top-0 z-20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-0">
        <a href="/" className="hover:opacity-90 transition-opacity shrink-0 self-start">
          <Logo />
        </a>

        {/* Навигация: на мобильных — кнопки в ряд (всегда видно), на десктопе — как раньше */}
        <nav className="flex flex-wrap items-center gap-2 md:flex-nowrap md:gap-6">
          {navLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="px-3 py-2 rounded-lg text-[var(--nevblock-blue)] font-medium bg-gray-100 hover:bg-[var(--nevblock-blue)]/10 active:bg-[var(--nevblock-blue)]/20 border border-gray-200/80 hover:border-[var(--nevblock-blue)]/30 transition-colors text-sm touch-manipulation md:bg-transparent md:border-0 md:py-2 md:px-0 md:hover:bg-transparent md:hover:border-0 md:hover:text-[var(--nevblock-brown)] md:rounded-none"
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
