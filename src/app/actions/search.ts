"use server";

import prisma from "@/lib/prisma";

export type SearchResult = {
  id: string;
  type: "MACHINE" | "CONSUMABLE" | "PAGE";
  title: string;
  description: string;
  url: string;
  image?: string | null;
};

const STATIC_PAGES = [
  { id: "page-home", title: "Home", description: "Classic Edge 53 Official Website - Precision Acrylic Fabrication", url: "/", keywords: ["home", "main", "start", "classic edge", "acrylic fabrication"] },
  { id: "page-machines", title: "Machines", description: "Explore our range of high-precision acrylic fabrication machines.", url: "/products", keywords: ["machines", "products", "equipment", "diamond polishing", "flame polishing", "acrylic bending"] },
  { id: "page-consumables", title: "Consumables", description: "High-quality parts and accessories matched perfectly to your machines.", url: "/consumables", keywords: ["consumables", "parts", "accessories", "spares", "maintenance"] },
  { id: "page-classic-concepts", title: "Classic Concepts", description: "Showcasing our completed projects and acrylic fabrication concepts.", url: "/classic-concepts", keywords: ["concepts", "projects", "gallery", "portfolio", "examples"] },
  { id: "page-certificates", title: "Certificates", description: "View our awards, ISO certifications, and recognitions.", url: "/certificates", keywords: ["certificates", "awards", "iso", "recognition", "quality"] },
  { id: "page-contact", title: "Contact Us", description: "Get in touch with us for inquiries, support, and sales.", url: "/contact", keywords: ["contact", "support", "email", "phone", "location", "address", "enquire"] },
];

export async function globalSearch(query: string): Promise<SearchResult[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const normalizedQuery = query.toLowerCase().trim();

  // 1. Search Static Pages
  const pageResults = STATIC_PAGES.filter(page => {
    return page.title.toLowerCase().includes(normalizedQuery) ||
           page.description.toLowerCase().includes(normalizedQuery) ||
           page.keywords.some(kw => kw.includes(normalizedQuery));
  }).map(page => ({
    id: page.id,
    type: "PAGE" as const,
    title: page.title,
    description: page.description,
    url: page.url,
  }));

  // 2. Search Database (Products and Consumables) in parallel
  const [products, consumables] = await Promise.all([
    prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: normalizedQuery } },
          { description: { contains: normalizedQuery } },
          { keywords: { contains: normalizedQuery } }
        ]
      },
      take: 5
    }),
    prisma.consumable.findMany({
      where: {
        OR: [
          { name: { contains: normalizedQuery } },
          { description: { contains: normalizedQuery } },
          { keywords: { contains: normalizedQuery } }
        ]
      },
      take: 5
    })
  ]);

  const productResults = products.map(p => ({
    id: `prod-${p.id}`,
    type: "MACHINE" as const,
    title: p.name,
    description: p.description?.substring(0, 100) || "Acrylic fabrication machine",
    url: `/products/${p.id}`,
    image: p.coverImage
  }));

  const consumableResults = consumables.map(c => ({
    id: `cons-${c.id}`,
    type: "CONSUMABLE" as const,
    title: c.name,
    description: c.description?.substring(0, 100) || "Machine consumable",
    url: `/consumables/${c.id}`,
    image: c.image
  }));

  // Combine and return results
  return [...pageResults, ...productResults, ...consumableResults];
}
