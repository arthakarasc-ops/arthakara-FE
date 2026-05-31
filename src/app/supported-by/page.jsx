"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/ui/Navbar";
import Contact from "@/components/section/Contact";

export default function SupportedByPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sponsors = [
    { name: "Starbucks", logo: "/image/Starbucks.png" },
    { name: "Prestasi Junior Indonesia", logo: "/image/pgi.png" },
    { name: "Kolese Loyola", logo: "/image/loyola-logo.png" },
  ];

  return (
    <main className="min-h-screen bg-[#faebd7] font-sans">
      <Navbar />

      {/* Header */}
      <section className="pt-32 pb-12 md:pt-44 md:pb-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className={`transition-all duration-700 ease-out ${mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
            <p className="text-xs md:text-sm tracking-[0.25em] text-cyan-700 uppercase font-semibold mb-4">
              Partners & Sponsors
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Supported By
            </h1>
            <div className="w-16 h-1 bg-cyan-600 rounded-full mb-6"></div>
            <p className="text-slate-600 text-base md:text-lg max-w-xl leading-relaxed">
              We are grateful to the organizations and institutions that support Arthakara Student Company in creating sustainable impact.
            </p>
          </div>
        </div>
      </section>

      {/* Sponsors */}
      <section className="pb-24 md:pb-32">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 lg:gap-28 py-12 border-t border-b border-slate-300/30">
            {sponsors.map((sponsor, index) => (
              <div
                key={index}
                className={`transition-all duration-700 ease-out hover:scale-105 ${mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
                style={{ transitionDelay: `${(index + 1) * 100}ms` }}
              >
                <img
                  src={sponsor.logo}
                  alt={sponsor.name}
                  className="h-16 md:h-20 lg:h-24 w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <Contact />
    </main>
  );
}
