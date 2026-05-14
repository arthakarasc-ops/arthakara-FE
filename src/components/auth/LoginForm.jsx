"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useAuth } from "@/components/context/AuthContext";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { login } = useAuth();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Pre-fill email dari registrasi
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }

    // Tampilkan success message dari registrasi
    const message = searchParams.get("message");
    if (message === "registrasi_sukses") {
      setSuccessMessage("Registrasi berhasil! Silakan login dengan akun Anda.");
    }
  }, [searchParams]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || "Login gagal. Silakan coba lagi.");
      setIsLoading(false);
    }
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
            Welcome back.
          </h1>
          <p className="text-zinc-500 font-light text-sm sm:text-base">
            Masuk ke akun Arthakara Anda
          </p>
        </div>

        {/* Form Container */}
        <div className="mt-10">
          {successMessage && (
            <div className="mb-8 p-4 bg-zinc-50 border-l-2 border-emerald-500">
              <p className="text-emerald-700 text-sm font-medium tracking-wide">{successMessage}</p>
            </div>
          )}
          {error && (
            <div className="mb-8 p-4 bg-zinc-50 border-l-2 border-red-500">
              <p className="text-red-700 text-sm font-medium tracking-wide">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-8">
            
            {/* Email Input */}
            <div className="relative group">
              <label htmlFor="email" className="block text-xs uppercase tracking-widest text-zinc-400 font-semibold mb-2 transition-colors group-focus-within:text-cyan-600">
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

            {/* Password Input */}
            <div className="relative group">
              <div className="flex justify-between items-end mb-2">
                <label htmlFor="password" className="block text-xs uppercase tracking-widest text-zinc-400 font-semibold transition-colors group-focus-within:text-cyan-600">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-zinc-400 hover:text-cyan-600 transition-colors"
                >
                  Lupa password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            {/* Remember */}
            <div className="flex items-center pt-2">
              <label className="flex items-center text-zinc-500 cursor-pointer group">
                <div className="relative flex items-center justify-center w-4 h-4 mr-3 border border-zinc-300 group-hover:border-cyan-600 transition-colors">
                  <input
                    type="checkbox"
                    className="absolute opacity-0 w-full h-full cursor-pointer peer"
                  />
                  <div className="w-2 h-2 bg-cyan-600 opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                </div>
                <span className="text-sm font-light group-hover:text-cyan-600 transition-colors">Tetap masuk</span>
              </label>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 mt-4 bg-cyan-600 text-white text-xs uppercase tracking-widest font-semibold hover:bg-cyan-700 active:scale-[0.98] disabled:bg-zinc-200 disabled:text-zinc-400 disabled:scale-100 transition-all duration-300"
            >
              {isLoading ? "Authenticating..." : "Sign In"}
            </button>

          </form>

          {/* Sign Up Link */}
          <div className="mt-12 text-center">
            <p className="text-zinc-500 text-sm font-light">
              Belum punya akun?{" "}
              <Link
                href="/signup"
                className="text-cyan-600 font-medium hover:underline decoration-1 underline-offset-4 transition-all"
              >
                Buat Akun
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
