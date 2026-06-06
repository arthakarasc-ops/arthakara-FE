"use client";
import { useEffect, useRef, useState } from "react";

const images = [
  "/image/dokumentasi1.jpeg",
  "/image/dokumentasi2.jpeg",
  "/image/dokumentasi3.jpeg",
];

function ImageSlider() {
  const sliderRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const totalSlides = images.length;

  const goToSlide = (i) => {
    if (!sliderRef.current) return;
    const width = sliderRef.current.clientWidth;
    sliderRef.current.style.scrollBehavior = "smooth";
    sliderRef.current.scrollTo({ left: width * i });
    setIndex(i);
  };

  const next = () => goToSlide(index + 1);
  const prev = () => goToSlide(index === 0 ? totalSlides - 1 : index - 1);

  // Autoplay
  useEffect(() => {
    if (isHovering) return;
    const interval = setInterval(next, 3000);
    return () => clearInterval(interval);
  }, [index, isHovering]);

  // Loop fix
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    const handleScroll = () => {
      if (index >= totalSlides) {
        slider.style.scrollBehavior = "auto";
        slider.scrollTo({ left: 0 });
        setIndex(0);
      }
    };
    slider.addEventListener("scroll", handleScroll);
    return () => slider.removeEventListener("scroll", handleScroll);
  }, [index]);

  return (
    <div
      className="relative w-full max-w-full overflow-hidden"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div ref={sliderRef} className="flex overflow-hidden">
        {[...images, ...images].map((src, i) => (
          <div key={i} className="min-w-full h-[250px] sm:h-[350px] md:h-[450px]">
            <img 
              src={src} 
              className="w-full h-full object-cover" 
              alt={`slide-${i}`} 
            />
          </div>
        ))}
      </div>

      <button
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur px-3 py-2 rounded-full shadow hover:bg-white transition"
      >
        ←
      </button>
      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur px-3 py-2 rounded-full shadow hover:bg-white transition"
      >
        →
      </button>
    </div>
  );
}

export default function InvestorSection() {
  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 bg-gray-50" id="value">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="grid md:grid-cols-2 gap-6 items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Our{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-sky-600">
                Values
              </span>
            </h2>
          </div>
          <div>
            <p className="text-gray-600">
              The principles that guide our every step in achieving our vision and mission
            </p>
          </div>
        </div>

        {/* MAIN CONTENT - items-center membuat konten di grid sejajar vertikal */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* SLIDER */}
          <div className="min-w-0">
            <ImageSlider />
          </div>

          {/* CARDS (Stacked Vertically) */}
          <div className="grid grid-cols-1 gap-6">
            {/* Integrity Card */}
            <div className="bg-cyan-700 text-white p-8 shadow-lg">
              <h3 className="text-xl font-semibold mb-3">VISION</h3>
              <div className="w-8 h-1 bg-white mb-4"></div>
              <p className="text-sm text-blue-50">
                Menginisiasi terwujudnya perusahaan yang inovatif dan berkelanjutan dalam menghadirkan produk yang berimplikasi positif dan mudah dijangkau sesuai kualitasnya, serta membentuk generasi muda yang visioner melalui kepedulian dalam pengolahan material plastik yang berintegritas ekologis.
              </p>
            </div>

            {/* Mission Card */}
<div className="bg-white p-8 shadow-sm border border-gray-200 rounded-lg">
  <h3 className="text-xl font-semibold mb-3 text-gray-900">MISSION</h3>
  <div className="w-8 h-1 bg-red-500 mb-6"></div>
  
  <ul className="space-y-4 text-sm text-gray-600">
    <li className="flex gap-3">
      <span className="font-bold text-red-500">1.</span>
      <span>Menumbuhkan budaya gagasan baru melalui riset, eksplorasi desain produk, dan memaksimalkan pemanfaatan material plastik daur ulang.</span>
    </li>
    <li className="flex gap-3">
      <span className="font-bold text-red-500">2.</span>
      <span>Menerapkan prinsip ekonomi sirkular dengan mengutamakan pemilihan material plastik pascapakai.</span>
    </li>
    <li className="flex gap-3">
      <span className="font-bold text-red-500">3.</span>
      <span>Membiasakan pandangan jangka panjang melalui peran generasi muda dalam kegiatan yang membangun kesadaran dampak.</span>
    </li>
    <li className="flex gap-3">
      <span className="font-bold text-red-500">4.</span>
      <span>Mengoptimalkan proses perancangan dan produksi secara efisien.</span>
    </li>
  </ul>
</div>
          </div>
        </div>
      </div>
    </section>
  );
}