"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchProductDetail } from "@/app/api/ProductApi";
import { useCart } from "@/components/context/CartContext";
import { Check, Minus, Plus, ShoppingBag, ShoppingCart } from "lucide-react";

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { addItem, loading: cartLoading } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedScents, setSelectedScents] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

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

  // =========================
  // QTY
  // =========================
  const increaseQty = () => {
    if (selectedVariant && quantity >= selectedVariant.stock) {
        // limit to stock
        return;
    }
    setQuantity((q) => q + 1);
  };

  const decreaseQty = () => {
    if (quantity > 1) setQuantity((q) => q - 1);
  };

  // Reset qty when variant changes to ensure it doesn't exceed new stock
  useEffect(() => {
      if (selectedVariant && quantity > selectedVariant.stock) {
          setQuantity(selectedVariant.stock > 0 ? 1 : 0);
      } else if (selectedVariant && quantity === 0 && selectedVariant.stock > 0) {
          setQuantity(1);
      }
  }, [selectedVariant]);

  // =========================
  // SELECT SCENT (WAJIB 2, HARUS BERBEDA)
  // =========================
  const handleSelectScent = (scent) => {
    const isSelected = selectedScents.find((s) => s.id === scent.id);

    if (isSelected) {
      // remove
      setSelectedScents(selectedScents.filter((s) => s.id !== scent.id));
    } else {
      if (selectedScents.length >= 2) {
        // Instead of an alert, we can just replace the last one or do nothing.
        // Let's replace the first one chosen to make it smoother, or just alert nicely.
        // Replacing the oldest selected scent:
        setSelectedScents([selectedScents[1], scent]);
        return;
      }

      setSelectedScents([...selectedScents, scent]);
    }
  };

  // =========================
  // TOTAL PRICE (termasuk extra scent price)
  // =========================
  const scentExtraTotal = selectedScents.reduce(
    (sum, s) => sum + (s.extra_price || 0),
    0
  );
  const totalPrice = ((product?.price || 0) + scentExtraTotal) * quantity;

  // =========================
  // ADD TO CART
  // =========================
  const handleAddToCart = async () => {
    if (!selectedVariant) return alert("Pilih varian warna terlebih dahulu.");
    if (selectedVariant.stock === 0) return alert("Maaf, stok habis.");
    if (selectedScents.length !== 2) return alert("Silakan pilih 2 pilihan wangi.");

    setAddingToCart(true);
    const res = await addItem({
      product_variant_id: selectedVariant.id,
      scents: selectedScents.map((s) => s.id),
      qty: quantity,
    });
    setAddingToCart(false);

    if (res.success) {
      alert("Produk berhasil ditambahkan ke keranjang!");
    } else {
      alert(res.error || "Gagal menambahkan ke keranjang");
    }
  };

  // =========================
  // CHECKOUT -> langsung ke halaman checkout
  // =========================
  const handleCheckout = () => {
    if (!selectedVariant) return alert("Pilih varian warna terlebih dahulu.");
    if (selectedVariant.stock === 0) return alert("Maaf, stok habis.");

    if (selectedScents.length !== 2) {
      return alert("Silakan pilih 2 pilihan wangi yang berbeda.");
    }

    // Kirim data ke checkout via URL params
    const params = new URLSearchParams({
      product_id: product.id,
      product_variant_id: selectedVariant.id,
      scents: JSON.stringify(selectedScents.map((s) => s.id)),
      scentDetails: JSON.stringify(selectedScents.map((s) => ({ id: s.id, name: s.name, price: s.price }))),
      name: product.name,
      price: (product.price + scentExtraTotal), // Update price with scents
      quantity: quantity,
    });

    router.push(`/checkout?${params.toString()}`);
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
        <div className="min-h-screen bg-slate-50 flex justify-center items-center">
            <div className="w-12 h-12 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin"></div>
        </div>
    );
  }

  // =========================
  // ERROR
  // =========================
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
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 selection:bg-cyan-200 selection:text-cyan-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* BREADCRUMB */}
        <nav className="text-sm text-slate-500 mb-8 flex items-center gap-2">
            <button onClick={() => router.push('/')} className="hover:text-cyan-600 transition-colors">Home</button>
            <span>/</span>
            <button onClick={() => router.push('/products')} className="hover:text-cyan-600 transition-colors">Produk</button>
            <span>/</span>
            <span className="text-slate-900 font-medium truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100/50 overflow-hidden">
            <div className="flex flex-col lg:flex-row">

                {/* IMAGE GALLERY */}
                <div className="w-full lg:w-1/2 p-4 sm:p-8 border-b lg:border-b-0 lg:border-r border-slate-100 bg-slate-50/50">
                    <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-100">
                        <img
                            src={product?.usage_image || "/no-image.png"}
                            alt={product?.name}
                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                        />
                    </div>
                </div>

                {/* PRODUCT DETAILS */}
                <div className="w-full lg:w-1/2 p-6 sm:p-10 flex flex-col">
                    
                    {/* TITLE & PRICE */}
                    <div className="mb-8">
                        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 leading-tight tracking-tight">
                            {product.name}
                        </h1>
                        <p className="text-3xl text-cyan-600 font-bold tracking-tight">
                            Rp {Number(product.price).toLocaleString("id-ID")}
                        </p>
                    </div>

                    {/* DESCRIPTION */}
                    {product.description && (
                        <div className="mb-8">
                            <p className="text-slate-600 leading-relaxed">
                                {product.description}
                            </p>
                        </div>
                    )}

                    <hr className="border-slate-100 mb-8" />

                    {/* =========================
                        PILIH WARNA (1 WAJIB)
                    ========================= */}
                    <div className="mb-8">
                        <div className="flex justify-between items-end mb-3">
                            <h3 className="font-semibold text-slate-900">
                                Pilih Varian <span className="text-cyan-600">*</span>
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
                                        {/* Color Swatch */}
                                        {v.color_hex && (
                                            <span
                                                className="w-5 h-5 rounded-full border border-slate-200 shadow-sm relative flex items-center justify-center"
                                                style={{ backgroundColor: v.color_hex }}
                                            >
                                                {isSelected && <Check size={12} className={v.color_hex.toLowerCase() === '#ffffff' ? 'text-slate-900' : 'text-white'} />}
                                            </span>
                                        )}
                                        <span className={`text-sm font-medium ${isSelected ? 'text-cyan-800' : isOutOfStock ? 'text-slate-400' : 'text-slate-700'}`}>
                                            {v.color || "No Color"}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                        ) : (
                        <p className="text-slate-500 text-sm italic">
                            Tidak ada varian tersedia.
                        </p>
                        )}
                    </div>

                    {/* =========================
                        PILIH WANGI (WAJIB 2 BERBEDA)
                    ========================= */}
                    <div className="mb-8">
                        <div className="flex justify-between items-end mb-3">
                            <h3 className="font-semibold text-slate-900">
                                Pilih 2 Aroma <span className="text-cyan-600">*</span>
                            </h3>
                            <span className="text-sm text-slate-500 font-medium">
                                {selectedScents.length}/2 Dipilih
                                {selectedScents.length === 2 && (
                                    <span className="text-emerald-500 ml-1">✓</span>
                                )}
                            </span>
                        </div>

                        {product.scents?.length > 0 ? (
                        <div className="flex gap-2.5 flex-wrap">
                            {product.scents.map((s) => {
                            const isActive = selectedScents.some((x) => x.id === s.id);

                            return (
                                <button
                                key={s.id}
                                onClick={() => handleSelectScent(s)}
                                className={`px-4 py-2 rounded-full border text-sm font-medium transition-all duration-300
                                    ${isActive
                                        ? "bg-slate-900 text-white border-slate-900 shadow-md"
                                        : "bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:bg-slate-50"
                                    }`}
                                >
                                    {s.name}
                                    {s.extra_price > 0 && (
                                        <span className={`text-xs ml-1.5 ${isActive ? 'text-slate-300' : 'text-slate-400'}`}>
                                        (+{Number(s.extra_price).toLocaleString("id-ID")})
                                        </span>
                                    )}
                                </button>
                            );
                            })}
                        </div>
                        ) : (
                        <p className="text-slate-500 text-sm italic">
                            Tidak ada aroma tersedia.
                        </p>
                        )}
                    </div>

                    <hr className="border-slate-100 mb-8 mt-auto" />

                    {/* QTY & TOTAL CONTAINER */}
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
                        
                        {/* QTY */}
                        <div>
                            <h3 className="font-semibold text-slate-900 mb-3 text-sm uppercase tracking-wider">Kuantitas</h3>
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

                        {/* TOTAL */}
                        <div className="sm:text-right">
                            <h3 className="font-semibold text-slate-500 mb-1 text-sm uppercase tracking-wider">Total Harga</h3>
                            <p className="text-3xl font-bold text-slate-900 tracking-tight">
                                Rp {totalPrice.toLocaleString("id-ID")}
                            </p>
                        </div>

                    </div>

                    {/* BUTTONS */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={handleAddToCart}
                            disabled={!selectedVariant || selectedVariant.stock === 0 || selectedScents.length !== 2 || addingToCart}
                            className="flex-1 bg-white text-slate-900 border-2 border-slate-900 py-3.5 rounded-full font-bold hover:bg-slate-900 hover:text-white disabled:bg-slate-50 disabled:text-slate-400 disabled:border-slate-200 disabled:cursor-not-allowed transition-all duration-300 flex justify-center items-center gap-2"
                        >
                            {addingToCart ? (
                                <>
                                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></span>
                                Memproses...
                                </>
                            ) : (
                                <>
                                <ShoppingCart size={20} />
                                Masukkan Keranjang
                                </>
                            )}
                        </button>

                        <button
                            onClick={handleCheckout}
                            disabled={!selectedVariant || selectedVariant.stock === 0 || selectedScents.length !== 2}
                            className="flex-1 bg-cyan-600 text-white py-3.5 rounded-full font-bold shadow-md hover:bg-cyan-700 hover:shadow-lg disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none disabled:cursor-not-allowed transition-all duration-300 flex justify-center items-center gap-2"
                        >
                            {selectedVariant?.stock === 0
                                ? "Stok Habis"
                                : selectedScents.length !== 2
                                ? "Lengkapi Pilihan"
                                : "Beli Sekarang"
                            }
                        </button>
                    </div>

                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
