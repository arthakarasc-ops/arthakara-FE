"use client";

import { useRouter } from "next/navigation";

export default function LoginModal({ isOpen, onClose, redirectUrl = "/", title = "Perlu Login", message = "Silakan login terlebih dahulu untuk melanjutkan." }) {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-sm flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">{title}</h2>
          <p className="text-slate-500 text-sm mb-6">{message}</p>
          <div className="flex gap-3">
            <button 
              onClick={onClose} 
              className="flex-1 px-4 py-2 rounded-full font-bold border-2 border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button 
              onClick={() => router.push(`/login?redirect=${encodeURIComponent(redirectUrl)}`)} 
              className="flex-1 px-4 py-2 rounded-full font-bold bg-cyan-600 text-white shadow-md hover:bg-cyan-700 transition-colors"
            >
              Login Sekarang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
