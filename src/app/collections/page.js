import Navbar from '@/components/ui/Navbar';
import CollectionPage from '@/components/collection/CollectionPage';
import Contact from '@/components/section/Contact';

export const metadata = {
  title: 'Koleksi | Arthakara',
  description: 'Jelajahi koleksi produk dari Arthakara',
};

export default function Collections() {
  return (
    <main className="min-h-screen bg-[#faebd7] font-sans">
      <Navbar />
      <CollectionPage/>
      <Contact />
    </main>
  );
}
