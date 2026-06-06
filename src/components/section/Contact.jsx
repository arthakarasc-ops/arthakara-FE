import { Mail, MapPin, Instagram, MessageCircle } from 'lucide-react';

export default function Contact() {
  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Contact Us
          </h2>
          <p className="text-slate-600 text-lg max-w-xl">
            Have questions or want to collaborate? Our team is ready to respond via WhatsApp or email.
          </p>
        </div>

        {/* Layout Grid: 2 Kolom untuk Desktop */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-24 items-start">
          
          {/* Kolom Kiri: Informasi Kontak */}
          <div className="space-y-10">
            {[
              { icon: MessageCircle, title: "Contact me", value: "+62 877-8448-8639", link: "https://wa.me/6287784488639" },
              { icon: Mail, title: "E-Mail", value: "arthakarasc@gmail.com", link: "mailto:arthakarasc@gmail.com" },
              { icon: MapPin, title: "Location", value: "SMA Kolese Loyola, Semarang", link: "https://www.google.com/maps/search/SMA+Kolese+Loyola+Semarang" }
            ].map((item, idx) => (
              <div key={idx} className="flex gap-5 group">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white transition-all duration-300 shadow-sm">
                  <item.icon className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{item.title}</h4>
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-lg md:text-xl font-medium text-slate-800 hover:text-cyan-600 transition-colors">
                    {item.value}
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Kolom Kanan: Sosmed & Aksen Visual */}
          <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
            <h3 className="text-xl font-bold text-slate-800 mb-6">Follow Us</h3>
            <div className="flex flex-col gap-4">
              {/* Instagram 1 */}
            <a 
              href="https://www.instagram.com/arthakara.sc" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl hover:border-cyan-600 hover:shadow-md transition-all group"
            >
              <Instagram className="w-6 h-6 text-cyan-600" />
              <span className="font-bold text-slate-900">@arthakara.sc</span>
            </a>

            {/* Instagram 2 */}
            <a 
              href="https://www.instagram.com/arvena.care" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl hover:border-cyan-600 hover:shadow-md transition-all group"
            >
              <Instagram className="w-6 h-6 text-cyan-600" />
              <span className="font-bold text-slate-900">@arvena.care</span>
            </a>
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-24 pt-12 border-t border-slate-100 text-center text-slate-400 text-sm">
        <p>© {new Date().getFullYear()} Arthakara Student Company. All rights reserved.</p>
      </footer>
    </section>
  );
}