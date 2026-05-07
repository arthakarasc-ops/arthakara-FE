"use client";
import { useEffect, useRef, useState } from "react";

const images = [
  "/image/dokumentasi1.jpeg",
  "/image/dokumentasi2.jpeg",
  "/image/dokumentasi3.jpeg",
];

const cards = [
  {
    title: "Integritas",
    desc: "Kami berkomitmen untuk selalu jujur, transparan, dan bertanggung jawab dalam setiap tindakan",
    style: "bg-cyan-600 text-white",
  },
  {
    title: "Kreativitas",
    desc: "Mendorong pemikiran out-of-the-box dan solusi inovatif untuk setiap tantangan",
    style: "bg-white text-gray-800 border",
  },
  {
    title: "Kolaborasi",
    desc: "Kami percaya kerja sama tim adalah kunci mencapai hasil terbaik",
    style: "bg-gray-100 text-gray-800",
  },
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
    sliderRef.current.scrollTo({
      left: width * i,
    });

    setIndex(i);
  };

  const next = () => {
    goToSlide(index + 1);
  };

  const prev = () => {
    if (index === 0) {
      goToSlide(totalSlides - 1);
    } else {
      goToSlide(index - 1);
    }
  };

  // AUTOPLAY
  useEffect(() => {
    if (isHovering) return;

    const interval = setInterval(() => {
      next();
    }, 3000);

    return () => clearInterval(interval);
  }, [index, isHovering]);

  // LOOP FIX
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const handleScroll = () => {
      const width = slider.clientWidth;

      // kalau sudah di clone terakhir
      if (index >= totalSlides) {
        slider.style.scrollBehavior = "auto";
        slider.scrollTo({ left: 0 });
        setIndex(0);
      }
    };

    slider.addEventListener("scroll", handleScroll);

    return () => {
      slider.removeEventListener("scroll", handleScroll);
    };
  }, [index]);

  function CardSlider() {
  const sliderRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const total = cards.length;

  const goTo = (i) => {
    if (!sliderRef.current) return;

    const width = sliderRef.current.clientWidth;

    sliderRef.current.style.scrollBehavior = "smooth";
    sliderRef.current.scrollTo({
      left: width * i,
    });

    setIndex(i);
  };

  const next = () => goTo(index + 1);

  useEffect(() => {
    if (isHovering) return;

    const interval = setInterval(next, 3000);
    return () => clearInterval(interval);
  }, [index, isHovering]);

  // loop
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    if (index >= total) {
      slider.style.scrollBehavior = "auto";
      slider.scrollTo({ left: 0 });
      setIndex(0);
    }
  }, [index]);

  return (
    <div
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div ref={sliderRef} className="flex">
        {[...cards, ...cards].map((card, i) => (
          <div key={i} className="min-w-full p-2">
            <div
              className={`${card.style} aspect-square p-6 shadow-lg flex flex-col justify-between transition hover:scale-[1.02]`}
            >
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  {card.title}
                </h3>
                <div className="w-8 h-1 bg-white mb-4"></div>
                <p className="text-sm opacity-90">
                  {card.desc}
                </p>
              </div>
              <div className="text-right text-xl mt-6">↗</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

  return (
    <div
      className="relative w-full max-w-full overflow-hidden"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* SLIDER */}
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

      {/* LEFT */}
      <button
        onClick={prev}
        className="absolute left-2 text-black sm:left-3 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur px-2 sm:px-3 py-1 sm:py-2 rounded-full shadow hover:bg-white"
      >
        ←
      </button>

      {/* RIGHT */}
      <button
        onClick={next}
        className="absolute right-2 text-black sm:right-3 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur px-2 sm:px-3 py-1 sm:py-2 rounded-full shadow hover:bg-white"
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
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center mb-10 sm:mb-12">
          <div>
            <p className="text-xs sm:text-sm tracking-widest text-gray-500 uppercase mb-2">
              Vision & Mission
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
             Our{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-sky-600">
                Values
              </span>
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <p className="text-gray-600 max-w-md text-sm sm:text-base">
             The principles that guide our every step in achieving our vision and mission
            </p>
          </div>
        </div>

        {/* MAIN */}
        <div className="grid md:grid-cols-2 gap-6 items-center overflow-hidden">

          {/* FIX: penting banget */}
          <div className="min-w-0">
            <ImageSlider />
          </div>

          {/* CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">

            <div className="bg-cyan-600 text-white p-6 sm:p-8 shadow-lg flex flex-col justify-between hover:scale-[1.02] transition">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3">
                  Integrity
                </h3>
                <div className="w-8 h-1 bg-white mb-4"></div>
                <p className="text-sm text-blue-100">
                  Carry out commitments with full honesty, transparency and responsibility.
                </p>
              </div>
              <div className="text-right text-xl mt-6">↗</div>
            </div>

            <div className="bg-white p-6 sm:p-8 shadow-sm hover:bg-cyan-600 text-gray-600 hover:text-white border border-gray-300 duration-400 hover:shadow-md transition flex flex-col justify-between">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3 text-gray-900">
                  Creativity
                </h3>
                <div className="w-8 h-1 bg-red-500 mb-4"></div>
                <p className="text-sm ">
                  Turning creative ideas into innovative solutions to address every challenge.
                </p>
              </div>
              <div className="text-right text-xl mt-6">↗</div>
            </div>

            <div className="bg-gray-200 p-6 sm:p-8 flex flex-col justify-between opacity-70 hover:opacity-100 transition sm:col-span-2">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3 text-gray-800">
                  Sosial Impact
                </h3>
                <div className="w-8 h-1 bg-pink-400 mb-4"></div>
                <p className="text-sm text-gray-800">
                  Committed to providing positive benefits to the environment through each of our programs.
                </p>
              </div>
              <div className="text-right text-xl mt-6 text-gray-500">↗</div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}