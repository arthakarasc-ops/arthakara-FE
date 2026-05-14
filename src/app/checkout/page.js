import { Suspense } from "react";
import Navbar from "@/components/ui/Navbar";
import Checkout from "@/components/checkout/CheckoutPage";

export default function checkoutPage() {
  return (
    <main className="min-h-screen bg-slate-50 font-sans pt-28 pb-20">
      <Navbar />
      <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh]">Loading...</div>}>
        <Checkout />
      </Suspense>
    </main>
  );
}