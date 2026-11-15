import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  CE53_ACRO_ADMIN_AGENT,
  cleanCe53PlainCopy,
  runCe53AcroProductAutofill,
  sanitizeCe53AdminInput,
} from "@/lib/acro-admin-ai";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const action = String(body?.action || "product_autofill");

    if (
      action === "product_autofill" ||
      action === "seo_generate" ||
      action === "improve_content"
    ) {
      const res = await runCe53AcroProductAutofill({
        itemType: body?.itemType === "CONSUMABLE" ? "CONSUMABLE" : "MACHINE",
        name: String(body?.name || ""),
        description: body?.description ? String(body.description) : undefined,
        keywords: body?.keywords ? String(body.keywords) : undefined,
        category: body?.category ? String(body.category) : undefined,
        modelNames: Array.isArray(body?.modelNames) ? body.modelNames.map(String) : undefined,
        existingSpecs: Array.isArray(body?.existingSpecs) ? body.existingSpecs : undefined,
        existingFeatures: Array.isArray(body?.existingFeatures)
          ? body.existingFeatures.map(String)
          : undefined,
        customNotes: body?.customNotes ? String(body.customNotes) : undefined,
      });

      if (!res.ok) {
        return NextResponse.json(res, { status: 400 });
      }

      return NextResponse.json({
        ...res,
        previewOnly: true,
      });
    }

    if (action === "inline_rewrite") {
      const sanitized = sanitizeCe53AdminInput(String(body?.currentText || ""));
      const cleaned = cleanCe53PlainCopy(sanitized.sanitized);
      return NextResponse.json({
        ok: true,
        agentName: CE53_ACRO_ADMIN_AGENT.name,
        previewOnly: true,
        result: cleaned,
        fieldDiffPreview: {
          current: String(body?.currentText || ""),
          proposed: cleaned,
        },
        injectionWarning: sanitized.injectionDetected
          ? "Blocked untrusted prompt-injection pattern in admin input."
          : undefined,
      });
    }

    return NextResponse.json(
      { ok: false, error: `Unknown ACRO action: ${action}` },
      { status: 400 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Failed to execute ACRO admin task." },
      { status: 500 }
    );
  }
}
