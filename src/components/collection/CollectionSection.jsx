"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCollections } from "@/app/api/CollectionApi";
import { ArrowRight, Package } from "lucide-react";

export default function CollectionSection() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      const res = await getCollections();
      if (res.status === 200 && Array.isArray(res.data)) {
        const collectionsData = res.data;
        const collectionsWithCounts = await Promise.all(
          collectionsData.map(async (col) => {
            try {
              const prodRes = await fetch(`https://arthakara.id/api/collections/${col.id}/products`, {
                headers: { 'Accept': 'application/json' }
              });
              const prodData = await prodRes.json();
              const products = prodData?.data || prodData || [];
              return { ...col, productCount: products.length };
            } catch (e) {
              return { ...col, productCount: 0 };
            }
          })
        );
        setCollections(collectionsWithCounts);
      }
      setLoading(false);
    };

    fetchCollections();
  }, []);

  return (
    <section className="relative bg-slate-50 py-20">
      {/* GRADASI TRANSISI: Dari Putih ke Slate-50 */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-slate-50 z-0"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="text-cyan-600 font-medium tracking-wider text-sm uppercase mb-3 block">Discover</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-sky-500">Collections</span>
            </h2>
          </div>
          <Link href="/collections" className="hidden md:flex items-center gap-2 text-slate-900 hover:text-cyan-600 font-medium transition-colors group">
            View All Collections
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* CONTENT GRID */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-[400px] rounded-[2rem] bg-slate-200 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {collections.slice(0, 3).map((collection) => (
              <Link key={collection.id} href={`/collections/${collection.slug}`} className="group block">
                {/* CARD CONTAINER */}
                <div className="relative h-[400px] rounded-[2rem] overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100">
                  
                  {/* IMAGE */}
                  <div className="absolute inset-0 w-full h-full">
                    <img
                      src={collection.image_url || "/no-image.png"}
                      alt={collection.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  {/* GRADIENT OVERLAY */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>

                  {/* CONTENT */}
                  <div className="absolute bottom-0 left-0 w-full p-8">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-white/10 text-white backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 border border-white/20">
                        <Package size={12} />
                        {collection.productCount} Products
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-2">
                      {collection.name}
                    </h3>
                    
                    <p className="text-slate-200 text-sm line-clamp-2 mb-6">
                      {collection.description || "Discover premium products in this exclusive collection."}
                    </p>

                    <div className="flex items-center gap-2 text-white font-semibold group-hover:gap-4 transition-all duration-300">
                      <span>Explore</span>
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* MOBILE VIEW ALL BUTTON */}
        <div className="mt-10 md:hidden flex justify-center">
           <Link href="/collections" className="flex items-center gap-2 text-slate-900 hover:text-cyan-600 font-medium transition-colors px-6 py-3 border border-slate-200 rounded-full">
            View All Collections
            <ArrowRight size={18} />
          </Link>
        </div>

      </div>
    </section>
  );
}