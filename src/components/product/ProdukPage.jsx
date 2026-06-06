"use client";

import { useEffect, useState, useMemo } from "react";
import { fetchProducts } from "@/app/api/ProductApi";
import ProductCard from "@/components/ProductCard";
import ProductSkeleton from "@/components/ProductSkeleton";
import { SlidersHorizontal, ChevronDown, Sparkles, Search, X } from "lucide-react";

export default function ProdukPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // States for filter and sort
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("terbaru"); // terbaru, termurah, termahal, az, za
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showFilterInput, setShowFilterInput] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetchProducts();
        setProducts(res || []);
        
        // Check for search query in URL
        const params = new URLSearchParams(window.location.search);
        const urlSearch = params.get("search");
        if (urlSearch) {
          setSearchQuery(urlSearch);
          setShowFilterInput(true);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter and Sort Logic
  const processedProducts = useMemo(() => {
    let result = [...products];

    // Filter by search query
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          (p.name && p.name.toLowerCase().includes(lowerQuery)) ||
          (p.description && p.description.toLowerCase().includes(lowerQuery))
      );
    }

    // Sort
    switch (sortOrder) {
      case "termurah":
        result.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
        break;
      case "termahal":
        result.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
        break;
      case "az":
        result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        break;
      case "za":
        result.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
        break;
      case "terbaru":
      default:
        // Assuming original order is newest or we can sort by id if no date is present
        result.sort((a, b) => (b.id || 0) - (a.id || 0));
        break;
    }

    return result;
  }, [products, searchQuery, sortOrder]);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white min-h-screen relative selection:bg-cyan-200 selection:text-cyan-900">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-full h-[50vh] bg-gradient-to-bl from-cyan-50/50 via-white to-transparent pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">

        {/* PAGE HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8 border-b border-slate-100 pb-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 tracking-tight">
              Semua <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-teal-500">Produk</span>
            </h1>
          </div>

          {/* FILTER / SORT ACTIONS */}
          <div className="flex flex-row items-center justify-end gap-2 sm:gap-4 relative">
            
            {/* SEARCH / FILTER INPUT */}
            <div className={`flex items-center transition-all duration-300 overflow-hidden ${showFilterInput ? 'w-32 xs:w-40 sm:w-64 opacity-100' : 'w-0 opacity-0'}`}>
               <div className="relative w-full">
                 <input 
                   type="text" 
                   placeholder="Cari..." 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="w-full pl-8 pr-4 py-1.5 rounded-full border border-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-xs sm:text-sm"
                 />
                 <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                 {searchQuery && (
                   <button onClick={() => setSearchQuery("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                     <X size={12} />
                   </button>
                 )}
               </div>
            </div>

            <button 
              onClick={() => setShowFilterInput(!showFilterInput)}
              className={`flex items-center gap-1.5 px-3 py-2 sm:px-5 sm:py-2.5 rounded-full border transition-all font-medium text-xs sm:text-sm ${showFilterInput || searchQuery ? 'border-cyan-300 text-cyan-700 bg-cyan-50' : 'border-slate-200 text-slate-700 hover:border-cyan-300 hover:text-cyan-700 hover:bg-cyan-50'}`}
            >
              <SlidersHorizontal size={14} className="sm:w-4 sm:h-4" />
              <span>Filter</span>
            </button>
            
            <div className="relative">
              <button 
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="flex items-center gap-1.5 px-3 py-2 sm:px-5 sm:py-2.5 rounded-full border border-slate-200 text-slate-700 hover:border-cyan-300 hover:text-cyan-700 hover:bg-cyan-50 transition-all font-medium text-xs sm:text-sm w-28 sm:w-36 justify-between"
              >
                <span className="truncate capitalize">{sortOrder === 'az' ? 'A - Z' : sortOrder === 'za' ? 'Z - A' : sortOrder}</span>
                <ChevronDown size={14} className={`transition-transform duration-300 sm:w-4 sm:h-4 ${showSortMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* DROPDOWN SORT */}
              {showSortMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowSortMenu(false)}></div>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="flex flex-col">
                      {[
                        { id: 'terbaru', label: 'Terbaru' },
                        { id: 'termurah', label: 'Harga Terendah' },
                        { id: 'termahal', label: 'Harga Tertinggi' },
                        { id: 'az', label: 'Nama (A-Z)' },
                        { id: 'za', label: 'Nama (Z-A)' },
                      ].map((option) => (
                        <button
                          key={option.id}
                          onClick={() => {
                            setSortOrder(option.id);
                            setShowSortMenu(false);
                          }}
                          className={`text-left px-4 py-3 text-sm transition-colors hover:bg-cyan-50 ${sortOrder === option.id ? 'text-cyan-600 font-semibold bg-cyan-50/50' : 'text-slate-600'}`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

          </div>
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-8 gap-y-8 sm:gap-y-16">
            {[...Array(8)].map((_, i) => (
              <ProductSkeleton key={`skeleton-${i}`} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-8 gap-y-8 sm:gap-y-16">
            {processedProducts.length > 0 ? (
              processedProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))
            ) : (
              <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-400 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                <Search size={48} className="mb-4 text-slate-300" />
                <p className="text-lg font-medium text-slate-600 mb-1">Pencarian tidak ditemukan</p>
                <p className="text-sm">Silakan coba dengan kata kunci lain atau hapus filter.</p>
                <button 
                  onClick={() => setSearchQuery("")}
                  className="mt-6 px-6 py-2 bg-white border border-slate-200 text-slate-700 rounded-full hover:bg-slate-50 transition-colors text-sm font-medium"
                >
                  Reset Pencarian
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
}