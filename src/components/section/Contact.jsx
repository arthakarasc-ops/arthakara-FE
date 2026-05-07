import { Mail, MapPin, Instagram, MessageCircle, Phone } from 'lucide-react';

const logo = "/logo.png";

export default function Contact() {
  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Contact Us
          </h2>
          <p className="text-slate-600 text-lg">
            Have questions or want to collaborate? Our team is ready to respond via WhatsApp or email.
          </p>
        </div>

        <div className="grid md:grid-cols-12 gap-12 lg:gap-20">
          
          {/* Left: Contact Details (WA moved here) */}
          <div className="md:col-span-5 space-y-10">
            {[
              { icon: MessageCircle, title: "WhatsApp Business", value: "+62 877-8448-8639", link: "https://wa.me/6287784488639" },
              { icon: Mail, title: "Email", value: "arthakarasc@gmail.com", link: "mailto:arthakarasc@gmail.com" },
              { icon: MapPin, title: "Location", value: "SMA Kolese Loyola, Semarang, Central Java", link: "https://maps.app.goo.gl/Xy75i8tQ3MEtFDrj9" }
            ].map((item, idx) => (
              <div key={idx} className="flex gap-5 group">
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white transition-all duration-300">
                  <item.icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">{item.title}</h4>
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-lg font-medium text-slate-800 hover:text-cyan-600 transition-colors">
                    {item.value}
                  </a>
                </div>
              </div>
            ))}

            <div className="flex flex-row gap-4">
  {/* Akun Instagram 1 */}
  <a 
    href="https://www.instagram.com/arthakara.sc?igsh=MWFxYm0xNzdwZ3BvZQ==" 
    target="_blank" 
    rel="noopener noreferrer"
    className="flex items-center gap-3 px-5 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-cyan-600 hover:text-white transition-all"
  >
    <Instagram className="w-5 h-5" />
    <span className="font-semibold text-sm">@arthakara.sc</span>
  </a>

  {/* Akun Instagram 2 */}
  <a 
    href="https://www.instagram.com/arvena.care?igsh=MTRpbXk1eHM4dHQxZg==" 
    target="_blank" 
    rel="noopener noreferrer"
    className="flex items-center gap-3 px-5 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-cyan-600 hover:text-white transition-all"
  >
    <Instagram className="w-5 h-5" />
    <span className="font-semibold text-sm">@arvena.care</span>
  </a>
</div>
          </div>

          {/* Right: Contact Form */}
          <div className="md:col-span-7 bg-slate-50 p-8 md:p-10 rounded-3xl border border-slate-100">
            <form className="space-y-6">
  <div className="grid sm:grid-cols-2 gap-6">
    <input 
      type="text" 
      placeholder="Full name" 
      className="w-full bg-white border border-slate-300 px-5 py-3 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none transition-all placeholder:text-slate-600 placeholder:font-medium text-slate-800" 
    />
    <input 
      type="Email" 
      placeholder="Email Anda" 
      className="w-full bg-white border border-slate-300 px-5 py-3 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none transition-all placeholder:text-slate-600 placeholder:font-medium text-slate-800" 
    />
  </div>
  <textarea 
    rows={4} 
    placeholder="Your message..." 
    className="w-full bg-white border border-slate-300 px-5 py-3 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none transition-all resize-none placeholder:text-slate-600 placeholder:font-medium text-slate-800"
  ></textarea>
  <button className="w-full bg-slate-900 text-white font-semibold py-4 rounded-xl hover:bg-cyan-600 transition-all active:scale-[0.98]">
    Send message
  </button>
</form>
          </div>
        </div>
      </div>

      <footer className="mt-24 pt-12 border-t border-slate-100 text-center text-slate-400 text-sm">
        <p>© {new Date().getFullYear()} Arthakara Student Company. All rights reserved.</p>
      </footer>
    </section>
  );
}