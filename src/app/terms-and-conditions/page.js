"use client";

import Link from "next/link";
import { ArrowLeft, ShieldCheck, FileText, Scale } from "lucide-react";

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-start py-16 px-4 sm:px-6 lg:px-8 font-sans text-zinc-800">
      <div className="w-full max-w-3xl space-y-10">
        
        {/* Tombol Kembali */}
        <div>
          <Link 
            href="/login" 
            className="inline-flex items-center text-xs uppercase tracking-widest text-zinc-400 hover:text-cyan-600 transition-colors duration-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Pendaftaran
          </Link>
        </div>

        {/* Header Dokumen */}
        <div className="border-b border-zinc-100 pb-8">
          <h1 className="text-3xl sm:text-4xl tracking-tighter font-light text-zinc-900 mb-3">
            Syarat & Ketentuan.
          </h1>
          <p className="text-zinc-400 font-light text-sm">
            Terakhir diperbarui: 3 Juni 2026
          </p>
        </div>

        {/* Isi Pasal-Pasal */}
        <div className="space-y-8 font-light leading-relaxed text-sm sm:text-base text-zinc-600">
          
          {/* Pasal 1 */}
          <section className="space-y-3">
            <h2 className="text-xs uppercase tracking-widest text-zinc-900 font-semibold flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-600" />
              1. Ketentuan Umum
            </h2>
            <p>
              Dengan mendaftar dan menggunakan layanan di platform Arthakara, Anda menyatakan bahwa Anda telah membaca, memahami, dan menyetujui seluruh aturan yang tertulis di dalam dokumen ini. Jika Anda tidak menyetujui salah satu poin di dalamnya, mohon untuk tidak melanjutkan proses pendaftaran.
            </p>
          </section>

          {/* Pasal 2 */}
          <section className="space-y-3">
            <h2 className="text-xs uppercase tracking-widest text-zinc-900 font-semibold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-600" />
              2. Keamanan Akun Anda
            </h2>
            <p>
              Anda bertanggung jawab penuh untuk menjaga kerahasiaan informasi akun Anda, termasuk username dan kata sandi (*password*). Arthakara tidak bertanggung jawab atas kerugian atau penyalahgunaan akun yang disebabkan oleh kelalaian pengguna dalam menjaga kerahasiaan data tersebut.
            </p>
          </section>

          {/* Pasal 3 */}
          <section className="space-y-3">
            <h2 className="text-xs uppercase tracking-widest text-zinc-900 font-semibold flex items-center gap-2">
              <Scale className="w-4 h-4 text-cyan-600" />
              3. Hak Kekayaan Intelektual
            </h2>
            <p>
              Seluruh materi, desain produk, logo, teks, grafik, dan sistem coding yang berada di dalam situs Arthakara merupakan hak milik eksklusif dari pihak manajemen Arthakara dan dilindungi oleh undang-undang hak cipta yang berlaku.
            </p>
          </section>

          {/* Pasal 4 */}
          <section className="space-y-3">
            <h2 className="text-xs uppercase tracking-widest text-zinc-900 font-semibold flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-600" />
              4. Perubahan Ketentuan
            </h2>
            <p>
              Pihak Arthakara berhak untuk mengubah, menambah, atau memperbarui syarat dan ketentuan ini sewaktu-waktu tanpa pemberitahuan tertulis sebelumnya demi meningkatkan kualitas layanan. Perubahan akan langsung berlaku setelah dipublikasikan di halaman ini.
            </p>
          </section>

        </div>

        {/* Footer Kecil */}
        <div className="pt-10 border-t border-zinc-100 text-center">
          <p className="text-xs font-light text-zinc-400">
            Ada pertanyaan mengenai Syarat & Ketentuan ini? Hubungi tim support Arthakara.
          </p>
        </div>

      </div>
    </div>
  );
}