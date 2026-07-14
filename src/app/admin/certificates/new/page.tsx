"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { createCertificate } from "@/app/actions/certificate";
import toast from "react-hot-toast";
import { ImageUpload, UploadableImage } from "@/components/ui/ImageUpload";
import { uploadFile } from "@/lib/uploadHelpers";

type FormValues = {
  title: string;
};

export default function NewCertificatePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [image, setImage] = useState<UploadableImage[]>([]);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    if (image.length === 0) {
      toast.error("Please upload an image for the certificate");
      return;
    }

    setIsSubmitting(true);
    try {
      let finalImageUrl = "";
      const img = image[0];
      
      if (img.file) {
        finalImageUrl = await uploadFile(img.file);
      } else if (img.url) {
        finalImageUrl = img.url;
      }

      const res = await createCertificate({
        ...data,
        image: finalImageUrl
      });
      
      if (res.success) {
        toast.success("Certificate added successfully");
        router.push("/admin/certificates");
      } else {
        toast.error(res.error || "Failed to save");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/certificates" className="p-2 glass rounded-lg hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-bold text-white">Add Certificate</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="glass-panel border border-white/5 p-8 rounded-2xl space-y-6">
        
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Certificate Image *</label>
          <ImageUpload 
            value={image}
            onChange={setImage}
            maxFiles={1}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Certificate Title *</label>
          <input
            {...register("title", { required: true })}
            className="w-full bg-[#050b14] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="e.g. ISO 9001:2015, CE Marking"
          />
          {errors.title && <span className="text-red-400 text-xs mt-1">Required</span>}
        </div>

        <div className="flex justify-end pt-6 border-t border-white/10">
          <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 shadow-[0_0_15px_rgba(37,99,235,0.4)]">
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {isSubmitting ? "Saving..." : "Save Certificate"}
          </button>
        </div>
      </form>
    </div>
  );
}
