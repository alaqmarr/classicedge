import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import prisma from "@/lib/prisma";
import { isAuthorizedInternalBridgeRequest } from "@/lib/whatsapp-bridge";

export const dynamic = "force-dynamic";

function stripAlnum(raw: string): string {
  return String(raw || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

export async function GET(req: Request) {
  if (!isAuthorizedInternalBridgeRequest(req)) {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const action = (searchParams.get("action") || "health").trim();

  if (action === "health") {
    const [machinesCount, consumablesCount, enquiriesCount] = await Promise.all([
      prisma.product.count().catch(() => 0),
      prisma.consumable.count().catch(() => 0),
      prisma.enquiry.count().catch(() => 0),
    ]);
    return NextResponse.json({
      ok: true,
      app: "classicedge",
      brand: "CLASSIC_EDGE_53",
      port: 3002,
      machinesCount,
      consumablesCount,
      enquiriesCount,
      timestamp: new Date().toISOString(),
    });
  }

  if (action === "orders" || action === "enquiries") {
    const rawOrderId = (searchParams.get("orderId") || "").trim();
    const rawPhone = (searchParams.get("phone") || "").replace(/\D/g, "").slice(-10);
    const rawEmail = (searchParams.get("email") || "").trim().toLowerCase();

    const enquiries = await prisma.enquiry.findMany({
      orderBy: { createdAt: "desc" },
      take: 250,
    });

    const targetAlnum = stripAlnum(rawOrderId);
    const matched = enquiries.filter((e) => {
      if (rawOrderId) {
        const fullAlnum = stripAlnum(e.id);
        const short6 = e.id.slice(-6).toLowerCase();
        if (
          fullAlnum === targetAlnum ||
          short6 === targetAlnum ||
          `ce${short6}` === targetAlnum ||
          `ce53${short6}` === targetAlnum
        ) {
          return true;
        }
      }
      if (rawPhone && rawPhone.length >= 8) {
        const p10 = String(e.phone || "").replace(/\D/g, "").slice(-10);
        if (p10 === rawPhone) return true;
      }
      if (rawEmail && String(e.email || "").trim().toLowerCase() === rawEmail) {
        return true;
      }
      return !rawOrderId && !rawPhone && !rawEmail;
    });

    if (action === "orders") {
      return NextResponse.json({
        ok: true,
        brand: "CLASSIC_EDGE_53",
        orders: matched.slice(0, 10).map((e) => {
          const shortId = `CE53-${e.id.slice(-6).toUpperCase()}`;
          return {
            id: e.id,
            orderId: shortId,
            rawId: e.id,
            brand: "CLASSIC_EDGE_53",
            brandLabel: "Classic Edge 53",
            customerName: e.name,
            customerEmail: e.email,
            customerPhone: e.phone || "",
            itemsSummary: e.productName
              ? `Machine Enquiry / Order: ${e.productName}`
              : "Classic Edge 53 Machine Request",
            totalAmountInr: 0,
            status: e.repliedAt ? "Replied" : "Order Confirmed",
            shipmentStatus: e.repliedAt ? "IN_PRODUCTION" : "ORDER_CONFIRMED",
            createdAt: e.createdAt.toISOString(),
            updatedAt: (e.repliedAt || e.createdAt).toISOString(),
          };
        }),
      });
    }

    return NextResponse.json({
      ok: true,
      brand: "CLASSIC_EDGE_53",
      enquiries: matched.slice(0, 25).map((e) => ({
        id: e.id,
        name: e.name,
        email: e.email,
        phone: e.phone || "",
        message: e.productName
          ? `[Machine: ${e.productName}] ${e.message}`
          : e.message,
        productName: e.productName,
        status: e.repliedAt ? "Replied" : "New",
        createdAt: e.createdAt.toISOString(),
      })),
    });
  }

  return NextResponse.json({ ok: false, error: "Unknown action" }, { status: 400 });
}

export async function POST(req: Request) {
  if (!isAuthorizedInternalBridgeRequest(req)) {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const action = String(body?.action || "");

  if (action === "mark_enquiry_replied" && body?.enquiryId) {
    await prisma.enquiry
      .update({
        where: { id: String(body.enquiryId) },
        data: { repliedAt: new Date() },
      })
      .catch(() => null);
    return NextResponse.json({ ok: true });
  }

  if (action === "send_smtp_mail") {
    const to = String(body?.to || "").trim();
    const subject = String(body?.subject || "").trim();
    const html = String(body?.html || "").trim();
    const text = String(body?.text || "").trim();

    const settings = await prisma.siteSettings.findFirst();
    if (!settings?.smtpEmail || !settings?.smtpPassword || !to || !subject) {
      return NextResponse.json(
        { ok: false, error: "Classic Edge SMTP not configured" },
        { status: 400 }
      );
    }

    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: settings.smtpEmail,
          pass: settings.smtpPassword,
        },
      });
      await transporter.sendMail({
        from: `"Classic Edge 53 Desk" <${settings.smtpEmail}>`,
        to,
        subject,
        ...(html ? { html } : {}),
        ...(text ? { text } : {}),
      });
      return NextResponse.json({ ok: true, deliveredVia: "classicedge_smtp" });
    } catch (err: any) {
      return NextResponse.json(
        { ok: false, error: err?.message || "SMTP relay failed" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ ok: false, error: "Unsupported bridge action" }, { status: 400 });
}
