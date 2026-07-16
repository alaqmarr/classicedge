import Link from "next/link";
import { getCertificates } from "@/app/actions/certificate";
import { Plus } from "lucide-react";
import CertificateCard from "./CertificateCard";

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
            <CertificateCard key={cert.id} certificate={cert} />
          ))
        )}
      </div>
    </div>
  );
}
