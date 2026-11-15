"use server";

import prisma from "@/lib/prisma";
import { logClassicEdgeAiTrace } from "@/lib/ai-logger";

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
  { id: "page-classic-concepts", title: "Classic Concepts", description: "Showcasing our completed projects and acrylic fabrication concepts.", url: "/classicconcepts", keywords: ["concepts", "projects", "gallery", "portfolio", "examples"] },
  { id: "page-about", title: "About Us", description: "Learn about Classic Edge 53, our heritage, leadership team, and branches.", url: "/about", keywords: ["about", "company", "team", "history", "branches", "clients"] },
  { id: "page-certificates", title: "Certificates", description: "View our awards, ISO certifications, and recognitions.", url: "/certificates", keywords: ["certificates", "awards", "iso", "recognition", "quality"] },
  { id: "page-contact", title: "Contact Us", description: "Get in touch with us for inquiries, support, and sales.", url: "/contact", keywords: ["contact", "support", "email", "phone", "location", "address", "enquire"] },
];

export async function globalSearch(query: string): Promise<SearchResult[]> {
  const startedAt = Date.now();
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

  const combined = [...pageResults, ...productResults, ...consumableResults];

  logClassicEdgeAiTrace({
    feature: "Classic Edge 53 Global Search",
    actor: "Website Visitor",
    question: query.trim(),
    model: "ce53-catalog-index",
    outcomeSource: "LOCAL_FALLBACK",
    responseCacheStatus: "LOCAL_ONLY",
    catalogCacheStatus: "HIT",
    cacheDetails: "Direct SQLite machine & consumable lookup",
    productLookupTriggered: true,
    productLookupQuery: normalizedQuery,
    productLookupTotalScanned: products.length + consumables.length + STATIC_PAGES.length,
    productsLookedUp: [
      ...productResults.map((p) => ({
        name: p.title,
        brand: "CLASSIC_EDGE_53",
        itemType: "MACHINE",
        url: p.url,
      })),
      ...consumableResults.map((c) => ({
        name: c.title,
        brand: "CLASSIC_EDGE_53",
        itemType: "CONSUMABLE",
        url: c.url,
      })),
    ],
    steps: [
      {
        stepNumber: 1,
        label: "Searched Classic Edge 53 machines, consumables, and static pages",
        detail: `machines=${productResults.length}, consumables=${consumableResults.length}, pages=${pageResults.length}`,
        durationMs: Date.now() - startedAt,
        status: "OK",
      },
    ],
    response:
      combined.length > 0
        ? `Matched ${combined.length} items: ${combined.map((r) => r.title).join(", ")}`
        : "0 matching machines or consumables",
    durationMs: Date.now() - startedAt,
  });

  // Combine and return results
  return combined;
}
