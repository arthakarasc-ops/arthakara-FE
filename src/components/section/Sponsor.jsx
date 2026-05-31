export default function Sponsor() {
  const sponsors = [
    { name: 'Starbucks', logo: '/image/Starbucks.png', imgClass: 'h-14 md:h-20' },
    { name: 'PGI', logo: '/image/pgi.png', imgClass: 'h-12 md:h-18' },
    { name: 'Kolese Loyola', logo: '/image/loyola-logo.png', imgClass: 'h-16 md:h-24' }
  ];

  return (
    <section className="pt-12 pb-20 md:pt-16 md:pb-28 bg-[#faebd7]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-10 md:mb-16">
          <p className="text-sm tracking-widest text-slate-500 uppercase mb-3 font-semibold">
            Partners & Sponsors
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            Supported By
          </h2>
          <div className="w-16 h-1 bg-cyan-600 mx-auto mt-6 rounded-full"></div>
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-24">
          {sponsors.map((sponsor, index) => (
            <div 
              key={index} 
              className="group flex items-center justify-center transition-all duration-500"
            >
              <img 
                src={sponsor.logo} 
                alt={sponsor.name} 
                className={`object-contain ${sponsor.imgClass}`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
