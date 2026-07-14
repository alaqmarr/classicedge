"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import nodemailer from "nodemailer";
import { getClientThankYouHtml, getAdminEnquiryHtml, getAdminReplyHtml } from "@/lib/email";

export async function getSettings() {
  return await prisma.siteSettings.findFirst();
}

export async function updateSettings(data: {
  smtpEmail: string;
  smtpPassword?: string;
  adminEmail: string;
  whatsappNumber: string;
}) {
  try {
    const existing = await prisma.siteSettings.findFirst();
    
    // Only update password if a new one is provided
    const updateData: any = {
      smtpEmail: data.smtpEmail,
      adminEmail: data.adminEmail,
      whatsappNumber: data.whatsappNumber,
    };

    if (data.smtpPassword && data.smtpPassword.trim() !== "") {
      updateData.smtpPassword = data.smtpPassword;
    }

    if (existing) {
      await prisma.siteSettings.update({
        where: { id: existing.id },
        data: updateData
      });
    } else {
      await prisma.siteSettings.create({
        data: updateData
      });
    }

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Failed to update settings:", error);
    return { success: false, error: "Failed to update settings" };
  }
}

export async function testSmtpConnection(testEmail: string, templateType: string) {
  try {
    const settings = await prisma.siteSettings.findFirst();
    if (!settings?.smtpEmail || !settings?.smtpPassword) {
      return { success: false, error: "SMTP settings not fully configured yet. Please save your SMTP Email and App Password first." };
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: settings.smtpEmail,
        pass: settings.smtpPassword,
      },
    });

    let subject = "Test Email from Classic Edge 53";
    let html = "";

    switch (templateType) {
      case "CLIENT_THANK_YOU":
        subject = "TEST: Thank You for Contacting Classic Edge 53";
        html = getClientThankYouHtml("John Doe (Test)");
        break;
      case "ADMIN_ENQUIRY":
        subject = "TEST: New Enquiry from John Doe";
        html = getAdminEnquiryHtml({
          name: "John Doe (Test)",
          email: "johndoe@example.com",
          phone: "+91 1234567890",
          productName: "Diamond Polishing Machine",
          message: "This is a test message to verify the SMTP connection is working perfectly."
        });
        break;
      case "ADMIN_REPLY":
        subject = "TEST: Regarding your enquiry to Classic Edge 53";
        html = getAdminReplyHtml("John Doe (Test)", "This is a test reply from the admin panel to verify SMTP works.");
        break;
      default:
        return { success: false, error: "Invalid template type selected" };
    }

    await transporter.sendMail({
      from: `"Classic Edge 53" <${settings.smtpEmail}>`,
      to: testEmail,
      subject,
      html,
    });

    return { success: true };
  } catch (error: any) {
    console.error("Test email failed:", error);
    return { success: false, error: error.message || "Failed to send test email. Check your credentials." };
  }
}

export async function getPreviewHtml(templateType: string) {
  switch (templateType) {
    case "CLIENT_THANK_YOU":
      return getClientThankYouHtml("John Doe (Preview)");
    case "ADMIN_ENQUIRY":
      return getAdminEnquiryHtml({
        name: "John Doe (Preview)",
        email: "johndoe@example.com",
        phone: "+91 1234567890",
        productName: "Diamond Polishing Machine",
        message: "This is a preview message to see how the enquiry email looks."
      });
    case "ADMIN_REPLY":
      return getAdminReplyHtml("John Doe (Preview)", "This is a preview reply from the admin panel.");
    default:
      return "";
  }
}
