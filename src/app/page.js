import Navbar from '@/components/ui/Navbar';
import Hero from '@/components/ui/Hero';
import About from '@/components/section/About';
import Values from '@/components/section/Values';
import CollectionSection from '@/components/collection/CollectionSection';
import Contact from '@/components/section/Contact';
import Ourtim from '@/components/section/Ourtim';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#faebd7] font-sans">
      <Navbar />
      <div className="flex flex-col">
        <Hero />
        <About />
        <Values />
        <Ourtim />
        <CollectionSection />
        <Contact />
      </div>
    </main>
  );
}