"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/5 bg-[#02060d]/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="Classic Edge 53" width={220} height={60} className="object-contain w-[220px] h-auto" />
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/" className="hover:text-blue-400 transition-colors">HOME</Link>
          <Link href="/products" className="hover:text-blue-400 transition-colors">MACHINES</Link>
          <Link href="/consumables" className="hover:text-blue-400 transition-colors">CONSUMABLES</Link>
          <Link href="/classicconcepts" className="hover:text-blue-400 transition-colors">CLASSIC CONCEPTS</Link>
          <Link href="/#about" className="hover:text-blue-400 transition-colors">ABOUT US</Link>
          <Link href="/certificates" className="hover:text-blue-400 transition-colors">CERTIFICATES</Link>
          <Link href="/contact" className="hover:text-blue-400 transition-colors">CONTACT US</Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/contact" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-medium transition-all shadow-[0_0_15px_rgba(37,99,235,0.5)]">
            ENQUIRE NOW
          </Link>
        </div>

        <button 
          className="md:hidden p-2 text-slate-300 z-50"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-20 bg-[#02060d] border-t border-white/5 z-40 overflow-y-auto">
          <nav className="flex flex-col p-6 gap-6 text-lg font-medium">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-blue-400 transition-colors">HOME</Link>
            <Link href="/products" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-blue-400 transition-colors">MACHINES</Link>
            <Link href="/consumables" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-blue-400 transition-colors">CONSUMABLES</Link>
            <Link href="/classicconcepts" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-blue-400 transition-colors">CLASSIC CONCEPTS</Link>
            <Link href="/#about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-blue-400 transition-colors">ABOUT US</Link>
            <Link href="/certificates" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-blue-400 transition-colors">CERTIFICATES</Link>
            <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-blue-400 transition-colors">CONTACT US</Link>
            <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white text-center py-3 rounded-xl font-medium transition-all shadow-[0_0_15px_rgba(37,99,235,0.5)]">
              ENQUIRE NOW
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
