import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

const FALLBACK_CE53_MACHINES = [
  {
    id: "ce53-diamond-edge-polisher",
    name: "Acrylic Diamond Edge Polishing Machine",
    description:
      "Industrial CNC diamond edge polisher for crystal-clear mirror finishes on thick cast acrylic sheets in a single pass.",
    keywords:
      "diamond edge polishing machine polisher crystal finish cast acrylic thick sheet yn-jw1200 yn-jw1600",
    coverImage: null,
    features: [
      "Single-pass crystal-clear mirror finish on cut acrylic edges without flame stress marks",
      "Adjustable bevel and angle polishing head from 0° to 45° / 60°",
      "Variable frequency inverter drive for smooth feed speed and spindle control",
      "Pneumatic clamping beam holds single sheets or stacked acrylic blanks firmly",
      "Compatible with PCD pre-milling and natural mono-crystal diamond finishing cutters",
    ],
    specifications: [
      { key: "Polishing Angle", value: "0° to 45° / 60° Adjustable" },
      { key: "Spindle Speed", value: "0 to 9,000 RPM Inverter Controlled" },
      { key: "Compatible Materials", value: "Cast Acrylic (PMMA), Polycarbonate, PS, MS Resin" },
      { key: "Cutter System", value: "PCD Pre-Cutter + Natural Diamond Finishing Cutter" },
    ],
    models: [
      {
        id: "model-yn-jw1200",
        modelName: "YN-JW1200",
        specifications: [
          { key: "Max Working Length", value: "1200 mm" },
          { key: "Sheet Thickness Capacity", value: "3 mm to 60 mm" },
          { key: "Feed Speed", value: "0.3 to 2.5 m/min" },
          { key: "Motor Power", value: "2.2 kW" },
          { key: "Machine Weight", value: "850 kg" },
        ],
        resources: [
          {
            name: "YN-JW1200 Technical Datasheet",
            url: "https://classicedge53.com/products/ce53-diamond-edge-polisher",
          },
        ],
        consumables: [
          {
            id: "ce53-pcd-diamond-blade",
            name: "PCD & Natural Mono-Crystal Diamond Polishing Cutter",
            category: "Cutting & Polishing Tools",
          },
        ],
      },
      {
        id: "model-yn-jw1600",
        modelName: "YN-JW1600",
        specifications: [
          { key: "Max Working Length", value: "1600 mm" },
          { key: "Sheet Thickness Capacity", value: "3 mm to 100 mm" },
          { key: "Feed Speed", value: "0.3 to 3.0 m/min" },
          { key: "Motor Power", value: "3.0 kW" },
          { key: "Machine Weight", value: "1150 kg" },
        ],
        resources: [
          {
            name: "YN-JW1600 Technical Datasheet",
            url: "https://classicedge53.com/products/ce53-diamond-edge-polisher",
          },
        ],
        consumables: [
          {
            id: "ce53-pcd-diamond-blade",
            name: "PCD & Natural Mono-Crystal Diamond Polishing Cutter",
            category: "Cutting & Polishing Tools",
          },
        ],
      },
    ],
    resources: [
      {
        name: "Diamond Edge Polisher Brochure & Operating Guide",
        url: "https://classicedge53.com/products/ce53-diamond-edge-polisher",
      },
    ],
    consumables: [
      {
        id: "ce53-pcd-diamond-blade",
        name: "PCD & Natural Mono-Crystal Diamond Polishing Cutter",
        category: "Cutting & Polishing Tools",
      },
      {
        id: "ce53-buffing-wheel-compound",
        name: "Cotton Buffing Wheel & Acrylic Polishing Compound",
        category: "Polishing Consumables",
      },
    ],
  },
  {
    id: "ce53-acrylic-line-bender",
    name: "Acrylic Bending Machine & Strip Heater",
    description:
      "Precision temperature-controlled quartz heating line bender for clean, bubble-free right-angle and multi-angle acrylic bends.",
    keywords:
      "acrylic bending machine strip heater line bender quartz heating bend abm-1250 abm-2400",
    coverImage: null,
    features: [
      "Infrared quartz heating element with circulating water-cooling channels on both sides of the bend line",
      "Digital PID temperature controller prevents bubbling, scorching, or yellowing along the fold",
      "Adjustable angle-stop protractor for repeatable 30° to 175° podium, stand, and display bends",
      "Localized heating zone keeps adjacent sheet areas cool and flat without warping",
    ],
    specifications: [
      { key: "Heating Element", value: "Infrared Quartz Tube with Water Cooling Circulation" },
      { key: "Temperature Control", value: "Digital PID Controller (0°C to 400°C)" },
      { key: "Bending Angle Range", value: "0° to 175° with Angle Stop" },
      { key: "Compatible Materials", value: "Acrylic (PMMA), PVC, Polycarbonate, ABS, PETG" },
    ],
    models: [
      {
        id: "model-abm-1250",
        modelName: "ABM-1250",
        specifications: [
          { key: "Effective Bending Width", value: "1250 mm (4 ft)" },
          { key: "Sheet Thickness Capacity", value: "1 mm to 10 mm" },
          { key: "Heating Configuration", value: "Single Upper Quartz Heating Unit" },
          { key: "Power Supply", value: "220V Single Phase, 1.5 kW" },
        ],
        resources: [
          {
            name: "ABM-1250 Line Bender Spec Sheet",
            url: "https://classicedge53.com/products/ce53-acrylic-line-bender",
          },
        ],
        consumables: [
          {
            id: "ce53-heating-wire-element",
            name: "Nichrome & Quartz Heating Element for Acrylic Bender",
            category: "Bending Spares",
          },
        ],
      },
      {
        id: "model-abm-2400",
        modelName: "ABM-2400",
        specifications: [
          { key: "Effective Bending Width", value: "2400 mm (8 ft)" },
          { key: "Sheet Thickness Capacity", value: "1 mm to 15 mm" },
          { key: "Heating Configuration", value: "Dual Upper & Lower Quartz Heating Units" },
          { key: "Power Supply", value: "220V / 380V, 3.6 kW" },
        ],
        resources: [
          {
            name: "ABM-2400 Heavy-Duty Bender Spec Sheet",
            url: "https://classicedge53.com/products/ce53-acrylic-line-bender",
          },
        ],
        consumables: [
          {
            id: "ce53-heating-wire-element",
            name: "Nichrome & Quartz Heating Element for Acrylic Bender",
            category: "Bending Spares",
          },
        ],
      },
    ],
    resources: [
      {
        name: "Acrylic Line Bending Temperature & Timing Chart",
        url: "https://classicedge53.com/products/ce53-acrylic-line-bender",
      },
    ],
    consumables: [
      {
        id: "ce53-heating-wire-element",
        name: "Nichrome & Quartz Heating Element for Acrylic Bender",
        category: "Bending Spares",
      },
    ],
  },
  {
    id: "ce53-laser-cutting-system",
    name: "Acrylic Laser Cutting & Engraving Machine",
    description:
      "High-precision CO2 laser cutting and engraving system engineered for smooth, polished-edge cast acrylic fabrication.",
    keywords:
      "acrylic laser cutting machine co2 engraver cutter sheet fabrication ce-lc1390 ce-lc1325",
    coverImage: null,
    features: [
      "Sealed CO2 laser tube delivers smooth, glossy flame-finished cut edges on cast acrylic",
      "Honeycomb and knife-blade dual worktable supports both small trophies and full 8x4 ft sheets",
      "High-speed stepper/servo motion system for crisp logo engraving and contour cutting",
    ],
    specifications: [
      { key: "Laser Type", value: "Sealed CO2 Glass / RF Laser Tube" },
      { key: "Positioning Accuracy", value: "±0.05 mm" },
      { key: "Supported Graphic Formats", value: "DXF, AI, PLT, CDR, BMP, PNG" },
    ],
    models: [
      {
        id: "model-ce-lc1390",
        modelName: "CE-LC1390",
        specifications: [
          { key: "Working Area", value: "1300 × 900 mm" },
          { key: "Laser Power", value: "100W / 130W" },
          { key: "Acrylic Cutting Thickness", value: "1 mm to 18 mm" },
        ],
        resources: [],
        consumables: [],
      },
      {
        id: "model-ce-lc1325",
        modelName: "CE-LC1325",
        specifications: [
          { key: "Working Area", value: "1300 × 2500 mm (Full 8×4 ft Sheet)" },
          { key: "Laser Power", value: "150W / 180W" },
          { key: "Acrylic Cutting Thickness", value: "1 mm to 25 mm" },
        ],
        resources: [],
        consumables: [],
      },
    ],
    resources: [
      {
        name: "CO2 Laser Acrylic Cutting Parameter Guide",
        url: "https://classicedge53.com/products/ce53-laser-cutting-system",
      },
    ],
    consumables: [],
  },
  {
    id: "ce53-cnc-router-acrylic",
    name: "CNC Router for Acrylic & Engineering Plastics",
    description:
      "Heavy-duty 3-axis CNC routing and bevelling center for thick acrylic blocks, trophies, signages, and industrial guards.",
    keywords: "cnc router acrylic routing bevelling machine plastics ce-cnc1325",
    coverImage: null,
    features: [
      "Rigid welded steel gantry eliminates vibration when routing thick 15mm to 50mm cast acrylic blocks",
      "High-frequency water/air-cooled spindle with mist coolant for chip-free acrylic edges",
      "Vacuum hold-down table with T-slot clamps for fast sheet setup",
    ],
    specifications: [
      { key: "Axes", value: "3-Axis Heavy-Duty Ball Screw / Helical Rack" },
      { key: "Spindle Speed", value: "0 to 24,000 RPM" },
      { key: "Table Type", value: "Multi-Zone Vacuum + Aluminium T-Slot" },
    ],
    models: [
      {
        id: "model-ce-cnc1325",
        modelName: "CE-CNC1325",
        specifications: [
          { key: "Working Area", value: "1300 × 2500 × 200 mm" },
          { key: "Spindle Power", value: "3.5 kW / 4.5 kW" },
          { key: "Max Acrylic Thickness", value: "Up to 50 mm" },
        ],
        resources: [],
        consumables: [],
      },
    ],
    resources: [],
    consumables: [],
  },
  {
    id: "ce53-flame-polishing-unit",
    name: "HHO Acrylic Flame Polishing Machine",
    description:
      "Oxy-hydrogen flame polishing machine for rapid edge polishing of intricate laser-cut or routed acrylic contours.",
    keywords: "flame polishing machine hho oxy hydrogen edge polisher ce-fp160 ce-fp260",
    coverImage: null,
    features: [
      "Electrolyzes distilled water into clean hydrogen-oxygen gas flame with zero carbon soot",
      "Polishes internal cutouts, curved trophy edges, and intricate letter contours in seconds",
      "Built-in flashback arrestor and pressure cut-off safety valves",
    ],
    specifications: [
      { key: "Fuel Source", value: "Distilled Water + Electrolytic Powder (Oxy-Hydrogen)" },
      { key: "Best For", value: "Curved Contours, Internal Cutouts & Thin-to-Medium Acrylic (2 mm to 12 mm)" },
    ],
    models: [
      {
        id: "model-ce-fp160",
        modelName: "CE-FP160",
        specifications: [
          { key: "Max Gas Output", value: "160 L/h" },
          { key: "Torch Support", value: "1 Single-Operator Torch" },
          { key: "Power Input", value: "220V, 600W" },
        ],
        resources: [],
        consumables: [],
      },
      {
        id: "model-ce-fp260",
        modelName: "CE-FP260",
        specifications: [
          { key: "Max Gas Output", value: "260 L/h" },
          { key: "Torch Support", value: "1 to 2 Operator Torches" },
          { key: "Power Input", value: "220V, 1000W" },
        ],
        resources: [],
        consumables: [],
      },
    ],
    resources: [],
    consumables: [],
  },
  {
    id: "ce53-thermoforming-oven",
    name: "Acrylic Thermoforming & Draping Oven",
    description:
      "Uniform forced-air circulation industrial oven for heating cast acrylic sheets prior to dome blowing, molding, or thermoforming.",
    keywords: "acrylic thermoforming oven heating draping dome blowing molding ce-to1525",
    coverImage: null,
    features: [
      "Multi-fan hot air circulation keeps temperature uniform within ±2°C across the entire acrylic sheet",
      "Pull-out loading tray with non-stick fiberglass mesh prevents surface marks on softened sheets",
      "Digital timer and PID temperature controller for repeatable softening cycles",
    ],
    specifications: [
      { key: "Temperature Range", value: "Room Temp to 250°C (PID Controlled)" },
      { key: "Heating Method", value: "360° Forced Hot-Air Circulation" },
    ],
    models: [
      {
        id: "model-ce-to1525",
        modelName: "CE-TO1525",
        specifications: [
          { key: "Internal Chamber Size", value: "1500 × 2500 × 450 mm" },
          { key: "Heating Power", value: "18 kW (3-Phase 380V)" },
          { key: "Sheet Thickness Capacity", value: "2 mm to 30 mm" },
        ],
        resources: [],
        consumables: [],
      },
    ],
    resources: [],
    consumables: [],
  },
];

const FALLBACK_CE53_CONSUMABLES = [
  {
    id: "ce53-pcd-diamond-blade",
    name: "PCD & Natural Mono-Crystal Diamond Polishing Cutter",
    description:
      "Precision replacement diamond cutter bit and scoring blade for acrylic diamond edge polishing machines.",
    keywords: "diamond cutter blade pcd polishing tool bit spare consumable",
    category: "Cutting & Polishing Tools",
    image: null,
  },
  {
    id: "ce53-buffing-wheel-compound",
    name: "Cotton Buffing Wheel & Acrylic Polishing Compound",
    description:
      "Fine cotton buffing wheel and wax compound bar for removing micro-scratches on acrylic edges and surfaces.",
    keywords: "buffing wheel polishing compound wax tool consumable accessory",
    category: "Polishing Consumables",
    image: null,
  },
  {
    id: "ce53-heating-wire-element",
    name: "Nichrome & Quartz Heating Element for Acrylic Bender",
    description:
      "Replacement heating wire and quartz tube element for Classic Edge 53 acrylic strip heaters and bending machines.",
    keywords: "heating wire quartz tube element spare consumable bender tool",
    category: "Bending Spares",
    image: null,
  },
  {
    id: "ce53-acrylic-bonding-solvent",
    name: "Bubble-Free Acrylic Bonding Solvent & Applicator Needle",
    description:
      "Fast-curing capillary acrylic welding solvent and precision applicator bottle for crystal-clear joints.",
    keywords: "acrylic solvent glue adhesive bonding applicator needle consumable",
    category: "Bonding Consumables",
    image: null,
  },
];

function isDummyPlaceholderRow(id?: string | null, name?: string | null): boolean {
  const cleanId = String(id || "").trim().toLowerCase();
  const cleanName = String(name || "").trim().toLowerCase();
  return (
    !cleanName ||
    cleanId === "test" ||
    cleanName === "test" ||
    cleanName === "test product" ||
    /^test\s+product\b/i.test(cleanName)
  );
}

/**
 * Classic Edge 53 (`classicedge53.com`) Catalog & Enquiry Bridge for `ccwhatsapp` ACRIO Co-Pilot.
 * Exposes all acrylic fabrication machines, machine models (`YN-JW1200`, `YN-JW1600`, `ABM-1250`, etc.),
 * product-level and model-specific specifications, features, resources, consumables, and recent machine enquiries.
 */
export async function GET() {
  try {
    const [rawMachines, rawConsumables, enquiries] = await Promise.all([
      prisma.product.findMany({
        orderBy: { updatedAt: "desc" },
        include: {
          images: { take: 3 },
          features: true,
          specifications: true,
          resources: true,
          consumables: {
            select: {
              id: true,
              name: true,
              category: true,
              description: true,
              keywords: true,
              image: true,
            },
          },
          models: {
            include: {
              specifications: true,
              resources: true,
              consumables: {
                select: {
                  id: true,
                  name: true,
                  category: true,
                  description: true,
                },
              },
            },
          },
        },
      }),
      prisma.consumable.findMany({
        orderBy: { updatedAt: "desc" },
      }),
      prisma.enquiry.findMany({
        orderBy: { createdAt: "desc" },
        take: 30,
      }),
    ]);

    const validMachines = rawMachines.filter(
      (m) => !isDummyPlaceholderRow(m.id, m.name)
    );
    const validConsumables = rawConsumables.filter(
      (c) => !isDummyPlaceholderRow(c.id, c.name)
    );

    const machinesToExpose =
      validMachines.length > 0
        ? validMachines.map((m) => ({
            id: m.id,
            brand: "CLASSIC_EDGE_53" as const,
            itemType: "MACHINE" as const,
            name: m.name,
            slug: m.id,
            categoryName: "Acrylic Fabrication Machines",
            description: m.description,
            keywords: m.keywords,
            coverImage: m.coverImage || m.images[0]?.url || null,
            url: `https://classicedge53.com/products/${m.id}`,
            features: m.features.map((f) => f.text),
            specifications: m.specifications
              .filter((s) => !s.productModelId)
              .map((s) => ({
                key: s.key,
                value: s.value,
              })),
            models: m.models.map((mod) => ({
              id: mod.id,
              modelName: mod.modelName,
              specifications: mod.specifications.map((s) => ({
                key: s.key,
                value: s.value,
              })),
              resources: mod.resources.map((r) => ({
                name: r.name,
                url: r.url,
              })),
              consumables: mod.consumables.map((c) => ({
                id: c.id,
                name: c.name,
                category: c.category,
                description: c.description,
              })),
            })),
            resources: m.resources
              .filter((r) => !r.productModelId)
              .map((r) => ({ name: r.name, url: r.url })),
            consumables: m.consumables.map((c) => ({
              id: c.id,
              name: c.name,
              category: c.category,
              description: c.description,
              keywords: c.keywords,
              image: c.image,
            })),
          }))
        : FALLBACK_CE53_MACHINES.map((m) => ({
            id: m.id,
            brand: "CLASSIC_EDGE_53" as const,
            itemType: "MACHINE" as const,
            name: m.name,
            slug: m.id,
            categoryName: "Acrylic Fabrication Machines",
            description: m.description,
            keywords: m.keywords,
            coverImage: m.coverImage,
            url: `https://classicedge53.com/products/${m.id}`,
            features: m.features,
            specifications: m.specifications,
            models: m.models,
            resources: m.resources,
            consumables: m.consumables,
          }));

    const consumablesToExpose =
      validConsumables.length > 0
        ? validConsumables.map((c) => ({
            id: c.id,
            brand: "CLASSIC_EDGE_53" as const,
            itemType: "CONSUMABLE" as const,
            name: c.name,
            slug: c.id,
            categoryName: c.category || "Machine Consumables",
            description: c.description,
            keywords: c.keywords,
            mainImage: c.image,
            url: `https://classicedge53.com/consumables/${c.id}`,
          }))
        : FALLBACK_CE53_CONSUMABLES.map((c) => ({
            id: c.id,
            brand: "CLASSIC_EDGE_53" as const,
            itemType: "CONSUMABLE" as const,
            name: c.name,
            slug: c.id,
            categoryName: c.category,
            description: c.description,
            keywords: c.keywords,
            mainImage: c.image,
            url: `https://classicedge53.com/consumables/${c.id}`,
          }));

    return NextResponse.json({
      ok: true,
      brand: "CLASSIC_EDGE_53",
      domain: "https://classicedge53.com",
      machinesCount: machinesToExpose.length,
      consumablesCount: consumablesToExpose.length,
      machines: machinesToExpose,
      consumables: consumablesToExpose,
      enquiries: enquiries.map((e) => ({
        id: e.id,
        name: e.name,
        email: e.email,
        phone: e.phone,
        message: e.message,
        productName: e.productName,
        repliedAt: e.repliedAt ? e.repliedAt.toISOString() : null,
        createdAt: e.createdAt.toISOString(),
      })),
    });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error?.message || "Failed to load Classic Edge 53 catalog" },
      { status: 500 }
    );
  }
}
