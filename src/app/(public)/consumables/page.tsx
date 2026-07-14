import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { Package, ChevronRight } from "lucide-react";

import { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Consumables | Classic Edge 53",
  description: "High-quality parts and accessories matched perfectly to your Classic Edge 53 precision machines to ensure maximum uptime and consistent results.",
  keywords: ["acrylic machine parts", "accessories", "consumables", "spares"],
};

export default async function ConsumablesPage() {
  const consumables = await prisma.consumable.findMany({
    orderBy: { createdAt: "desc" },
    include: { products: true, models: true }
  });

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
          Premium Consumables
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          High-quality parts and accessories matched perfectly to your Classic Edge 53 precision machines to ensure maximum uptime and consistent results.
        </p>
      </div>

      {consumables.length === 0 ? (
        <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
          <Package className="w-16 h-16 text-slate-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">No Consumables Found</h2>
          <p className="text-slate-400">We are updating our inventory. Please check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {consumables.map((item) => (
            <div key={item.id} className="glass-panel border border-white/5 rounded-3xl p-5 group hover:border-blue-500/50 transition-all duration-300">
              <div className="aspect-[4/3] bg-[#050b14] rounded-2xl mb-5 relative overflow-hidden flex items-center justify-center">
                {item.image ? (
                  <Image src={item.image} alt={item.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <Package className="w-12 h-12 text-slate-600" />
                )}
              </div>
              
              <h2 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{item.name}</h2>
              <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                {item.description || "Premium quality accessory"}
              </p>

              {/* Badges for compatibility */}
              <div className="flex flex-wrap gap-2 mb-6">
                {item.products.length > 0 && (
                  <span className="text-xs font-medium px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md">
                    {item.products.length} Machines
                  </span>
                )}
                {item.models.length > 0 && (
                  <span className="text-xs font-medium px-2 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md">
                    {item.models.length} Models
                  </span>
                )}
              </div>
              
              <Link href={`/consumables/${item.id}`} className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-blue-600/20 text-white hover:text-blue-400 rounded-xl font-medium transition-all group-hover:border-blue-500/30 border border-transparent">
                View Details <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
