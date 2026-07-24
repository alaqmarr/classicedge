import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Settings, CheckCircle2, Download, FileText, ChevronRight } from "lucide-react";
import { ProductActionButtons } from "./ProductActionButtons";
import { ProductGallery } from "./ProductGallery";

export const revalidate = 3600; // Revalidate every hour

export async function generateStaticParams() {
  const products = await prisma.product.findMany({ select: { id: true } });
  return products.map((product) => ({
    id: product.id,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await prisma.product.findUnique({
    where: { id: resolvedParams.id },
  });

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  const description = product.description?.substring(0, 160) || "Precision acrylic fabrication machine";
  const title = `${product.name} | Classic Edge 53`;

  return {
    title,
    description,
    keywords: product.keywords ? product.keywords.split(",") : [product.name, "acrylic machine", "fabrication"],
    openGraph: {
      title,
      description,
      url: `https://classicedge53.com/products/${product.id}`,
      siteName: 'Classic Edge 53',
      type: 'website',
      ...(product.coverImage && {
        images: [
          {
            url: product.coverImage,
            width: 1200,
            height: 630,
            alt: product.name,
          }
        ]
      })
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(product.coverImage && { images: [product.coverImage] }),
    },
  };
}

export default async function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  // Fetch product and settings in parallel
  const [product, settings] = await Promise.all([
    prisma.product.findUnique({
      where: { id: resolvedParams.id },
      include: {
        images: true,
        resources: true,
        features: true,
        specifications: true,
        consumables: true,
        models: {
          include: {
            specifications: true,
            resources: true,
          }
        }
      }
    }),
    prisma.siteSettings.findFirst()
  ]);

  if (!product) {
    notFound();
  }

  // Find all unique specification keys across all models to build the table headers
  const allModelSpecKeys = Array.from(new Set(
    product.models.flatMap(model => model.specifications.map(spec => spec.key))
  ));

  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/products" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-8 font-medium transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Machines
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <div className="space-y-4">
          <ProductGallery 
            coverImage={product.coverImage} 
            productName={product.name} 
            images={product.images} 
          />
        </div>

        <div className="flex flex-col justify-center">
          <div className="inline-block px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-semibold tracking-wide mb-6 self-start">
            PRODUCT DETAILS
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{product.name}</h1>
          <p className="text-lg text-slate-400 mb-8 leading-relaxed">
            {product.description || "The high-efficiency acrylic computer automatic machine series is based on the precise mechanical structure. It's one of the preferred equipment for the manufacturers of modern medium-high end acrylic products, advertising signs and craft products."}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {product.features.length > 0 ? (
              product.features.map(feature => (
                <div key={feature.id} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                  <span className="text-slate-300">{feature.text}</span>
                </div>
              ))
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                  <span className="text-slate-300">High Efficiency</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                  <span className="text-slate-300">Precise Control</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                  <span className="text-slate-300">Durable Build</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                  <span className="text-slate-300">24x7 Support</span>
                </div>
              </>
            )}
          </div>

          <ProductActionButtons 
            productName={product.name} 
            whatsappNumber={settings?.whatsappNumber || null} 
          />

          {/* Root level resources */}
          {product.resources.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4 text-white">Downloads & Resources</h3>
              <div className="grid gap-3">
                {product.resources.map(res => (
                  <a 
                    key={res.id} 
                    href={res.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 glass-panel border border-white/10 rounded-xl hover:bg-white/5 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-blue-400" />
                      <span className="font-medium text-slate-300 group-hover:text-white transition-colors">{res.name}</span>
                    </div>
                    <Download className="w-5 h-5 text-slate-500 group-hover:text-blue-400 transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Root level specifications if no models */}
      {product.models.length === 0 && product.specifications.length > 0 && (
        <div className="mt-20">
          <div className="text-center mb-10">
             <h2 className="text-2xl md:text-3xl font-bold text-blue-400 mb-2">Technical Specifications</h2>
          </div>
          <div className="max-w-3xl mx-auto glass-panel border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <div className="divide-y divide-white/5">
              {product.specifications.map((spec, idx) => (
                <div key={spec.id} className={`flex justify-between p-5 ${idx % 2 === 0 ? "bg-white/[0.02]" : "bg-transparent"}`}>
                  <span className="font-medium text-slate-400">{spec.key}</span>
                  <span className="font-semibold text-white text-right">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Model specifications table */}
      {product.models.length > 0 && (
        <div className="mt-20">
          <div className="text-center mb-10">
             <h2 className="text-2xl md:text-3xl font-bold text-blue-400 mb-2">Model Specifications</h2>
          </div>
          
          <div className="glass-panel border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-center border-collapse">
                <thead>
                  <tr className="bg-[#172554]/50">
                    <th className="p-4 border-b border-r border-white/10 font-bold text-slate-200">
                      Model
                    </th>
                    {allModelSpecKeys.map(key => (
                      <th key={key} className="p-4 border-b border-r border-white/10 font-bold text-slate-200">
                        {key}
                      </th>
                    ))}
                    <th className="p-4 border-b border-white/10 font-bold text-slate-200">Resources</th>
                  </tr>
                </thead>
                <tbody>
                  {product.models.map((model, idx) => (
                    <tr key={model.id} className={idx % 2 === 0 ? "bg-white/[0.04]" : "bg-white/[0.01] hover:bg-white/[0.06] transition-colors"}>
                      <td className="p-4 border-b border-r border-white/10 font-bold text-blue-400 bg-[#172554]/30 whitespace-nowrap shadow-[inset_-1px_0_0_rgba(255,255,255,0.1)]">
                        {model.modelName}
                      </td>
                      {allModelSpecKeys.map(key => {
                        const spec = model.specifications.find(s => s.key === key);
                        return (
                          <td key={key} className="p-4 border-b border-r border-white/10 text-slate-300">
                            {spec?.value || "-"}
                          </td>
                        );
                      })}
                      <td className="p-4 border-b border-white/10">
                        {model.resources.length > 0 ? (
                           <div className="flex flex-col gap-2 items-center">
                            {model.resources.map(res => (
                              <a key={res.id} href={res.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                                <Download className="w-3 h-3" /> {res.name}
                              </a>
                            ))}
                           </div>
                        ) : (
                          <span className="text-slate-500">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Recommended Consumables */}
      {product.consumables.length > 0 && (
        <div className="mt-24 pt-16 border-t border-white/10">
          <div className="text-center mb-12">
             <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Recommended Consumables</h2>
             <p className="text-slate-400">Perfectly matched supplies for your {product.name}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {product.consumables.map(consumable => (
              <Link href={`/consumables`} key={consumable.id} className="glass-panel border border-white/5 rounded-2xl p-4 hover:border-blue-500/50 transition-all group">
                <div className="aspect-square bg-[#050b14] rounded-xl mb-4 relative overflow-hidden">
                  {consumable.image ? (
                    <Image src={consumable.image} alt={consumable.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-700">No Image</div>
                  )}
                </div>
                <h3 className="font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors">{consumable.name}</h3>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm text-blue-400 font-medium">View Details</span>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
