import { getClassicConceptsBrandInfo } from "@/lib/brandInfo";
import { ExternalLink, FileText, Award } from "lucide-react";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function AdminCertificatesPage() {
  const brandInfo = await getClassicConceptsBrandInfo();
  const certificates = brandInfo?.brand?.certifications?.allCertificates || [];

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Certificates</h1>
          <p className="text-slate-400 text-sm mt-1">
            Synced automatically from <span className="text-blue-400">classicconcepts.in/api/brand-info</span>
          </p>
        </div>
        <a
          href="https://classicconcepts.in/admin"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
        >
          Manage on Classic Concepts <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {certificates.length === 0 ? (
          <div className="col-span-full text-slate-500 p-8 border border-white/10 rounded-xl text-center">
            No certificates found in API.
          </div>
        ) : (
          certificates.map((cert) => {
            const isPdf = cert.fileUrl?.toLowerCase().endsWith(".pdf");
            return (
              <a
                key={cert.id}
                href={cert.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#050b14] border border-white/5 hover:border-blue-500/40 rounded-xl overflow-hidden flex flex-col transition-all group"
              >
                <div className="aspect-[4/3] relative bg-[#0a1120] flex items-center justify-center">
                  {cert.fileUrl && !isPdf ? (
                    <Image src={cert.fileUrl} alt={cert.title} fill className="object-contain p-2" />
                  ) : isPdf ? (
                    <div className="flex flex-col items-center gap-2 text-blue-400">
                      <FileText className="w-12 h-12" />
                      <span className="text-xs uppercase font-semibold">PDF Document</span>
                    </div>
                  ) : (
                    <Award className="w-12 h-12 text-slate-600" />
                  )}
                </div>
                <div className="p-4 flex items-center justify-between gap-2">
                  <h3 className="font-semibold text-white truncate group-hover:text-blue-400 transition-colors">
                    {cert.title}
                  </h3>
                  <ExternalLink className="w-4 h-4 text-slate-500 shrink-0" />
                </div>
              </a>
            );
          })
        )}
      </div>
    </div>
  );
}
