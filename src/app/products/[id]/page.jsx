import { Suspense } from "react";
import ProductDetail from "@/components/product/ProductDetail";
import Navbar from "@/components/ui/Navbar";

export async function generateStaticParams() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://arthakara.id/api'}/products`, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 3600 }
    });
    if (!res.ok) return [];
    const products = await res.json();
    
    // Memastikan data adalah array (biasanya Laravel mengembalikan array langsung atau di dalam 'data')
    const productsArray = Array.isArray(products) ? products : (products.data || []);

    return productsArray.map((product) => ({
      id: product.id.toString(),
    }));
  } catch (error) {
    console.error("Failed to fetch static params for products:", error);
    return [];
  }
}

export default function Page() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
        <ProductDetail />
      </Suspense>
    </>
  );
}