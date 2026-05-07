"use client";
import Navbar from "@/components/ui/Navbar";
import TeamCarousel from "@/components/section/Ourtim";

export default function OurTimPage() {
  return (
    <main className="min-h-screen bg-[#faebd7] font-sans">
        <Navbar />
      <div className="">
        <TeamCarousel />
      </div>
    </main>
  );
}