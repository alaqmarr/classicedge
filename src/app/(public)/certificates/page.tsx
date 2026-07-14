import { getCertificates } from "@/app/actions/certificate";
import Image from "next/image";
import { Award } from "lucide-react";

export default async function CertificatesPage() {
  const certificates = await getCertificates();

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="text-center mb-16 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Certificates</h1>
        <p className="text-xl text-slate-400">Classic Edge 53 is committed to the highest standards of quality and manufacturing excellence.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {certificates.length === 0 ? (
          <div className="col-span-full text-center py-20 text-slate-500">
            No certificates found. Check back later.
          </div>
        ) : (
          certificates.map((cert) => (
            <div key={cert.id} className="glass-panel p-6 rounded-2xl group hover:border-blue-500/30 transition-colors">
              <div className="aspect-[4/3] bg-[#0a1120] rounded-xl mb-6 relative overflow-hidden flex items-center justify-center border border-white/5">
                {cert.image ? (
                  <Image src={cert.image} alt={cert.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <Award className="w-16 h-16 text-blue-500/20" />
                )}
              </div>
              <h3 className="font-semibold text-xl text-center text-slate-200">{cert.title}</h3>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
