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
        
        // Fetch product count for each collection
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
      } else {
        setCollections([]);
      }

      setLoading(false);
    };

    fetchCollections();
  }, []);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-cyan-100/40 blur-[120px]"></div>
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[60%] rounded-full bg-sky-100/40 blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="text-cyan-600 font-medium tracking-wider text-sm uppercase mb-3 block">Koleksi Pilihan</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
              Eksplorasi <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-sky-500">Gaya Anda</span>
            </h2>
            <p className="mt-4 text-slate-600 text-lg">
              Kurasi produk eksklusif yang dirancang khusus untuk memenuhi kebutuhan dan gaya hidup modern Anda.
            </p>
          </div>
          <Link href="/collections" className="hidden md:flex items-center gap-2 text-slate-900 hover:text-cyan-600 font-medium transition-colors group">
            Lihat Semua Koleksi
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={`col-sec-skeleton-${i}`} className="h-[400px] rounded-3xl bg-slate-200 animate-pulse border border-slate-100"></div>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {collections.slice(0, 3).map((collection, index) => (
              <Link key={collection.id} href={`/collections/${collection.slug}`} className="group">
                <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 bg-white">
                  
                  {/* IMAGE WITH ZOOM EFFECT */}
                  <div className="absolute inset-0 w-full h-full">
                    <img
                      src={collection.image_url || "/no-image.png"}
                      alt={collection.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  {/* GRADIENT OVERLAY */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent transition-opacity duration-500 group-hover:opacity-90"></div>

                  {/* CONTENT */}
                  <div className="absolute bottom-0 left-0 w-full p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    
                    <div className="flex items-center gap-2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                      <span className="bg-cyan-500/20 text-cyan-300 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 border border-cyan-500/30">
                        <Package size={12} />
                        {collection.productCount} Produk
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-2">
                      {collection.name}
                    </h3>
                    
                    <p className="text-slate-300 text-sm line-clamp-2 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-150">
                      {collection.description || "Temukan rangkaian produk premium dalam koleksi eksklusif ini."}
                    </p>

                    <div className="flex items-center gap-2 text-white font-medium opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200 translate-y-2 group-hover:translate-y-0">
                      <span>Eksplorasi</span>
                      <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                    </div>

                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-10 md:hidden flex justify-center">
           <Link href="/collections" className="flex items-center gap-2 text-slate-900 hover:text-cyan-600 font-medium transition-colors group px-6 py-3 border border-slate-200 rounded-full">
            Lihat Semua Koleksi
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </section>
  );
}