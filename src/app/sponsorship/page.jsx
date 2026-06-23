"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/ui/Navbar";
import Contact from "@/components/section/Contact";

export default function SponsorshipPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTier, setActiveTier] = useState("official");

  useEffect(() => {
    setMounted(true);
  }, []);

  const sponsorshipTiers = [
    {
      id: "featured",
      title: "Featured Sponsors",
      // Mobile: 2 kolom, Desktop: naik bertahap sampai 4 kolom
      gridClass: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
      sponsors: [
        { name: "Featured 1", logo: "/image/Coming soon.jpg" },
        { name: "Featured 2", logo: "/image/Coming soon.jpg" },
        { name: "Featured 3", logo: "/image/Coming soon.jpg" },
        { name: "Featured 4", logo: "/image/Coming soon.jpg" },
      ],
    },
    {
      id: "official",
      title: "Official Sponsors",
      // Mobile: 3 kolom, Desktop: naik bertahap sampai 6 kolom
      gridClass: "grid-cols-3 sm:grid-cols-4 lg:grid-cols-6",
      sponsors: [
        { name: "Official 1", logo: "/image/Coming soon.jpg" },
        { name: "Official 2", logo: "/image/Coming soon.jpg" },
        { name: "Official 3", logo: "/image/Coming soon.jpg" },
        { name: "Official 4", logo: "/image/Coming soon.jpg" },
        { name: "Official 5", logo: "/image/Coming soon.jpg" },
        { name: "Official 6", logo: "/image/Coming soon.jpg" },
        { name: "Official 7", logo: "/image/Coming soon.jpg" },
        { name: "Official 8", logo: "/image/Coming soon.jpg" },
        { name: "Official 9", logo: "/image/Coming soon.jpg" },
      ],
    },
    {
      id: "supporting",
      title: "Supporting Sponsors",
      // Mobile: 4 kolom, Desktop: naik bertahap sampai 8 kolom
      gridClass: "grid-cols-4 sm:grid-cols-6 lg:grid-cols-8",
      sponsors: [
        { name: "Supporting 1", logo: "/image/Keluarga Lie Kok Liang.jpeg" },
        { name: "Supporting 2", logo: "/image/Coming soon.jpg" },
        { name: "Supporting 3", logo: "/image/Coming soon.jpg" },
        { name: "Supporting 4", logo: "/image/Coming soon.jpg" },
        { name: "Supporting 5", logo: "/image/Coming soon.jpg" },
        { name: "Supporting 6", logo: "/image/Coming soon.jpg" },
        { name: "Supporting 7", logo: "/image/Coming soon.jpg" },
        { name: "Supporting 8", logo: "/image/Coming soon.jpg" },
        { name: "Supporting 9", logo: "/image/Coming soon.jpg" },
        { name: "Supporting 10", logo: "/image/Coming soon.jpg" },
        { name: "Supporting 11", logo: "/image/Coming soon.jpg" },
        { name: "Supporting 12", logo: "/image/Coming soon.jpg" },
      ],
    },
  ];

  const currentTier = sponsorshipTiers.find((t) => t.id === activeTier);

  return (
    <main className="min-h-screen bg-gray-200 font-sans overflow-x-hidden">
      <Navbar />

      {/* Header Section */}
      <section className="pt-32 pb-8 md:pt-44 md:pb-12">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className={`transition-all duration-700 ease-out ${mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
            <p className="text-xs md:text-sm tracking-[0.25em] text-slate-500 uppercase font-bold mb-3">
              Our Supporters
            </p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
              Sponsorship Tiers
            </h1>
            <div className="w-16 h-1 bg-slate-900 rounded-full mb-6 mx-auto"></div>
            <p className="text-slate-600 text-sm md:text-base max-w-md leading-relaxed mx-auto">
              We highly appreciate our partners who contribute to empowering youth and driving sustainable innovation.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Tabs & Grid Section */}
      <section className="pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          
          {/* Tombol Tab Filter */}
          <div className="flex flex-col gap-2 mb-10 max-w-sm mx-auto">
            <button
              onClick={() => setActiveTier("featured")}
              className={`w-full py-3 px-6 rounded-2xl font-bold text-sm transition-all duration-300 border border-transparent ${
                activeTier === "featured"
                  ? "bg-slate-900 text-white shadow-md"
                  : "bg-gray-300/70 text-slate-700 hover:bg-gray-300"
              }`}
            >
              Featured Sponsors
            </button>

            <div className="flex gap-2">
              <button
                onClick={() => setActiveTier("official")}
                className={`flex-1 py-3 px-4 rounded-2xl font-bold text-sm transition-all duration-300 border border-transparent ${
                  activeTier === "official"
                    ? "bg-slate-900 text-white shadow-md"
                    : "bg-gray-300/70 text-slate-700 hover:bg-gray-300"
              }`}
              >
                Official Sponsors
              </button>
              <button
                onClick={() => setActiveTier("supporting")}
                className={`flex-1 py-3 px-4 rounded-2xl font-bold text-sm transition-all duration-300 border border-transparent ${
                  activeTier === "supporting"
                    ? "bg-slate-900 text-white shadow-md"
                    : "bg-gray-300/70 text-slate-700 hover:bg-gray-300"
                }`}
              >
                Supporting Sponsors
              </button>
            </div>
          </div>

          {/* Grid Logo Sponsor */}
          {currentTier && (
            <div 
              key={currentTier.id}
              className="grid gap-3 transition-all duration-500 ease-out opacity-100 scale-100"
            >
              <div className={`grid ${currentTier.gridClass} gap-3`}>
                {currentTier.sponsors.map((sponsor, index) => (
                  <div
                    key={`${currentTier.id}-${index}`}
                    className="bg-white border border-gray-300/80 rounded-2xl aspect-square flex items-center justify-center overflow-hidden shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md p-1"
                  >
                    <img
                      src={sponsor.logo}
                      alt={sponsor.name}
                      className="w-full h-full object-contain opacity-100"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </section>

      <Contact />
    </main>
  );
}