import nodemailer from "nodemailer";
import prisma from "@/lib/prisma";

async function getTransporter() {
  const settings = await prisma.siteSettings.findFirst();
  if (!settings?.smtpEmail || !settings?.smtpPassword) {
    throw new Error("SMTP settings not configured");
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: settings.smtpEmail,
      pass: settings.smtpPassword,
    },
  });
}

// Generate the HTML for the emails based on the Classic Edge 53 brand
const emailWrapper = (content: string) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
    .header { background-color: #020610; padding: 24px; text-align: center; border-bottom: 4px solid #3b82f6; }
    .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: bold; }
    .header h1 span { color: #3b82f6; }
    .content { padding: 32px; color: #334155; line-height: 1.6; }
    .footer { background-color: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #64748b; }
    .button { display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 500; margin-top: 16px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>CLASSIC<span>EDGE</span> <span style="color:#eab308;font-style:italic;">53</span></h1>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} Classic Edge 53. All Rights Reserved.
    </div>
  </div>
</body>
</html>
`;

export const getClientThankYouHtml = (name: string) => emailWrapper(`
  <h2 style="color: #0f172a; margin-top: 0;">Thank You for Your Enquiry, ${name}!</h2>
  <p>We have successfully received your message and our team will get back to you shortly.</p>
  <p>At Classic Edge 53, we take pride in delivering precision acrylic fabrication machinery and excellent support. If you need immediate assistance, feel free to contact us via WhatsApp or phone.</p>
  <br/>
  <p>Best regards,<br/><strong>The Classic Edge 53 Team</strong></p>
`);

export const getAdminEnquiryHtml = (data: { name: string, email: string, phone?: string | null, message: string, productName?: string | null }) => emailWrapper(`
  <h2 style="color: #0f172a; margin-top: 0;">New Enquiry Received</h2>
  <p><strong>Name:</strong> ${data.name}</p>
  <p><strong>Email:</strong> ${data.email}</p>
  ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ''}
  ${data.productName ? `<p><strong>Product Interest:</strong> ${data.productName}</p>` : ''}
  <div style="background-color: #f8fafc; padding: 16px; border-radius: 6px; margin-top: 20px;">
    <p style="margin: 0;"><strong>Message:</strong><br/>${data.message.replace(/\n/g, '<br/>')}</p>
  </div>
`);

export const getAdminReplyHtml = (name: string, replyMessage: string) => emailWrapper(`
  <h2 style="color: #0f172a; margin-top: 0;">Hi ${name},</h2>
  <p>Thank you for your interest in Classic Edge 53. Our team has reviewed your enquiry.</p>
  <div style="background-color: #f8fafc; padding: 16px; border-left: 4px solid #3b82f6; margin: 20px 0;">
    <p style="margin: 0;">${replyMessage.replace(/\n/g, '<br/>')}</p>
  </div>
  <p>If you have any further questions, feel free to reply directly to this email.</p>
  <br/>
  <p>Best regards,<br/><strong>The Classic Edge 53 Team</strong></p>
`);

export async function sendClientThankYouEmail(to: string, name: string) {
  const settings = await prisma.siteSettings.findFirst();
  const transporter = await getTransporter();

  await transporter.sendMail({
    from: `"Classic Edge 53" <${settings!.smtpEmail}>`,
    to,
    subject: "Thank You for Contacting Classic Edge 53",
    html: getClientThankYouHtml(name),
  });
}

export async function sendAdminEnquiryEmail(data: { name: string, email: string, phone?: string | null, message: string, productName?: string | null }) {
  const settings = await prisma.siteSettings.findFirst();
  if (!settings?.adminEmail) return; // Silent fail if no admin email set

  const transporter = await getTransporter();

  await transporter.sendMail({
    from: `"Classic Edge Website" <${settings.smtpEmail}>`,
    to: settings.adminEmail,
    replyTo: data.email,
    subject: `New Enquiry from ${data.name}${data.productName ? ` about ${data.productName}` : ''}`,
    html: getAdminEnquiryHtml(data),
  });
}

export async function sendAdminReplyEmail(to: string, name: string, replyMessage: string) {
  const settings = await prisma.siteSettings.findFirst();
  const transporter = await getTransporter();

  await transporter.sendMail({
    from: `"Classic Edge 53" <${settings!.smtpEmail}>`,
    to,
    replyTo: settings!.adminEmail || settings!.smtpEmail || undefined,
    subject: "Regarding your enquiry to Classic Edge 53",
    html: getAdminReplyHtml(name, replyMessage),
  });
}
