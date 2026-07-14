"use client";

import { FaWhatsapp } from "react-icons/fa";
import Link from "next/link";
import { useEffect, useState } from "react";

export function FloatingWhatsApp({ phoneNumber }: { phoneNumber: string | null }) {
  const [mounted, setMounted] = useState(false);
  const number = phoneNumber || "+919849050752"; // Fallback to provided number

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Link 
      href={`https://wa.me/${number.replace(/[^0-9]/g, '')}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#1ebd5a] text-white rounded-full shadow-[0_4px_20px_rgba(37,211,102,0.4)] transition-transform hover:scale-110 group"
      aria-label="Contact us on WhatsApp"
    >
      <span className="absolute w-full h-full rounded-full bg-[#25D366] animate-ping opacity-75 group-hover:opacity-0" />
      <FaWhatsapp className="w-8 h-8 relative z-10" />
    </Link>
  );
}
