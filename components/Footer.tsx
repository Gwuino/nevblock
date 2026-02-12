export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-[var(--nevblock-blue)] text-white/90">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <div className="flex flex-col items-center justify-center gap-6 text-center">
          <div className="flex flex-col items-center gap-2 text-sm text-white/70">
            <span>г. Невинномысск</span>
            <a href="tel:+79280120026" className="hover:text-white transition-colors">
              +7 (928) 012-00-26
            </a>
          </div>
          <span className="text-sm text-white/70">&copy; {year} ООО «НЕВБЛОК»</span>
        </div>
      </div>
    </footer>
  );
}
