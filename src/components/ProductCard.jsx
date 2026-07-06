"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function ProductCard({ product, index = 0 }) {
  const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_URL || "https://arthakara.id";

  // Kumpulkan semua URL gambar dari usage_images (array baru) atau fallback ke usage_image tunggal
  const images = (() => {
    if (Array.isArray(product.usage_images) && product.usage_images.length > 0) {
      return product.usage_images.slice(0, 3).map((url) =>
        url.startsWith("http") ? url : `${IMAGE_BASE_URL}/storage/${url}`
      );
    }
    if (product.usage_image) {
      return [
        product.usage_image.startsWith("http")
          ? product.usage_image
          : `${IMAGE_BASE_URL}/storage/${product.usage_image}`,
      ];
    }
    return ["/no-image.png"];
  })();

  const hasMultiple = images.length > 1;
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef(null);

  // Auto-slide setiap 3 detik jika ada lebih dari 1 gambar
  useEffect(() => {
    if (!hasMultiple) return;
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(intervalRef.current);
  }, [hasMultiple, images.length]);

  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div className="flex flex-col h-full relative">

        {/* IMAGE CONTAINER */}
        <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-slate-100 mb-5">

          {/* Slider wrapper */}
          <div
            className="flex h-full transition-transform duration-500 ease-out"
            style={{
              width: `${images.length * 100}%`,
              transform: `translateX(-${(current * 100) / images.length}%)`,
            }}
          >
            {images.map((src, i) => (
              <div
                key={i}
                className="h-full shrink-0"
                style={{ width: `${100 / images.length}%` }}
              >
                <img
                  src={src}
                  alt={`${product.name} - foto ${i + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-100"
                />
              </div>
            ))}
          </div>

          {/* SOFT GRADIENT OVERLAY ON HOVER */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          {/* DOT NAVIGASI — hanya jika ada > 1 gambar */}
          {hasMultiple && (
            <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-1.5 z-10 pointer-events-none">
              {images.map((_, i) => (
                <span
                  key={i}
                  className={`block rounded-full transition-all duration-300 ${
                    i === current
                      ? "w-4 h-1.5 bg-white"
                      : "w-1.5 h-1.5 bg-white/50"
                  }`}
                />
              ))}
            </div>
          )}

          {/* FLOATING ACTION */}
          <div className="absolute bottom-4 sm:bottom-6 left-0 w-full flex justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out z-20 px-2">
            <div className="bg-white/95 backdrop-blur-sm text-slate-900 px-3 py-2 sm:px-6 sm:py-3 rounded-full font-semibold text-xs sm:text-sm shadow-xl flex items-center gap-1.5 sm:gap-2 hover:bg-cyan-600 hover:text-white transition-colors">
              <ShoppingBag size={14} className="sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Lihat Detail</span>
              <span className="sm:hidden">Detail</span>
            </div>
          </div>
        </div>

        {/* CONTENT INFO */}
        <div className="flex flex-col flex-grow px-1 sm:px-2 mt-2 sm:mt-0">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-2 mb-1 sm:mb-2">
            <h3 className="font-bold text-sm sm:text-lg text-slate-900 group-hover:text-cyan-600 transition-colors line-clamp-2 leading-tight sm:leading-snug">
              {product.name}
            </h3>
            <span className="text-cyan-700 font-bold text-xs sm:text-base whitespace-nowrap mt-1 sm:mt-0">
              Rp {Number(product.price || 0).toLocaleString("id-ID")}
            </span>
          </div>

          <p className="text-slate-500 text-sm line-clamp-2 mt-auto">
            {product.description || "Produk masterpiece dengan material berkualitas tinggi."}
          </p>

          {/* DECORATIVE LINE ON HOVER */}
          <div className="h-0.5 w-0 bg-cyan-500 mt-4 transition-all duration-500 group-hover:w-full" />
        </div>

      </div>
    </Link>
  );
}