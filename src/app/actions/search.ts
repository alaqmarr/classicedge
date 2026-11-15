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

const FALLBACK_CE53_MACHINES = [
  {
    id: "ce53-diamond-edge-polisher",
    name: "Acrylic Diamond Edge Polishing Machine",
    description: "Industrial CNC diamond edge polisher for optical-clarity crystal finishes on thick cast acrylic sheets (3mm to 100mm+).",
    keywords: "diamond edge polishing machine polisher crystal finish cast acrylic thick sheet yn-jw1200 yn-jw1600 1200mm 1600mm 9000 rpm pcd",
    coverImage: null,
  },
  {
    id: "ce53-acrylic-line-bender",
    name: "Acrylic Bending Machine & Strip Heater",
    description: "Precision temperature-controlled quartz heating line bender for clean, bubble-free right-angle and multi-angle acrylic bends.",
    keywords: "acrylic bending machine strip heater line bender quartz heating bend abm-1250 abm-2400 1250mm 2400mm pid water cooling",
    coverImage: null,
  },
  {
    id: "ce53-laser-cutting-system",
    name: "Acrylic Laser Cutting & Engraving Machine",
    description: "High-precision CO2 laser cutting and engraving system engineered for polished-edge cast acrylic fabrication.",
    keywords: "acrylic laser cutting machine co2 engraver cutter sheet fabrication ce-lc1390 ce-lc1325 1300x900 1300x2500",
    coverImage: null,
  },
  {
    id: "ce53-cnc-router-acrylic",
    name: "CNC Router for Acrylic & Engineering Plastics",
    description: "Heavy-duty 3-axis CNC routing and bevelling center for thick acrylic blocks, trophies, signages, and industrial guards.",
    keywords: "cnc router acrylic routing bevelling machine plastics ce-cnc1325 24000 rpm vacuum table",
    coverImage: null,
  },
  {
    id: "ce53-flame-polishing-unit",
    name: "HHO Acrylic Flame Polishing Machine",
    description: "Oxy-hydrogen flame polishing machine for rapid edge polishing of intricate laser-cut or routed acrylic contours.",
    keywords: "flame polishing machine hho oxy hydrogen edge polisher ce-fp160 ce-fp260 electrolytic",
    coverImage: null,
  },
  {
    id: "ce53-thermoforming-oven",
    name: "Acrylic Thermoforming & Draping Oven",
    description: "Uniform forced-air circulation industrial oven for heating cast acrylic sheets prior to dome blowing, molding, or thermoforming.",
    keywords: "acrylic thermoforming oven heating draping dome blowing molding ce-to1525 forced air",
    coverImage: null,
  },
];

const FALLBACK_CE53_CONSUMABLES = [
  {
    id: "ce53-pcd-diamond-blade",
    name: "PCD & Natural Mono-Crystal Diamond Polishing Cutter",
    description: "Precision replacement diamond cutter bit and scoring blade for acrylic diamond edge polishing machines.",
    keywords: "diamond cutter blade pcd polishing tool bit spare consumable",
    category: "Cutting & Polishing Tools",
    image: null,
  },
  {
    id: "ce53-buffing-wheel-compound",
    name: "Cotton Buffing Wheel & Acrylic Polishing Compound",
    description: "Fine cotton buffing wheel and wax compound bar for removing micro-scratches on acrylic edges and surfaces.",
    keywords: "buffing wheel polishing compound wax tool consumable accessory",
    category: "Polishing Consumables",
    image: null,
  },
  {
    id: "ce53-heating-wire-element",
    name: "Nichrome & Quartz Heating Element for Acrylic Bender",
    description: "Replacement heating wire and quartz tube element for Classic Edge 53 acrylic strip heaters and bending machines.",
    keywords: "heating wire quartz tube element spare consumable bender tool",
    category: "Bending Spares",
    image: null,
  },
  {
    id: "ce53-acrylic-bonding-solvent",
    name: "Bubble-Free Acrylic Bonding Solvent & Applicator Needle",
    description: "Fast-curing capillary acrylic welding solvent and precision applicator bottle for crystal-clear joints.",
    keywords: "acrylic solvent glue adhesive bonding applicator needle consumable",
    category: "Bonding Consumables",
    image: null,
  },
];

function isDummyCe53Row(id?: string | null, name?: string | null): boolean {
  const cleanId = String(id || "").trim().toLowerCase();
  const cleanName = String(name || "").trim().toLowerCase();
  return !cleanName || cleanId === "test" || cleanName === "test" || /^test\s+product\b/i.test(cleanName);
}

const CE53_STOPWORDS = new Set([
  "a", "an", "am", "are", "as", "at", "be", "but", "by", "can", "do", "does",
  "for", "from", "get", "give", "have", "hello", "hey", "hi", "how", "i", "im",
  "in", "into", "is", "it", "just", "looking", "look", "me", "my", "need", "no",
  "not", "of", "on", "only", "or", "our", "please", "said", "show", "some",
  "that", "the", "to", "us", "want", "we", "what", "which", "with", "you",
  "your", "actually", "acrylic", "classic", "edge", "53",
]);

const CE53_SYNONYM_GROUPS: string[][] = [
  ["polisher", "polishing", "polish", "diamond", "buffing", "cloudy", "edge"],
  ["bender", "bending", "bend", "heater", "heating", "strip", "line"],
  ["laser", "router", "cnc", "cutter", "cutting", "blade", "blades", "saw"],
  ["oven", "thermoforming", "forming", "draping", "moulding", "molding"],
  ["consumable", "consumables", "tool", "tools", "accessory", "accessories", "spare", "spares", "solvent", "chloroform", "glue", "adhesive"],
];

function tokenizeCe53(text: string): string[] {
  return String(text || "")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

function tokenMatchesCe53Word(word: string, token: string): boolean {
  if (word === token) return true;
  if (token.length >= 4 && word.length >= 4) {
    if (word === `${token}s` || token === `${word}s`) return true;
    if (word === `${token}es` || token === `${word}es`) return true;
    if (
      token.length >= 5 &&
      (word.startsWith(token) || (word.length >= 5 && token.startsWith(word)))
    ) {
      return true;
    }
  }
  return false;
}

export async function globalSearch(query: string): Promise<SearchResult[]> {
  const startedAt = Date.now();
  if (!query || query.trim().length < 2) {
    return [];
  }

  const normalizedQuery = query.toLowerCase().trim();

  // 0. Gate non-product conversational greetings, identity, or off-topic queries
  if (
    /^[\s\W]*(hi+|hello+|hey+|good\s*(?:morning|afternoon|evening)|thanks|thank\s+you|who\s+are\s+you|what\s+can\s+you\s+do|i\s+have\s+a\s+different\s+query)[\s\W]*$/i.test(
      normalizedQuery
    ) ||
    /\b(weather|cricket|football|recipe|biryani|pizza|bitcoin|stock\s*market|horoscope|pulpit|pulpits|podium|podiums|lectern|trophy|trophies|memento)\b/i.test(
      normalizedQuery
    )
  ) {
    logClassicEdgeAiTrace({
      feature: "Classic Edge 53 Global Search",
      actor: "Website Visitor",
      question: query.trim(),
      model: "ce53-catalog-index",
      outcomeSource: "LOCAL_FALLBACK",
      responseCacheStatus: "LOCAL_ONLY",
      catalogCacheStatus: "BYPASS",
      cacheDetails: "Skipped CE53 machine lookup for non-CE53 or non-product query",
      productLookupTriggered: false,
      productLookupQuery: "",
      productLookupTotalScanned: 0,
      productsLookedUp: [],
      steps: [
        {
          stepNumber: 1,
          label: "Skipped CE53 catalog scan (non-machine or non-product query)",
          detail: `query="${normalizedQuery}"`,
          durationMs: Date.now() - startedAt,
          status: "OK",
        },
      ],
      response: "0 matching machines or consumables",
      durationMs: Date.now() - startedAt,
    });
    return [];
  }

  // Detect item-type negations ("not looking for tools, just machines", "no consumables", "only machines")
  const excludeConsumables =
    /\b(?:not\s+looking\s+for|don'?t\s+want|do\s+not\s+want|no|without|exclude|excluding|skip)\s+(?:any\s+)?(?:tools?|consumables?|blades?|cutters?|solvents?|accessories)\b|\b(?:just|only)\s+machines?\b/i.test(
      normalizedQuery
    );
  const excludeMachines =
    /\b(?:not\s+looking\s+for|don'?t\s+want|do\s+not\s+want|no|without|exclude)\s+(?:any\s+)?machines?\b|\b(?:just|only)\s+(?:tools?|consumables?|blades?|cutters?)\b/i.test(
      normalizedQuery
    );

  const cleanedForTokens = normalizedQuery.replace(
    /\b(?:not\s+looking\s+for|don'?t\s+want|do\s+not\s+want|no|without|exclude|excluding|skip)\s+(?:any\s+)?(?:tools?|consumables?|blades?|cutters?|solvents?|accessories|machines?)\b/gi,
    " "
  );

  const rawTokens = tokenizeCe53(cleanedForTokens).filter(
    (t) =>
      t.length >= 2 &&
      !CE53_STOPWORDS.has(t) &&
      t !== "machine" &&
      t !== "machines"
  );

  const expandedSynonyms = new Set<string>();
  for (const tok of rawTokens) {
    for (const grp of CE53_SYNONYM_GROUPS) {
      if (grp.some((g) => tokenMatchesCe53Word(g, tok))) {
        for (const syn of grp) {
          if (!rawTokens.includes(syn)) expandedSynonyms.add(syn);
        }
      }
    }
  }

  // 1. Search Static Pages
  const pageResults = STATIC_PAGES.filter((page) => {
    if (excludeConsumables && page.id === "page-consumables") return false;
    if (excludeMachines && page.id === "page-machines") return false;
    return (
      page.title.toLowerCase().includes(normalizedQuery) ||
      page.description.toLowerCase().includes(normalizedQuery) ||
      page.keywords.some((kw) => kw.includes(normalizedQuery))
    );
  }).map((page) => ({
    id: page.id,
    type: "PAGE" as const,
    title: page.title,
    description: page.description,
    url: page.url,
  }));

  // 2. Fetch and score Database (Products and Consumables) with tokenized + synonym + deep spec/model/feature matching
  const [rawProducts, rawConsumables] = await Promise.all([
    excludeMachines
      ? Promise.resolve([])
      : prisma.product.findMany({
          include: {
            features: true,
            specifications: true,
            resources: true,
            models: {
              include: {
                specifications: true,
                resources: true,
              },
            },
          },
        }),
    excludeConsumables ? Promise.resolve([]) : prisma.consumable.findMany(),
  ]);

  const validDbProducts = rawProducts.filter((p) => !isDummyCe53Row(p.id, p.name));
  const validDbConsumables = rawConsumables.filter((c) => !isDummyCe53Row(c.id, c.name));

  const allProducts = excludeMachines
    ? []
    : validDbProducts.length > 0
      ? validDbProducts
      : FALLBACK_CE53_MACHINES;

  const allConsumables = excludeConsumables
    ? []
    : validDbConsumables.length > 0
      ? validDbConsumables
      : FALLBACK_CE53_CONSUMABLES;

  const scoreItem = (
    name: string,
    description: string | null,
    keywords: string | null,
    extraBlob = ""
  ): number => {
    const nameLower = name.toLowerCase();
    const descLower = (description || "").toLowerCase();
    const kwLower = `${keywords || ""} ${extraBlob}`.toLowerCase();

    if (
      nameLower.includes(normalizedQuery) ||
      kwLower.includes(normalizedQuery)
    ) {
      return 100;
    }

    if (rawTokens.length === 0) {
      // Bare "just machines" or "machines" query
      return /\bmachines?\b/i.test(cleanedForTokens) ? 25 : 0;
    }

    const nameWords = tokenizeCe53(nameLower);
    const kwWords = tokenizeCe53(kwLower);
    const descWords = tokenizeCe53(descLower);

    let score = 0;
    for (const tok of rawTokens) {
      if (nameWords.some((w) => tokenMatchesCe53Word(w, tok))) score += 28;
      else if (kwWords.some((w) => tokenMatchesCe53Word(w, tok))) score += 20;
      else if (descWords.some((w) => tokenMatchesCe53Word(w, tok))) score += 8;
    }
    for (const syn of expandedSynonyms) {
      if (nameWords.some((w) => tokenMatchesCe53Word(w, syn))) score += 14;
      else if (kwWords.some((w) => tokenMatchesCe53Word(w, syn))) score += 10;
    }
    return score;
  };

  const productResults = allProducts
    .map((p: any) => {
      const deepExtra = [
        ...(Array.isArray(p.features) ? p.features.map((f: any) => f.text || f) : []),
        ...(Array.isArray(p.specifications)
          ? p.specifications.map((s: any) => `${s.key || ""} ${s.value || ""}`)
          : []),
        ...(Array.isArray(p.models)
          ? p.models.map(
              (m: any) =>
                `${m.modelName || ""} ${
                  Array.isArray(m.specifications)
                    ? m.specifications.map((s: any) => `${s.key || ""} ${s.value || ""}`).join(" ")
                    : ""
                }`
            )
          : []),
        ...(Array.isArray(p.resources) ? p.resources.map((r: any) => r.name || "") : []),
      ].join(" ");
      return {
        product: p,
        score: scoreItem(p.name, p.description, p.keywords, deepExtra),
      };
    })
    .filter((x) => x.score >= 14)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(({ product: p }) => ({
      id: `prod-${p.id}`,
      type: "MACHINE" as const,
      title: p.name,
      description:
        p.description?.substring(0, 100) || "Acrylic fabrication machine",
      url: `/products/${p.id}`,
      image: p.coverImage,
    }));

  const consumableResults = allConsumables
    .map((c) => ({
      consumable: c,
      score: scoreItem(c.name, c.description, c.keywords, c.category || ""),
    }))
    .filter((x) => x.score >= 14)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(({ consumable: c }) => ({
      id: `cons-${c.id}`,
      type: "CONSUMABLE" as const,
      title: c.name,
      description: c.description?.substring(0, 100) || "Machine consumable",
      url: `/consumables/${c.id}`,
      image: c.image,
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
    cacheDetails: "Tokenized + synonym + itemType-filtered SQLite lookup",
    productLookupTriggered: true,
    productLookupQuery: normalizedQuery,
    productLookupTotalScanned:
      allProducts.length + allConsumables.length + STATIC_PAGES.length,
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
        detail: `machines=${productResults.length}, consumables=${consumableResults.length}, pages=${pageResults.length}, excludeConsumables=${excludeConsumables}`,
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
