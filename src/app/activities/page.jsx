"use client";

import { useState } from "react";
import Navbar from "@/components/ui/Navbar";
import Contact from "@/components/section/Contact";

const categories = ["All", "CSR", "PR", "Marketing"];

const activities = [
  // Placeholder data — ganti dengan data asli nanti
];

export default function ActivitiesPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All"
    ? activities
    : activities.filter((a) => a.category === activeCategory);

  return (
    <main className="min-h-screen bg-white font-sans">
      <Navbar />

      {/* Header */}
      <section className="pt-32 pb-10 md:pt-44 md:pb-14 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs md:text-sm tracking-[0.25em] text-cyan-700 uppercase font-semibold mb-4">
            What We Do
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Our Activities
          </h1>
          <div className="w-16 h-1 bg-cyan-600 rounded-full mb-6"></div>
          <p className="text-slate-500 text-base md:text-lg max-w-xl leading-relaxed">
            A collection of programs and initiatives by Arthakara Student Company across CSR, Public Relations, and Marketing.
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="bg-white sticky top-[72px] z-30 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex gap-2 py-4 overflow-x-auto scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-slate-900 text-white shadow-md"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Activities Grid */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          {filtered.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filtered.map((item, index) => (
                <article
                  key={index}
                  className="group bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 hover:-translate-y-1"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-200">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        item.category === "CSR"
                          ? "bg-emerald-500 text-white"
                          : item.category === "PR"
                          ? "bg-violet-500 text-white"
                          : "bg-amber-500 text-white"
                      }`}>
                        {item.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider mb-2">
                      {item.date}
                    </p>
                    <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-cyan-700 transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">
                      {item.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-6">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Coming Soon</h3>
              <p className="text-slate-400 text-sm max-w-sm">
                Stay tuned! Our latest activities and programs will be shared here.
              </p>
            </div>
          )}
        </div>
      </section>

      <Contact />
    </main>
  );
}
