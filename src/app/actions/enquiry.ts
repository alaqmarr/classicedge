"use server";

import prisma from "@/lib/prisma";
import {
  sendClientThankYouEmail,
  sendAdminEnquiryEmail,
  sendAdminReplyEmail,
} from "@/lib/email";
import {
  pushClassicEdgeEnquiryToWhatsAppHub,
  pushClassicEdgeEnquiryReplyToWhatsAppHub,
} from "@/lib/whatsapp-bridge";
import { logClassicEdgeAiTrace } from "@/lib/ai-logger";
import { revalidatePath } from "next/cache";

export async function submitEnquiry(data: {
  name: string;
  email: string;
  phone?: string;
  message: string;
  productName?: string;
}) {
  try {
    // 1. Save to database
    const enquiry = await prisma.enquiry.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
        productName: data.productName,
      },
    });

    // 2. Evaluate immediately via WhatsApp Hub (:3007 -> Claude Haiku 5.5 + Sales Routing + Staff Email Alert)
    //    and send a smart, machine-specific reply email first (falling back to thank-you email if unavailable).
    try {
      await sendAdminEnquiryEmail(data).catch((e) =>
        console.error("Admin email error:", e)
      );

      const evalStartedAt = Date.now();
      const hubResult = await pushClassicEdgeEnquiryToWhatsAppHub({
        enquiryId: enquiry.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
        productName: data.productName,
      });

      logClassicEdgeAiTrace({
        feature: "Classic Edge 53 Enquiry AI Evaluation",
        actor: `${data.name} (${data.email})`,
        question: `${data.productName ? `[Machine: ${data.productName}] ` : ""}${data.message}`,
        model: hubResult.ok ? "claude-haiku-5-5" : "fallback-email",
        effort: "medium",
        outcomeSource: hubResult.ok ? "LIVE_AI" : "LOCAL_FALLBACK",
        responseCacheStatus: "BYPASS",
        catalogCacheStatus: hubResult.ok ? "HIT" : "BYPASS",
        cacheDetails: hubResult.ok
          ? `Evaluated via Central ACRIO Hub (category=${hubResult.smartCategory || "MACHINES"})`
          : "Hub unreachable -> sent standard thank-you email",
        productLookupTriggered: Boolean(data.productName),
        productLookupQuery: data.productName || data.message.slice(0, 80),
        productLookupTotalScanned: 1,
        productsLookedUp: data.productName
          ? [{ name: data.productName, brand: "CLASSIC_EDGE_53", itemType: "MACHINE" }]
          : [],
        steps: [
          {
            stepNumber: 1,
            label: "Saved enquiry to Classic Edge 53 DB & forwarded to ACRIO Hub",
            detail: `hubOk=${hubResult.ok}, whatsappSent=${Boolean(hubResult.whatsappDispatched)}, emailSent=${Boolean(hubResult.emailDispatchedByHub)}`,
            durationMs: Date.now() - evalStartedAt,
            status: hubResult.ok ? "OK" : "WARN",
          },
        ],
        response:
          hubResult.smartReplyText ||
          "Standard Classic Edge 53 enquiry acknowledgement sent.",
        durationMs: Date.now() - evalStartedAt,
      });

      if (hubResult.ok && hubResult.emailDispatchedByHub) {
        await prisma.enquiry
          .update({
            where: { id: enquiry.id },
            data: { repliedAt: new Date() },
          })
          .catch(() => null);
      } else if (hubResult.smartReplyText) {
        await sendAdminReplyEmail(data.email, data.name, hubResult.smartReplyText);
        await prisma.enquiry
          .update({
            where: { id: enquiry.id },
            data: { repliedAt: new Date() },
          })
          .catch(() => null);
      } else {
        await sendClientThankYouEmail(data.email, data.name);
      }
    } catch (emailError) {
      console.error("Error sending enquiry emails:", emailError);
      await sendClientThankYouEmail(data.email, data.name).catch(() => null);
    }

    revalidatePath("/admin/enquiries");
    return { success: true };
  } catch (error) {
    console.error("Failed to submit enquiry:", error);
    return { success: false, error: "Failed to submit enquiry" };
  }
}

export async function replyToEnquiry(enquiryId: string, replyMessage: string) {
  try {
    const enquiry = await prisma.enquiry.findUnique({ where: { id: enquiryId } });
    if (!enquiry) {
      return { success: false, error: "Enquiry not found" };
    }

    let emailSentLocally = false;
    try {
      await sendAdminReplyEmail(enquiry.email, enquiry.name, replyMessage);
      emailSentLocally = true;
    } catch (err) {
      console.warn("[CE53 Enquiry Reply] Local SMTP failed, trying Hub relay:", err);
    }

    const hubSync = await pushClassicEdgeEnquiryReplyToWhatsAppHub({
      enquiryId: enquiry.id,
      name: enquiry.name,
      email: enquiry.email,
      phone: enquiry.phone,
      productName: enquiry.productName,
      originalMessage: enquiry.message,
      replyMessage,
      channel: "EMAIL",
      repliedByName: "Classic Edge 53 Admin",
      dispatchEmailViaHub: !emailSentLocally,
    });

    if (!emailSentLocally && !hubSync.emailDispatchedByHub) {
      return { success: false, error: "Failed to send reply email. Please verify SMTP settings." };
    }

    await prisma.enquiry.update({
      where: { id: enquiryId },
      data: { repliedAt: new Date() },
    });

    revalidatePath("/admin/enquiries");
    return { success: true };
  } catch (error) {
    console.error("Failed to reply to enquiry:", error);
    return { success: false, error: "Failed to send reply" };
  }
}

export async function getEnquiries() {
  return await prisma.enquiry.findMany({
    orderBy: { createdAt: "desc" },
  });
}
