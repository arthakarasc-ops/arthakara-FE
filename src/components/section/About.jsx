"use client";

import { useEffect, useState, useRef } from "react";

// 🔥 Komponen Counter (Tetap)
function Counter({ val, label, showPlus = true }) {
  const target = parseInt(val);
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target]);

  return (
    <div className="bg-white px-4 sm:px-8 py-4 sm:py-6 rounded-2xl sm:rounded-3xl border border-cyan-100 shadow-[0_4px_20px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center min-w-[100px] sm:min-w-[120px]">
      <span className="block text-2xl sm:text-3xl font-bold text-cyan-600">
        {count}
        {showPlus && "+"}
      </span>
      <span className="text-xs font-semibold text-gray-400 tracking-widest mt-1">{label}</span>
    </div>
  );
}

export default function About() {
  const [activeIndex, setActiveIndex] = useState(0);
  const videoRef = useRef(null);

  // Fungsi untuk pindah slide secara manual
  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % 3);
  };

  // Efek untuk Foto: Foto tayang 10 detik lalu otomatis pindah
  useEffect(() => {
    if (activeIndex !== 0) {
      const timer = setTimeout(() => {
        nextSlide();
      }, 10000); // Foto tayang 10 detik
      return () => clearTimeout(timer);
    }
  }, [activeIndex]);

  return (
    <section className="relative py-16 sm:py-24 bg-white overflow-hidden" id="about">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        
        {/* Kolom Kiri: Teks */}
        <div className="flex flex-col order-2 md:order-1">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
            About <span className="text-cyan-600">Arthakara</span>
          </h2>
          <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8">
            Arthakara Student Company is a company formed by 29 students of SMA Kolese Loyola, where “Artha” means value and “Kara” means creator, reflecting the idea of creating value through action. Arthakara focuses on transforming plastic waste into meaningful products with attention to environmental issues, especially the impact of plastic pollution on sea turtles. Through this initiative, the company aims to raise awareness among young people about caring for the environment & turning simple materials into something that carries purpose and impact.
          </p>

          <div className="flex flex-wrap gap-3 sm:gap-6">
            {[
              { val: "29", label: "MEMBERS", showPlus: false },
              { val: "1000+", label: "ITEMS SOLD", showPlus: true },
              { val: "500+", label: "BUYERS", showPlus: true }
            ].map((item, index) => (
              <Counter key={index} val={item.val} label={item.label} showPlus={item.showPlus} />
            ))}
          </div>
        </div>

        {/* Kolom Kanan: Media Dinamis */}
        <div className="relative flex justify-center items-center order-1 md:order-2">
          <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
            <div className="radial-light w-[150%] h-[150%] animate-cyan-bloom"></div>
          </div>

          <div className="relative z-10 w-full max-w-xl aspect-video rounded-[2rem] shadow-2xl bg-gray-200 overflow-hidden">
            <div 
              className="flex w-full h-full transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {/* Slide 1: Video (onEnded pemicu perpindahan) */}
              <div className="w-full h-full flex-shrink-0 relative">
                <video
                  ref={videoRef}
                  src="/About.mp4"
                  autoPlay
                  muted
                  playsInline
                  onEnded={nextSlide} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Slide 2: Foto 1 */}
              <div className="w-full h-full flex-shrink-0 relative">
                <img src="/Shell-Penyu.jpeg" alt="Shell Penyu" className="w-full h-full object-cover" />
              </div>

              {/* Slide 3: Foto 2 */}
              <div className="w-full h-full flex-shrink-0 relative">
                <img src="/Penangkaran-Penyu.png" alt="Penangkaran Penyu" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes cyan-bloom {
          0%, 100% { opacity: 0.5; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1.15); }
        }
        .animate-cyan-bloom { animation: cyan-bloom 10s ease-in-out infinite; }
      `}</style>
    </section>
  );
}