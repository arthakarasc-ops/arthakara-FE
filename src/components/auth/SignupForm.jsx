"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Eye, EyeOff, ArrowLeft, Phone, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/components/context/AuthContext";

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    nickname: "",
    email: "",
    phone_number: "",
    password: "",
    password_confirmation: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // STATE BARU UNTUK KEBUTUHAN ALUR POP-UP
  const [isTermsOpen, setIsTermsOpen] = useState(false); // Buka-tutup pop-up
  const [hasAgreed, setHasAgreed] = useState(false);   // Status persetujuan user

  const { register } = useAuth();
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;

    // KHUSUS PHONE: hanya angka
    if (name === "phone_number") {
      const onlyNumbers = value.replace(/[^0-9]/g, "");
      setFormData(prev => ({
        ...prev,
        [name]: onlyNumbers
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    // VALIDASI TAMBAHAN: Cegah submit lewat Enter jika belum setuju
    if (!hasAgreed) {
      setError("Anda harus membaca dan menyetujui Syarat & Ketentuan terlebih dahulu.");
      return;
    }

    // VALIDASI EMAIL
    const emailRegex = /^[^\s@]+@[^\s@]+\.com$/;
    if (!emailRegex.test(formData.email)) {
      setError("Email harus menggunakan format @ dan .com");
      return;
    }

    // VALIDASI NOMOR TELEPON
    const phoneRegex = /^[0-9]+$/;
    if (!phoneRegex.test(formData.phone_number)) {
      setError("Nomor telepon hanya boleh angka");
      return;
    }

    // VALIDASI PASSWORD
    if (formData.password.length < 1) {
      setError("Password harus diisi");
      return;
    }

    // VALIDASI CONFIRM PASSWORD
    if (formData.password !== formData.password_confirmation) {
      setError("Password tidak cocok!");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await register(formData);
      router.push(`/login?email=${encodeURIComponent(formData.email)}&message=registrasi_sukses`);
    } catch (err) {
      setError(err.message || "Pendaftaran gagal. Silakan coba lagi.");
      setIsLoading(false);
    }
  };

  // Fungsi saat user klik "Saya Setuju" di dalam pop-up
  const handleAcceptTerms = () => {
    setHasAgreed(true);
    setIsTermsOpen(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="w-full max-w-md space-y-10">
        
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center text-xs uppercase tracking-widest text-zinc-400 hover:text-cyan-600 mb-10 transition-colors duration-300">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Link>
          <h1 className="text-4xl sm:text-5xl tracking-tighter font-light text-zinc-900 mb-3">
            Create account.
          </h1>
          <p className="text-zinc-500 font-light text-sm sm:text-base">
            Bergabunglah dengan Arthakara hari ini
          </p>
        </div>

        {/* Form Container */}
        <div className="mt-10">
          {error && (
            <div className="mb-8 p-4 bg-zinc-50 border-l-2 border-red-500">
              <p className="text-red-700 text-sm font-medium tracking-wide">{error}</p>
            </div>
          )}
          <form onSubmit={handleSignup} className="space-y-8">
            
            {/* Name Input */}
            <div className="relative group">
              <label className="block text-xs uppercase tracking-widest text-zinc-400 font-semibold mb-2 transition-colors group-focus-within:text-cyan-600">
                Nama Lengkap
              </label>
              <input
                type="text"
                name="nickname"
                value={formData.nickname}
                onChange={handleChange}
                className="w-full bg-transparent border-0 border-b border-zinc-200 py-3 px-0 text-zinc-900 focus:ring-0 focus:border-cyan-600 outline-none focus:outline-none transition-colors placeholder-zinc-300 text-base"
                placeholder="John Doe"
                required
              />
            </div>

            {/* Email Input */}
            <div className="relative group">
              <label className="block text-xs uppercase tracking-widest text-zinc-400 font-semibold mb-2 transition-colors group-focus-within:text-cyan-600">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                pattern="^[^\s@]+@[^\s@]+\.com$"
                className="w-full bg-transparent border-0 border-b border-zinc-200 py-3 px-0 text-zinc-900 focus:ring-0 focus:border-cyan-600 outline-none focus:outline-none transition-colors placeholder-zinc-300 text-base"
                placeholder="hello@example.com"
                required
              />
            </div>

            {/* Phone Input */}
            <div className="relative group">
              <label className="block text-xs uppercase tracking-widest text-zinc-400 font-semibold mb-2 transition-colors group-focus-within:text-cyan-600">
                Nomor Telepon
              </label>
              <input
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                inputMode="numeric"
                pattern="[0-9]*"
                className="w-full bg-transparent border-0 border-b border-zinc-200 py-3 px-0 text-zinc-900 focus:ring-0 focus:border-cyan-600 outline-none focus:outline-none transition-colors placeholder-zinc-300 text-base"
                placeholder="08123456789"
                required
              />
            </div>

            {/* Password Input */}
            <div className="relative group">
              <label className="block text-xs uppercase tracking-widest text-zinc-400 font-semibold mb-2 transition-colors group-focus-within:text-cyan-600">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-transparent border-0 border-b border-zinc-200 py-3 px-0 text-zinc-900 focus:ring-0 focus:border-cyan-600 outline-none focus:outline-none transition-colors placeholder-zinc-300 text-base"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 text-zinc-300 hover:text-cyan-600 transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div className="relative group">
              <label className="block text-xs uppercase tracking-widest text-zinc-400 font-semibold mb-2 transition-colors group-focus-within:text-cyan-600">
                Konfirmasi Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  className="w-full bg-transparent border-0 border-b border-zinc-200 py-3 px-0 text-zinc-900 focus:ring-0 focus:border-cyan-600 outline-none focus:outline-none transition-colors placeholder-zinc-300 text-base"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 text-zinc-300 hover:text-cyan-600 transition-colors"
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Alur Teks Baru Tanpa Checkbox Bawaan */}
            <div className="pt-2 text-center sm:text-left">
              {hasAgreed ? (
                <div className="inline-flex items-center text-sm text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full font-light">
                  <CheckCircle2 className="w-4 h-4 mr-2 stroke-[2.5]" />
                  Anda telah menyetujui Syarat & Ketentuan.
                </div>
              ) : (
                <p className="text-sm font-light text-zinc-500 leading-relaxed">
                  Sebelum mendaftar, Anda diwajibkan untuk membaca dan menyetujui{" "}
                  <button
                    type="button"
                    onClick={() => setIsTermsOpen(true)}
                    className="font-medium text-cyan-600 underline decoration-1 underline-offset-4 hover:text-cyan-700 transition-colors"
                  >
                    Syarat & Ketentuan
                  </button>{" "}
                  Arthakara.
                </p>
              )}
            </div>

            {/* Tombol Register (Akan aktif kalau hasAgreed bernilai true) */}
            <button
              type="submit"
              disabled={isLoading || !hasAgreed}
              className="w-full py-4 mt-4 bg-cyan-600 text-white text-xs uppercase tracking-widest font-semibold hover:bg-cyan-700 active:scale-[0.98] disabled:bg-zinc-100 disabled:text-zinc-400 disabled:scale-100 transition-all duration-300 border disabled:border-zinc-200"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-12 text-center">
            <p className="text-zinc-500 text-sm font-light">
              Sudah punya akun?{" "}
              <Link
                href="/login"
                className="text-cyan-600 font-medium hover:underline decoration-1 underline-offset-4 transition-all"
              >
                Masuk di sini
              </Link>
            </p>
            <p className="mt-4 text-xs font-light text-zinc-400">
              Kami tidak akan pernah membagikan data Anda kepada pihak ketiga.
            </p>
          </div>
        </div>

      </div>

      {/* POP-UP MODAL SYARAT & KETENTUAN */}
      {isTermsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl border border-zinc-100 transform scale-100 transition-transform">
            
            {/* Header Pop-up */}
            <div className="p-6 border-b border-zinc-100 flex justify-between items-center">
              <h2 className="text-lg font-medium tracking-tight text-zinc-900">Syarat & Ketentuan Arthakara</h2>
              <button 
                type="button" 
                onClick={() => setIsTermsOpen(false)}
                className="text-zinc-400 hover:text-zinc-600 text-xs uppercase tracking-widest font-semibold transition-colors"
              >
                Batal
              </button>
            </div>

            {/* Isi Dokumen (Scrollable) */}
            <div className="p-6 overflow-y-auto space-y-6 text-sm font-light leading-relaxed text-zinc-600">
              <section className="space-y-2">
                <h3 className="text-xs uppercase tracking-widest text-zinc-900 font-semibold">1. Ketentuan Umum</h3>
                <p>Dengan mendaftar dan menggunakan layanan di platform Arthakara, Anda menyatakan bahwa Anda telah membaca, memahami, dan menyetujui seluruh aturan yang tertulis di dalam dokumen ini.</p>
              </section>

              <section className="space-y-2">
                <h3 className="text-xs uppercase tracking-widest text-zinc-900 font-semibold">2. Keamanan Akun</h3>
                <p>Anda bertanggung jawab penuh untuk menjaga kerahasiaan informasi akun Anda, termasuk kata sandi (password). Pihak manajemen tidak bertanggung jawab atas kelalaian pengguna.</p>
              </section>

              <section className="space-y-2">
                <h3 className="text-xs uppercase tracking-widest text-zinc-900 font-semibold">3. Hak Kekayaan Intelektual</h3>
                <p>Seluruh materi, desain produk, logo, teks, grafik, dan sistem coding yang berada di dalam situs Arthakara merupakan hak milik eksklusif dari pihak manajemen Arthakara.</p>
              </section>

              <section className="space-y-2">
                <h3 className="text-xs uppercase tracking-widest text-zinc-900 font-semibold">4. Perubahan Ketentuan</h3>
                <p>Pihak Arthakara berhak untuk mengubah, menambah, atau memperbarui syarat dan ketentuan ini sewaktu-waktu tanpa pemberitahuan tertulis sebelumnya.</p>
              </section>
            </div>

            {/* Footer Pop-up */}
            <div className="p-4 bg-zinc-50 border-t border-zinc-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsTermsOpen(false)}
                className="px-5 py-2 border border-zinc-200 text-zinc-500 text-xs uppercase tracking-widest font-semibold hover:bg-zinc-100 transition-colors"
              >
                Kembali
              </button>
              <button
                type="button"
                onClick={handleAcceptTerms}
                className="px-6 py-2 bg-cyan-600 text-white text-xs uppercase tracking-widest font-semibold hover:bg-cyan-700 transition-colors"
              >
                Saya Setuju
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}