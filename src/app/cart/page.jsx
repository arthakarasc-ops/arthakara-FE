"use client";

import { useCart } from "@/components/context/CartContext";
import Navbar from "@/components/ui/Navbar";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { cartItems, cartTotal, updateQty, removeItem, loading } = useCart();
  const router = useRouter();

  if (loading && cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-slate-200 border-t-cyan-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white selection:bg-cyan-200 selection:text-cyan-900 font-sans">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        
        {/* HEADER */}
        <div className="mb-12 border-b border-slate-100 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight">
              Shopping Cart
            </h1>
            <p className="text-slate-500 mt-2 text-lg">
              {cartItems.length} products selected
            </p>
          </div>
          <Link href="/products" className="text-sm font-semibold text-slate-900 flex items-center gap-2 hover:text-cyan-600 transition-colors group">
            Continue Exploration
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 sm:py-20 text-center animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 mb-6 text-slate-200">
              <ShoppingBag size={80} strokeWidth={1} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">Shopping Cart Empty</h2>
            <p className="text-slate-500 mb-8 max-w-sm">You don't have any products in your cart yet. Please explore our product catalog.</p>
            <Link href="/products">
              <button className="bg-cyan-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-cyan-700 transition-all shadow-lg shadow-cyan-600/20 flex items-center gap-2">
                Start Shopping <ArrowRight size={18} />
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
            
            {/* ITEMS LIST */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-8">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-6 sm:gap-8 group border-b border-slate-100 pb-8 last:border-0">
                  
                  {/* IMAGE */}
                  <Link href={`/products/${item.product_id}`} className="w-28 h-36 sm:w-40 sm:h-48 bg-slate-50 rounded-2xl overflow-hidden flex-shrink-0 relative">
                    <img 
                      src={item.image_url || "/no-image.png"} 
                      alt={item.product_name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>
                  </Link>
                  
                  {/* DETAIL */}
                  <div className="flex flex-col flex-grow justify-between py-1">
                    <div>
                      <div className="flex justify-between items-start gap-4 mb-2">
                        <Link href={`/products/${item.product_id}`}>
                            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 hover:text-cyan-600 transition-colors leading-tight">
                                {item.product_name}
                            </h3>
                        </Link>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-slate-400 hover:text-red-500 transition-colors p-2 -mr-2 -mt-2 rounded-full hover:bg-red-50"
                        >
                          <Trash2 size={20} strokeWidth={1.5} />
                        </button>
                      </div>
                      
                      <div className="text-sm text-slate-500 space-y-1.5 mb-4">
                        <p className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded-full border border-slate-200 inline-block" style={{backgroundColor: item.color_hex || '#e2e8f0'}}></span>
                            {item.color}
                        </p>
                        <p className="flex items-start gap-2">
                            <span className="opacity-70 mt-0.5">Scent:</span>
                            <span className="text-slate-700 font-medium">{item.scents.map(s => s.name).join(", ")}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4">
                      
                      {/* QTY CONTROL */}
                      <div className="flex items-center gap-1 bg-slate-50 rounded-full p-1 border border-slate-100 w-max">
                        <button 
                          onClick={() => updateQty(item.id, Math.max(1, item.qty - 1))}
                          className="w-8 h-8 flex items-center justify-center rounded-full text-slate-500 hover:bg-cyan-600 hover:text-white hover:shadow-sm transition-all"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-sm font-bold text-slate-900">{item.qty}</span>
                        <button 
                          onClick={() => updateQty(item.id, item.qty + 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-full text-slate-500 hover:bg-cyan-600 hover:text-white hover:shadow-sm transition-all"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      
                      <p className="text-xl font-bold text-slate-900 tracking-tight">
                        Rp {item.subtotal.toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* SUMMARY (STICKY) */}
            <div className="lg:col-span-5 xl:col-span-4">
              <div className="bg-slate-50/50 p-8 sm:p-10 rounded-3xl border border-slate-100 sticky top-32">
                <h2 className="text-2xl font-bold mb-6 text-slate-900 tracking-tight">Summary</h2>
                
                <div className="space-y-4 mb-8 pb-8 border-b border-slate-200/60">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-medium text-slate-900">Rp {cartTotal.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Shipping</span>
                    <span className="text-sm italic text-slate-400">Calculated at checkout</span>
                  </div>
                </div>

                <div className="flex justify-between items-end mb-10">
                  <span className="text-lg font-bold text-slate-900">Total</span>
                  <span className="text-3xl font-bold text-cyan-700 tracking-tight">
                    Rp {cartTotal.toLocaleString("id-ID")}
                  </span>
                </div>

                <Link href="/checkout" className="block w-full">
                  <button className="w-full bg-cyan-600 text-white py-4 rounded-full font-bold tracking-wide hover:bg-cyan-700 shadow-lg shadow-cyan-600/20 transition-all flex justify-center items-center gap-2">
                    Proceed to Checkout <ArrowRight size={18} />
                  </button>
                </Link>
                
                <div className="mt-8 flex items-center justify-center gap-6 opacity-40 grayscale">
                    {/* Fake payment logos for aesthetic */}
                    <div className="h-6 w-10 bg-slate-400 rounded"></div>
                    <div className="h-6 w-10 bg-slate-400 rounded"></div>
                    <div className="h-6 w-10 bg-slate-400 rounded"></div>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
