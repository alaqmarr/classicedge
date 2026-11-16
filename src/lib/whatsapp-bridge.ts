/**
 * Internal Ecosystem Bridge for Classic Edge 53 (:3002) <-> Classic Concepts (:3003) <-> WhatsApp Desk (:3007)
 */

export const CC_BRIDGE_KEY = (
  process.env.CC_BRIDGE_KEY ||
  process.env.CC_ECOSYSTEM_BRIDGE_KEY ||
  "cc_internal_ecosystem_bridge_2026"
).trim();

const ACCEPTED_BRIDGE_KEYS = new Set([
  CC_BRIDGE_KEY,
  "cc_internal_ecosystem_bridge_2026",
  "cc_internal_bridge_2026",
]);

export function getWhatsAppHubInternalUrls(): string[] {
  return Array.from(
    new Set(
      [
        process.env.CCWHATSAPP_INTERNAL_URL,
        "http://127.0.0.1:3007",
        "http://127.0.0.1:3000",
      ]
        .filter(Boolean)
        .map((u) => String(u).replace(/\/+$/, ""))
    )
  );
}

export function getWhatsAppHubInternalUrl(): string {
  return getWhatsAppHubInternalUrls()[0] || "http://127.0.0.1:3007";
}

export function isAuthorizedInternalBridgeRequest(req: Request): boolean {
  const headerKey = (req.headers.get("x-cc-bridge-key") || "").trim();
  if (headerKey && ACCEPTED_BRIDGE_KEYS.has(headerKey)) return true;

  const host = (req.headers.get("host") || "").toLowerCase();
  const forwarded = (req.headers.get("x-forwarded-for") || "").toLowerCase();
  const isLocalHostHeader =
    host.startsWith("127.0.0.1") ||
    host.startsWith("localhost") ||
    host.startsWith("[::1]");
  const isLocalForwarded =
    !forwarded ||
    forwarded.startsWith("127.0.0.1") ||
    forwarded.startsWith("::1") ||
    forwarded.includes("localhost");

  return isLocalHostHeader && isLocalForwarded;
}

export interface SmartEnquiryEvaluationResult {
  ok: boolean;
  conversationId?: string;
  smartReplyText?: string;
  smartCategory?: string;
  assignedStaffName?: string | null;
  assignedTeamName?: string | null;
  whatsappDispatched?: boolean;
  emailDispatchedByHub?: boolean;
}

export async function pushClassicEdgeEnquiryToWhatsAppHub(params: {
  enquiryId: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  productName?: string;
}): Promise<SmartEnquiryEvaluationResult> {
  for (const baseUrl of getWhatsAppHubInternalUrls()) {
    try {
      const res = await fetch(`${baseUrl}/api/internal/website-enquiry`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-cc-bridge-key": CC_BRIDGE_KEY,
        },
        body: JSON.stringify({
          type: "WEBSITE_ENQUIRY",
          event: "WEBSITE_ENQUIRY",
          brand: "CLASSIC_EDGE_53",
          sourcePort: 3002,
          customerName: params.name,
          customerEmail: params.email,
          customerPhone: params.phone || "",
          source: params.productName
            ? `Classic Edge 53 (${params.productName})`
            : "Classic Edge 53 Website",
          ...params,
        }),
        signal: AbortSignal.timeout(7500),
      });
      if (!res.ok) continue;
      const data = await res.json().catch(() => ({}));
      return {
        ok: Boolean(data?.ok),
        conversationId: data?.conversationId,
        smartReplyText:
          typeof data?.smartReplyText === "string" ? data.smartReplyText : undefined,
        smartCategory: data?.smartCategory,
        assignedStaffName: data?.assignedStaffName ?? null,
        assignedTeamName: data?.assignedTeamName ?? null,
        whatsappDispatched: Boolean(data?.whatsappDispatched),
        emailDispatchedByHub: Boolean(data?.emailDispatchedByHub),
      };
    } catch {
      // Try next Hub port
    }
  }
  return { ok: false };
}

export async function pushClassicEdgeEnquiryReplyToWhatsAppHub(params: {
  enquiryId: string;
  name: string;
  email: string;
  phone?: string | null;
  productName?: string | null;
  originalMessage?: string;
  replyMessage: string;
  channel: "EMAIL" | "WHATSAPP";
  repliedByName?: string;
  dispatchEmailViaHub?: boolean;
}): Promise<{ ok: boolean; emailDispatchedByHub?: boolean; whatsappDispatchedByHub?: boolean }> {
  for (const baseUrl of getWhatsAppHubInternalUrls()) {
    try {
      const res = await fetch(`${baseUrl}/api/internal/website-enquiry`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-cc-bridge-key": CC_BRIDGE_KEY,
        },
        body: JSON.stringify({
          type: "ENQUIRY_REPLY",
          event: "ENQUIRY_REPLY",
          brand: "CLASSIC_EDGE_53",
          sourcePort: 3002,
          enquiryId: params.enquiryId,
          customerName: params.name,
          customerEmail: params.email,
          customerPhone: params.phone || "",
          productName: params.productName || "",
          originalMessage: params.originalMessage || "",
          replyMessage: params.replyMessage,
          channel: params.channel,
          repliedByName: params.repliedByName || "Classic Edge 53 Admin",
          dispatchEmailViaHub: Boolean(params.dispatchEmailViaHub),
        }),
        signal: AbortSignal.timeout(7500),
      });
      if (!res.ok) continue;
      const data = await res.json().catch(() => ({}));
      return {
        ok: Boolean(data?.ok),
        emailDispatchedByHub: Boolean(data?.emailDispatchedByHub),
        whatsappDispatchedByHub: Boolean(data?.whatsappDispatchedByHub),
      };
    } catch {
      // Try next Hub port
    }
  }
  return { ok: false };
}

export async function notifyWhatsAppHubCatalogSync(
  reason = "classic_edge_catalog_mutation"
): Promise<boolean> {
  for (const baseUrl of getWhatsAppHubInternalUrls()) {
    try {
      const res = await fetch(`${baseUrl}/api/cache/sync`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-cc-bridge-key": CC_BRIDGE_KEY,
        },
        body: JSON.stringify({
          action: "sync",
          brand: "CLASSIC_EDGE_53",
          reason,
        }),
        signal: AbortSignal.timeout(3500),
      });
      if (res.ok) return true;
    } catch {
      // Non-blocking if Hub is offline in local dev
    }
  }
  return false;
}
