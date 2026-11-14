import type { Metadata } from "next";
import Link from "next/link";
import { FileText, ShieldCheck, Trash2, Mail, Phone, MapPin } from "lucide-react";
import { getClassicConceptsBrandInfo } from "@/lib/brandInfo";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service for Classic Edge 53 (Classic Concepts Acrylic Private Limited) covering acrylic processing machinery, consumables, quotations, shipping, and WhatsApp support.",
  alternates: {
    canonical: "https://classicedge53.com/terms-of-service",
  },
  openGraph: {
    title: "Terms of Service | Classic Edge 53",
    description:
      "Terms and conditions for using classicedge53.com, purchasing machines or consumables, and connecting with Classic Edge 53 on WhatsApp.",
    url: "https://classicedge53.com/terms-of-service",
    siteName: "Classic Edge 53",
    type: "website",
  },
};

export default async function ClassicEdgeTermsPage() {
  const brandInfo = await getClassicConceptsBrandInfo();
  const companyName =
    brandInfo?.brand?.companyName || "Classic Concepts Acrylic Private Limited";
  const address =
    brandInfo?.contact?.address ||
    "Secunderabad, Hyderabad, Telangana, India";
  const phone = brandInfo?.contact?.phones?.[0] || "+91 98490 50752";
  const email =
    brandInfo?.contact?.emails?.[0] || "info@classicedge53.com";

  return (
    <div className="container mx-auto px-4 py-16 md:py-20">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
            <FileText className="w-4 h-4" />
            <span>Official Terms of Service</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Terms of Service
          </h1>
          <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto">
            Clear terms for using classicedge53.com, ordering industrial acrylic
            machines and consumables, and communicating with our team on
            WhatsApp.
          </p>
        </div>

        <div className="glass-panel rounded-2xl border border-white/10 p-6 sm:p-10 md:p-12 space-y-8 text-slate-300 leading-relaxed">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <p className="text-sm font-semibold text-white">
                Classic Edge 53 (A Brand of {companyName})
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Effective Date: 1 January 2026 | Last Updated: 14 November 2026
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              <Link
                href="/privacy-policy"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Privacy Policy</span>
              </Link>
              <Link
                href="/data-deletion"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/30 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Data Deletion</span>
              </Link>
            </div>
          </div>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">
              1. Acceptance of Terms
            </h2>
            <p>
              By browsing <strong>https://classicedge53.com</strong>, requesting
              a machine or consumable quote, tracking a shipment via{" "}
              <strong>track.ccapl.cc</strong> or <strong>track.ccapl.in</strong>
              , signing in via a Meta Login dialog, or messaging our official
              WhatsApp Business number, you agree to these Terms of Service with{" "}
              <strong>{companyName}</strong> (operating{" "}
              <strong>Classic Edge 53</strong>).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">
              2. Machinery Specifications, Quotations, and Orders
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Technical specifications, photos, and brochures on{" "}
                <strong>classicedge53.com</strong> describe standard models of
                diamond edge polishers, flame polishers, CNC routers, heaters,
                blades, and consumables. Minor design updates may occur as we
                improve machine models.
              </li>
              <li>
                Formal price validity, voltage/phase requirements, crating,
                taxes, and dispatch schedules are confirmed in your written
                proforma invoice.
              </li>
              <li>
                Buyers are responsible for ensuring proper industrial electrical
                earthing, voltage stability, ventilation, and trained operator
                safety gear when operating industrial machinery and flame or
                cutting equipment.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">
              3. Pricing, GST, and Payments
            </h2>
            <p>
              All prices are quoted in Indian Rupees (INR) unless stated
              otherwise on an export quotation. Applicable GST, wooden crating,
              and freight charges are itemized clearly on your proforma and tax
              invoice. Orders are dispatched as per the payment terms agreed on
              your proforma invoice.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">
              4. Freight, Delivery, and Order Tracking
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Once your machine or consumable parcel is booked with the
                freight carrier or courier, we share a tracking link (such as{" "}
                <strong>track.ccapl.cc/your-order-id</strong>) on WhatsApp or
                email so you can check live carrier status.
              </li>
              <li>
                Please inspect the wooden crate or parcel upon arrival before
                signing clean receipt with the transporter, and notify us within
                48 hours with photos if any external transit damage is noticed.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">
              5. Warranty and Consumables
            </h2>
            <p>
              Machinery warranty terms apply strictly as stated on your tax
              invoice or warranty card and cover manufacturing defects under
              normal industrial use. Wear-and-tear consumables such as diamond
              cutters, saw blades, buffing wheels, heating wires, fuses, and
              torch nozzles are not covered under machine warranty once used.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">
              6. WhatsApp Business Messaging and Acceptable Use
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                By submitting your phone number on an enquiry form or messaging
                us on WhatsApp, you consent to receive replies, quotations,
                invoices, tracking links, and technical support on WhatsApp.
              </li>
              <li>
                You may opt out of promotional WhatsApp messages at any time by
                replying <strong>STOP</strong>.
              </li>
              <li>
                You agree not to misuse our site, Meta integrations, or WhatsApp
                channel for unlawful content, automated scraping, or service
                disruption.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">
              7. Intellectual Property and Governing Law
            </h2>
            <p>
              All machine photos, manuals, videos, brand marks, and catalog
              content on <strong>classicedge53.com</strong> belong to{" "}
              {companyName}. These Terms are governed by the laws of India, and
              any dispute shall fall under the exclusive jurisdiction of the
              competent courts in Secunderabad and Hyderabad, Telangana, India.
            </p>
          </section>

          <section className="space-y-4 pt-6 border-t border-white/10">
            <h2 className="text-xl font-semibold text-white">
              8. Contact Information
            </h2>
            <div className="rounded-xl bg-slate-900/80 border border-white/10 p-5 space-y-2.5 text-sm">
              <p className="font-semibold text-white">
                Classic Edge 53 ({companyName})
              </p>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-1" />
                <span className="whitespace-pre-line">{address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <a
                  href={`mailto:${email}`}
                  className="text-blue-400 font-semibold hover:underline"
                >
                  {email}
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
