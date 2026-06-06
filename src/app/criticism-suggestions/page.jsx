"use client";

import { useState } from "react";
import Navbar from "@/components/ui/Navbar";
import { Star, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CriticismPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    rating: 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.rating === 0) {
      alert("Mohon berikan rating bintang terlebih dahulu!");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("https://formspree.io/f/mykaknpk", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setIsSuccess(true);
      } else {
        alert("Maaf, terjadi kesalahan saat mengirim. Silakan coba lagi.");
      }
    } catch (error) {
      alert("Terjadi masalah koneksi. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setFormData({ name: "", email: "", phone: "", message: "", rating: 0 });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-teal-700 to-cyan-500 font-sans overflow-x-hidden flex flex-col justify-between">
    <Navbar />
    <section className="py-20 mt-12 bg-slate-50 min-h-screen">
      <div className="max-w-2xl mx-auto px-6">
        {isSuccess ? (
          // Tampilan Sukses
          <div className="bg-white p-12 rounded-3xl shadow-sm border border-slate-100 text-center animate-in fade-in duration-500">
            <div className="text-6xl mb-6">✅</div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Terima Kasih!</h2>
            <p className="text-slate-600 mb-8">Masukan Anda sangat berharga bagi perkembangan Arthakara.</p>
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={handleReset}
                className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-cyan-600 transition-all"
                >
                Kirim Masukan Lain
              </button>
              <Link href="/" className="w-full text-slate-600 py-3 font-medium hover:text-slate-900 transition-colors">
                ← Kembali ke Halaman Utama
              </Link>
            </div>
          </div>
        ) : (
          // Tampilan Form
          <>
            <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-all mb-6 font-medium">
              <ArrowLeft size={20} />
              Kembali
            </Link>

            <h1 className="text-4xl font-bold text-slate-900 mb-2">Criticism & Suggestions</h1>
            <p className="text-slate-600 mb-10">Kami menghargai masukan Anda untuk perkembangan Arthakara.</p>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">Berikan Penilaian</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                    type="button"
                    key={star}
                    onClick={() => setFormData({ ...formData, rating: star })}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        size={32}
                        className={`transition-colors ${
                          (hoveredRating || formData.rating) >= star
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-slate-300"
                        }`}
                        />
                    </button>
                  ))}
                </div>
              </div>

              {/* Nama */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Nama</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  placeholder="Masukkan nama Anda"
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none text-slate-900 placeholder:text-slate-300 transition-all"
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
              </div>

              {/* Email & Telp */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    placeholder="email@example.com"
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none text-slate-900 placeholder:text-slate-300 transition-all"
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">No. Telp</label>
                  <input
                    required
                    type="tel"
                    value={formData.phone}
                    placeholder="08123456789"
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none text-slate-900 placeholder:text-slate-300 transition-all"
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                </div>
              </div>

              {/* Kritik & Saran */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Kritik & Saran</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  placeholder="Tuliskan masukan Anda di sini..."
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none text-slate-900 placeholder:text-slate-300 transition-all"
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 rounded-xl font-bold transition-all ${
                  isSubmitting ? "bg-slate-400 cursor-not-allowed" : "bg-slate-900 text-white hover:bg-cyan-600"
                }`}
                >
                {isSubmitting ? "Mengirim..." : "Kirim Masukan"}
              </button>
            </form>
          </>
        )}
      </div>
    </section>
    </main>
  );
}