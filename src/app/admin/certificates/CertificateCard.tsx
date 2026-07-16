"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { deleteCertificate } from "@/app/actions/certificate";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { useRouter } from "next/navigation";

interface Certificate {
  id: string;
  title: string;
  image: string;
}

export default function CertificateCard({ certificate }: { certificate: Certificate }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteCertificate(certificate.id);
    setIsDeleting(false);
    
    if (result.success) {
      setIsModalOpen(false);
      router.refresh();
    } else {
      alert("Failed to delete certificate");
    }
  };

  return (
    <>
      <div className="bg-[#050b14] border border-white/5 rounded-xl overflow-hidden group">
        <div className="aspect-[4/3] bg-white/5 relative flex items-center justify-center">
          {certificate.image ? (
            <Image src={certificate.image} alt={certificate.title} fill className="object-cover" />
          ) : (
            <span className="text-slate-500 text-xs">No image</span>
          )}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-red-500/20 text-red-400 p-3 rounded-full hover:bg-red-500 hover:text-white transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-slate-200 text-center truncate">{certificate.title}</h3>
        </div>
      </div>

      <ConfirmModal 
        isOpen={isModalOpen}
        title="Delete Certificate"
        description={`Are you sure you want to delete "${certificate.title}"?`}
        onConfirm={handleDelete}
        onCancel={() => setIsModalOpen(false)}
        isLoading={isDeleting}
      />
    </>
  );
}
