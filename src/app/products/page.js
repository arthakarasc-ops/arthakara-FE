import Navbar from "@/components/ui/Navbar";
import ProdukPage from "@/components/product/ProdukPage";

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-[#faebd7]">
      <Navbar />
      <div className="">
        <ProdukPage />
      </div>
    </main>
  );
}