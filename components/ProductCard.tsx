import Image from "next/image";
import type { Product } from "@/lib/types";

const PLACEHOLDER = "/products/placeholder.svg";

export function ProductCard({ product }: { product: Product }) {
  const src = product.image?.startsWith("http")
    ? product.image
    : product.image || PLACEHOLDER;
  const isExternal = product.image?.startsWith("http");

  return (
    <article className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:border-gray-200 transition-all duration-300 hover:-translate-y-1">
      <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        {isExternal ? (
          <img
            src={src}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <Image
            src={src}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="p-4 sm:p-5">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm sm:text-base group-hover:text-[var(--nevblock-blue)] transition-colors">
          {product.name}
        </h3>
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-[var(--nevblock-blue)] font-bold text-lg sm:text-xl">
            {product.price != null
              ? `${product.price.toLocaleString("ru-RU")} ₽`
              : "по запросу"}
          </p>
          {product.price != null && (
            <span className="text-gray-400 text-sm">/ {product.unit}</span>
          )}
        </div>
      </div>
    </article>
  );
}
