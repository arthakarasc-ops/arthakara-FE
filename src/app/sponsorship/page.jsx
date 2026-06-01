"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/ui/Navbar";
import Contact from "@/components/section/Contact";

export default function SponsorshipPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sponsorshipTiers = [
    {
      id: "platinum",
      title: "Platinum Partners",
      imageClass: "h-24 md:h-36 lg:h-44", 
      directionClass: "animate-scroll-right", // Gerak ke Kanan
      sponsors: [
        { name: "Platinum Dummy 1", logo: "/image/Coming soon.jpg" },
        { name: "Platinum Dummy 2", logo: "/image/Coming soon.jpg" },
        { name: "Platinum Dummy 3", logo: "/image/Coming soon.jpg" },
        { name: "Platinum Dummy 4", logo: "/image/Coming soon.jpg" },
        { name: "Platinum Dummy 5", logo: "/image/Coming soon.jpg" },
        { name: "Platinum Dummy 6", logo: "/image/Coming soon.jpg" },
      ],
    },
    {
      id: "gold",
      title: "Gold Sponsors",
      imageClass: "h-16 md:h-24 lg:h-28", 
      directionClass: "animate-scroll-left", // Gerak ke Kiri (Selang-seling)
      sponsors: [
        { name: "Gold Dummy 1", logo: "/image/Coming soon.jpg" },
        { name: "Gold Dummy 2", logo: "/image/Coming soon.jpg" },
        { name: "Gold Dummy 3", logo: "/image/Coming soon.jpg" },
        { name: "Gold Dummy 4", logo: "/image/Coming soon.jpg" },
        { name: "Gold Dummy 5", logo: "/image/Coming soon.jpg" },
      ],
    },
    {
      id: "silver",
      title: "Silver Sponsors",
      imageClass: "h-10 md:h-14 lg:h-18", 
      directionClass: "animate-scroll-right", // Gerak ke Kanan (Selang-seling)
      sponsors: [
        { name: "Silver Dummy 1", logo: "/image/Coming soon.jpg" },
        { name: "Silver Dummy 2", logo: "/image/Coming soon.jpg" },
        { name: "Silver Dummy 3", logo: "/image/Coming soon.jpg" },
        { name: "Silver Dummy 4", logo: "/image/Coming soon.jpg" },
        { name: "Silver Dummy 5", logo: "/image/Coming soon.jpg" },
        { name: "Silver Dummy 6", logo: "/image/Coming soon.jpg" },
      ],
    },
  ];

  return (
    // Background halaman utama menggunakan gray-200
    <main className="min-h-screen bg-gray-200 font-sans overflow-x-hidden">
      <style jsx global>{`
        @keyframes marqueeRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        @keyframes marqueeLeft {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll-right {
          animation: marqueeRight 35s linear infinite;
        }
        .animate-scroll-left {
          animation: marqueeLeft 40s linear infinite;
        }
        .animate-scroll-right:hover, .animate-scroll-left:hover {
          animation-play-state: paused;
        }
      `}</style>

      <Navbar />

      {/* Header */}
      <section className="pt-32 pb-12 md:pt-44 md:pb-16">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className={`transition-all duration-700 ease-out ${mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
            <p className="text-xs md:text-sm tracking-[0.25em] text-cyan-700 uppercase font-semibold mb-4">
              Our Supporters
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Sponsorship Tiers
            </h1>
            <div className="w-16 h-1 bg-cyan-600 rounded-full mb-6 mx-auto"></div>
            <p className="text-slate-600 text-base md:text-lg max-w-xl leading-relaxed mx-auto">
              We highly appreciate our partners who contribute to empowering youth and driving sustainable innovation.
            </p>
          </div>
        </div>
      </section>

      {/* Tiers Section */}
      <section className="pb-24 md:pb-32">
        <div className="max-w-7xl mx-auto space-y-16 md:space-y-20">
          {sponsorshipTiers.map((tier) => {
            const doubledSponsors = [...tier.sponsors, ...tier.sponsors, ...tier.sponsors, ...tier.sponsors];

            return (
              <div 
                key={tier.id} 
                className={`transition-all duration-1000 ease-out ${
                  mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
              >
                <h2 className="text-center text-sm md:text-base font-semibold tracking-widest text-slate-500 uppercase mb-6 px-6">
                  {tier.title}
                </h2> 

                {/* Container Utama Slider */}
                {/* Ujung gradasi (before/after) sudah disesuaikan menggunakan utility Tailwind via-transparent dan from-gray-200 */}
                <div className="relative w-full overflow-hidden py-2 before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-24 before:bg-gradient-to-r before:from-gray-200 before:to-transparent after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-24 after:bg-gradient-to-l after:from-gray-200 after:to-transparent">
                  
                  <div className={`flex w-max items-center gap-8 md:gap-12 whitespace-nowrap px-4 ${tier.directionClass}`}>
                    {doubledSponsors.map((sponsor, index) => (
                      <div
                        key={`${tier.id}-${index}`}
                        className="inline-block transition-transform duration-300 hover:scale-105"
                      >
                        <img
                          src={sponsor.logo}
                          alt={sponsor.name}
                          className={`${tier.imageClass} w-auto object-contain mix-blend-multiply filter contrast-125 saturate-110`}
                        />
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </section>

      <Contact />
    </main>
  );
}