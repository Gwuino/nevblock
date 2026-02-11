"use client";

import Image from "next/image";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center ${className ?? ""}`}>
      <Image
        src="/logo.png"
        alt="НЕВБЛОК — Газосиликатные блоки"
        width={220}
        height={80}
        className="h-12 sm:h-14 md:h-16 w-auto object-contain shrink-0"
        priority
      />
    </div>
  );
}
