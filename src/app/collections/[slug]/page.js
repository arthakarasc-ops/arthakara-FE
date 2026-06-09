import Navbar from "@/components/ui/Navbar";
import Collection from "@/components/collection/CollectionPage";

export async function generateStaticParams() {
  try {
    const res = await fetch('https://arthakara.id/api/collections', {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 3600 }
    });
    if (!res.ok) return [];
    const data = await res.json();
    const collections = data.data || [];
    
    return collections.map((col) => ({
      slug: col.slug,
    }));
  } catch (error) {
    console.error("Failed to fetch static params for collections:", error);
    return [];
  }
}

export default async function CollectionDetail({ params }) {
  // Await params for Next.js 15 compatibility
  const resolvedParams = await params;
  
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <Collection slug={resolvedParams.slug} />
    </div>
  );
}