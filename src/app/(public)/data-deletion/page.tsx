import type { Metadata } from "next";
import Link from "next/link";
import { Trash2, ShieldCheck, FileText, Mail, Phone } from "lucide-react";
import { getClassicConceptsBrandInfo } from "@/lib/brandInfo";
import { DataDeletionForm } from "./DataDeletionForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "User Data Deletion Instructions & Request",
  description:
    "Instructions and instant form to request deletion of your WhatsApp Business, Meta Login, and website contact data held by Classic Edge 53.",
  alternates: {
    canonical: "https://classicedge53.com/data-deletion",
  },
  openGraph: {
    title: "User Data Deletion Request | Classic Edge 53",
    description:
      "How to delete your WhatsApp, Meta Login, and website data with Classic Edge 53 (Classic Concepts Acrylic Private Limited).",
    url: "https://classicedge53.com/data-deletion",
    siteName: "Classic Edge 53",
    type: "website",
  },
};

export default async function ClassicEdgeDataDeletionPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const [brandInfo, params] = await Promise.all([
    getClassicConceptsBrandInfo(),
    searchParams,
  ]);
  const companyName =
    brandInfo?.brand?.companyName || "Classic Concepts Acrylic Private Limited";
  const email =
    brandInfo?.contact?.emails?.[0] || "info@classicedge53.com";
  const whatsapp = brandInfo?.contact?.whatsappNumber || "+91 73372 20568";
  const cleanCode =
    typeof params?.code === "string"
      ? params.code.replace(/[^A-Za-z0-9_-]/g, "").slice(0, 40)
      : "";

  return (
    <div className="container mx-auto px-4 py-16 md:py-20">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-semibold">
            <Trash2 className="w-4 h-4" />
            <span>User Data Deletion Portal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            User Data Deletion
          </h1>
          <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto">
            Simple instructions and online form to permanently remove your
            WhatsApp Business, Meta Login, and website contact records from
            Classic Edge 53.
          </p>
        </div>

        <div className="glass-panel rounded-2xl border border-white/10 p-6 sm:p-10 md:p-12 space-y-8 text-slate-300 leading-relaxed">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <p className="text-sm font-semibold text-white">
                Classic Edge 53 (A Brand of {companyName})
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Meta App &amp; WhatsApp Business User Data Deletion Portal
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
                href="/terms-of-service"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Terms of Service</span>
              </Link>
            </div>
          </div>

          <DataDeletionForm initialCode={cleanCode || undefined} />

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">
              How to Request Data Deletion (3 Easy Ways)
            </h2>
            <p>
              You control the personal and business contact data shared with{" "}
              <strong className="text-white">Classic Edge 53</strong> ({companyName}) across{" "}
              <strong className="text-white">classicedge53.com</strong>, Meta
              Login dialogs, and our WhatsApp Business number (
              <strong className="text-white">{whatsapp}</strong>):
            </p>
            <ol className="list-decimal pl-6 space-y-2.5">
              <li>
                <strong className="text-white">
                  Online Form Above (Instant Confirmation Code):
                </strong>{" "}
                Enter your phone number or email above and click{" "}
                <strong className="text-white">Submit Deletion Request</strong>{" "}
                to get an immediate confirmation code.
              </li>
              <li>
                <strong className="text-white">Directly on WhatsApp:</strong>{" "}
                Message <strong className="text-white">DELETE MY DATA</strong>{" "}
                from your WhatsApp number to{" "}
                <strong className="text-white">{whatsapp}</strong>.
              </li>
              <li>
                <strong className="text-white">
                  Via Facebook / Meta Settings or Email:
                </strong>{" "}
                Open your Facebook Account{" "}
                <em>Settings &amp; Privacy &gt; Settings &gt; Apps and Websites</em>
                , remove our app, and click <em>Send Request</em>, or email{" "}
                <a
                  href={`mailto:${email}?subject=Data%20Deletion%20Request`}
                  className="text-blue-400 font-semibold underline"
                >
                  {email}
                </a>{" "}
                with the subject line{" "}
                <strong className="text-white">Data Deletion Request</strong>.
              </li>
            </ol>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">
              What Data Is Deleted and Timeline
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong className="text-white">
                  Deleted Within 7 Business Days:
                </strong>{" "}
                Your WhatsApp chat threads, contact directory profile, broadcast
                opt-in lists, Meta app-scoped user IDs, and website machine
                enquiry records.
              </li>
              <li>
                <strong className="text-white">Legal Tax Exception:</strong>{" "}
                Where machinery or consumables were purchased under a GST tax
                invoice, statutory tax invoice lines required under Indian GST
                law are kept offline solely for tax audit compliance and are
                never used for marketing or messaging.
              </li>
            </ul>
          </section>

          <section className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-6 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-400" />
              <a
                href={`mailto:${email}`}
                className="font-semibold text-blue-400 hover:underline"
              >
                {email}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-400" />
              <span>WhatsApp Support: {whatsapp}</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
