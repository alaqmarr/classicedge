import { getClassicConceptsBrandInfo } from "@/lib/brandInfo";
import Image from "next/image";
import { Award, FileText, ExternalLink } from "lucide-react";

export const revalidate = 60;

export default async function CertificatesPage() {
  const brandInfo = await getClassicConceptsBrandInfo();
  const certificates = brandInfo?.brand?.certifications?.allCertificates?.sort(
    (a, b) => a.sortOrder - b.sortOrder
  ) || [];

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="text-center mb-16 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Certificates</h1>
        <p className="text-xl text-slate-400">
          Classic Edge 53 is committed to the highest standards of quality and manufacturing excellence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {certificates.length === 0 ? (
          <div className="col-span-full text-center py-20 text-slate-500">
            No certificates found. Check back later.
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
                className="glass-panel p-6 rounded-2xl group hover:border-blue-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[4/3] bg-[#0a1120] rounded-xl mb-6 relative overflow-hidden flex flex-col items-center justify-center border border-white/5">
                    {cert.fileUrl && !isPdf ? (
                      <Image
                        src={cert.fileUrl}
                        alt={cert.title}
                        fill
                        className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : isPdf ? (
                      <div className="flex flex-col items-center gap-3 text-blue-400 group-hover:scale-105 transition-transform duration-300">
                        <FileText className="w-16 h-16 text-blue-500/60" />
                        <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
                          PDF Document
                        </span>
                      </div>
                    ) : (
                      <Award className="w-16 h-16 text-blue-500/20" />
                    )}
                  </div>
                  <h3 className="font-semibold text-xl text-center text-slate-200 group-hover:text-blue-400 transition-colors">
                    {cert.title}
                  </h3>
                  {cert.issuedBy && (
                    <p className="text-sm text-slate-400 text-center mt-1">Issued by {cert.issuedBy}</p>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-center gap-2 text-sm text-blue-400 font-medium opacity-80 group-hover:opacity-100">
                  <span>View Certificate</span>
                  <ExternalLink className="w-4 h-4" />
                </div>
              </a>
            );
          })
        )}
      </div>
    </div>
  );
}
