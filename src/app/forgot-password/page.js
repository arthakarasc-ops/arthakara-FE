"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/components/context/AuthContext"; // 1. Mengaktifkan kembali impor context

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const { resetPassword } = useAuth(); // 2. Mengaktifkan kembali fungsi dari context

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validasi Format Email (.com)
    const emailRegex = /^[^\s@]+@[^\s@]+\.com$/;
    if (!emailRegex.test(email)) {
      setError("Email harus menggunakan format @ dan .com");
      setIsLoading(false);
      return;
    }

    try {
      // 3. MENEMBAK API ASLI: Mengirim email nyata ke rute baru backend cPanel
      await resetPassword(email);
      
      setIsSubmitted(true);
    } catch (err) {
      setError(err.message || "Gagal mengirim permintaan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="w-full max-w-md space-y-10">
        
        {/* Header */}
        <div className="text-center">
          <Link 
            href="/login" 
            className="inline-flex items-center text-xs uppercase tracking-widest text-zinc-400 hover:text-cyan-600 mb-10 transition-colors duration-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Login
          </Link>
          
          <h1 className="text-4xl sm:text-5xl tracking-tighter font-light text-zinc-900 mb-3">
            Reset password.
          </h1>
          <p className="text-zinc-500 font-light text-sm sm:text-base">
            {isSubmitted 
              ? "Instruksi pemulihan telah dikirim" 
              : "Masukkan email untuk mengatur ulang password Anda"
            }
          </p>
        </div>

        {/* Form & Tampilan Status */}
        <div className="mt-10">
          {error && (
            <div className="mb-8 p-4 bg-zinc-50 border-l-2 border-red-500">
              <p className="text-red-700 text-sm font-medium tracking-wide">{error}</p>
            </div>
          )}

          {!isSubmitted ? (
            <form onSubmit={handleForgotPassword} className="space-y-8">
              
              {/* Email Input */}
              <div className="relative group">
                <label 
                  htmlFor="email" 
                  className="block text-xs uppercase tracking-widest text-zinc-400 font-semibold mb-2 transition-colors group-focus-within:text-cyan-600"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border-0 border-b border-zinc-200 py-3 px-0 text-zinc-900 focus:ring-0 focus:border-cyan-600 outline-none focus:outline-none transition-colors placeholder-zinc-300 text-base"
                  placeholder="hello@example.com"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 mt-4 bg-cyan-600 text-white text-xs uppercase tracking-widest font-semibold hover:bg-cyan-700 active:scale-[0.98] disabled:bg-zinc-200 disabled:text-zinc-400 disabled:scale-100 transition-all duration-300"
              >
                {isLoading ? "Sending Link..." : "Send Reset Link"}
              </button>

            </form>
          ) : (
            /* Tampilan Sukses (State ketika email berhasil dikirim) */
            <div className="space-y-8 text-center animate-fade-in">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 mb-2">
                <CheckCircle2 className="w-6 h-6 stroke-[1.5]" />
              </div>
              
              <div className="bg-zinc-50 p-6 border border-zinc-100 space-y-3">
                <p className="text-sm text-zinc-600 font-light leading-relaxed">
                  Kami telah mengirimkan tautan pengaturan ulang password ke alamat email:
                </p>
                <p className="text-sm font-medium text-zinc-900 break-all">
                  {email}
                </p>
                <p className="text-xs text-zinc-400 pt-2 font-light">
                  Silakan periksa kotak masuk atau folder spam email Anda dalam beberapa menit ke depan.
                </p>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="text-xs uppercase tracking-widest text-zinc-400 hover:text-cyan-600 font-semibold transition-colors"
                >
                  Gunakan email lain
                </button>
              </div>
            </div>
          )}

          {/* Footer Tambahan */}
          <div className="mt-12 text-center border-t border-zinc-100 pt-8">
            <p className="text-xs font-light text-zinc-400">
              Butuh bantuan lebih lanjut? Hubungi tim IT support Arthakara.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}