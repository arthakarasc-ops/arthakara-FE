"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/context/AuthContext";
import { useCart } from "@/components/context/CartContext";

const InputField = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = true,
}) => (
  <div className="mb-4">
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-slate-900 font-medium"
    />
  </div>
);


export default function CheckoutPage() {
  const params = useSearchParams();
  const router = useRouter();
  const { token, isAuthenticated } = useAuth();
  const { cartItems, cartTotal, clearAll } = useCart();

  // Data produk dari URL params (untuk Direct Buy)
  const directBuyData = params.get("product_variant_id") ? {
    product_id: params.get("product_id"),
    product_variant_id: params.get("product_variant_id"),
    name: params.get("name"),
    price: Number(params.get("price")),
    quantity: Number(params.get("quantity")),
    scents: JSON.parse(params.get("scents") || "[]"),
  } : null;

  const [shipping, setShipping] = useState({
    first_name: "",
    last_name: "",
    address: "",
    appartment_suite: "",
    city: "",
    province: "",
    postal_code: "",
    country: "Indonesia",
    phone_number: "",
  });

  const [billing, setBilling] = useState({
    first_name: "",
    last_name: "",
    address: "",
    appartment_suite: "",
    city: "",
    province: "",
    postal_code: "",
    country: "Indonesia",
    phone_number: "",
  });

  const [sameAsShipping, setSameAsShipping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [orderType, setOrderType] = useState("delivery"); // 'delivery' | 'take_away'

  // Menentukan items yang akan di-checkout
  const checkoutItems = directBuyData 
    ? [
        {
          product_variant_id: Number(directBuyData.product_variant_id),
          quantity: directBuyData.quantity,
          scents: directBuyData.scents,
          scentDetails: JSON.parse(params.get("scentDetails") || "[]"),
          name: directBuyData.name,
          price: directBuyData.price,
          subtotal: directBuyData.price * directBuyData.quantity
        }
      ]
    : cartItems.map(item => ({
        product_variant_id: item.product_variant_id,
        quantity: item.qty,
        scents: item.scents.map(s => s.id),
        scentDetails: item.scents,
        name: item.product_name,
        price: item.price,
        subtotal: item.subtotal
      }));

  const totalAmount = checkoutItems.reduce((sum, item) => sum + item.subtotal, 0);

  // =========================
  // HANDLER: Checkbox billing = shipping
  // =========================
  const handleSameAsShipping = (checked) => {
    setSameAsShipping(checked);
    if (checked) {
      setBilling({ ...shipping });
    }
  };

  // =========================
  // HANDLER: Buat Order → Bayar Midtrans
  // =========================
  const handleOrder = async () => {
    if (!isAuthenticated) {
      alert("Kamu harus login dulu untuk melakukan order.");
      router.push("/login");
      return;
    }

    if (checkoutItems.length === 0) {
      return alert("Tidak ada item untuk di-checkout.");
    }

    // Validasi form berdasarkan tipe order
    if (orderType === 'delivery') {
      // Validasi lengkap untuk Delivery
      if (!shipping.first_name.trim() || !shipping.last_name.trim() || !shipping.address.trim() || !shipping.city.trim() || !shipping.province.trim() || !shipping.postal_code.trim() || !shipping.phone_number.trim()) {
        return alert("Harap lengkapi semua field alamat pengiriman.");
      }

      const billingData = sameAsShipping ? shipping : billing;
      if (!billingData.first_name.trim() || !billingData.last_name.trim() || !billingData.address.trim() || !billingData.city.trim() || !billingData.province.trim() || !billingData.postal_code.trim() || !billingData.phone_number.trim()) {
        return alert("Harap lengkapi semua field alamat penagihan.");
      }
    } else {
      // Validasi khusus Take Away (Hanya butuh nama dan nomor telepon)
      if (!shipping.first_name.trim() || !shipping.last_name.trim() || !shipping.phone_number.trim()) {
        return alert("Harap isi Nama Lengkap dan Nomor Telepon untuk data pengambilan.");
      }
    }

    setIsLoading(true);

    try {
      // Jika Take Away, isi otomatis data alamat yang tidak perlu dengan "Take Away"
      const finalShipping = orderType === "take_away" 
        ? { ...shipping, address: "Take Away", city: "Take Away", province: "Take Away", postal_code: "00000", country: "Indonesia" }
        : shipping;
        
      // Untuk Take Away, salin data shipping ke billing (karena form billing disembunyikan & state-nya kosong)
      const finalBilling = orderType === "take_away"
        ? { ...finalShipping }
        : (sameAsShipping ? finalShipping : billing);

      // ============================================
      // STEP 1: Buat Order di backend
      // ============================================
      const payload = {
        shipping_address: finalShipping,
        billing_address: finalBilling,
        shipping_method_id: orderType === "take_away" ? 4 : 1, // ID 4 = Take Away, ID 1 = Regular/Delivery
        items: checkoutItems.map(item => ({
          product_variant_id: item.product_variant_id,
          quantity: item.quantity,
          scents: item.scents
        })),
      };

      const orderRes = await fetch("/api/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        const errorMsg = orderData.errors
          ? Object.values(orderData.errors).flat().join("\n")
          : orderData.message || "Gagal membuat order";
        alert(errorMsg);
        setIsLoading(false);
        return;
      }

      const orderId = orderData.data?.order_id;
      if (!orderId) {
        alert("Order berhasil tapi ID tidak ditemukan.");
        setIsLoading(false);
        return;
      }

      setOrderResult(orderData.data);

      // ============================================
      // STEP 2: Minta Snap Token dari backend
      // ============================================
      const payRes = await fetch("/api/pay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ order_id: orderId }),
      });

      const payData = await payRes.json();

      if (!payRes.ok) {
        alert(payData.message || "Gagal membuat transaksi pembayaran");
        setIsLoading(false);
        return;
      }

      const snapToken = payData.snap_token;

      // ============================================
      // STEP 3: Tampilkan Pop-up Midtrans Snap
      // ============================================
      if (window.snap) {
        window.snap.pay(snapToken, {
          onSuccess: function (result) {
            clearAll();
            alert("Pembayaran berhasil! Terima kasih telah berbelanja di Arthakara.");
            router.push("/profile");
          },
          onPending: function (result) {
            clearAll();
            alert("Pembayaran pending. Silakan selesaikan pembayaran sesuai instruksi.");
            router.push("/profile");
          },
          onError: function (result) {
            alert("Pembayaran gagal. Silakan coba lagi.");
            console.error("Payment Error:", result);
          },
          onClose: function () {
            alert("Pop-up pembayaran ditutup. Kamu bisa menyelesaikan pembayaran nanti di halaman profil.");
          },
        });
      } else {
        alert("Midtrans belum dimuat. Coba refresh halaman ini.");
      }
    } catch (err) {
      console.error("Checkout Error Full:", err);
      // Jika error punya detail dari Laravel (response.json() tadi gagal)
      alert("Terjadi kesalahan sistem: " + (err.message || "Koneksi terputus"));
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8 text-slate-900 tracking-tight">Checkout</h1>

      <div className="grid md:grid-cols-3 gap-8">

        {/* ==================== LEFT: FORM ==================== */}
        <div className="md:col-span-2 space-y-6">

          {/* ORDER TYPE SELECTION */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-cyan-50 text-cyan-600 flex items-center justify-center text-sm font-bold border border-cyan-100">1</span>
              Metode Pengambilan
            </h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <label className={`flex-1 flex items-center justify-center gap-3 p-5 rounded-2xl border-2 cursor-pointer transition-all ${orderType === 'delivery' ? 'border-cyan-600 bg-cyan-50 text-cyan-800 shadow-md shadow-cyan-100' : 'border-slate-200 text-slate-500 hover:border-cyan-200 hover:bg-slate-50'}`}>
                <input type="radio" name="orderType" value="delivery" checked={orderType === 'delivery'} onChange={() => setOrderType('delivery')} className="hidden" />
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                <span className="font-semibold">Delivery (Dikirim)</span>
              </label>
              
              <label className={`flex-1 flex items-center justify-center gap-3 p-5 rounded-2xl border-2 cursor-pointer transition-all ${orderType === 'take_away' ? 'border-amber-500 bg-amber-50 text-amber-800 shadow-md shadow-amber-100' : 'border-slate-200 text-slate-500 hover:border-amber-200 hover:bg-slate-50'}`}>
                <input type="radio" name="orderType" value="take_away" checked={orderType === 'take_away'} onChange={() => setOrderType('take_away')} className="hidden" />
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                <span className="font-semibold">Take Away (Ambil Sendiri)</span>
              </label>
            </div>
          </div>

          {/* SHIPPING ADDRESS */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-cyan-50 text-cyan-600 flex items-center justify-center text-sm font-bold border border-cyan-100">2</span>
              {orderType === 'take_away' ? 'Data Pengambil (Pemesanan)' : 'Alamat Pengiriman'}
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <InputField label="Nama Depan" value={shipping.first_name} onChange={(e) => setShipping({ ...shipping, first_name: e.target.value })} placeholder="John" />
              <InputField label="Nama Belakang" value={shipping.last_name} onChange={(e) => setShipping({ ...shipping, last_name: e.target.value })} placeholder="Doe" />
            </div>
            
            <div className="mb-3">
              <InputField label="No. Telepon" type="tel" value={shipping.phone_number} onChange={(e) => setShipping({ ...shipping, phone_number: e.target.value.replace(/[^0-9]/g, '') })} placeholder="08123456789" />
            </div>

            {orderType === 'delivery' && (
              <>
                <InputField label="Alamat Lengkap" value={shipping.address} onChange={(e) => setShipping({ ...shipping, address: e.target.value })} placeholder="Jl. Contoh No. 123" />
                <InputField label="Apartemen/Suite" value={shipping.appartment_suite} onChange={(e) => setShipping({ ...shipping, appartment_suite: e.target.value })} placeholder="Opsional" required={false} />
                <div className="grid grid-cols-2 gap-3">
                  <InputField label="Kota" value={shipping.city} onChange={(e) => setShipping({ ...shipping, city: e.target.value })} placeholder="Jakarta" />
                  <InputField label="Provinsi" value={shipping.province} onChange={(e) => setShipping({ ...shipping, province: e.target.value })} placeholder="DKI Jakarta" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <InputField label="Kode Pos" value={shipping.postal_code} onChange={(e) => setShipping({ ...shipping, postal_code: e.target.value })} placeholder="12345" />
                </div>
              </>
            )}
          </div>

          {/* BILLING ADDRESS (Hanya muncul jika Delivery) */}
          {orderType === 'delivery' && (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-cyan-50 text-cyan-600 flex items-center justify-center text-sm font-bold border border-cyan-100">3</span>
                  Alamat Penagihan
                </h2>
                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-600 bg-slate-50 px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={sameAsShipping}
                    onChange={(e) => handleSameAsShipping(e.target.checked)}
                    className="rounded text-cyan-600 focus:ring-cyan-500 border-slate-300 w-4 h-4"
                  />
                  Sama dengan pengiriman
                </label>
              </div>

              {!sameAsShipping && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <InputField label="Nama Depan" value={billing.first_name} onChange={(e) => setBilling({ ...billing, first_name: e.target.value })} placeholder="John" />
                    <InputField label="Nama Belakang" value={billing.last_name} onChange={(e) => setBilling({ ...billing, last_name: e.target.value })} placeholder="Doe" />
                  </div>
                  <div className="mb-3">
                    <InputField label="No. Telepon" type="tel" value={billing.phone_number} onChange={(e) => setBilling({ ...billing, phone_number: e.target.value.replace(/[^0-9]/g, '') })} placeholder="08123456789" />
                  </div>
                  <InputField label="Alamat" value={billing.address} onChange={(e) => setBilling({ ...billing, address: e.target.value })} placeholder="Jl. Contoh No. 123" />
                  <InputField label="Apartemen/Suite" value={billing.appartment_suite} onChange={(e) => setBilling({ ...billing, appartment_suite: e.target.value })} placeholder="Opsional" required={false} />
                  <div className="grid grid-cols-2 gap-3">
                    <InputField label="Kota" value={billing.city} onChange={(e) => setBilling({ ...billing, city: e.target.value })} placeholder="Jakarta" />
                    <InputField label="Provinsi" value={billing.province} onChange={(e) => setBilling({ ...billing, province: e.target.value })} placeholder="DKI Jakarta" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <InputField label="Kode Pos" value={billing.postal_code} onChange={(e) => setBilling({ ...billing, postal_code: e.target.value })} placeholder="12345" />
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* ==================== RIGHT: ORDER SUMMARY ==================== */}
        <div className="md:col-span-1">
          <div className="bg-white p-8 rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 sticky top-28">
            <h2 className="font-bold text-xl mb-6 text-slate-900">Ringkasan Pesanan</h2>

            <div className="border-b border-slate-100 pb-6 mb-6 space-y-4">
              {checkoutItems.map((item, idx) => (
                <div key={idx} className="flex flex-col gap-1">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-semibold text-slate-900 text-sm flex-1 leading-snug">{item.name}</h3>
                    <span className="font-bold text-slate-900 text-sm whitespace-nowrap">Rp {Number(item.subtotal).toLocaleString("id-ID")}</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-1">Qty: {item.quantity}</p>
                  
                  {/* Scent Details */}
                  {item.scentDetails && item.scentDetails.length > 0 && (
                    <div className="pl-3 border-l-2 border-slate-100 mt-1 space-y-1">
                      {item.scentDetails.map((scent, sIdx) => (
                        <div key={sIdx} className="flex justify-between text-xs text-slate-500">
                          <span className="truncate pr-2">+ {scent.name}</span>
                          {Number(scent.price) > 0 ? (
                            <span className="whitespace-nowrap font-medium text-slate-400">Rp {(Number(scent.price) * item.quantity).toLocaleString("id-ID")}</span>
                          ) : (
                            <span className="whitespace-nowrap font-medium text-slate-400">Gratis</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-slate-500 text-sm">
                <span>Subtotal</span>
                <span className="font-medium text-slate-900">Rp {totalAmount.toLocaleString("id-ID")}</span>
              </div>
              <div className="pt-4 mt-2 border-t border-slate-100 flex justify-between font-bold text-xl text-slate-900">
                <span>Total</span>
                <span className="text-cyan-600">Rp {totalAmount.toLocaleString("id-ID")}</span>
              </div>
            </div>

            <button
              onClick={handleOrder}
              disabled={isLoading}
              className="w-full bg-cyan-600 text-white py-4 rounded-xl font-bold tracking-wide hover:bg-cyan-700 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed transition-all shadow-md shadow-cyan-600/20 active:scale-[0.98]"
            >
              {isLoading ? "Memproses..." : "Selesaikan Pembayaran"}
            </button>

            <div className="mt-6 pt-4 border-t border-slate-100 text-center flex flex-col gap-2 items-center">
              <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              <p className="text-xs text-slate-500">
                Pembayaran diproses secara aman oleh <span className="font-semibold text-slate-700">Midtrans</span>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}