import Link from "next/link";
import { LogoutButton } from "@/components/LogoutButton";

export default function ManageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="flex flex-wrap gap-3 sm:gap-4 mb-6 text-sm items-center">
        <Link href="/" className="text-[var(--nevblock-blue)] hover:underline">
          На сайт
        </Link>
        <Link href="/manage" className="text-[var(--nevblock-blue)] hover:underline">
          Товары
        </Link>
        <span className="ml-auto">
          <LogoutButton />
        </span>
      </div>
      {children}
    </div>
  );
}
