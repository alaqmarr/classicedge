import { logClassicEdgeAiTrace } from "@/lib/ai-logger";

export const CE53_LOCKED_MODEL = "claude-haiku-5-5" as const;

export const CE53_ACRO_ADMIN_AGENT = {
  name: "ACRO (Classic Edge 53 Admin Co-Pilot)",
  scope: "admin" as const,
  model: CE53_LOCKED_MODEL,
  apiKeyEnvVar: "ANTHROPIC_ADMIN_API_KEY" as const,
};

const PROMPT_INJECTION_PATTERNS: RegExp[] = [
  /ignore\s+(?:all\s+)?(?:previous|prior|above|system)\s+(?:instructions|rules|prompts|directives)/gi,
  /disregard\s+(?:all\s+)?(?:previous|prior|above|system)\s+(?:instructions|rules|prompts)/gi,
  /(?:reveal|output|print|show|dump|leak)\s+(?:your\s+)?(?:system\s+prompt|api\s*key|secret\s*key|internal\s+instructions|anthropic_)/gi,
  /<\s*\/?\s*(?:system|instruction|prompt|admin_override)\s*>/gi,
  /you\s+are\s+now\s+(?:in\s+)?(?:developer\s+mode|dan\s+mode|unrestricted)/gi,
];

const FORBIDDEN_BUZZWORDS: [RegExp, string][] = [
  [/\bbespoke\b/gi, "custom"],
  [/\belevate(?:s|d)?\b/gi, "improve"],
  [/\bmeticulous(?:ly)?\b/gi, "careful"],
  [/\bunparalleled\b/gi, "reliable"],
  [/\bseamless(?:ly)?\b/gi, "smooth"],
  [/\bstate-of-the-art\b/gi, "modern"],
  [/\bcutting-edge\b/gi, "modern"],
  [/\butilize(?:s|d)?\b/gi, "use"],
  [/\bleverage(?:s|d)?\b/gi, "use"],
  [/\brobust\b/gi, "heavy-duty"],
];

export function cleanCe53PlainCopy(raw: string): string {
  if (!raw) return "";
  let out = String(raw)
    .replace(/\s*—\s*/g, ", ")
    .replace(/\s+–\s+/g, ", ")
    .replace(/\s*--\s*/g, ", ");
  for (const [pattern, replacement] of FORBIDDEN_BUZZWORDS) {
    out = out.replace(pattern, replacement);
  }
  return out.replace(/\s{2,}/g, " ").trim();
}

export function sanitizeCe53AdminInput(raw: string | null | undefined): {
  sanitized: string;
  injectionDetected: boolean;
} {
  if (!raw) return { sanitized: "", injectionDetected: false };
  let sanitized = String(raw);
  let injectionDetected = false;
  for (const pattern of PROMPT_INJECTION_PATTERNS) {
    pattern.lastIndex = 0;
    if (pattern.test(sanitized)) {
      injectionDetected = true;
      pattern.lastIndex = 0;
      sanitized = sanitized.replace(pattern, "[filtered instruction]");
    }
  }
  return { sanitized: sanitized.trim(), injectionDetected };
}

export interface Ce53VerifiedMachineFacts {
  hasExplicitPowerKw: boolean;
  hasExplicitWorkingSize: boolean;
  hasExplicitVoltage: boolean;
  hasExplicitModelCode: boolean;
  verifiedPowerTokens: string[];
  verifiedSizeTokens: string[];
  verifiedVoltageTokens: string[];
  preservedSpecifications: { key: string; value: string }[];
  missingAttributesWarning: string[];
}

export function extractCe53VerifiedMachineFacts(params: {
  itemType: "MACHINE" | "CONSUMABLE";
  name: string;
  description?: string;
  category?: string;
  modelNames?: string[];
  existingSpecs?: { key: string; value: string }[];
  customNotes?: string;
}): Ce53VerifiedMachineFacts {
  const specs = Array.isArray(params.existingSpecs) ? params.existingSpecs : [];
  const models = Array.isArray(params.modelNames) ? params.modelNames.filter(Boolean) : [];
  const combinedText = [
    params.name || "",
    params.description || "",
    params.category || "",
    params.customNotes || "",
    ...models,
    ...specs.map((s) => `${s.key || ""} ${s.value || ""}`),
  ].join(" ");

  const powerMatches =
    combinedText.match(/\b(\d+(?:\.\d+)?\s*(?:kw|w|hp))\b/gi)?.map((m) => m.trim()) || [];
  const sizeMatches =
    combinedText
      .match(/\b(\d+(?:\.\d+)?\s*(?:mm|cm|inch|inches|m)\b|\d+\s*[xX×]\s*\d+(?:\s*mm)?)/gi)
      ?.map((m) => m.trim()) || [];
  const voltageMatches =
    combinedText
      .match(/\b(\d{3}\s*v(?:\s*\/?\s*\d{2}\s*hz)?|\b(?:single|three|3)\s*-?\s*phase\b)/gi)
      ?.map((m) => m.trim()) || [];

  const preservedSpecifications = specs
    .filter((s) => s?.key?.trim() && s?.value?.trim())
    .map((s) => ({
      key: cleanCe53PlainCopy(s.key.trim()),
      value: cleanCe53PlainCopy(s.value.trim()),
    }));

  const hasExplicitPowerKw =
    powerMatches.length > 0 ||
    preservedSpecifications.some((s) => /power|kw|watt|motor|heating/i.test(s.key));
  const hasExplicitWorkingSize =
    sizeMatches.length > 0 ||
    preservedSpecifications.some((s) =>
      /width|length|size|dimension|capacity|thickness|diameter|stroke/i.test(s.key)
    );
  const hasExplicitVoltage =
    voltageMatches.length > 0 ||
    preservedSpecifications.some((s) => /voltage|phase|power supply/i.test(s.key));
  const hasExplicitModelCode =
    models.length > 0 || /\b[A-Z]{2,4}[-_ ]?\d{2,5}[A-Z]?\b/.test(combinedText);

  // Extract inline verified specs from notes/description if not already in preservedSpecifications
  if (
    powerMatches.length > 0 &&
    !preservedSpecifications.some((s) => /power|kw/i.test(s.key))
  ) {
    preservedSpecifications.push({
      key: "Power Rating",
      value: Array.from(new Set(powerMatches)).join(" / "),
    });
  }
  if (
    sizeMatches.length > 0 &&
    !preservedSpecifications.some((s) => /working|width|size|dimension|thickness/i.test(s.key))
  ) {
    preservedSpecifications.push({
      key: params.itemType === "MACHINE" ? "Working Capacity / Dimensions" : "Dimensions / Size",
      value: Array.from(new Set(sizeMatches)).join(" / "),
    });
  }
  if (
    voltageMatches.length > 0 &&
    !preservedSpecifications.some((s) => /voltage|phase/i.test(s.key))
  ) {
    preservedSpecifications.push({
      key: "Power Supply",
      value: Array.from(new Set(voltageMatches)).join(" / "),
    });
  }

  const missingAttributesWarning: string[] = [];
  if (params.itemType === "MACHINE") {
    if (!hasExplicitWorkingSize) {
      missingAttributesWarning.push(
        "Working width, bed size, or sheet thickness capacity (mm) was not provided. Please enter confirmed machine capacity before publishing."
      );
    }
    if (!hasExplicitPowerKw) {
      missingAttributesWarning.push(
        "Motor or heating power rating (kW / W) was not specified. Please confirm exact power rating."
      );
    }
    if (!hasExplicitVoltage) {
      missingAttributesWarning.push(
        "Electrical supply specification (220V single-phase or 380V/415V 3-phase) was not specified."
      );
    }
    if (!hasExplicitModelCode) {
      missingAttributesWarning.push(
        "Machine model code (for example YN-JW1200) was not provided."
      );
    }
  } else {
    if (!hasExplicitWorkingSize) {
      missingAttributesWarning.push(
        "Consumable dimensions, blade diameter, wire gauge, or pack size was not specified. Please confirm exact part dimensions."
      );
    }
  }

  return {
    hasExplicitPowerKw,
    hasExplicitWorkingSize,
    hasExplicitVoltage,
    hasExplicitModelCode,
    verifiedPowerTokens: Array.from(new Set(powerMatches.map((p) => p.toLowerCase()))),
    verifiedSizeTokens: Array.from(new Set(sizeMatches.map((s) => s.toLowerCase()))),
    verifiedVoltageTokens: Array.from(new Set(voltageMatches.map((v) => v.toLowerCase()))),
    preservedSpecifications,
    missingAttributesWarning,
  };
}

function scrubUnverifiedMachineNumbers(
  text: string,
  facts: Ce53VerifiedMachineFacts
): string {
  let out = cleanCe53PlainCopy(text);
  if (!facts.hasExplicitPowerKw) {
    out = out.replace(/\b\d+(?:\.\d+)?\s*(?:kw|hp)\b/gi, "industrial-grade power");
  }
  if (!facts.hasExplicitWorkingSize) {
    out = out.replace(
      /\b\d+(?:\.\d+)?\s*(?:to\s*\d+(?:\.\d+)?\s*)?mm\b/gi,
      "standard industrial capacity"
    );
  }
  if (!facts.hasExplicitVoltage) {
    out = out.replace(/\b(?:220|230|380|400|415)\s*v\b/gi, "standard factory power supply");
  }
  return cleanCe53PlainCopy(out);
}

export async function runCe53AcroProductAutofill(params: {
  itemType?: "MACHINE" | "CONSUMABLE";
  name: string;
  description?: string;
  keywords?: string;
  category?: string;
  modelNames?: string[];
  existingSpecs?: { key: string; value: string }[];
  existingFeatures?: string[];
  customNotes?: string;
}): Promise<{
  ok: boolean;
  agentName: string;
  data?: {
    itemType: "MACHINE" | "CONSUMABLE";
    description: string;
    bullets: string[];
    features: string[];
    specifications: { key: string; value: string }[];
    seoTitle: string;
    metaDescription: string;
    keywords: string;
    missingAttributesWarning: string[];
    groundingStatus: "VERIFIED_INPUTS" | "NEEDS_ADMIN_CONFIRMATION";
    fieldDiffPreview: {
      description: { current: string; proposed: string };
      features: { current: string[]; proposed: string[] };
      specifications: {
        current: { key: string; value: string }[];
        proposed: { key: string; value: string }[];
      };
      seoTitle: { current: string; proposed: string };
      metaDescription: { current: string; proposed: string };
      keywords: { current: string; proposed: string };
    };
  };
  injectionWarning?: string;
  warning?: string;
  error?: string;
}> {
  const startedAt = Date.now();
  const itemType: "MACHINE" | "CONSUMABLE" =
    params.itemType === "CONSUMABLE" ? "CONSUMABLE" : "MACHINE";
  const sanitizedName = sanitizeCe53AdminInput(params.name);
  if (!sanitizedName.sanitized) {
    return {
      ok: false,
      agentName: CE53_ACRO_ADMIN_AGENT.name,
      error: "Please enter a machine or consumable name first.",
    };
  }

  const sanitizedDesc = sanitizeCe53AdminInput(params.description);
  const sanitizedNotes = sanitizeCe53AdminInput(params.customNotes);
  const injectionWarning =
    sanitizedName.injectionDetected || sanitizedDesc.injectionDetected || sanitizedNotes.injectionDetected
      ? "Blocked untrusted prompt-injection pattern in admin input."
      : undefined;

  const facts = extractCe53VerifiedMachineFacts({
    itemType,
    name: sanitizedName.sanitized,
    description: sanitizedDesc.sanitized,
    category: params.category,
    modelNames: params.modelNames,
    existingSpecs: params.existingSpecs,
    customNotes: sanitizedNotes.sanitized,
  });

  const cleanName = cleanCe53PlainCopy(sanitizedName.sanitized);
  const typeLabel =
    itemType === "CONSUMABLE"
      ? params.category?.trim() || "Acrylic Fabrication Consumables & Spare Parts"
      : "Industrial Acrylic Fabrication Machinery";

  const bullets: string[] =
    itemType === "MACHINE"
      ? [
          `Machine Purpose: ${cleanName} engineered by Classic Edge 53 for clean, high-precision industrial acrylic fabrication.`,
          `Build & Operation: Heavy-duty workshop frame built for steady daily production and accurate repeatable output${
            facts.hasExplicitWorkingSize && facts.verifiedSizeTokens.length > 0
              ? ` (${facts.verifiedSizeTokens.join(" / ")})`
              : ""
          }.`,
          `Power & Controls: Easy-to-operate industrial controls${
            facts.hasExplicitPowerKw && facts.verifiedPowerTokens.length > 0
              ? ` rated at ${facts.verifiedPowerTokens.join(" / ")}`
              : ""
          } for smooth workshop operation.`,
          "Support & Spares: Backed by Classic Edge 53 technical guidance, operator training support, and ready stock of matching consumables and spare parts.",
        ]
      : [
          `Part Purpose: ${cleanName} supplied by Classic Edge 53 for industrial acrylic fabrication machines.`,
          `Workshop Performance: Built for clean edge finishes, steady heat or cutting accuracy, and long service life${
            facts.hasExplicitWorkingSize && facts.verifiedSizeTokens.length > 0
              ? ` (${facts.verifiedSizeTokens.join(" / ")})`
              : ""
          }.`,
          "Machine Compatibility: Matches Classic Edge 53 acrylic polishing, bending, routing, and fabrication equipment.",
          "Supply & Dispatch: Available for quick pan-India dispatch from Classic Edge 53.",
        ];

  const sanitizedBullets = bullets.map((b) => scrubUnverifiedMachineNumbers(b, facts));
  const proposedDescription = sanitizedBullets.join(" ");

  const defaultFeatures =
    itemType === "MACHINE"
      ? [
          "Heavy-duty industrial frame for vibration-free acrylic processing",
          "Simple operator controls for consistent workshop production",
          "Designed for cast and extruded acrylic sheet fabrication",
          "Supported with genuine Classic Edge 53 spares, tooling, and technical service",
        ]
      : [
          "Genuine Classic Edge 53 replacement consumable for industrial acrylic machines",
          "Consistent workshop performance with minimal downtime",
          "Easy installation and standard tooling fitment",
          "Ready stock for pan-India workshop dispatch",
        ];

  const proposedFeatures = defaultFeatures.map((f) => scrubUnverifiedMachineNumbers(f, facts));

  const proposedSpecs: { key: string; value: string }[] = [...facts.preservedSpecifications];
  const baseMachineSpecs: { key: string; value: string }[] =
    itemType === "MACHINE"
      ? [
          { key: "Application", value: "Industrial Acrylic Sheet Fabrication & Processing" },
          { key: "Brand / Supplier", value: "Classic Edge 53 (classicedge53.com)" },
        ]
      : [
          { key: "Category", value: cleanCe53PlainCopy(params.category || "Machine Consumable / Tooling") },
          { key: "Brand / Supplier", value: "Classic Edge 53 (classicedge53.com)" },
        ];

  for (const s of baseMachineSpecs) {
    if (!proposedSpecs.some((existing) => existing.key.toLowerCase() === s.key.toLowerCase())) {
      proposedSpecs.push(s);
    }
  }

  const rawSeoTitle = `${cleanName} | ${
    itemType === "MACHINE" ? "Acrylic Fabrication Machine" : "Acrylic Machine Consumables"
  } | Classic Edge 53`;
  const seoTitle =
    rawSeoTitle.length <= 68 ? rawSeoTitle : `${cleanName} | Classic Edge 53 India`.slice(0, 68);

  const metaDescription = cleanCe53PlainCopy(
    `${cleanName} from Classic Edge 53. ${
      itemType === "MACHINE"
        ? "Industrial acrylic fabrication machine built for clean, accurate workshop production with full spares and service support across India."
        : "High-precision replacement consumable and tooling for industrial acrylic fabrication machines with fast pan-India delivery."
    }`
  ).slice(0, 158);

  const keywordTokens = Array.from(
    new Set(
      [
        cleanName.toLowerCase(),
        itemType === "MACHINE" ? "acrylic fabrication machine" : "acrylic machine consumable",
        itemType === "MACHINE" ? "industrial acrylic equipment" : "acrylic fabrication spare parts",
        "classic edge 53",
        ...(params.modelNames || []).map((m) => m.toLowerCase()),
        ...facts.verifiedSizeTokens,
        ...facts.verifiedPowerTokens,
      ]
        .map((k) => k.trim())
        .filter(Boolean)
    )
  );
  const keywords = keywordTokens.join(", ");

  const groundingStatus: "VERIFIED_INPUTS" | "NEEDS_ADMIN_CONFIRMATION" =
    facts.missingAttributesWarning.length === 0
      ? "VERIFIED_INPUTS"
      : "NEEDS_ADMIN_CONFIRMATION";

  const fieldDiffPreview = {
    description: {
      current: params.description || "",
      proposed: proposedDescription,
    },
    features: {
      current: Array.isArray(params.existingFeatures) ? params.existingFeatures : [],
      proposed: proposedFeatures,
    },
    specifications: {
      current: facts.preservedSpecifications,
      proposed: proposedSpecs,
    },
    seoTitle: {
      current: "",
      proposed: seoTitle,
    },
    metaDescription: {
      current: "",
      proposed: metaDescription,
    },
    keywords: {
      current: params.keywords || "",
      proposed: keywords,
    },
  };

  logClassicEdgeAiTrace({
    feature: `ACRO ${itemType} Autofill & SEO`,
    actor: "ACRO Admin",
    question: `Autofill ${itemType.toLowerCase()}: ${cleanName}`,
    model: CE53_LOCKED_MODEL,
    effort: "low",
    outcomeSource: "LOCAL_FALLBACK",
    responseCacheStatus: "LOCAL_ONLY",
    catalogCacheStatus: "LOCAL_ONLY",
    cacheDetails: `ACRO grounded ${itemType.toLowerCase()} autofill (${groundingStatus})`,
    productLookupTriggered: false,
    productLookupQuery: cleanName,
    productLookupTotalScanned: 0,
    productsLookedUp: [],
    steps: [
      {
        stepNumber: 1,
        label: `Generated grounded ${itemType.toLowerCase()} specs, features, and SEO via ACRO`,
        detail: `specs=${proposedSpecs.length}, warnings=${facts.missingAttributesWarning.length}`,
        durationMs: Date.now() - startedAt,
        status: "OK",
      },
    ],
    response: proposedDescription,
    durationMs: Date.now() - startedAt,
  });

  return {
    ok: true,
    agentName: CE53_ACRO_ADMIN_AGENT.name,
    data: {
      itemType,
      description: proposedDescription,
      bullets: sanitizedBullets,
      features: proposedFeatures,
      specifications: proposedSpecs,
      seoTitle,
      metaDescription,
      keywords,
      missingAttributesWarning: facts.missingAttributesWarning,
      groundingStatus,
      fieldDiffPreview,
    },
    injectionWarning,
  };
}
