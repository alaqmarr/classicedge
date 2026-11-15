import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { CC_BRIDGE_KEY } from "@/lib/whatsapp-bridge";

export interface Ce53LookedUpItem {
  name: string;
  slug?: string;
  sku?: string | null;
  brand?: string;
  itemType?: string;
  priceInr?: number | null;
  url?: string | null;
  reason?: string | null;
}

export interface Ce53TraceStep {
  stepNumber: number;
  label: string;
  detail?: string;
  durationMs?: number;
  status?: "OK" | "WARN" | "SKIP" | "ERROR";
}

function formatIstTimestamp(utcIso: string): string {
  try {
    const dt = new Date(utcIso);
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).formatToParts(dt);
    const get = (type: string) => parts.find((p) => p.type === type)?.value || "00";
    return `${get("year")}-${get("month")}-${get("day")} ${get("hour")}:${get("minute")}:${get("second")} IST`;
  } catch {
    return utcIso;
  }
}

export function logClassicEdgeAiTrace(input: {
  feature: string;
  actor: string;
  question: string;
  model: string;
  effort?: string;
  outcomeSource:
    | "LIVE_AI"
    | "RESPONSE_CACHE"
    | "LOCAL_FALLBACK"
    | "ORDER_LOOKUP"
    | "HUMAN_HANDOFF"
    | "ERROR";
  responseCacheStatus: "HIT" | "MISS" | "BYPASS" | "LOCAL_ONLY";
  catalogCacheStatus: "HIT" | "MISS" | "BYPASS" | "LOCAL_ONLY";
  cacheDetails: string;
  productLookupTriggered: boolean;
  productLookupQuery: string;
  productLookupTotalScanned: number;
  productsLookedUp: Ce53LookedUpItem[];
  steps: Ce53TraceStep[];
  response: string;
  durationMs: number;
  error?: string | null;
}): void {
  const timestampUtc = new Date().toISOString();
  const timestampIst = formatIstTimestamp(timestampUtc);
  const id = `ail_ce53_${Date.now().toString(36)}_${crypto.randomBytes(3).toString("hex")}`;

  const entry = {
    id,
    timestampUtc,
    timestampIst,
    website: "CLASSIC_EDGE_53" as const,
    websiteLabel: "Classic Edge 53 (classicedge53.com)",
    ...input,
  };

  try {
    const logPath = path.join(/*turbopackIgnore: true*/ process.cwd(), "ai.logs");
    const indent = (s: string) =>
      String(s || "(empty)")
        .replace(/\r\n/g, "\n")
        .split("\n")
        .map((l) => `  ${l}`)
        .join("\n");

    const prodText = !entry.productLookupTriggered
      ? "  (No machine/consumable lookup executed)"
      : entry.productsLookedUp.length === 0
      ? `  (0 matched for "${entry.productLookupQuery}")`
      : entry.productsLookedUp
          .map(
            (p, idx) =>
              `  ${idx + 1}. [CLASSIC_EDGE_53] ${p.name} (${p.itemType || "MACHINE"}${
                p.url ? ` | ${p.url}` : ""
              })`
          )
          .join("\n");

    const stepText = entry.steps
      .map(
        (s, idx) =>
          `  ${s.stepNumber || idx + 1}. [${s.status || "OK"}]${
            typeof s.durationMs === "number" ? ` (+${s.durationMs}ms)` : ""
          } ${s.label}${s.detail ? ` -> ${s.detail}` : ""}`
      )
      .join("\n");

    const block = [
      "================================================================================",
      `[${timestampIst} | ${timestampUtc}] TRACE_ID: ${id}`,
      `WEBSITE: ${entry.websiteLabel} | FEATURE: ${entry.feature}`,
      `ACTOR: ${entry.actor} | MODEL: ${entry.model} | OUTCOME: ${entry.outcomeSource} (${entry.durationMs}ms)`,
      `CACHE: response=${entry.responseCacheStatus} | catalog=${entry.catalogCacheStatus} | ${entry.cacheDetails}`,
      `QUESTION / INPUT:\n${indent(entry.question)}`,
      `PRODUCT LOOKUP (triggered=${entry.productLookupTriggered}, query="${entry.productLookupQuery}", matched=${entry.productsLookedUp.length}):\n${prodText}`,
      `STEPS FOLLOWED:\n${stepText}`,
      `RESPONSE FOLLOWED:\n${indent(entry.response)}`,
      `META_JSON: ${JSON.stringify(entry)}`,
      "",
    ].join("\n");

    fs.appendFileSync(logPath, `${block}\n`, "utf8");
  } catch {
    // Non-blocking
  }

  void (async () => {
    const candidates = Array.from(
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
    for (const base of candidates) {
      try {
        const res = await fetch(`${base}/api/internal/ai-logs`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-cc-bridge-key": CC_BRIDGE_KEY,
          },
          body: JSON.stringify(entry),
          signal: AbortSignal.timeout(1800),
        });
        if (res.ok) break;
      } catch {
        // Try next candidate
      }
    }
  })();
}
