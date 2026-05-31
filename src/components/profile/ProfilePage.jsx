"use client";

import { useAuth } from "@/components/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { User, Mail, Phone, LogOut, ArrowLeft, Edit3, X, Check, Package, Clock, CheckCircle, XCircle, ArrowRight, Camera } from "lucide-react";
import { getUserOrders, updateUserProfile } from "@/lib/api";

export default function ProfilePage() {
  const { user, token, isAuthenticated, logout, loading, updateUser } = useAuth();
  const router = useRouter();
  
  // Profile State
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: "", phone: "" });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");

  // Orders State
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

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
    if (isAuthenticated) fetchOrders();
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
      <div className="min-h-screen bg-[#faebd7] flex items-center justify-center">
        <div className="w-12 h-12 border-[3px] border-cyan-600/20 border-t-cyan-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return null;

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setUpdateMessage("");
    try {
      const formData = new FormData();
      formData.append("_method", "PUT");
      formData.append("full_name", (editData.name || "").trim());
      formData.append("phone_number", (editData.phone || "").trim());
      if (avatarFile) formData.append("avatar", avatarFile);

      const { status, data } = await updateUserProfile(token, formData);
      if (status !== 200) {
        let errorMsg = data.error || data.message || "Gagal memperbarui profil.";
        if (data.errors) errorMsg = Object.values(data.errors)[0][0];
        throw new Error(errorMsg);
      }

      if (data.data) updateUser(data.data);

      setUpdateMessage("✓ Profil berhasil diperbarui.");
      setIsEditing(false);
      setAvatarFile(null);
      setTimeout(() => setUpdateMessage(""), 3000);
    } catch (error) {
      setUpdateMessage("✗ " + (error.message || "Terjadi kesalahan."));
    } finally {
      setIsSaving(false);
    }
  };

  const handleContinuePayment = async (orderId) => {
    try {
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
      if (!payRes.ok) {
        alert(payData.message || "Gagal membuat sesi pembayaran.");
        return;
      }
      if (window.snap) {
        window.snap.pay(payData.snap_token, {
          onSuccess: () => { alert("Pembayaran berhasil!"); window.location.reload(); },
          onPending: () => { alert("Menunggu pembayaran diselesaikan."); window.location.reload(); },
          onError: () => alert("Pembayaran gagal atau dibatalkan."),
        });
      } else {
        alert("Sistem pembayaran belum siap. Silakan muat ulang halaman.");
      }
    } catch (err) {
      alert("Terjadi kesalahan sistem: " + err.message);
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  // Pagination Logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#faebd7] font-sans selection:bg-cyan-600 selection:text-white pt-24 pb-20 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-white/40 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-cyan-100/30 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <Link href="/" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-cyan-700 transition-colors group mb-6">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-2 transition-transform" />
              Kembali ke Beranda
            </Link>
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight">Personal Space</h1>
          </div>
          
          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center px-6 py-3 bg-white border border-slate-200 rounded-full text-sm font-bold text-slate-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all shadow-sm group"
          >
            <LogOut className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
            Keluar Sesi
          </button>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT: PROFILE CARD */}
          <div className="lg:col-span-4 lg:sticky lg:top-32 space-y-6">
            <div className="bg-white/70 backdrop-blur-xl p-8 rounded-[2rem] border border-white shadow-xl shadow-cyan-900/5 relative overflow-hidden group">
              {/* Card Decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-cyan-100/50 to-transparent rounded-bl-full opacity-50"></div>

              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="absolute top-6 right-6 p-2.5 text-slate-400 hover:text-cyan-600 bg-white rounded-full border border-slate-100 shadow-sm hover:shadow transition-all z-10"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              )}

              <div className="flex flex-col items-center text-center mb-8 relative z-10">
                <div className="relative mb-6">
                  <div className="w-28 h-28 bg-gradient-to-tr from-cyan-600 to-sky-400 text-white rounded-full flex items-center justify-center text-3xl font-bold tracking-widest shadow-lg shadow-cyan-600/30 overflow-hidden ring-4 ring-white">
                    {avatarPreview || user.avatar ? (
                      <img src={avatarPreview || user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      getInitials(user.full_name || user.name)
                    )}
                  </div>
                  {isEditing && (
                    <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer opacity-0 hover:opacity-100 transition-opacity">
                      <Camera className="text-white w-8 h-8" />
                      <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                    </label>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-1">{user.full_name || user.name || "Pelanggan"}</h2>
                <span className="px-4 py-1 bg-cyan-50 text-cyan-700 rounded-full text-xs font-bold tracking-widest uppercase border border-cyan-100">
                  Member
                </span>
              </div>

              {updateMessage && (
                <div className={`mb-6 p-4 rounded-2xl text-sm font-semibold text-center ${
                  updateMessage.startsWith("✓") ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-red-50 text-red-700 border border-red-100"
                }`}>
                  {updateMessage}
                </div>
              )}

              {isEditing ? (
                <div className="space-y-5 animate-in fade-in zoom-in-95 duration-300">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block ml-1">Nama Lengkap</label>
                    <input
                      type="text"
                      name="name"
                      value={editData.name}
                      onChange={handleEditChange}
                      className="w-full px-5 py-4 bg-slate-50 border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all text-slate-900 font-medium placeholder:text-slate-400"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block ml-1">Nomor Telepon</label>
                    <input
                      type="tel"
                      name="phone"
                      value={editData.phone}
                      onChange={handleEditChange}
                      className="w-full px-5 py-4 bg-slate-50 border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all text-slate-900 font-medium placeholder:text-slate-400"
                    />
                  </div>

                  <div className="flex flex-col gap-3 pt-4">
                    <button
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-cyan-600 disabled:bg-slate-300 transition-colors flex justify-center items-center gap-2 shadow-lg hover:shadow-cyan-600/30"
                    >
                      {isSaving ? "Menyimpan..." : <><Check size={18} /> Simpan Perubahan</>}
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="w-full bg-white text-slate-500 py-4 rounded-2xl font-bold hover:bg-slate-50 hover:text-slate-900 transition-colors"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 pt-4 border-t border-slate-100/60">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 flex-shrink-0">
                      <Mail size={16} />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Email</p>
                      <p className="text-slate-900 font-medium truncate">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 flex-shrink-0">
                      <Phone size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Phone</p>
                      <p className="text-slate-900 font-medium">{user.phone_number || <span className="text-slate-400 italic font-normal">Not added yet</span>}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: ORDERS */}
          <div className="lg:col-span-8">
            <div className="bg-white/70 backdrop-blur-xl p-8 md:p-10 rounded-[2rem] border border-white shadow-xl shadow-cyan-900/5 min-h-[600px] flex flex-col">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Order History</h2>
                  <p className="text-slate-500">Lacak dan kelola pesanan Anda di sini.</p>
                </div>
                <div className="bg-slate-100/80 px-4 py-2 rounded-full text-sm font-bold text-slate-600">
                  {orders.length} Transaksi
                </div>
              </div>

              {loadingOrders ? (
                <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                  <div className="w-10 h-10 border-[3px] border-slate-200 border-t-cyan-600 rounded-full animate-spin"></div>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Memuat Pesanan...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center mb-6 border border-slate-100">
                    <Package size={40} className="text-slate-300" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Belum ada pesanan</h3>
                  <p className="text-slate-500 mb-8 max-w-sm">Temukan produk Arvena Shell favoritmu dan mulai ciptakan ruang yang lebih nyaman.</p>
                  <Link href="/products" className="inline-flex items-center justify-center px-8 py-4 bg-slate-900 text-white rounded-full font-bold hover:bg-cyan-600 transition-all shadow-lg hover:shadow-cyan-600/30 gap-2">
                    Mulai Belanja <ArrowRight size={18} />
                  </Link>
                </div>
              ) : (
                <div className="flex-1 flex flex-col justify-between">
                  <div className="space-y-5">
                    {currentOrders.map((order) => {
                      const isFailed = order.status === "Cancelled" || order.payment_status === "expired" || order.payment_status === "failed";
                      const isSuccess = order.status === "Completed" && order.payment_status === "paid";
                      
                      let statusTheme = "bg-amber-50 text-amber-700 border-amber-100 icon-amber-500";
                      let StatusIcon = Clock;
                      
                      if (isFailed) {
                        statusTheme = "bg-red-50 text-red-700 border-red-100 icon-red-500";
                        StatusIcon = XCircle;
                      } else if (isSuccess) {
                        statusTheme = "bg-emerald-50 text-emerald-700 border-emerald-100 icon-emerald-500";
                        StatusIcon = CheckCircle;
                      } else if (order.payment_status === "paid") {
                        statusTheme = "bg-cyan-50 text-cyan-700 border-cyan-100 icon-cyan-500";
                        StatusIcon = Package; // processing/shipped
                      }

                      const [bgClass, textClass, borderClass, iconClass] = statusTheme.split(' ');

                      return (
                        <div key={order.order_id} className="group bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all">
                          <div className="flex flex-col sm:flex-row justify-between gap-6">
                            
                            <div className="flex items-start gap-4">
                              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${bgClass} ${borderClass} border`}>
                                <StatusIcon size={20} className={iconClass.replace('icon-', 'text-')} />
                              </div>
                              <div>
                                <p className="text-lg font-bold text-slate-900 tracking-tight mb-1">#{order.order_id}</p>
                                <p className="text-xs text-slate-400 font-medium mb-3">{order.created_at}</p>
                                <span className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${bgClass} ${textClass} ${borderClass}`}>
                                  {order.status} • {order.payment_status}
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-col sm:items-end justify-between gap-4">
                              <div className="sm:text-right bg-slate-50 sm:bg-transparent p-4 sm:p-0 rounded-xl">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Belanja</p>
                                <p className="text-xl font-bold text-slate-900">Rp {Number(order.total_price).toLocaleString("id-ID")}</p>
                              </div>

                              {(order.payment_status === "unpaid" || order.payment_status === "pending") && !isFailed && (
                                <button 
                                  onClick={() => handleContinuePayment(order.order_id)}
                                  className="w-full sm:w-auto px-6 py-3 bg-cyan-600 text-white font-bold text-sm rounded-full hover:bg-cyan-700 transition-all shadow-lg shadow-cyan-600/20 flex items-center justify-center gap-2"
                                >
                                  Bayar Sekarang <ArrowRight size={16} />
                                </button>
                              )}
                            </div>
                          </div>
                          
                          {order.tracking_number && (
                            <div className="mt-5 pt-5 border-t border-slate-100 flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                                <Package size={14} />
                              </div>
                              <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Nomor Resi</p>
                                <p className="text-sm font-bold text-slate-900 tracking-wide">{order.tracking_number}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-between">
                      <button 
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border border-slate-200 rounded-full text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        Prev
                      </button>
                      
                      <div className="flex gap-2">
                        {Array.from({ length: totalPages }, (_, i) => (
                          <button
                            key={i + 1}
                            onClick={() => paginate(i + 1)}
                            className={`w-8 h-8 rounded-full text-sm font-bold transition-all ${
                              currentPage === i + 1
                                ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/20"
                                : "bg-white text-slate-500 hover:bg-slate-50 hover:text-cyan-700 border border-slate-100"
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                      </div>

                      <button 
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 border border-slate-200 rounded-full text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
