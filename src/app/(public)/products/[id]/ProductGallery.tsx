"use client";

import { useState } from "react";
import Image from "next/image";
import { Settings } from "lucide-react";

interface Props {
  coverImage: string | null;
  productName: string;
  images: { id: string; url: string }[];
}

export function ProductGallery({ coverImage, productName, images }: Props) {
  // Combine cover image and additional images into a single array
  const allImages = coverImage ? [{ id: 'cover', url: coverImage }, ...images] : images;
  const [activeImage, setActiveImage] = useState(allImages[0]?.url || null);

  if (allImages.length === 0) {
    return (
      <div className="glass-panel p-2 rounded-3xl">
        <div className="aspect-[4/3] bg-[#0a1120] rounded-2xl flex items-center justify-center relative overflow-hidden">
          <Settings className="w-32 h-32 text-blue-500/10" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="glass-panel p-2 rounded-3xl">
        <div className="aspect-[4/3] bg-[#0a1120] rounded-2xl flex items-center justify-center relative overflow-hidden">
          <Image 
            src={activeImage!} 
            alt={productName} 
            fill 
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain" 
            priority
          />
        </div>
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {allImages.map((img) => (
            <button 
              key={img.id}
              type="button"
              onClick={() => setActiveImage(img.url)}
              className={`aspect-square bg-[#0a1120] rounded-xl relative overflow-hidden border-2 transition-colors cursor-pointer ${
                activeImage === img.url ? "border-blue-500" : "border-white/5 hover:border-blue-500/50"
              }`}
            >
              <Image src={img.url} alt={`${productName} thumbnail`} fill sizes="(max-width: 768px) 25vw, 15vw" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
