"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { EmailEnquiryModal } from "@/components/ui/EmailEnquiryModal";

interface Props {
  productName: string;
  whatsappNumber: string | null;
}

export function ProductActionButtons({ productName, whatsappNumber }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const number = whatsappNumber || "+919849050752";
  const whatsappUrl = `https://wa.me/${number.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi, I am interested in the product: ${productName}`)}`;

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-medium transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)]"
        >
          <Mail className="w-5 h-5" />
          Email Enquiry
        </button>
        
        <a 
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebd5a] text-white px-8 py-4 rounded-full font-medium transition-all shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:shadow-[0_0_30px_rgba(37,211,102,0.6)]"
        >
          <FaWhatsapp className="w-5 h-5" />
          Enquire on WhatsApp
        </a>
      </div>

      <EmailEnquiryModal 
        productName={productName}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
