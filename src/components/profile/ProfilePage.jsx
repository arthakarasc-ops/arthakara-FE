"use client";

import { useAuth } from "@/components/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { User, Mail, Phone, LogOut, ArrowLeft, Edit2, X, Check, Package, Clock, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { getUserOrders, updateUserProfile } from "@/lib/api";

export default function ProfilePage() {
  const { user, token, isAuthenticated, logout, loading, updateUser } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    phone: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (token) {
        setLoadingOrders(true);
        const res = await getUserOrders(token);
        if (res.status === 200) {
          setOrders(res.data);
        }
        setLoadingOrders(false);
      }
    };

    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    if (user) {
      setEditData({
        name: user.full_name || user.name || "",
        phone: user.phone_number || user.phone || "",
      });
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-slate-200 border-t-cyan-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setUpdateMessage("");

    try {
      const formData = new FormData();
      formData.append("_method", "PUT"); // Laravel method spoofing
      formData.append("full_name", (editData.name || "").trim());
      formData.append("phone_number", (editData.phone || "").trim());

      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const { status, data } = await updateUserProfile(token, formData);

      if (status !== 200) {
        let errorMsg = data.error || data.message || "Gagal memperbarui profil.";
        if (data.errors) {
          // If there are validation errors, pick the first one
          const firstError = Object.values(data.errors)[0][0];
          errorMsg = firstError;
        }
        throw new Error(errorMsg);
      }

      // Update global auth state with new user data
      if (data.data) {
        updateUser(data.data);
      }

      setUpdateMessage("✓ Profil berhasil diperbarui.");
      setIsEditing(false);
      setAvatarFile(null);
      
      setTimeout(() => {
        setUpdateMessage("");
      }, 3000);
    } catch (error) {
      console.error("Update profile error:", error);
      setUpdateMessage("✗ " + (error.message || "Terjadi kesalahan."));
    } finally {
      setIsSaving(false);
    }
  };

  const handleContinuePayment = async (orderId) => {
    try {
      const payRes = await fetch("https://arthakara-api-production.up.railway.app/api/pay", {
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
        alert(payData.message || "Gagal membuat sesi pembayaran.");
        return;
      }

      if (window.snap) {
        window.snap.pay(payData.snap_token, {
          onSuccess: function () {
            alert("Pembayaran berhasil!");
            window.location.reload();
          },
          onPending: function () {
            alert("Menunggu pembayaran diselesaikan.");
            window.location.reload();
          },
          onError: function () {
            alert("Pembayaran gagal atau dibatalkan.");
          },
        });
      } else {
        alert("Sistem pembayaran belum siap. Silakan muat ulang halaman.");
      }
    } catch (err) {
      alert("Terjadi kesalahan sistem: " + err.message);
    }
  };

  // Helper function to get initials
  const getInitials = (name) => {
      if (!name) return "U";
      return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-cyan-200 selection:text-cyan-900 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* BREADCRUMB & LOGOUT */}
        <div className="flex justify-between items-center mb-12">
            <Link
                href="/"
                className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors group"
            >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Kembali ke Beranda
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Keluar Sesi
            </button>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* LEFT COL: PROFILE INFO */}
            <div className="lg:col-span-4 lg:sticky lg:top-32 space-y-8">
                
                <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Akun Saya</h1>

                <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 relative">
                    
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 bg-white rounded-full border border-slate-100 hover:border-slate-300 transition-all shadow-sm hover:shadow"
                            title="Edit profil"
                        >
                            <Edit2 className="w-4 h-4" />
                        </button>
                    )}

                    <div className="flex items-center gap-5 mb-10">
                        <div className="relative group">
                            <div className="w-20 h-20 bg-cyan-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold tracking-widest shadow-lg shadow-cyan-600/20 overflow-hidden">
                                {avatarPreview || user.avatar ? (
                                    <img src={avatarPreview || user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    getInitials(user.full_name || user.name)
                                )}
                            </div>
                            {isEditing && (
                                <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Edit2 className="text-white w-6 h-6" />
                                    <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                                </label>
                            )}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 leading-tight">{user.full_name || user.name || "Pelanggan"}</h2>
                            <p className="text-slate-500 text-sm mt-1">{user.email}</p>
                        </div>
                    </div>

                    {updateMessage && (
                        <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${
                            updateMessage.startsWith("✓") ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-red-50 text-red-700 border border-red-100"
                        }`}>
                            {updateMessage}
                        </div>
                    )}

                    {isEditing ? (
                        <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2">
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Nama Lengkap</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={editData.name}
                                    onChange={handleEditChange}
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-slate-900 font-medium"
                                    placeholder="Masukkan nama"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Nomor Telepon</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={editData.phone}
                                    onChange={handleEditChange}
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-slate-900 font-medium"
                                    placeholder="+62"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={handleSaveProfile}
                                    disabled={isSaving}
                                    className="flex-1 bg-cyan-600 text-white py-3 rounded-xl font-semibold hover:bg-cyan-700 disabled:bg-slate-300 transition-colors flex justify-center items-center gap-2 shadow-md shadow-cyan-600/20"
                                >
                                    {isSaving ? "Menyimpan..." : <><Check size={16} /> Simpan</>}
                                </button>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-5 bg-white text-slate-600 border border-slate-200 py-3 rounded-xl font-semibold hover:bg-slate-50 transition-colors flex justify-center items-center"
                                >
                                    Batal
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Email Surel</p>
                                <p className="text-slate-900 font-medium">{user.email}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Nomor Telepon</p>
                                <p className="text-slate-900 font-medium">{user.phone_number || <span className="text-slate-400 italic font-normal">Belum ditambahkan</span>}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT COL: ORDERS */}
            <div className="lg:col-span-8">
                <div className="flex items-end justify-between mb-8 pb-4 border-b border-slate-100">
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Riwayat Pembelian</h2>
                    <span className="text-sm text-slate-500">{orders.length} Transaksi</span>
                </div>

                {loadingOrders ? (
                    <div className="py-20 flex justify-center">
                        <div className="w-8 h-8 border-2 border-slate-200 border-t-cyan-600 rounded-full animate-spin"></div>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="py-20 text-center bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                        <Package size={48} strokeWidth={1} className="mx-auto text-slate-300 mb-4" />
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Riwayat Pesanan Kosong</h3>
                        <p className="text-slate-500 mb-8 max-w-sm mx-auto">Anda belum memiliki riwayat pesanan saat ini.</p>
                        <Link href="/products" className="inline-flex items-center gap-2 bg-cyan-600 text-white px-8 py-3 rounded-full font-medium hover:bg-cyan-700 transition-all shadow-md shadow-cyan-600/20">
                            Mulai Belanja <ArrowRight size={16} />
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => {
                            const isFailed = order.status === "Cancelled" || order.payment_status === "expired" || order.payment_status === "failed";
                            const isSuccess = order.status === "Completed" && order.payment_status === "paid";
                            
                            const statusColor = isFailed ? "bg-red-50 text-red-600 border-red-100" 
                                              : isSuccess ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                                              : "bg-amber-50 text-amber-600 border-amber-100";
                            
                            const StatusIcon = isFailed ? XCircle : isSuccess ? CheckCircle : Clock;

                            return (
                                <div key={order.order_id} className="border border-slate-100 rounded-xl p-4 sm:p-5 hover:border-slate-200 transition-all bg-white group">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${statusColor.replace('text-', 'bg-').replace('600', '100')}`}>
                                                <StatusIcon size={18} className={isFailed ? 'text-red-500' : isSuccess ? 'text-emerald-500' : 'text-amber-500'} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 tracking-tight">#{order.order_id}</p>
                                                <p className="text-xs text-slate-500">{order.created_at}</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-3 sm:gap-6">
                                            <div className="text-right">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Total</p>
                                                <p className="text-sm font-bold text-cyan-600">Rp {Number(order.total_price).toLocaleString("id-ID")}</p>
                                            </div>

                                            <div className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${statusColor}`}>
                                                {order.status}
                                            </div>

                                            {(order.payment_status === "unpaid" || order.payment_status === "pending") && !isFailed && (
                                                <button 
                                                    onClick={() => handleContinuePayment(order.order_id)}
                                                    className="px-4 py-2 bg-cyan-600 text-white font-bold text-[11px] rounded-full hover:bg-cyan-700 transition-all shadow-md shadow-cyan-600/10 flex items-center gap-1.5"
                                                >
                                                    Bayar <ArrowRight size={12} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {order.tracking_number && (
                                        <div className="mt-3 pt-3 border-t border-slate-50 flex items-center gap-2">
                                            <Package size={14} className="text-slate-400" />
                                            <p className="text-xs text-slate-500">Resi: <span className="font-medium text-slate-700">{order.tracking_number}</span></p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            
        </div>
      </div>
    </div>
  );
}
