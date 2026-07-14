"use server";

import prisma from "@/lib/prisma";
import { sendClientThankYouEmail, sendAdminEnquiryEmail, sendAdminReplyEmail } from "@/lib/email";
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
      }
    });

    // 2. Send Emails (Non-blocking ideally, but we await to ensure delivery status if needed. 
    // In production, might want to send these asynchronously without awaiting to speed up response)
    try {
      await sendClientThankYouEmail(data.email, data.name);
      await sendAdminEnquiryEmail(data);
    } catch (emailError) {
      console.error("Error sending emails:", emailError);
      // We still return success since the enquiry was saved, but log the email failure
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

    // Send the reply email
    await sendAdminReplyEmail(enquiry.email, enquiry.name, replyMessage);

    // Update database
    await prisma.enquiry.update({
      where: { id: enquiryId },
      data: { repliedAt: new Date() }
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
    orderBy: { createdAt: 'desc' }
  });
}
