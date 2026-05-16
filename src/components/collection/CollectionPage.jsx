"use client";

import Link from "next/link";
import { ArrowRight, ArrowLeft, Package, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { getCollections } from "@/app/api/CollectionApi";
import ProductCard from "@/components/ProductCard";
import ProductSkeleton from "@/components/ProductSkeleton";

function ProductCarousel({ products, IMAGE_BASE_URL }) {
  const scrollRef = useRef(null);
  const [showArrows, setShowArrows] = useState(false);

  const checkOverflow = () => {
    if (scrollRef.current) {
      const { scrollWidth, clientWidth } = scrollRef.current;
      // Show arrows only if content overflows the container width
      setShowArrows(scrollWidth > clientWidth);
    }
  };

  useEffect(() => {
    // Check initially and on resize
    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [products]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth * 0.7 
        : scrollLeft + clientWidth * 0.7;
      
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative group/carousel px-4 -mx-4 sm:px-0 sm:mx-0">
      {/* NAVIGATION ARROWS (Smart logic & Mobile friendly) */}
      {showArrows && (
        <button 
          onClick={() => scroll('left')}
          className="absolute left-2 sm:left-4 top-[40%] sm:top-[40%] -translate-y-1/2 z-30 bg-white/90 backdrop-blur-xl p-2 sm:p-3 rounded-full shadow-xl border border-slate-100 transition-all duration-300 -ml-2 sm:-ml-6 flex items-center justify-center hover:bg-cyan-600 hover:text-white hover:scale-110 active:scale-95"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
        </button>
      )}

      {/* CAROUSEL CONTAINER */}
      <div 
        ref={scrollRef}
        onScroll={checkOverflow}
        className="flex items-stretch overflow-x-auto pb-8 gap-4 sm:gap-6 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {products.map((product) => (
          <div key={product.id} className="snap-start flex-none w-[160px] sm:w-[220px] md:w-[240px]">
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* RIGHT ARROW */}
      {showArrows && (
        <button 
          onClick={() => scroll('right')}
          className="absolute right-2 sm:right-4 top-[40%] sm:top-[40%] -translate-y-1/2 z-30 bg-white/90 backdrop-blur-xl p-2 sm:p-3 rounded-full shadow-xl border border-slate-100 transition-all duration-300 -mr-2 sm:-mr-6 flex items-center justify-center hover:bg-cyan-600 hover:text-white hover:scale-110 active:scale-95"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}

export default function CollectionPage({ slug }) {
  const [collections, setCollections] = useState([]);
  const [productsMap, setProductsMap] = useState({});
  const [loading, setLoading] = useState(true);

  const BASE_URL = "https://arthakara-api-production.up.railway.app/api"; 
  const IMAGE_BASE_URL = "https://arthakara-api-production.up.railway.app";

  // FETCH PRODUCTS PER COLLECTION
  const fetchProducts = async (collectionId) => {
    try {
      const res = await fetch(`${BASE_URL}/collections/${collectionId}/products`, {
        headers: { 'Accept': 'application/json' }
      });
      const data = await res.json();
      return data?.data || data || [];
    } catch (err) {
      return [];
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const res = await getCollections();

      if (res.status === 200) {
        let collectionsData = res.data;
        
        // Filter by slug if provided (for detail page)
        if (slug) {
          collectionsData = collectionsData.filter(col => col.slug === slug);
        }
        
        setCollections(collectionsData);

        const productData = {};

        await Promise.all(
          collectionsData.map(async (col) => {
            const products = await fetchProducts(col.id);
            productData[col.id] = products;
          })
        );

        setProductsMap(productData);
      }

      setLoading(false);
    };

    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 relative selection:bg-cyan-200 selection:text-cyan-900">
      
      {/* Background Decor */}
      <div className="absolute top-0 w-full h-[50vh] bg-gradient-to-b from-cyan-100/40 to-transparent pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* HEADER */}
        <div className="text-center mb-20">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
            Koleksi <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-sky-500">Produk</span>
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Daftar kategori produk kami. Jelajahi berbagai pilihan produk berkualitas yang tersedia di setiap koleksi.
          </p>
        </div>
        
        {/* LOADING */}
        {loading ? (
          <div className="space-y-32">
            {[...Array(3)].map((_, colIndex) => (
              <div key={`col-skeleton-${colIndex}`} className="relative">
                {/* COLLECTION HEADER SKELETON */}
                <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-slate-200 pb-8 animate-pulse">
                  <div className="max-w-3xl w-full">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="h-8 md:h-10 bg-slate-200 rounded-lg w-1/2"></div>
                      <div className="h-6 w-16 bg-slate-200 rounded-full"></div>
                    </div>
                    <div className="h-5 bg-slate-200 rounded-md w-3/4"></div>
                  </div>
                  <div className="h-6 w-32 bg-slate-200 rounded-md"></div>
                </div>

                {/* PRODUCTS CAROUSEL SKELETON */}
                <div className="flex overflow-hidden pb-8 gap-4 sm:gap-6">
                  {[...Array(5)].map((_, prodIndex) => (
                    <div key={`prod-skeleton-${prodIndex}`} className="flex-none w-[160px] sm:w-[220px] md:w-[240px]">
                      <ProductSkeleton />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-32">

            {collections.map((collection) => (
              <div key={collection.id} className="relative">

                {/* COLLECTION HEADER */}
                <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-slate-200 pb-8">
                  <div className="max-w-3xl">
                    <div className="flex items-center gap-4 mb-3">
                      <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                        {collection.name}
                      </h2>
                      <span className="bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
                        <Package size={14} />
                        {productsMap[collection.id]?.length || 0}
                      </span>
                    </div>
                    <p className="text-slate-500 text-lg">
                      {collection.description ?? "Eksplorasi rangkaian produk unggulan dari koleksi ini."}
                    </p>
                  </div>

                  {!slug ? (
                    <Link href={`/collections/${collection.slug}`}>
                      <button className="group flex items-center gap-2 text-cyan-600 hover:text-cyan-700 font-bold transition-colors whitespace-nowrap">
                        Lihat Koleksi Lengkap
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </Link>
                  ) : (
                    <Link href="/collections" className="group flex items-center gap-2 text-cyan-600 hover:text-cyan-700 font-bold transition-colors whitespace-nowrap">
                      <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                      Kembali ke Koleksi
                    </Link>
                  )}
                </div>

                {/* PRODUCTS CAROUSEL */}
                {productsMap[collection.id]?.length > 0 ? (
                  <ProductCarousel 
                    products={productsMap[collection.id]} 
                    IMAGE_BASE_URL={IMAGE_BASE_URL} 
                  />
                ) : (
                  <div className="py-12 flex flex-col items-center justify-center text-slate-400 bg-white rounded-3xl border border-dashed border-slate-200">
                    <Package size={48} className="mb-4 text-slate-300" />
                    <p className="text-lg font-medium">Belum ada produk yang tersedia</p>
                  </div>
                )}

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}