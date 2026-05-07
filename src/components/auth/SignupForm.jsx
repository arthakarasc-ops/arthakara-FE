"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Eye, EyeOff, ArrowLeft, Phone } from "lucide-react";
import { useAuth } from "@/components/context/AuthContext";

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { register } = useAuth();
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;

    // KHUSUS PHONE: hanya angka
    if (name === "phone") {
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

    // VALIDASI EMAIL
    const emailRegex = /^[^\s@]+@[^\s@]+\.com$/;
    if (!emailRegex.test(formData.email)) {
      setError("Email harus menggunakan format @ dan .com");
      return;
    }

    // VALIDASI NOMOR TELEPON
    const phoneRegex = /^[0-9]+$/;
    if (!phoneRegex.test(formData.phone)) {
      setError("Nomor telepon hanya boleh angka");
      return;
    }

    // VALIDASI PASSWORD
    if (formData.password.length < 8 || formData.password.length > 12) {
      setError("Password harus 8 - 12 karakter");
      return;
    }

    // VALIDASI CONFIRM PASSWORD
    if (formData.password !== formData.confirmPassword) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-sky-50 flex items-center justify-center pt-20 pb-8 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center text-cyan-600 hover:text-cyan-700 mb-6 transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Kembali ke Beranda
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
            Buat Akun
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Bergabunglah dengan Arthakara hari ini
          </p>
        </div>

        {/* Signup Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}
          <form onSubmit={handleSignup} className="space-y-4 sm:space-y-5">

            {/* Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                Nama Lengkap
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 text-black py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition-all text-sm sm:text-base"
                  placeholder="Nama Anda"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  pattern="^[^\s@]+@[^\s@]+\.com$"
                  className="w-full pl-12 pr-4 py-3 border text-gray-600 border-gray-200 rounded-xl focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition-all text-sm sm:text-base"
                  placeholder="email@example.com"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                Nomor Telepon
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="w-full pl-12 pr-4 py-3 text-gray-600 border border-gray-200 rounded-xl focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition-all text-sm sm:text-base"
                  placeholder="+62 8xx xxxx xxxx"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  minLength={8}
                  maxLength={12}
                  className="w-full pl-12 text-gray-700 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition-all text-sm sm:text-base"
                  placeholder="••••••••"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                Konfirmasi Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  minLength={8}
                  maxLength={12}
                  className="w-full pl-12 text-gray-700 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition-all text-sm sm:text-base"
                  placeholder="••••••••"
                  required
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start text-gray-600 cursor-pointer text-xs sm:text-sm">
              <input type="checkbox" className="w-4 h-4 mt-1 accent-cyan-600" required />
              <span className="ml-2">
                Saya setuju dengan <Link href="#" className="text-cyan-600">Syarat & Ketentuan</Link>
              </span>
            </label>

            {/* Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-sky-500 text-white font-semibold rounded-xl mt-6"
            >
              {isLoading ? "Sedang mendaftar..." : "Buat Akun"}
            </button>
          </form>

          <p className="text-center text-gray-600 text-sm mt-8">
            Sudah punya akun? <Link href="/login" className="text-cyan-600 font-semibold">Masuk di sini</Link>
          </p>
        </div>

        <p className="text-center text-gray-500 text-xs mt-6">
          Kami tidak akan pernah membagikan data Anda kepada pihak ketiga
        </p>
      </div>
    </div>
  );
}