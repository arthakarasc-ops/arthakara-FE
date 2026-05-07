import Navbar from "@/components/ui/Navbar";
import Collection from "@/components/collection/CollectionPage";

export default function CollectionDetail({ params }) {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <Collection slug={params.slug} />
    </div>
  );
}