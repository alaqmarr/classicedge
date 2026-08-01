"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface HeroImageCarouselProps {
  images: string[];
}

export function HeroImageCarousel({ images }: HeroImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000); // Rotate every 4 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  if (images.length === 0) return null;

  return (
    <div className="relative aspect-square md:aspect-[4/3] glass-panel rounded-2xl flex items-center justify-center border border-white/10 overflow-hidden group">
      {images.map((src, idx) => (
        <Image
          key={src + idx}
          src={src}
          alt={`Acrylic fabrication machine ${idx}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className={`absolute inset-0 object-cover transition-all duration-1000 ${
            idx === currentIndex ? "opacity-100 scale-100 z-10" : "opacity-0 scale-105 z-0"
          } group-hover:scale-105`}
          priority={idx === 0}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 pointer-events-none"></div>
      
      {/* Optional: Indicator dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              idx === currentIndex ? "bg-blue-500 w-6" : "bg-white/30 hover:bg-white/50"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
