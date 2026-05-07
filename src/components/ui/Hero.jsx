"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Hero() {
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    let timer;

    if (!showVideo) {
      // Tampilkan gambar dulu → lalu pindah ke video
      timer = setTimeout(() => {
        setShowVideo(true);
      }, 5000); // 5 detik gambar
    } else {
      // Setelah video → balik ke gambar
      timer = setTimeout(() => {
        setShowVideo(false);
      }, 8000); // durasi video (sesuaikan)
    }

    return () => clearTimeout(timer);
  }, [showVideo]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden text-white">
      
      {/* BACKGROUND */}
      <div className="absolute inset-0 z-0" id="home">

        {/* IMAGE BACKGROUND */}
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ${
            showVideo ? "opacity-0" : "opacity-100"
          }`}
        >
          <Image
            src="/Foto Bersama.png"
            alt="Foto Bersama Arthakara"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* VIDEO BACKGROUND */}
        <video
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            showVideo ? "opacity-100" : "opacity-0"
          }`}
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/image/vid-lanscape.mp4" type="video/mp4" />
        </video>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* CONTENT */}
      <div className="relative z-10 text-center px-4 sm:px-6">
        <p className="text-base sm:text-lg md:text-2xl font-light italic mb-2 tracking-widest text-cyan-300 animate-text-1">
          We are
        </p>
        
        <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-serif italic mb-4 sm:mb-6 drop-shadow-lg animate-text-2 leading-tight">
          Arthakara
        </h1>
        
        <p className="text-sm sm:text-base md:text-lg lg:text-2xl uppercase tracking-[0.15em] sm:tracking-[0.2em] font-light animate-text-3">
          VALUES IN MOTION, CHANGE IN CREATION.
        </p>
      </div>


      {/* ANIMATIONS */}
      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-text-1, .animate-text-2, .animate-text-3 {
          animation-name: fadeInUp;
          animation-duration: 1s;
          animation-timing-function: ease-out;
          animation-fill-mode: both;
        }

        .animate-text-1 { animation-delay: 0.2s; }
        .animate-text-2 { animation-delay: 0.6s; }
        .animate-text-3 { animation-delay: 1s; }

        @keyframes jumpDown {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(15px); }
        }

        .animate-jump-down {
          animation: jumpDown 1.5s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}