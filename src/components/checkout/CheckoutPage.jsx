"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/components/context/AuthContext";
import { useCart } from "@/components/context/CartContext";
import { getProvinces, getCities, getShippingCost } from "@/lib/api";

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
  const directBuyItemsParam = params.get("direct_buy_items");
  let directBuyItems = [];
  try {
      if (directBuyItemsParam) {
          directBuyItems = JSON.parse(directBuyItemsParam);
      } else if (params.get("product_variant_id")) {
          // Fallback for old single direct buy links
          directBuyItems = [{
            product_variant_id: Number(params.get("product_variant_id")),
            quantity: Number(params.get("quantity")),
            scents: JSON.parse(params.get("scents") || "[]"),
            scentDetails: JSON.parse(params.get("scentDetails") || "[]"),
            name: params.get("name"),
            price: Number(params.get("price")),
            subtotal: Number(params.get("price")) * Number(params.get("quantity"))
          }];
      }
  } catch (e) {
      console.error("Failed to parse direct buy items", e);
  }

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

  const [isLoading, setIsLoading] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [orderType, setOrderType] = useState("delivery"); // 'delivery' | 'take_away'
  const [tanggalLahir, setTanggalLahir] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("whatsapp"); // 'whatsapp' | 'doku'

  // States for RajaOngkir
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [courier, setCourier] = useState("");
  const [shippingCosts, setShippingCosts] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [isLoadingCost, setIsLoadingCost] = useState(false);

  // Menentukan items yang akan di-checkout
  const checkoutItems = directBuyItems.length > 0
    ? directBuyItems
    : cartItems.map(item => ({
        product_variant_id: item.product_variant_id,
        quantity: item.qty,
        scents: item.scents.map(s => s.id),
        scentDetails: item.scents,
        name: item.product_name,
        price: item.price,
        subtotal: item.subtotal
      }));

  // Hitung total berat
  const totalWeight = checkoutItems.reduce((sum, item) => sum + (item.quantity * 500), 0);
  const subTotalAmount = checkoutItems.reduce((sum, item) => sum + item.subtotal, 0);
  const shippingAmount = selectedService ? selectedService.cost : 0;
  const totalAmount = subTotalAmount + shippingAmount;

  // Fetch Provinces
  useEffect(() => {
    const loadProvinces = async () => {
      const res = await getProvinces();
      if (res.isSuccess) setProvinces(res.data);
    };
    loadProvinces();
  }, []);

  // Fetch Cities when province changes
  useEffect(() => {
    if (!selectedProvince) {
      setCities([]);
      setSelectedCity("");
      return;
    }
    const loadCities = async () => {
      const res = await getCities(selectedProvince);
      if (res.isSuccess) setCities(res.data);
    };
    loadCities();
    
    const provName = provinces.find(p => p.id == selectedProvince)?.name || "";
    setShipping(prev => ({ ...prev, province: provName }));
  }, [selectedProvince, provinces]);

  // Update shipping city name when selectedCity changes
  useEffect(() => {
    const cityName = cities.find(c => c.id == selectedCity)?.name || "";
    setShipping(prev => ({ ...prev, city: cityName }));
  }, [selectedCity, cities]);

  // Fetch Shipping Costs
  useEffect(() => {
    if (orderType !== "delivery") return;
    if (!selectedCity || !courier) {
      setShippingCosts([]);
      setSelectedService(null);
      return;
    }

    const loadCost = async () => {
      setIsLoadingCost(true);
      setSelectedService(null);
      const res = await getShippingCost({
        destination: selectedCity,
        weight: totalWeight > 0 ? totalWeight : 500,
        courier: courier
      });
      if (res.isSuccess) {
        setShippingCosts(res.data);
      } else {
        setShippingCosts([]);
      }
      setIsLoadingCost(false);
    };
    loadCost();
  }, [selectedCity, courier, totalWeight, orderType]);


  // =========================
  // HELPER: Validasi Form
  // =========================
  const validateForm = () => {
    if (checkoutItems.length === 0) {
      alert("Tidak ada item untuk di-checkout.");
      return false;
    }

    if (!tanggalLahir) {
      alert("Harap isi Tanggal Lahir.");
      return false;
    }

    if (orderType === 'delivery') {
      if (!selectedProvince || !selectedCity || !courier || !selectedService) {
        alert("Harap lengkapi opsi pengiriman (Provinsi, Kota, Kurir, dan Layanan).");
        return false;
      }
      if (!shipping.first_name.trim() || !shipping.last_name.trim() || !shipping.address.trim() || !shipping.postal_code.trim() || !shipping.phone_number.trim()) {
        alert("Harap lengkapi semua field alamat pengiriman.");
        return false;
      }
    } else {
      // Take Away — hanya butuh nama dan nomor telepon
      if (!shipping.first_name.trim() || !shipping.last_name.trim() || !shipping.phone_number.trim()) {
        alert("Harap isi Nama Lengkap dan Nomor Telepon untuk data pengambilan.");
        return false;
      }
    }

    return true;
  };

  // =========================
  // HELPER: Build Pesan WhatsApp
  // Jika orderId ada → order sudah tersimpan di sistem (user login)
  // Jika orderId null → order tidak tersimpan (guest)
  // =========================
  const buildWAMessage = (orderId = null) => {
    const totalFormatted = totalAmount.toLocaleString("id-ID");
    const shippingFormatted = shippingAmount.toLocaleString("id-ID");

    const itemDetails = checkoutItems.map(item => {
      const scentNames = (item.scentDetails || [])
        .map(scent => scent?.name)
        .filter(Boolean)
        .join(', ');
      const scentSuffix = scentNames ? ` (Wangi: ${scentNames})` : '';
      return `- ${item.name}${scentSuffix} (x${item.quantity})`;
    }).join('\n');

    let text = orderId
      ? `Halo Arthakara, saya ingin konfirmasi pembayaran pesanan saya:\n\n`
      : `Halo Arthakara, saya ingin melakukan pemesanan:\n\n`;

    if (orderId) {
      text += `*Order ID:* #${orderId}\n`;
    }

    text += `*Informasi Pemesan:*\n`;
    text += `- Nama: ${shipping.first_name} ${shipping.last_name}\n`;
    text += `- No HP: ${shipping.phone_number}\n`;
    if (tanggalLahir) text += `- Tgl Lahir: ${tanggalLahir}\n`;

    text += `\n*Metode Pengambilan:* ${orderType === 'delivery' ? 'Delivery (Dikirim)' : 'Take Away (Ambil Sendiri)'}\n`;

    if (orderType === 'delivery') {
      text += `\n*Alamat Pengiriman:*\n`;
      text += `${shipping.address}`;
      if (shipping.appartment_suite) text += `, ${shipping.appartment_suite}`;
      text += `\n${shipping.city}, ${shipping.province} ${shipping.postal_code}\n`;
      text += `${shipping.country}\n`;
      text += `\n*Kurir:* ${courier.toUpperCase()} - ${selectedService?.service}\n`;
    }

    text += `\n*Detail Pesanan:*\n${itemDetails}\n\n`;
    text += `*Ongkos Kirim:* Rp ${shippingFormatted}\n`;
    text += `*Total Tagihan: Rp ${totalFormatted}*\n\n`;
    text += `Mohon kirimkan instruksi pembayaran / QRIS. Terima kasih!`;

    return text;
  };

  // =========================
  // HANDLER UTAMA: Buat Order & Bayar
  // Ada 3 jalur:
  //   A) Guest + WhatsApp → langsung ke WA, tanpa simpan ke DB
  //   B) Login + WhatsApp → simpan ke DB dulu, lalu ke WA dengan Order ID
  //   C) Login + Doku    → simpan ke DB, lalu ke Doku (tidak diubah)
  // =========================
  const handleOrder = async () => {

    // === GUARD: Doku wajib login ===
    if (paymentMethod === "doku" && !isAuthenticated) {
      alert(
        "Pembayaran via Doku memerlukan login terlebih dahulu.\n\n" +
        "Silakan login untuk menggunakan Doku, atau pilih metode WhatsApp untuk melanjutkan tanpa login."
      );
      router.push("/login?redirect=/checkout");
      return;
    }

    // Validasi form terlebih dahulu
    if (!validateForm()) return;

    setIsLoading(true);

    try {

      // ============================================================
      // JALUR A: GUEST + WHATSAPP
      // Tidak simpan data ke database.
      // Langsung buat pesan WA dari isian form dan buka WhatsApp.
      // ============================================================
      if (paymentMethod === "whatsapp" && !isAuthenticated) {
        const waNumber = "6287784488639";
        const message = buildWAMessage(null); // tanpa Order ID
        const encodedText = encodeURIComponent(message);

        alert("Pesanan Anda akan dikirim ke WhatsApp Admin untuk diproses secara manual.");
        router.push("/");
        setTimeout(() => {
          window.location.href = `https://api.whatsapp.com/send?phone=${waNumber}&text=${encodedText}`;
        }, 100);

        setIsLoading(false);
        return;
      }

      // ============================================================
      // JALUR B & C: USER LOGIN (WhatsApp atau Doku)
      // Selalu simpan order ke database terlebih dahulu.
      // ============================================================

      // Jika Take Away, isi otomatis data alamat yang tidak perlu
      const finalShipping = orderType === "take_away"
        ? { ...shipping, address: "Take Away", city: "Take Away", province: "Take Away", postal_code: "00000", country: "Indonesia" }
        : shipping;

      // Salin otomatis alamat pengiriman ke alamat penagihan
      const finalBilling = { ...finalShipping };

      const payload = {
        tanggal_lahir: tanggalLahir,
        shipping_address: finalShipping,
        billing_address: finalBilling,
        shipping_method_id: orderType === "take_away" ? 4 : 1,
        courier_code: orderType === "take_away" ? null : courier,
        courier_service: orderType === "take_away" ? null : selectedService?.service,
        shipping_cost: orderType === "take_away" ? null : selectedService?.cost,
        destination_city_id: orderType === "take_away" ? null : selectedCity,
        items: checkoutItems.map(item => ({
          product_variant_id: item.product_variant_id,
          quantity: item.quantity,
          scents: item.scents
        })),
      };

      const orderRes = await fetch("https://arthakara.id/api/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
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

      const orderId = orderData.data?.id || orderData.data?.order_id;
      if (!orderId) {
        console.error("Order Data:", orderData);
        alert("Order berhasil tapi ID tidak ditemukan.");
        setIsLoading(false);
        return;
      }

      setOrderResult(orderData.data);

      // ============================================================
      // JALUR B: LOGIN + WHATSAPP
      // Order sudah tersimpan di DB (admin bisa lihat di dashboard).
      // Buka WA dengan Order ID agar admin bisa tracking.
      // ============================================================
      if (paymentMethod === "whatsapp") {
        const waNumber = "6287784488639";
        const message = buildWAMessage(orderId); // dengan Order ID
        const encodedText = encodeURIComponent(message);

        clearAll();
        alert(`Pesanan #${orderId} berhasil dibuat dan tersimpan di akun Anda!\nKamu akan diarahkan ke WhatsApp untuk konfirmasi pembayaran.`);
        router.push("/profile");
        setTimeout(() => {
          window.location.href = `https://api.whatsapp.com/send?phone=${waNumber}&text=${encodedText}`;
        }, 100);

        setIsLoading(false);
        return;
      }

      // ============================================================
      // JALUR C: LOGIN + DOKU (tidak diubah dari versi sebelumnya)
      // ============================================================
      const payRes = await fetch("https://arthakara.id/api/pay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ order_id: orderId }),
      });

      const payData = await payRes.json();

      if (!payRes.ok || !payData.isSuccess) {
        alert(payData.message || "Gagal membuat transaksi pembayaran");
        setIsLoading(false);
        return;
      }

      clearAll();
      alert("Pesanan berhasil dibuat! Kamu akan diarahkan ke halaman pembayaran Doku.");
      window.location.href = payData.payment_url;

    } catch (err) {
      console.error("Checkout Error Full:", err);
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
            
            <div className="mb-3">
              <InputField label="Tanggal Lahir" type="date" value={tanggalLahir} onChange={(e) => setTanggalLahir(e.target.value)} />
            </div>

            {orderType === 'delivery' && (
              <>
                <InputField label="Alamat Lengkap" value={shipping.address} onChange={(e) => setShipping({ ...shipping, address: e.target.value })} placeholder="Jl. Contoh No. 123" />
                <InputField label="Apartemen/Suite" value={shipping.appartment_suite} onChange={(e) => setShipping({ ...shipping, appartment_suite: e.target.value })} placeholder="Opsional" required={false} />
                
                {/* RajaOngkir Selection */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Provinsi <span className="text-red-500">*</span>
                    </label>
                    <select 
                      value={selectedProvince} 
                      onChange={(e) => setSelectedProvince(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-cyan-500 text-slate-900 font-medium"
                    >
                      <option value="">Pilih Provinsi</option>
                      {provinces.map(prov => (
                        <option key={prov.id} value={prov.id}>{prov.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Kota/Kabupaten <span className="text-red-500">*</span>
                    </label>
                    <select 
                      value={selectedCity} 
                      onChange={(e) => setSelectedCity(e.target.value)}
                      disabled={!selectedProvince}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-cyan-500 text-slate-900 font-medium disabled:bg-slate-50"
                    >
                      <option value="">Pilih Kota</option>
                      {cities.map(city => (
                        <option key={city.id} value={city.id}>{city.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <InputField label="Kode Pos" value={shipping.postal_code} onChange={(e) => setShipping({ ...shipping, postal_code: e.target.value })} placeholder="12345" />
                </div>

                {/* Courier Selection */}
                {selectedCity && (
                  <div className="mb-6">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Pilih Kurir <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { code: 'jne', label: 'JNE' },
                        { code: 'jnt', label: 'J&T' },
                        { code: 'tiki', label: 'TIKI' },
                      ].map(c => (
                        <label key={c.code} className={`flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all font-bold text-sm ${courier === c.code ? 'border-cyan-600 bg-cyan-50 text-cyan-800' : 'border-slate-200 text-slate-500 hover:border-cyan-200 hover:bg-slate-50'}`}>
                          <input type="radio" name="courier" value={c.code} checked={courier === c.code} onChange={(e) => setCourier(e.target.value)} className="hidden" />
                          {c.label}
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Shipping Services List */}
                {isLoadingCost && <div className="text-sm text-cyan-600 mb-4 animate-pulse">Menghitung ongkos kirim...</div>}
                
                {shippingCosts && shippingCosts.length > 0 && !isLoadingCost && (
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                      Layanan Pengiriman <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                      {shippingCosts.map((service, idx) => (
                        <label key={idx} className={`flex justify-between items-center p-3 rounded-lg border cursor-pointer transition-all ${selectedService?.service === service.service ? 'border-cyan-500 bg-white ring-1 ring-cyan-500' : 'border-slate-200 bg-white hover:border-cyan-300'}`}>
                          <div className="flex items-center gap-3">
                            <input 
                              type="radio" 
                              name="service" 
                              checked={selectedService?.service === service.service} 
                              onChange={() => setSelectedService(service)}
                              className="text-cyan-600 focus:ring-cyan-500"
                            />
                            <div>
                              <div className="font-bold text-sm text-slate-800">{service.service}</div>
                              <div className="text-xs text-slate-500">{service.description} (Estimasi {service.etd} hari)</div>
                            </div>
                          </div>
                          <div className="font-bold text-cyan-600 text-sm">
                            Rp {service.cost.toLocaleString("id-ID")}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* ==================== METODE PEMBAYARAN ==================== */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-cyan-50 text-cyan-600 flex items-center justify-center text-sm font-bold border border-cyan-100">3</span>
              Metode Pembayaran
            </h2>
            <div className="flex flex-col sm:flex-row gap-4">
              {/* WhatsApp Option */}
              <label className={`flex-1 flex items-start gap-3 p-5 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'whatsapp' ? 'border-green-500 bg-green-50 shadow-md shadow-green-100' : 'border-slate-200 hover:border-green-200 hover:bg-slate-50'}`}>
                <input type="radio" name="paymentMethod" value="whatsapp" checked={paymentMethod === 'whatsapp'} onChange={() => setPaymentMethod('whatsapp')} className="hidden" />
                <div className="flex-1">
                  <div className={`font-bold ${paymentMethod === 'whatsapp' ? 'text-green-800' : 'text-slate-700'} flex justify-between items-center`}>
                    <span>WhatsApp (Manual)</span>
                    <span className="text-xs font-normal bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Tanpa Login</span>
                  </div>
                  <div className="text-sm mt-1 text-slate-500">Pembayaran via QRIS/Transfer diarahkan ke WA Admin</div>
                </div>
              </label>
              
              {/* Doku Option */}
              <label className={`flex-1 flex items-start gap-3 p-5 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'doku' ? 'border-cyan-600 bg-cyan-50 shadow-md shadow-cyan-100' : 'border-slate-200 hover:border-cyan-200 hover:bg-slate-50'}`}>
                <input type="radio" name="paymentMethod" value="doku" checked={paymentMethod === 'doku'} onChange={() => setPaymentMethod('doku')} className="hidden" />
                <div className="flex-1">
                  <div className={`font-bold ${paymentMethod === 'doku' ? 'text-cyan-800' : 'text-slate-700'} flex justify-between items-center`}>
                    <span>Doku</span>
                    <span className="text-xs font-normal bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Perlu Login</span>
                  </div>
                  <div className="text-sm mt-1 text-slate-500">Virtual Account, QRIS, &amp; E-Wallet (Otomatis)</div>
                </div>
              </label>
            </div>

            {/* Info Banner berdasarkan kondisi */}
            <div className="mt-4">
              {/* Guest + WhatsApp → info tidak tersimpan */}
              {paymentMethod === 'whatsapp' && !isAuthenticated && (
                <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm">
                  <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-amber-800">Order tanpa akun</p>
                    <p className="text-amber-700 mt-0.5">Data pesanan <strong>tidak akan tersimpan</strong> di sistem kami. Pembayaran akan dikonfirmasi manual oleh admin via WhatsApp. <a href="/login?redirect=/checkout" className="underline font-semibold">Login</a> jika ingin data pesanan tersimpan di akun Anda.</p>
                  </div>
                </div>
              )}

              {/* Login + WhatsApp → info data tersimpan */}
              {paymentMethod === 'whatsapp' && isAuthenticated && (
                <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-xl text-sm">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-green-800">Order tersimpan di akun Anda</p>
                    <p className="text-green-700 mt-0.5">Karena Anda sudah login, data pesanan akan tersimpan dan bisa dilihat di profil Anda. Pembayaran dikonfirmasi manual via WhatsApp ke admin.</p>
                  </div>
                </div>
              )}

              {/* Guest + Doku → peringatan wajib login */}
              {paymentMethod === 'doku' && !isAuthenticated && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-sm">
                  <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-red-800">Login diperlukan untuk Doku</p>
                    <p className="text-red-700 mt-0.5">Pembayaran via Doku memerlukan akun terdaftar. <a href="/login?redirect=/checkout" className="underline font-semibold">Login sekarang</a> atau pilih WhatsApp untuk melanjutkan tanpa login.</p>
                  </div>
                </div>
              )}

              {/* Login + Doku → info normal */}
              {paymentMethod === 'doku' && isAuthenticated && (
                <div className="flex items-start gap-3 p-4 bg-cyan-50 border border-cyan-200 rounded-xl text-sm">
                  <svg className="w-5 h-5 text-cyan-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-cyan-800">Pembayaran otomatis via Doku</p>
                    <p className="text-cyan-700 mt-0.5">Anda akan diarahkan ke halaman pembayaran Doku. Tersedia Virtual Account, QRIS, dan E-Wallet. Data pesanan tersimpan otomatis.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

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
                          {Number(scent.extra_price) > 0 ? (
                            <span className="whitespace-nowrap font-medium text-slate-400">Rp {(Number(scent.extra_price) * item.quantity).toLocaleString("id-ID")}</span>
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
                <span>Subtotal ({totalWeight} gr)</span>
                <span className="font-medium text-slate-900">Rp {subTotalAmount.toLocaleString("id-ID")}</span>
              </div>
              
              {orderType === 'delivery' && (
                <div className="flex justify-between text-slate-500 text-sm">
                  <span>Ongkos Kirim {selectedService ? `(${selectedService.service})` : ''}</span>
                  <span className="font-medium text-slate-900">Rp {shippingAmount.toLocaleString("id-ID")}</span>
                </div>
              )}

              <div className="pt-4 mt-2 border-t border-slate-100 flex justify-between font-bold text-xl text-slate-900">
                <span>Total</span>
                <span className="text-cyan-600">Rp {totalAmount.toLocaleString("id-ID")}</span>
              </div>
            </div>

            <button
              onClick={handleOrder}
              disabled={isLoading || (orderType === 'delivery' && !selectedService)}
              className="w-full bg-cyan-600 text-white py-4 rounded-xl font-bold tracking-wide hover:bg-cyan-700 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed transition-all shadow-md shadow-cyan-600/20 active:scale-[0.98]"
            >
              {isLoading ? "Memproses..." : (
                paymentMethod === 'whatsapp'
                  ? "Pesan via WhatsApp"
                  : "Bayar via Doku"
              )}
            </button>

            {/* Status Login Info */}
            <div className="mt-4 text-center">
              {isAuthenticated ? (
                <p className="text-xs text-green-600 font-medium">✓ Anda sedang login — data pesanan tersimpan</p>
              ) : (
                <p className="text-xs text-slate-400">
                  Belum login?{" "}
                  <a href="/login?redirect=/checkout" className="text-cyan-600 font-semibold hover:underline">
                    Login di sini
                  </a>
                </p>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 text-center flex flex-col gap-2 items-center">
              <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              <p className="text-xs text-slate-500">
                Pembayaran Doku diproses secara aman oleh <span className="font-semibold text-slate-700">Doku</span>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}