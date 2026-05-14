import Navbar from "@/components/ui/Navbar";
import Collection from "@/components/collection/CollectionPage";

export async function generateStaticParams() {
  const res = await fetch('https://arthakara-api-production.up.railway.app/api/collections', {
    headers: { 'Accept': 'application/json' }
  });
  const data = await res.json();
  const collections = data.data || [];
  
  return collections.map((col) => ({
    slug: col.slug,
  }));
}

export default function CollectionDetail({ params }) {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <Collection slug={params.slug} />
    </div>
  );
}