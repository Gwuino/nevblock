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

        {/* На мобильных: одна строка, мельче, с горизонтальной прокруткой. На десктопе — как раньше */}
        <nav className="flex overflow-x-auto gap-2 flex-nowrap items-center w-full md:overflow-visible md:w-auto md:gap-6 py-0.5 -mx-4 px-4 md:mx-0 md:px-0 scroll-smooth touch-pan-x [&::-webkit-scrollbar]:h-0.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full">
          {navLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="shrink-0 px-2.5 py-1.5 rounded-lg text-[var(--nevblock-blue)] font-medium bg-gray-100 hover:bg-[var(--nevblock-blue)]/10 active:bg-[var(--nevblock-blue)]/20 border border-gray-200/80 hover:border-[var(--nevblock-blue)]/30 transition-colors text-xs touch-manipulation md:shrink md:bg-transparent md:border-0 md:py-2 md:px-0 md:text-base md:hover:bg-transparent md:hover:border-0 md:hover:text-[var(--nevblock-brown)] md:rounded-none"
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
