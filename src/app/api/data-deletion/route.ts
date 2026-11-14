import crypto from "node:crypto";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://classicedge53.com";

function decodeBase64Url(input: string): Buffer {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad = normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4));
  return Buffer.from(normalized + pad, "base64");
}

function parseMetaSignedRequest(signedRequest: string): {
  valid: boolean;
  userId: string;
} {
  try {
    const parts = signedRequest.split(".");
    if (parts.length !== 2) return { valid: false, userId: "meta_user" };
    const [encodedSig, payload] = parts;
    const data = JSON.parse(decodeBase64Url(payload).toString("utf8")) as {
      user_id?: string;
    };

    const appSecret = (process.env.META_APP_SECRET || "").trim();
    if (appSecret) {
      const expectedSig = crypto
        .createHmac("sha256", appSecret)
        .update(payload)
        .digest();
      const actualSig = decodeBase64Url(encodedSig);
      if (
        expectedSig.length !== actualSig.length ||
        !crypto.timingSafeEqual(expectedSig, actualSig)
      ) {
        return { valid: false, userId: "" };
      }
    }

    return {
      valid: true,
      userId: String(data.user_id || "meta_user"),
    };
  } catch {
    return { valid: false, userId: "" };
  }
}

function makeConfirmationCode(): string {
  return `DEL-CE53-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "Classic Edge 53 User Data Deletion Endpoint",
    instructions_url: `${BASE_URL}/data-deletion`,
  });
}

export async function POST(req: Request) {
  try {
    const contentType = (req.headers.get("content-type") || "").toLowerCase();
    let signedRequest = "";
    let name = "Meta Platform User";
    let email = "info@classicedge53.com";
    let phone = "Meta Callback";
    let channel = "Meta Signed Data Deletion Callback";
    let notes = "";

    if (
      contentType.includes("application/x-www-form-urlencoded") ||
      contentType.includes("multipart/form-data")
    ) {
      const formData = await req.formData();
      signedRequest = String(formData.get("signed_request") || "").trim();
      if (!signedRequest) {
        name = String(formData.get("name") || "Customer").trim().slice(0, 160);
        email = String(formData.get("email") || "").trim().slice(0, 160);
        phone = String(formData.get("phone") || "").trim().slice(0, 60);
        notes = String(formData.get("notes") || "").trim().slice(0, 1500);
      }
    } else {
      const body = await req.json().catch(() => ({}));
      signedRequest = String(body?.signed_request || "").trim();
      if (!signedRequest) {
        name = String(body?.name || "Customer").trim().slice(0, 160);
        email = String(body?.email || "").trim().slice(0, 160);
        phone = String(body?.phone || "").trim().slice(0, 60);
        channel = String(body?.channel || "Website / WhatsApp Deletion Form")
          .trim()
          .slice(0, 120);
        notes = String(body?.notes || "").trim().slice(0, 1500);
      }
    }

    const confirmationCode = makeConfirmationCode();
    const statusUrl = `${BASE_URL}/data-deletion?code=${confirmationCode}`;

    if (signedRequest) {
      const parsed = parseMetaSignedRequest(signedRequest);
      if (!parsed.valid) {
        return NextResponse.json(
          { error: "Invalid signed_request signature." },
          { status: 400 }
        );
      }
      await prisma.enquiry
        .create({
          data: {
            name: `Meta User ${parsed.userId}`,
            email: "info@classicedge53.com",
            phone: parsed.userId,
            message: `[${confirmationCode}] Automated Meta Data Deletion Callback for Meta user_id=${parsed.userId}.`,
            productName: "Data Deletion Request",
          },
        })
        .catch(() => {});

      return NextResponse.json({
        url: statusUrl,
        confirmation_code: confirmationCode,
      });
    }

    if (!phone && !email) {
      return NextResponse.json(
        { error: "Please provide your WhatsApp phone number or email address." },
        { status: 400 }
      );
    }

    await prisma.enquiry
      .create({
        data: {
          name: name || "Customer",
          email: email || "no-email@classicedge53.com",
          phone: phone || null,
          message: `[${confirmationCode}] Scope: ${channel}${
            notes ? ` | Notes: ${notes}` : ""
          }`,
          productName: "Data Deletion Request",
        },
      })
      .catch(() => {});

    return NextResponse.json({
      ok: true,
      url: statusUrl,
      confirmation_code: confirmationCode,
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to process deletion request right now." },
      { status: 500 }
    );
  }
}
