import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Package, ChevronRight } from "lucide-react";
import { ProductActionButtons } from "@/app/(public)/products/[id]/ProductActionButtons";

export const revalidate = 3600; // Revalidate every hour

export async function generateStaticParams() {
  const consumables = await prisma.consumable.findMany({ select: { id: true } });
  return consumables.map((c) => ({
    id: c.id,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const consumable = await prisma.consumable.findUnique({
    where: { id: resolvedParams.id },
  });

  if (!consumable) {
    return {
      title: "Consumable Not Found",
    };
  }

  const description = consumable.description?.substring(0, 160) || "Premium quality part/accessory for Classic Edge 53 machines.";
  const title = `${consumable.name} | Classic Edge 53`;

  return {
    title,
    description,
    keywords: consumable.keywords ? consumable.keywords.split(",") : [consumable.name, "accessory", "part"],
    openGraph: {
      title,
      description,
      url: `https://classicedge53.com/consumables/${consumable.id}`,
      siteName: 'Classic Edge 53',
      type: 'website',
      ...(consumable.image && {
        images: [
          {
            url: consumable.image,
            width: 1200,
            height: 630,
            alt: consumable.name,
          }
        ]
      })
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(consumable.image && { images: [consumable.image] }),
    },
  };
}

export default async function ConsumableDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  const [consumable, settings] = await Promise.all([
    prisma.consumable.findUnique({
      where: { id: resolvedParams.id },
      include: {
        products: true,
        models: true
      }
    }),
    prisma.siteSettings.findFirst()
  ]);

  if (!consumable) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/consumables" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-8 font-medium transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Consumables
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <div className="space-y-4">
          <div className="glass-panel p-2 rounded-3xl">
            <div className="aspect-[4/3] bg-[#0a1120] rounded-2xl flex items-center justify-center relative overflow-hidden">
               {consumable.image ? (
                  <Image src={consumable.image} alt={consumable.name} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-contain" />
                ) : (
                  <Package className="w-32 h-32 text-blue-500/10" />
                )}
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <div className="inline-block px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm font-semibold tracking-wide mb-6 self-start">
            CONSUMABLE DETAILS
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{consumable.name}</h1>
          <p className="text-lg text-slate-400 mb-8 leading-relaxed">
            {consumable.description || "Premium quality part/accessory for Classic Edge 53 machines."}
          </p>

          <ProductActionButtons 
            productName={consumable.name} 
            whatsappNumber={settings?.whatsappNumber || null} 
          />
        </div>
      </div>

      {/* Compatible Products */}
      {consumable.products.length > 0 && (
        <div className="mt-20 pt-16 border-t border-white/10">
          <div className="text-center mb-10">
             <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Compatible Machines</h2>
             <p className="text-slate-400">This consumable can be used with the following products</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {consumable.products.map(product => (
              <Link href={`/products/${product.id}`} key={product.id} className="glass-panel border border-white/5 rounded-2xl p-4 hover:border-blue-500/50 transition-all group">
                <div className="aspect-square bg-[#050b14] rounded-xl mb-4 relative overflow-hidden">
                  {product.coverImage ? (
                    <Image src={product.coverImage} alt={product.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-700">No Image</div>
                  )}
                </div>
                <h3 className="font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors line-clamp-2">{product.name}</h3>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm text-blue-400 font-medium">View Machine</span>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Compatible Models */}
      {consumable.models.length > 0 && (
        <div className="mt-16">
          <div className="text-center mb-10">
             <h2 className="text-2xl font-bold text-white mb-2">Specific Models Supported</h2>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            {consumable.models.map(model => (
              <div key={model.id} className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 font-medium text-blue-300 shadow-sm">
                {model.modelName}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
