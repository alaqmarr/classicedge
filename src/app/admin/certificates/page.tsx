import Link from "next/link";
import { getCertificates } from "@/app/actions/certificate";
import { Plus, Trash2 } from "lucide-react";
import Image from "next/image";

export default async function AdminCertificatesPage() {
  const certificates = await getCertificates();

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Certificates</h1>
        <Link href="/admin/certificates/new" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
          <Plus className="w-4 h-4" /> Add Certificate
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {certificates.length === 0 ? (
          <div className="col-span-full text-slate-500 p-8 border border-white/10 rounded-xl text-center">
            No certificates uploaded.
          </div>
        ) : (
          certificates.map((cert) => (
            <div key={cert.id} className="bg-[#050b14] border border-white/5 rounded-xl overflow-hidden group">
              <div className="aspect-[4/3] bg-white/5 relative flex items-center justify-center">
                {cert.image ? (
                  <Image src={cert.image} alt={cert.title} fill className="object-cover" />
                ) : (
                  <span className="text-slate-500 text-xs">No image</span>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button className="bg-red-500/20 text-red-400 p-3 rounded-full hover:bg-red-500 hover:text-white transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-slate-200 text-center truncate">{cert.title}</h3>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
