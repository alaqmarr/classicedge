import Link from "next/link";
import { getProducts } from "@/app/actions/product";
import { Settings, ArrowRight, Download, PackageOpen } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Products & Machines | Classic Edge 53",
  description: "Browse our complete catalog of industrial acrylic fabrication machines, including CNC routers, diamond edge polishers, and laser cutters.",
  keywords: ["acrylic fabrication machines", "diamond polishing", "flame polishing", "acrylic bending"],
};

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Machines</h1>
        <p className="text-xl text-slate-400">Precision equipment for every acrylic fabrication need.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.length === 0 ? (
          <div className="col-span-full text-center text-slate-500 py-20">
            No machines found. Check back later!
          </div>
        ) : (
          products.map(product => (
            <Link key={product.id} href={`/products/${product.id}`} className="glass-panel p-6 rounded-2xl group hover:border-blue-500/30 transition-colors block">
              <div className="aspect-video bg-[#0a1120] rounded-xl mb-6 flex items-center justify-center border border-white/5 overflow-hidden relative">
                {product.coverImage ? (
                  <Image src={product.coverImage} alt={product.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <Settings className="w-16 h-16 text-blue-500/20 group-hover:scale-110 transition-transform duration-500" />
                )}
              </div>
              <h3 className="font-semibold text-xl mb-2">{product.name}</h3>
              <p className="text-slate-400 text-sm line-clamp-2 mb-4 h-10">{product.description}</p>
              
              <div className="flex items-center justify-between border-t border-white/10 pt-4">
                <span className="text-blue-400 text-sm font-medium">{product.models.length} Models Available</span>
                <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-blue-400 transition-colors" />
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
