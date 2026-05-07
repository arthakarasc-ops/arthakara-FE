'use client';
  import React, { useState } from 'react';
  import Image from 'next/image';
  import { Swiper, SwiperSlide } from 'swiper/react';
  import { Autoplay, EffectCoverflow } from 'swiper/modules';
  import { ArrowRight } from 'lucide-react'; // Ikon panah baru

  import 'swiper/css';
  import 'swiper/css/effect-coverflow';

  const TeamCarousel = () => {
    const divisions = {
      directors: {
        name: "Board of Directors",
        desc: "Tim pimpinan eksekutif yang mengarahkan visi dan strategi Arthakara.",
        members: [
          { name: "Matthew", fullName: "Matthew Edsel A.", role: "CEO", photo: "/image/Matthew E - CEO.jpg", bio: "Always look up, don't get too complacent with who you are right now. There will always be someone above us, so keep looking up and never let yourself become arrogant." },
          { name: "Felicia", fullName: "Felicia Tan", role: "Director of Sales", photo: "/image/Felicia - Director of Sales.jpg", bio: "Success is not final, failure is not fatal." },
          { name: "Revi", fullName: "Avrilya Revi L.", role: "Director of Production", photo: "/image/Revi - Director of Production.jpg", bio: "Love ought to show itself in deeds." },
          { name: "Vino", fullName: "Vino Leornado", role: "Director of Finance", photo: "/image/Vino - Director of Finance.jpg", bio: "Dream big, start with small steps." },
          { name: "Adrienne", fullName: "Emanuella Adrienne", role: "Director of Marketing", photo: "/image/Adrienne - Mrk.jpg", bio: "Stop wishing, just do it." },
          { name: "Miranda", fullName: "Miranda Debora S.", role: "Director of PR", photo: "/image/Miranda - Director of PR.png", bio: "The grass is sometimes greener because it is fake." },
          { name: "Nasha", fullName: "Angela Novenasha G.", role: "Director of HRD", photo: "/image/Nasha - HRD.jpg", bio: "Speak softly and carry a big stick." },
          { name: "Kinan", fullName: "Agata Kinantya A.", role: "Secretary",  photo: "/image/Kinan - Secre.jpg", bio: "Believe in yourself. Do this and wherever you are you'll have nothing to fear" }
        ]
      },
      sales: {
        name: "Sales",
        desc: "Tim yang fokus pada strategi penjualan dan ekspansi pasar.",
        members: [
          { name: "Felicia", fullName: "Felicia Tan", role: "Director of Sales", photo: "/image/Felicia - Director of Sales.jpg", bio: "Success is not final, failure is not fatal." },
          { name: "Freya", fullName: "Freya Georgia S.", role: "Sales & Inventory Manager", photo: "/image/Freya - Sales & Inventory Manager.jpg", bio: "Even strength must bow down to wisdom." },
          { name: "Kayleen", fullName: "Kayleen Joan T.", role: "Sales & Inventory Manager", photo: "/image/Kayleen - Sales & Inventory Manager.jpg", bio: "Every day is a new chance." },
          { name: "Steve", fullName: "Steve Cassius W.", role: "Sales & Inventory Manager", photo: "/image/Steve - Sales & Inventory Manager.jpg", bio: "Bloom slowly, flowers don't rush." }
        ]
      },
      production: {
        name: "Production",
        desc: "Mengubah ide menjadi produk nyata dengan standar tinggi.",
        members: [
          { name: "Revi", fullName: "Avrilya Revi L.", role: "Director of Production", photo: "/image/Revi - Director of Production.jpg", bio: "Love ought to show itself in deeds." },
          { name: "Cheryl", fullName: "Cheryl Ashley T.", role: "Production Manager", photo: "/image/Cheryl - production manager.jpg", bio: "If you knew you were 100 rejections away from your dream." },
          { name: "Erika", fullName: "Erika Nathania S.", role: "RND Manager", photo: "/image/Erika - RND Manager.jpg", bio: "Fokus pada kemajuan, bukan kesempurnaan." },
          { name: "Brenda", fullName: "Brenda Gracia M. T.", role: "QC Manager", photo: "/image/Brenda - QC Manager.jpg", bio: "A lighter heart begins with letting go." },
          { name: "Laras", fullName: "Priyanka Larasati S.", role: "Purchasing Manager", photo: "/image/Laras - purchasing manager.jpg", bio: "Recycle today for tomorrow." },
          { name: "Raras", fullName: "Sekar Raras P.", role: "Purchasing Manager", photo: "/image/Raras - purchasing manager.jpg", bio: "Don't let anyone tell you that you can't." }
        ]
      },
      finance: {
        name: "Finance",
        desc: "Mengelola stabilitas keuangan dan investasi strategis.",
        members: [
          { name: "Vino", fullName: "Vino Leornado", role: "Director of Finance", photo: "/image/Vino - Director of Finance.jpg" , bio: "Dream big, start with small steps." },
          { name: "Khalfano", fullName: "Khalfano Lazuardi G.", role: "Finance Manager", photo: "/image/Khalfano - Finance Manager.jpg", bio: "Sometimes life is like the sea." }
        ]
      },
      marketing: {
        name: "Marketing",
        desc: "Pengembangan brand dan komunikasi pemasaran kreatif.",
        members: [
          { name: "Adrienne", fullName: "Emanuella Adrienne", role: "Director of Marketing", photo: "/image/Adrienne - Mrk.jpg", bio: "Stop wishing, just do it." },
          { name: "Davis", fullName: "Kurniawan Davis M.", role: "Market Research", photo: "/image/Davis - market research.jpg", bio: "Kemarin adalah sejarah, hari ini misteri." },
          { name: "Marvel", fullName: "Marvellino Winatajaya", role: "Brand Manager", photo: "/image/Marvel - brand manager.jpg", bio: "Be led by the dreams in your heart." },
          { name: "Stefano", fullName: "Stefano Theodore B.", role: "Creative Design", photo: "/image/Stefano - Creative Design.jpg", bio: "Repetisi membangun reputasi." },
          { name: "Matthew", fullName: "Matthew Sudharsono", role: "Creative Design", photo: "/image/Matthew S - brand manager.jpg", bio: "It is better to shoot and miss." },
          { name: "Griffint", fullName: "Griffint Imanuel P.", role: "Event Manager", photo: "/image/Griffint - event manager.jpg", bio: "Kesuksesan adalah hasil dari belajar." }
        ]
      },
      pr: {
        name: "Public Relations",
        desc: "Membangun hubungan harmonis antara perusahaan dan publik.",
        members: [
          { name: "Miranda", fullName: "Miranda Debora S.", role: "Director of PR", photo: "/image/Miranda - Director of PR.png", bio: "The grass is sometimes greener because it is fake." },
          { name: "Felice", fullName: "Eleonora Felicia P. S.", role: "PR Manager", photo: "/image/Felice - PR Manager.jpg", bio: "Trust the process." },
          { name: "Jessy", fullName: "Gabriella Jessyca S.", role: "PR Manager", photo: "/image/Jessy - PR Manager.jpg", bio: "There is nothing either good or bad." },
          { name: "Yuna", fullName: "Gracia Yuna N.", role: "CSR Manager", photo: "/image/Yuna - CSR Manager.jpg", bio: "Belajar adalah perjalanan penuh peluang." },
          { name: "Gracia", fullName: "Gracia Victoria H.", role: "CSR Manager", photo: "/image/Gracia - CSR Manager.jpg", bio: "Keep going, you'll get there." }
        ]
      },
      hrd: {
        name: "HRD",
        desc: "Mengembangkan potensi SDM dan kultur perusahaan.",
        members: [
          { name: "Nasha", fullName: "Angela Novenasha G.", role: "Director of HRD", photo: "/image/Nasha - HRD.jpg", bio: "Speak softly and carry a big stick." },
          { name: "Jessica", fullName: "Jessica Chie S.", role: "Attendance & Payroll", photo: "/image/Jessica - attendance & payroll.jpg", bio: "Don't wish for it, work for it." },
          { name: "Cindy", fullName: "Cindy Fabiola K.", role: "Training & Development", photo: "/image/Cindy - training & development.jpg", bio: "Tetap Semangat." },
          { name: "Jevera", fullName: "Matthew Jevera", role: "Training & Development", photo: "/image/Jevera - training & development.jpg", bio: "Dream big, work hard." }
        ]
      }
    };

    const [activeTab, setActiveTab] = useState('directors');
    const [selectedBio, setSelectedBio] = useState(null);

    return (
    <section className="py-20 bg-white" id='ourteam'>
      <div className="max-w-6xl pt-12 mx-auto px-6">
        <div className="bg-black p-10 md:p-14 rounded-[2.5rem] shadow-2xl">
          {/* HEADER */}
          <div className="text-center mb-10">
            <span className="text-[25px] font-bold text-white/70 uppercase tracking-[0.3em]">
              Who We Are
            </span>
            <div className="w-10 h-[1px] bg-gray-700 mx-auto mt-3"></div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="md:w-2/5 text-left">
              <h2 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-tighter">
                {divisions[activeTab].name}
              </h2>
              <p className="text-gray-400 mt-5 text-sm md:text-base leading-relaxed">
                {divisions[activeTab].desc}
              </p>
            </div>

            {/* CAROUSEL CONTAINER */}
            <div className="md:w-3/5 w-full h-[260px] flex items-center overflow-hidden">
              <Swiper
                key={activeTab}
                effect={'coverflow'}
                grabCursor={true}
                centeredSlides={true}
                slidesPerView={'auto'}
                loop={true}
                autoplay={{ delay: 2000, disableOnInteraction: false }}
                coverflowEffect={{
                  rotate: 0,
                  stretch: 25,
                  depth: 250,
                  modifier: 1,
                  slideShadows: false,
                }}
                modules={[EffectCoverflow, Autoplay]}
                className="myCoverflowSwiper w-full"
              >
                {/* Kita gunakan flatMap untuk menduplikasi data agar loop selalu jalan tanpa error */}
                {Array.from({ length: 4 }).flatMap(() => divisions[activeTab].members).map((member, i) => (
                  <SwiperSlide key={`${member.fullName}-${i}`} className="!w-[180px] px-2">
                    <div className="h-[260px] rounded-[1rem] overflow-hidden bg-gray-800 border border-gray-700 relative group">
                      <Image src={member.photo} alt={member.name} fill className="object-cover object-center" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                      <div className="absolute bottom-0 p-4 w-full flex justify-between items-end">
                        <div className="overflow-hidden">
                          <h3 className="font-bold text-xs text-white truncate">{member.name}</h3>
                          <p className="text-[10px] text-gray-400 truncate">{member.role}</p>
                        </div>
                        <button 
                          onClick={() => setSelectedBio(member)}
                          className="bg-white text-black p-2 rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg"
                        >
                          <ArrowRight size={12} strokeWidth={3} />
                        </button>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mt-10 pt-8 border-t border-gray-800">
            {Object.keys(divisions).map((key) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-4 py-2 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wide transition-all ${
                  activeTab === key ? 'bg-white text-black' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {divisions[key].name}
              </button>
            ))}
          </div>
        </div>

        {/* MODAL BIO */}
        {selectedBio && (
          <div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all" 
            onClick={() => setSelectedBio(null)}
          >
            <div 
              className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl relative animate-in fade-in zoom-in duration-300" 
              onClick={e => e.stopPropagation()}
            >
              <button onClick={() => setSelectedBio(null)} className="absolute top-5 right-5 text-gray-400 hover:text-black transition">✕</button>
              <h3 className="text-2xl font-bold text-black tracking-tight">{selectedBio.fullName}</h3>
              <p className="text-blue-600 text-xs font-bold uppercase tracking-wider mb-4">{selectedBio.role}</p>
              <div className="w-full h-[1px] bg-gray-100 mb-5"></div>
              <p className="text-gray-700 italic text-sm leading-relaxed">"{selectedBio.bio}"</p>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        .myCoverflowSwiper { padding: 40px 0; }
        @media (max-width: 768px) { .myCoverflowSwiper { padding: 20px 0; } }
      `}</style>
    </section>
  );
} 
export default TeamCarousel; 