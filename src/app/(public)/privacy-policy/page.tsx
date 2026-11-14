import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, FileText, Trash2, Mail, Phone, MapPin } from "lucide-react";
import { getClassicConceptsBrandInfo } from "@/lib/brandInfo";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for Classic Edge 53 (Classic Concepts Acrylic Private Limited) covering machinery enquiries, orders, WhatsApp Business support, and Meta login.",
  alternates: {
    canonical: "https://classicedge53.com/privacy-policy",
  },
  openGraph: {
    title: "Privacy Policy | Classic Edge 53",
    description:
      "How Classic Edge 53 collects, uses, protects, and deletes customer data across classicedge53.com and WhatsApp Business.",
    url: "https://classicedge53.com/privacy-policy",
    siteName: "Classic Edge 53",
    type: "website",
  },
};

export default async function ClassicEdgePrivacyPolicyPage() {
  const brandInfo = await getClassicConceptsBrandInfo();
  const companyName =
    brandInfo?.brand?.companyName || "Classic Concepts Acrylic Private Limited";
  const address =
    brandInfo?.contact?.address ||
    "Secunderabad, Hyderabad, Telangana, India";
  const phone = brandInfo?.contact?.phones?.[0] || "+91 98490 50752";
  const whatsapp = brandInfo?.contact?.whatsappNumber || "+91 73372 20568";
  const email =
    brandInfo?.contact?.emails?.[0] || "info@classicedge53.com";

  return (
    <div className="container mx-auto px-4 py-16 md:py-20">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Official Privacy Policy</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto">
            How Classic Edge 53 ({companyName}) collects, uses, stores, and
            protects your information across our website, order tracking portal,
            and WhatsApp Business support.
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
                href="/terms-of-service"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Terms of Service</span>
              </Link>
              <Link
                href="/data-deletion"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/30 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Request Data Deletion</span>
              </Link>
            </div>
          </div>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">
              1. Who We Are and Scope of This Policy
            </h2>
            <p>
              <strong>Classic Edge 53</strong> is the industrial acrylic
              machinery and consumables brand of{" "}
              <strong>{companyName}</strong> (&quot;Classic Edge 53&quot;,
              &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). This Privacy
              Policy explains how we collect and protect information when you
              visit <strong>https://classicedge53.com</strong>, submit an
              enquiry for machines, blades, or consumables, track an order via{" "}
              <strong>track.ccapl.cc</strong> or <strong>track.ccapl.in</strong>
              , connect through a Meta Login dialog, or message our official
              WhatsApp Business account and customer desk at{" "}
              <strong>whatsapp.ccapl.cc</strong>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">
              2. Information We Collect
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Business and Contact Details:</strong> Your name, phone
                number, WhatsApp number, email address, workshop or company
                name, city, delivery address, and GST number (for GST tax
                invoicing).
              </li>
              <li>
                <strong>Machinery Enquiry and Order Records:</strong> Machine
                models, diamond tools, polishing consumables, technical manuals
                requested, quotations, payment references, transport LR or AWB
                numbers, and after-sales service notes.
              </li>
              <li>
                <strong>WhatsApp Business and Meta Platform Data:</strong> When
                you message our WhatsApp Business number or sign in via a Meta
                Login dialog connected to our app, we receive your WhatsApp
                phone number, profile name, message text, media shared with us,
                and delivery/read receipts via the official Meta WhatsApp
                Business Cloud API.
              </li>
              <li>
                <strong>Basic Visit Data:</strong> Anonymous session cookies and
                page visit counts used only to keep the site fast and reliable.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">
              3. How We Use Your Information
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                To answer technical questions and prepare quotations for
                diamond edge polishers, flame polishers, CNC routers, bending
                machines, blades, and consumables.
              </li>
              <li>
                To process orders, issue GST invoices, book freight or courier
                dispatch, and send live shipment tracking links.
              </li>
              <li>
                To provide installation guidance, spare parts support, and
                warranty assistance over WhatsApp, phone, or email.
              </li>
              <li>
                To share machine or consumable updates on WhatsApp only where
                you have opted in, with instant opt-out anytime by replying{" "}
                <strong>STOP</strong>.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">
              4. Meta Login Dialog and WhatsApp Cloud API Disclosures
            </h2>
            <p>
              Our support desk connects to official Meta Platforms, Inc. APIs
              (WhatsApp Business Cloud API and Facebook Login for Business where
              applicable):
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                We never sell, rent, or trade your WhatsApp phone number, Meta
                account data, or chat history to any third party.
              </li>
              <li>
                Data received through Meta APIs is used strictly to answer your
                enquiries, send order and tracking updates, and support your
                account with {companyName}.
              </li>
              <li>
                If our automated assistant answers basic machine specification
                questions on WhatsApp, it processes your message solely to reply
                and connect you with our engineering or sales staff. Your data
                is never used to train public AI models.
              </li>
              <li>
                Reply <strong>STOP</strong> at any time on WhatsApp to opt out
                of promotional broadcasts.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">
              5. How We Share Information
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Freight and Courier Carriers:</strong> Transport and
                courier providers (such as Safexpress, VRL, TCI Express, Gati,
                Delhivery, Blue Dart, and DTDC) receive your delivery name,
                address, and phone number to deliver machines or consumables.
              </li>
              <li>
                <strong>Meta and Hosting Providers:</strong> Meta Platforms,
                Inc. delivers WhatsApp messages to and from our verified
                business number, and encrypted cloud servers host our database.
              </li>
              <li>
                <strong>Tax and Legal Compliance:</strong> Banks and government
                tax authorities receive payment and GST filings where required
                under Indian law.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">
              6. Data Security, Retention, and Deletion Rights
            </h2>
            <p>
              All traffic is protected with HTTPS encryption, restricted staff
              access, and encrypted backups. Under India&apos;s Digital Personal
              Data Protection Act, 2023 (DPDP Act) and Meta Platform rules, you
              may request access, correction, or complete deletion of your
              personal data at any time via our{" "}
              <Link
                href="/data-deletion"
                className="text-blue-400 font-semibold underline hover:text-blue-300"
              >
                User Data Deletion Request page
              </Link>
              .
            </p>
          </section>

          <section className="space-y-4 pt-6 border-t border-white/10">
            <h2 className="text-xl font-semibold text-white">
              7. Contact Us and Grievance Officer
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
                <span>
                  Phone: {phone} | WhatsApp: {whatsapp}
                </span>
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
