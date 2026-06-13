"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchProductDetail } from "@/app/api/ProductApi";
import { useAuth } from "@/components/context/AuthContext";
import { useCart } from "@/components/context/CartContext";
import LoginModal from "@/components/ui/LoginModal";
import { Check, Minus, Plus, ShoppingBag, ShoppingCart, ArrowRight, X, Copy } from "lucide-react";

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { token, isAuthenticated } = useAuth();
  const { addBulkItem, loading: cartLoading } = useCart();
  const BASE_URL = "https://arthakara.id/api";
  const IMAGE_BASE_URL = "https://arthakara.id";

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  // WIZARD STATE
  const [showWizard, setShowWizard] = useState(false);
  const [configurations, setConfigurations] = useState([]); // Array of arrays

  // MODAL STATE
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchProductDetail(id);
      if (!data) {
        console.error("Product not found or API error");
      }
      setProduct(data);
      setLoading(false);
    };

    loadData();
  }, [id]);

  // Reset qty when variant changes to ensure it doesn't exceed new stock
  useEffect(() => {
      if (selectedVariant && quantity > selectedVariant.stock) {
          setQuantity(selectedVariant.stock > 0 ? 1 : 0);
      } else if (selectedVariant && quantity === 0 && selectedVariant.stock > 0) {
          setQuantity(1);
      }
  }, [selectedVariant]);

  // =========================
  // QTY
  // =========================
  const increaseQty = () => {
    if (selectedVariant && quantity >= selectedVariant.stock) return;
    setQuantity((q) => q + 1);
  };

  const decreaseQty = () => {
    if (quantity > 1) setQuantity((q) => q - 1);
  };

  // =========================
  // OPEN WIZARD
  // =========================
  const handleOpenWizard = () => {
    if (!selectedVariant) return alert("Pilih varian warna terlebih dahulu.");
    if (selectedVariant.stock === 0) return alert("Maaf, stok habis.");
    if (quantity < 1) return;

    // Inisialisasi konfigurasi kosong sebanyak quantity
    const initialConfigs = Array.from({ length: quantity }, () => []);
    setConfigurations(initialConfigs);
    setShowWizard(true);
  };

  // =========================
  // WIZARD SCENT SELECTION
  // =========================
  const addScentToConfig = (configIndex, scent) => {
    const newConfigs = [...configurations];
    if (newConfigs[configIndex].length >= 2) {
        // Ganti yang kedua
        newConfigs[configIndex] = [newConfigs[configIndex][0], scent];
    } else {
        newConfigs[configIndex].push(scent);
    }
    setConfigurations(newConfigs);
  };

  const removeScentFromConfig = (configIndex, scentIndex) => {
    const newConfigs = [...configurations];
    newConfigs[configIndex].splice(scentIndex, 1);
    setConfigurations(newConfigs);
  };

  const copyToAll = (sourceIndex) => {
    const sourceConfig = configurations[sourceIndex];
    if (sourceConfig.length !== 2) return alert("Pilih 2 wangi terlebih dahulu sebelum menyamakan semua.");
    const newConfigs = Array.from({ length: quantity }, () => [...sourceConfig]);
    setConfigurations(newConfigs);
  };

  // =========================
  // PROCESS SUBMIT
  // =========================
  const getCollapsedConfigs = () => {
    const collapsedConfigs = [];
    configurations.forEach(config => {
        const sortedIds = [...config].map(s => s.id).sort((a,b) => a - b);
        const existing = collapsedConfigs.find(c => {
             const cSorted = [...c.scents].map(s => s.id).sort((a,b) => a - b);
             return JSON.stringify(cSorted) === JSON.stringify(sortedIds);
        });
        if (existing) {
             existing.qty += 1;
        } else {
             collapsedConfigs.push({ scents: config, qty: 1 });
        }
    });
    return collapsedConfigs;
  };

  const handleBulkAddToCart = async () => {
    const collapsedConfigs = getCollapsedConfigs();
    const payload = collapsedConfigs.map(config => ({
        product_variant_id: selectedVariant.id,
        scents: config.scents.map(s => s.id),
        qty: config.qty
    }));

    if (!isAuthenticated) {
        setShowLoginModal(true);
        return;
    }

    setAddingToCart(true);
    const res = await addBulkItem(payload);
    setAddingToCart(false);

    if (res.success) {
        alert("Produk berhasil ditambahkan ke keranjang!");
        setShowWizard(false);
    } else {
        alert(res.error || "Gagal menambah ke keranjang");
    }
  };

  const handleBulkCheckout = () => {
    const collapsedConfigs = getCollapsedConfigs();
    const directBuyItems = collapsedConfigs.map(config => {
        const scentExtraTotal = config.scents.reduce((sum, s) => sum + (s.extra_price || 0), 0);
        return {
            product_variant_id: selectedVariant.id,
            quantity: config.qty,
            scents: config.scents.map(s => s.id),
            scentDetails: config.scents.map(s => ({ id: s.id, name: s.name, extra_price: s.extra_price })),
            name: product.name,
            price: product.price + scentExtraTotal,
            subtotal: (product.price + scentExtraTotal) * config.qty
        };
    });

    const params = new URLSearchParams({
      direct_buy_items: JSON.stringify(directBuyItems)
    });

    router.push(`/checkout?${params.toString()}`);
  };

  // =========================
  // DIRECT CHECKOUT (NO SCENTS)
  // =========================
  const handleDirectAddToCart = async () => {
    if (!isAuthenticated) return setShowLoginModal(true);
    setAddingToCart(true);
    const payload = [{
        product_variant_id: selectedVariant.id,
        scents: [],
        qty: quantity
    }];
    const res = await addBulkItem(payload);
    setAddingToCart(false);
    if (res.success) {
        alert("Produk berhasil ditambahkan ke keranjang!");
    } else {
        alert(res.error || "Gagal menambah ke keranjang");
    }
  };

  const handleDirectCheckout = () => {
    const directBuyItems = [{
        product_variant_id: selectedVariant.id,
        quantity: quantity,
        scents: [],
        scentDetails: [],
        name: product.name,
        price: product.price,
        subtotal: product.price * quantity
    }];
    const params = new URLSearchParams({
      direct_buy_items: JSON.stringify(directBuyItems)
    });
    router.push(`/checkout?${params.toString()}`);
  };

  // =========================
  // RENDERS
  // =========================
  if (loading) {
    return (
        <div className="min-h-screen bg-slate-50 flex justify-center items-center">
            <div className="w-12 h-12 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin"></div>
        </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 flex justify-center items-center">
          <div className="text-center p-10 bg-white rounded-2xl shadow-sm border border-slate-100">
            <ShoppingBag size={48} className="mx-auto text-slate-300 mb-4" />
            <h2 className="text-xl font-bold text-slate-700 mb-2">Produk Tidak Ditemukan</h2>
            <p className="text-slate-500">Maaf, produk yang Anda cari tidak tersedia atau telah dihapus.</p>
            <button onClick={() => router.push('/products')} className="mt-6 px-6 py-2 bg-cyan-600 text-white rounded-full hover:bg-cyan-700 transition-colors">
                Kembali ke Katalog
            </button>
          </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 selection:bg-cyan-200 selection:text-cyan-900 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <nav className="text-sm text-slate-500 mb-8 flex items-center gap-2">
            <button onClick={() => router.push('/')} className="hover:text-cyan-600 transition-colors">Home</button>
            <span>/</span>
            <button onClick={() => router.push('/products')} className="hover:text-cyan-600 transition-colors">Produk</button>
            <span>/</span>
            <span className="text-slate-900 font-medium truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100/50 overflow-hidden">
            <div className="flex flex-col lg:flex-row">

                {/* IMAGE */}
                <div className="w-full lg:w-1/2 p-4 sm:p-8 border-b lg:border-b-0 lg:border-r border-slate-100 bg-slate-50/50">
                    <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-100">
                        <img
                            src={
                              product?.usage_image
                                ? product.usage_image.startsWith("http")
                                  ? product.usage_image
                                  : `${IMAGE_BASE_URL}/storage/${product.usage_image}`
                                : "/no-image.png"
                            }
                            alt={product?.name}
                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                        />
                    </div>
                </div>

                {/* DETAILS */}
                <div className="w-full lg:w-1/2 p-6 sm:p-10 flex flex-col">
                    <div className="mb-8">
                        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 leading-tight tracking-tight">
                            {product.name}
                        </h1>
                        <p className="text-3xl text-cyan-600 font-bold tracking-tight">
                            Rp {Number(product.price).toLocaleString("id-ID")}
                        </p>
                    </div>

                    {product.description && (
                        <div className="mb-8">
                            <p className="text-slate-600 leading-relaxed">
                                {product.description}
                            </p>
                        </div>
                    )}

                    <hr className="border-slate-100 mb-8" />

                    {/* VARIANTS */}
                    <div className="mb-8">
                        <div className="flex justify-between items-end mb-3">
                            <h3 className="font-semibold text-slate-900">
                                Pilih Warna <span className="text-cyan-600">*</span>
                            </h3>
                            {selectedVariant && (
                                <span className={`text-sm font-medium ${selectedVariant.stock > 0 ? "text-emerald-600" : "text-red-500"}`}>
                                    {selectedVariant.stock > 0 ? `Stok: ${selectedVariant.stock}` : "Stok Habis"}
                                </span>
                            )}
                        </div>

                        {product.variants?.length > 0 ? (
                        <div className="flex gap-3 flex-wrap">
                            {product.variants.map((v) => {
                                const isSelected = selectedVariant?.id === v.id;
                                const isOutOfStock = v.stock === 0;

                                return (
                                    <button
                                        key={v.id}
                                        onClick={() => !isOutOfStock && setSelectedVariant(v)}
                                        disabled={isOutOfStock}
                                        className={`group relative flex items-center gap-3 px-4 py-2.5 rounded-full border transition-all duration-300
                                            ${isSelected 
                                                ? "border-cyan-600 bg-cyan-50/50 shadow-sm ring-1 ring-cyan-600" 
                                                : isOutOfStock 
                                                    ? "border-slate-200 bg-slate-50 opacity-60 cursor-not-allowed" 
                                                    : "border-slate-200 bg-white hover:border-cyan-400 hover:shadow-sm"
                                            }`}
                                    >
                                        <span className={`text-sm font-medium ${isSelected ? 'text-cyan-800' : isOutOfStock ? 'text-slate-400' : 'text-slate-700'}`}>
                                            {v.color || "No Color"}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                        ) : (
                        <p className="text-slate-500 text-sm italic">Tidak ada varian tersedia.</p>
                        )}
                    </div>

                    {/* QTY */}
                    <div className="mb-8 flex-1">
                        <h3 className="font-semibold text-slate-900 mb-3">
                            Kuantitas <span className="text-cyan-600">*</span>
                        </h3>
                        <div className="flex items-center bg-slate-100 rounded-full border border-slate-200 p-1 w-max">
                            <button
                                onClick={decreaseQty}
                                disabled={quantity <= 1}
                                className="w-10 h-10 flex justify-center items-center rounded-full text-slate-600 hover:bg-white hover:shadow-sm disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:shadow-none transition-all"
                            >
                                <Minus size={16} />
                            </button>
                            <span className="w-12 text-center font-bold text-slate-900">{quantity}</span>
                            <button
                                onClick={increaseQty}
                                disabled={selectedVariant && quantity >= selectedVariant.stock}
                                className="w-10 h-10 flex justify-center items-center rounded-full text-slate-600 hover:bg-white hover:shadow-sm disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:shadow-none transition-all"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                    </div>

                    <hr className="border-slate-100 mb-8" />

                    {/* BUTTON ACTIONS */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        {product.scents?.length > 0 ? (
                            <button
                                onClick={handleOpenWizard}
                                disabled={!selectedVariant || selectedVariant.stock === 0}
                                className="flex-1 bg-cyan-600 text-white py-4 rounded-full font-bold shadow-md hover:bg-cyan-700 hover:shadow-lg disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none disabled:cursor-not-allowed transition-all duration-300 flex justify-center items-center gap-2"
                            >
                                {selectedVariant?.stock === 0 ? "Stok Habis" : "Lanjut Pilih Wangi"}
                                {selectedVariant?.stock !== 0 && <ArrowRight size={20} />}
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={handleDirectAddToCart}
                                    disabled={!selectedVariant || selectedVariant.stock === 0 || addingToCart}
                                    className="flex-1 py-4 rounded-full font-bold border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white transition-all disabled:border-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                                >
                                    <ShoppingCart size={20} /> Ke Keranjang
                                </button>
                                <button
                                    onClick={handleDirectCheckout}
                                    disabled={!selectedVariant || selectedVariant.stock === 0 || addingToCart}
                                    className="flex-1 bg-cyan-600 text-white py-4 rounded-full font-bold shadow-md hover:bg-cyan-700 hover:shadow-lg disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none disabled:cursor-not-allowed transition-all duration-300"
                                >
                                    Beli Sekarang
                                </button>
                            </>
                        )}
                    </div>

                </div>
            </div>
        </div>
      </div>

      {/* =========================
          WIZARD MODAL OVERLAY
      ========================= */}
      {showWizard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                
                {/* WIZARD HEADER */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Konfigurasi Aroma</h2>
                        <p className="text-slate-500 text-sm mt-1">Pilih 2 aroma untuk setiap produk yang Anda beli ({quantity} produk)</p>
                    </div>
                    <button onClick={() => setShowWizard(false)} className="p-2 rounded-full hover:bg-slate-200 text-slate-500 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* WIZARD BODY */}
                <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
                    <div className="space-y-6">
                        {configurations.map((config, index) => (
                            <div key={index} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-lg text-slate-800">
                                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-cyan-100 text-cyan-700 text-xs mr-2">
                                            {index + 1}
                                        </span>
                                        Produk {index + 1}
                                    </h3>
                                    {index === 0 && quantity > 1 && (
                                        <button 
                                            onClick={() => copyToAll(index)}
                                            className="text-xs font-semibold flex items-center gap-1.5 text-cyan-600 hover:text-cyan-800 bg-cyan-50 px-3 py-1.5 rounded-full transition-colors"
                                        >
                                            <Copy size={14} /> Samakan ke semua
                                        </button>
                                    )}
                                </div>
                                
                                {/* SCENT SLOTS */}
                                <div className="flex gap-3 mb-4">
                                    {/* Slot 1 */}
                                    <div className="flex-1 border-2 border-dashed border-slate-200 rounded-xl p-3 flex flex-col justify-center min-h-[60px] bg-slate-50/50">
                                        {config[0] ? (
                                            <div className="flex items-center justify-between bg-cyan-50 text-cyan-800 px-3 py-2 rounded-lg border border-cyan-100">
                                                <span className="font-medium text-sm">{config[0].name}</span>
                                                <button onClick={() => removeScentFromConfig(index, 0)} className="text-cyan-600 hover:text-cyan-900"><X size={16}/></button>
                                            </div>
                                        ) : (
                                            <span className="text-slate-400 text-sm text-center font-medium">Slot Wangi 1</span>
                                        )}
                                    </div>
                                    {/* Slot 2 */}
                                    <div className="flex-1 border-2 border-dashed border-slate-200 rounded-xl p-3 flex flex-col justify-center min-h-[60px] bg-slate-50/50">
                                        {config[1] ? (
                                            <div className="flex items-center justify-between bg-cyan-50 text-cyan-800 px-3 py-2 rounded-lg border border-cyan-100">
                                                <span className="font-medium text-sm">{config[1].name}</span>
                                                <button onClick={() => removeScentFromConfig(index, 1)} className="text-cyan-600 hover:text-cyan-900"><X size={16}/></button>
                                            </div>
                                        ) : (
                                            <span className="text-slate-400 text-sm text-center font-medium">Slot Wangi 2</span>
                                        )}
                                    </div>
                                </div>

                                {/* AVAILABLE SCENTS */}
                                <div>
                                    <p className="text-xs text-slate-500 font-semibold mb-2 uppercase tracking-wider">Pilih dari sini:</p>
                                    <div className="flex gap-2 flex-wrap">
                                        {product.scents?.map((s) => (
                                            <button
                                                key={s.id}
                                                onClick={() => addScentToConfig(index, s)}
                                                className="px-3 py-1.5 rounded-full border border-slate-200 text-sm font-medium text-slate-600 hover:border-cyan-400 hover:bg-cyan-50 hover:text-cyan-800 transition-colors bg-white shadow-sm"
                                            >
                                                {s.name}
                                                {s.extra_price > 0 && <span className="text-xs ml-1 text-slate-400">(+{Number(s.extra_price).toLocaleString("id-ID")})</span>}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* WIZARD FOOTER */}
                <div className="p-6 border-t border-slate-100 bg-white flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="text-sm font-medium text-slate-500">
                        Total:{' '}
                        <span className="text-xl font-bold text-slate-900 ml-1">
                            Rp {configurations.reduce((sum, config) => sum + (product?.price || 0) + config.reduce((s, scent) => s + (scent.extra_price || 0), 0), 0).toLocaleString("id-ID")}
                        </span>
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                        <button
                            onClick={handleBulkAddToCart}
                            disabled={addingToCart}
                            className="flex-1 sm:flex-none px-6 py-3 rounded-full font-bold border-2 border-slate-900 text-slate-900 bg-white hover:bg-slate-900 hover:text-white transition-all disabled:border-slate-200 disabled:text-slate-400 disabled:bg-slate-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {addingToCart ? "Memproses..." : <><ShoppingCart size={18} className="mr-2"/> Ke Keranjang</>}
                        </button>
                        <button
                            onClick={handleBulkCheckout}
                            disabled={addingToCart}
                            className="flex-1 sm:flex-none px-6 py-3 rounded-full font-bold bg-cyan-600 text-white shadow-md hover:bg-cyan-700 hover:shadow-lg transition-all disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none disabled:cursor-not-allowed"
                        >
                            Beli Sekarang
                        </button>
                    </div>
                </div>

            </div>
        </div>
      )}

      {/* =========================
          LOGIN MODAL OVERLAY
      ========================= */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
        redirectUrl={`/products/${id}`} 
      />
    </div>
  );
}
