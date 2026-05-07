"use client";

import Link from "next/link";
import { ArrowRight, Package, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { getCollections } from "@/app/api/CollectionApi";

export default function CollectionPage() {
  const [collections, setCollections] = useState([]);
  const [productsMap, setProductsMap] = useState({});
  const [loading, setLoading] = useState(true);

  const BASE_URL = "http://localhost:8000"; 

  // FETCH PRODUCTS PER COLLECTION
  const fetchProducts = async (collectionId) => {
    try {
      const res = await fetch(`/api/collections/${collectionId}/products`);
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
        const collectionsData = res.data;
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
          <span className="text-cyan-600 font-medium tracking-widest text-sm uppercase mb-4 block">Katalog Kami</span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
            Koleksi <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-sky-500">Produk</span>
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Daftar kategori produk kami. Jelajahi berbagai pilihan produk berkualitas yang tersedia di setiap koleksi.
          </p>
        </div>
        
        {/* LOADING */}
        {loading ? (
          <div className="flex justify-center items-center h-40">
             <div className="w-12 h-12 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-24">

            {collections.map((collection, index) => (
              <div key={collection.id} className="relative">

                {/* COLLECTION HEADER */}
                <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-slate-200 pb-6">
                  <div className="max-w-3xl">
                    <div className="flex items-center gap-3 mb-3">
                      <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                        {collection.name}
                      </h2>
                      <span className="bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5">
                        <Package size={14} />
                        {productsMap[collection.id]?.length || 0}
                      </span>
                    </div>
                    <p className="text-slate-600 text-lg">
                      {collection.description ?? "Eksplorasi rangkaian produk unggulan dari koleksi ini."}
                    </p>
                  </div>

                  <Link href={`/collections/${collection.slug}`}>
                    <button className="group flex items-center gap-2 text-cyan-600 hover:text-cyan-700 font-semibold transition-colors whitespace-nowrap">
                      Lihat Koleksi
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                </div>

                {/* PRODUCTS GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                  {productsMap[collection.id]?.length > 0 ? (
                    productsMap[collection.id].slice(0, 4).map((product) => (
                      <Link key={product.id} href={`/products/${product.id}`} className="group h-full">
                        <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden flex flex-col h-full border border-slate-100/50">
                          
                          {/* IMAGE */}
                          <div className="relative h-64 overflow-hidden bg-slate-100">
                            <img
                              src={
                                product.usage_image
                                  ? product.usage_image.startsWith("http")
                                    ? product.usage_image
                                    : `${BASE_URL}/storage/${product.usage_image}`
                                  : "/no-image.png"
                              }
                              alt={product.name}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors duration-300"></div>
                            
                            {/* Hover Action */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="bg-white/90 backdrop-blur-sm text-slate-900 px-4 py-2 rounded-full font-medium text-sm translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-lg flex items-center gap-2">
                                <ShoppingBag size={16} /> Lihat Detail
                              </div>
                            </div>
                          </div>

                          {/* CONTENT */}
                          <div className="p-6 flex flex-col flex-grow">
                            <h3 className="font-bold text-lg text-slate-900 group-hover:text-cyan-600 transition-colors line-clamp-1 mb-2">
                              {product.title || product.name}
                            </h3>
                            
                            <p className="text-slate-500 text-sm mb-4 line-clamp-2 flex-grow">
                              {product.description || "Produk berkualitas tinggi dengan desain elegan."}
                            </p>

                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                              <span className="text-slate-900 font-bold text-lg">
                                Rp {Number(product.price).toLocaleString("id-ID")}
                              </span>
                            </div>
                          </div>

                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-400 bg-slate-100/50 rounded-2xl border border-dashed border-slate-200">
                      <Package size={48} className="mb-4 text-slate-300" />
                      <p className="text-lg font-medium">Belum ada produk yang tersedia</p>
                    </div>
                  )}
                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}