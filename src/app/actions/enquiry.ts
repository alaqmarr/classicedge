"use server";

import prisma from "@/lib/prisma";
import {
  sendClientThankYouEmail,
  sendAdminEnquiryEmail,
  sendAdminReplyEmail,
} from "@/lib/email";
import { pushClassicEdgeEnquiryToWhatsAppHub } from "@/lib/whatsapp-bridge";
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

      const hubResult = await pushClassicEdgeEnquiryToWhatsAppHub({
        enquiryId: enquiry.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
        productName: data.productName,
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

    await sendAdminReplyEmail(enquiry.email, enquiry.name, replyMessage);

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
