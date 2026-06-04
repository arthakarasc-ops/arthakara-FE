"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Eye, EyeOff, Lock, CheckCircle, RefreshCw } from "lucide-react";
import { forgotPasswordUser, verifyOtpUser, resetPasswordUser } from "@/lib/api";

const STEPS = {
  EMAIL: 1,
  OTP: 2,
  NEW_PASSWORD: 3,
  SUCCESS: 4,
};

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60; // seconds

export default function ForgotPasswordForm() {
  // --- State ---
  const [step, setStep] = useState(STEPS.EMAIL);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const otpRefs = useRef([]);

  // --- Resend Cooldown Timer ---
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // --- OTP Input Handlers ---
  const focusOtpInput = useCallback((index) => {
    if (otpRefs.current[index]) {
      otpRefs.current[index].focus();
    }
  }, []);

  const handleOtpChange = useCallback((index, value) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    setOtp((prev) => {
      const newOtp = [...prev];
      newOtp[index] = value;
      return newOtp;
    });

    // Auto-focus next input
    if (value && index < OTP_LENGTH - 1) {
      focusOtpInput(index + 1);
    }
  }, [focusOtpInput]);

  const handleOtpKeyDown = useCallback((index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      focusOtpInput(index - 1);
    }
    if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      focusOtpInput(index - 1);
    }
    if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      e.preventDefault();
      focusOtpInput(index + 1);
    }
  }, [otp, focusOtpInput]);

  const handleOtpPaste = useCallback((e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    // Only accept 6 digit paste
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setOtp(digits);
      focusOtpInput(OTP_LENGTH - 1);
    }
  }, [focusOtpInput]);

  // --- Step Handlers ---
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { status, data } = await forgotPasswordUser({ email });

      if (status !== 200) {
        throw new Error(data.error || "Gagal mengirim OTP.");
      }

      setStep(STEPS.OTP);
      setResendCooldown(RESEND_COOLDOWN);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setIsLoading(true);
    setError("");

    try {
      const { status, data } = await forgotPasswordUser({ email });

      if (status !== 200) {
        throw new Error(data.error || "Gagal mengirim ulang OTP.");
      }

      setOtp(Array(OTP_LENGTH).fill(""));
      setResendCooldown(RESEND_COOLDOWN);
      focusOtpInput(0);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length !== OTP_LENGTH) {
      setError("Masukkan 6 digit kode OTP.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const { status, data } = await verifyOtpUser({ email, otp: otpString });

      if (status !== 200) {
        throw new Error(data.error || "Kode OTP tidak valid.");
      }

      setStep(STEPS.NEW_PASSWORD);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    if (e) e.preventDefault();

    if (password.length < 8) {
      setError("Password minimal 8 karakter.");
      return;
    }
    if (password !== passwordConfirmation) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const { status, data } = await resetPasswordUser({
        email,
        otp: otp.join(""),
        password,
        password_confirmation: passwordConfirmation,
      });

      if (status !== 200) {
        throw new Error(data.error || "Gagal mereset password.");
      }

      setStep(STEPS.SUCCESS);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Step Progress Indicator ---
  const renderProgressIndicator = () => {
    if (step === STEPS.SUCCESS) return null;

    const steps = [
      { num: 1, label: "Email" },
      { num: 2, label: "Verifikasi" },
      { num: 3, label: "Password Baru" },
    ];

    return (
      <div className="flex items-center justify-center gap-2 mb-10">
        {steps.map((s, i) => (
          <div key={s.num} className="flex items-center gap-2">
            <div
              className={`
                w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold
                transition-all duration-500 ease-out
                ${step >= s.num
                  ? "bg-cyan-600 text-white scale-100"
                  : "bg-zinc-100 text-zinc-400 scale-95"
                }
              `}
            >
              {step > s.num ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                s.num
              )}
            </div>
            {i < steps.length - 1 && (
              <div
                className={`
                  w-10 h-[2px] transition-all duration-500 ease-out
                  ${step > s.num ? "bg-cyan-600" : "bg-zinc-200"}
                `}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  // --- Render Steps ---
  const renderEmailStep = () => (
    <form onSubmit={handleSendOtp} className="space-y-8">
      <div className="text-center mb-2">
        <h1 className="text-3xl sm:text-4xl tracking-tighter font-light text-zinc-900 mb-3">
          Lupa Password?
        </h1>
        <p className="text-zinc-500 font-light text-sm sm:text-base max-w-xs mx-auto">
          Masukkan alamat email yang terdaftar, kami akan mengirimkan kode verifikasi.
        </p>
      </div>

      {renderProgressIndicator()}

      <div className="relative group">
        <label
          htmlFor="forgot-email"
          className="block text-xs uppercase tracking-widest text-zinc-400 font-semibold mb-2 transition-colors group-focus-within:text-cyan-600"
        >
          Email Address
        </label>
        <div className="relative">
          <input
            type="email"
            id="forgot-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent border-0 border-b border-zinc-200 py-3 px-0 text-zinc-900 focus:ring-0 focus:border-cyan-600 outline-none focus:outline-none transition-colors placeholder-zinc-300 text-base"
            placeholder="hello@example.com"
            required
            autoFocus
          />
          <Mail className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || !email}
        className="w-full py-4 mt-4 bg-cyan-600 text-white text-xs uppercase tracking-widest font-semibold hover:bg-cyan-700 active:scale-[0.98] disabled:bg-zinc-200 disabled:text-zinc-400 disabled:scale-100 transition-all duration-300 cursor-pointer disabled:cursor-not-allowed"
      >
        {isLoading ? "Mengirim..." : "Kirim Kode OTP"}
      </button>
    </form>
  );

  const renderOtpStep = () => (
    <form onSubmit={handleVerifyOtp} className="space-y-8">
      <div className="text-center mb-2">
        <h1 className="text-3xl sm:text-4xl tracking-tighter font-light text-zinc-900 mb-3">
          Masukkan Kode OTP
        </h1>
        <p className="text-zinc-500 font-light text-sm sm:text-base max-w-xs mx-auto">
          Kode 6 digit telah dikirim ke{" "}
          <span className="text-zinc-700 font-medium">{email}</span>
        </p>
      </div>

      {renderProgressIndicator()}

      {/* OTP Inputs */}
      <div className="flex justify-center gap-2.5 sm:gap-3">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (otpRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleOtpChange(index, e.target.value)}
            onKeyDown={(e) => handleOtpKeyDown(index, e)}
            onPaste={index === 0 ? handleOtpPaste : undefined}
            autoFocus={index === 0}
            className={`
              w-11 h-14 sm:w-13 sm:h-16 text-center text-xl sm:text-2xl font-semibold
              border-2 rounded-lg bg-zinc-50
              transition-all duration-200 outline-none
              ${digit
                ? "border-cyan-600 bg-cyan-50/30 text-zinc-900"
                : "border-zinc-200 text-zinc-900"
              }
              focus:border-cyan-600 focus:bg-white focus:ring-2 focus:ring-cyan-100
            `}
          />
        ))}
      </div>

      {/* Resend Button */}
      <div className="text-center">
        <button
          type="button"
          onClick={handleResendOtp}
          disabled={resendCooldown > 0 || isLoading}
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-cyan-600 disabled:text-zinc-300 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
          {resendCooldown > 0
            ? `Kirim ulang dalam ${resendCooldown}s`
            : "Kirim ulang kode"
          }
        </button>
      </div>

      <button
        type="submit"
        disabled={isLoading || otp.join("").length !== OTP_LENGTH}
        className="w-full py-4 mt-4 bg-cyan-600 text-white text-xs uppercase tracking-widest font-semibold hover:bg-cyan-700 active:scale-[0.98] disabled:bg-zinc-200 disabled:text-zinc-400 disabled:scale-100 transition-all duration-300 cursor-pointer disabled:cursor-not-allowed"
      >
        {isLoading ? "Memverifikasi..." : "Verifikasi Kode"}
      </button>
    </form>
  );

  const renderNewPasswordStep = () => (
    <form onSubmit={handleResetPassword} className="space-y-8">
      <div className="text-center mb-2">
        <h1 className="text-3xl sm:text-4xl tracking-tighter font-light text-zinc-900 mb-3">
          Buat Password Baru
        </h1>
        <p className="text-zinc-500 font-light text-sm sm:text-base max-w-xs mx-auto">
          Password baru minimal 8 karakter. Gunakan kombinasi yang kuat.
        </p>
      </div>

      {renderProgressIndicator()}

      {/* New Password */}
      <div className="relative group">
        <label
          htmlFor="new-password"
          className="block text-xs uppercase tracking-widest text-zinc-400 font-semibold mb-2 transition-colors group-focus-within:text-cyan-600"
        >
          Password Baru
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent border-0 border-b border-zinc-200 py-3 px-0 pr-8 text-zinc-900 focus:ring-0 focus:border-cyan-600 outline-none focus:outline-none transition-colors placeholder-zinc-300 text-base"
            placeholder="Minimal 8 karakter"
            required
            minLength={8}
            autoFocus
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-cyan-600 transition-colors cursor-pointer"
            aria-label="Toggle password visibility"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {/* Password strength indicator */}
        {password && (
          <div className="mt-3 flex gap-1">
            {[1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                  password.length >= level * 3
                    ? level <= 1
                      ? "bg-red-400"
                      : level <= 2
                      ? "bg-amber-400"
                      : level <= 3
                      ? "bg-cyan-400"
                      : "bg-emerald-400"
                    : "bg-zinc-100"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Confirm Password */}
      <div className="relative group">
        <label
          htmlFor="confirm-password"
          className="block text-xs uppercase tracking-widest text-zinc-400 font-semibold mb-2 transition-colors group-focus-within:text-cyan-600"
        >
          Konfirmasi Password
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="confirm-password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            className="w-full bg-transparent border-0 border-b border-zinc-200 py-3 px-0 pr-8 text-zinc-900 focus:ring-0 focus:border-cyan-600 outline-none focus:outline-none transition-colors placeholder-zinc-300 text-base"
            placeholder="Ulangi password baru"
            required
            minLength={8}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-cyan-600 transition-colors cursor-pointer"
            aria-label="Toggle confirm password visibility"
          >
            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {/* Match indicator */}
        {passwordConfirmation && (
          <p className={`mt-2 text-xs transition-colors ${
            password === passwordConfirmation ? "text-emerald-500" : "text-red-400"
          }`}>
            {password === passwordConfirmation ? "✓ Password cocok" : "✗ Password tidak cocok"}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading || password.length < 8 || password !== passwordConfirmation}
        className="w-full py-4 mt-4 bg-cyan-600 text-white text-xs uppercase tracking-widest font-semibold hover:bg-cyan-700 active:scale-[0.98] disabled:bg-zinc-200 disabled:text-zinc-400 disabled:scale-100 transition-all duration-300 cursor-pointer disabled:cursor-not-allowed"
      >
        {isLoading ? "Menyimpan..." : "Ubah Password"}
      </button>
    </form>
  );

  const renderSuccessStep = () => (
    <div className="text-center space-y-8 py-4">
      {/* Animated Checkmark */}
      <div className="flex justify-center">
        <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center animate-bounce-once">
          <CheckCircle className="w-10 h-10 text-emerald-500" strokeWidth={1.5} />
        </div>
      </div>

      <div>
        <h1 className="text-3xl sm:text-4xl tracking-tighter font-light text-zinc-900 mb-3">
          Password Diperbarui!
        </h1>
        <p className="text-zinc-500 font-light text-sm sm:text-base max-w-xs mx-auto">
          Password Anda berhasil diubah. Silakan login kembali dengan password baru Anda.
        </p>
      </div>

      <Link
        href="/login"
        className="inline-block w-full py-4 bg-cyan-600 text-white text-xs uppercase tracking-widest font-semibold hover:bg-cyan-700 active:scale-[0.98] transition-all duration-300 text-center"
      >
        Kembali ke Login
      </Link>
    </div>
  );

  // --- Main Render ---
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="w-full max-w-md space-y-6">
        {/* Back Link */}
        {step !== STEPS.SUCCESS && (
          <div className="text-center">
            <Link
              href="/login"
              className="inline-flex items-center text-xs uppercase tracking-widest text-zinc-400 hover:text-cyan-600 transition-colors duration-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Login
            </Link>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-zinc-50 border-l-2 border-red-500 animate-shake">
            <p className="text-red-700 text-sm font-medium tracking-wide">{error}</p>
          </div>
        )}

        {/* Step Content */}
        <div className="transition-all duration-300">
          {step === STEPS.EMAIL && renderEmailStep()}
          {step === STEPS.OTP && renderOtpStep()}
          {step === STEPS.NEW_PASSWORD && renderNewPasswordStep()}
          {step === STEPS.SUCCESS && renderSuccessStep()}
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes bounce-once {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.1); }
          70% { transform: scale(0.95); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-bounce-once {
          animation: bounce-once 0.6s ease-out forwards;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}
