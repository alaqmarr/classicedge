import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-cc-sync-key",
  "Cache-Control": "public, s-maxage=120, stale-while-revalidate=300",
};

function toAbsoluteUrl(url: string | null | undefined, origin: string): string | null {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${origin}${url.startsWith("/") ? "" : "/"}${url}`;
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(req: NextRequest) {
  try {
    const origin =
      process.env.NEXT_PUBLIC_SITE_URL ||
      req.nextUrl.origin ||
      "https://classicedge53.com";

    const customerQuery = (req.nextUrl.searchParams.get("customer") || "").trim();

    const [machines, consumables] = await Promise.all([
      prisma.product.findMany({
        include: {
          images: { select: { url: true } },
          specifications: { select: { key: true, value: true } },
          features: { select: { text: true } },
          resources: { select: { name: true, url: true } },
          consumables: { select: { id: true, name: true, category: true } },
          models: {
            include: {
              specifications: { select: { key: true, value: true } },
              resources: { select: { name: true, url: true } },
              consumables: { select: { id: true, name: true } },
            },
          },
        },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.consumable.findMany({
        orderBy: { updatedAt: "desc" },
      }),
    ]);

    let customerEnquiries: {
      id: string;
      brand: "CLASSIC_EDGE_53";
      name: string;
      email: string;
      phone: string;
      message: string;
      source: string;
      status: string;
      createdAt: string;
    }[] = [];

    if (customerQuery) {
      const last10 = customerQuery.replace(/\D/g, "").slice(-10);
      const isEmail = customerQuery.includes("@");
      const orFilters: any[] = [];
      if (last10.length >= 7) {
        orFilters.push({ phone: { contains: last10 } });
      }
      if (isEmail) {
        orFilters.push({ email: { equals: customerQuery } });
      }

      if (orFilters.length > 0) {
        const enqRows = await prisma.enquiry.findMany({
          where: { OR: orFilters },
          orderBy: { createdAt: "desc" },
          take: 8,
        });

        customerEnquiries = enqRows.map((e) => ({
          id: e.id,
          brand: "CLASSIC_EDGE_53",
          name: e.name,
          email: e.email,
          phone: e.phone || "",
          message: e.productName
            ? `[Machine: ${e.productName}] ${e.message}`
            : e.message,
          source: `classicedge53.com${e.productName ? ` (${e.productName})` : ""}`,
          status: e.repliedAt ? "Replied" : "New",
          createdAt: e.createdAt.toISOString(),
        }));
      }
    }

    return NextResponse.json(
      {
        ok: true,
        source: "classicedge53.com",
        syncedAt: new Date().toISOString(),
        machines: machines.map((m) => ({
          id: m.id,
          brand: "CLASSIC_EDGE_53" as const,
          brandLabel: "Classic Edge 53",
          itemType: "MACHINE" as const,
          name: m.name,
          slug: m.id,
          description: m.description || null,
          keywords: m.keywords || null,
          coverImage: toAbsoluteUrl(
            m.coverImage || m.images[0]?.url || null,
            origin
          ),
          features: m.features.map((f) => f.text),
          specifications: m.specifications.map((s) => ({
            key: s.key,
            value: s.value || "",
          })),
          models: m.models.map((mod) => ({
            id: mod.id,
            modelName: mod.modelName,
            specifications: mod.specifications.map((s) => ({
              key: s.key,
              value: s.value || "",
            })),
            resources: mod.resources.map((r) => ({
              name: r.name,
              url: toAbsoluteUrl(r.url, origin) || r.url,
            })),
          })),
          resources: m.resources.map((r) => ({
            name: r.name,
            url: toAbsoluteUrl(r.url, origin) || r.url,
          })),
          relatedConsumables: m.consumables.map((c) => c.name),
          url: `${origin}/products/${m.id}`,
          updatedAt: m.updatedAt.toISOString(),
        })),
        consumables: consumables.map((c) => ({
          id: c.id,
          brand: "CLASSIC_EDGE_53" as const,
          brandLabel: "Classic Edge 53",
          itemType: "CONSUMABLE" as const,
          name: c.name,
          slug: c.id,
          categoryName: c.category || "Machine Consumables",
          description: c.description || null,
          keywords: c.keywords || null,
          mainImage: toAbsoluteUrl(c.image || null, origin),
          url: `${origin}/consumables/${c.id}`,
          updatedAt: c.updatedAt.toISOString(),
        })),
        customerEnquiries,
      },
      { headers: CORS_HEADERS }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        ok: false,
        error: err?.message || "Failed to export Classic Edge 53 machines catalog",
      },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
