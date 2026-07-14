"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { createConsumable } from "@/app/actions/consumable";
import { ImageUpload, UploadableImage } from "@/components/ui/ImageUpload";
import { uploadFile } from "@/lib/uploadHelpers";

export function NewConsumableClient({ products }: { products: any[] }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    keywords: "",
    coverImage: [] as UploadableImage[],
    price: "",
    productIds: [] as string[],
    modelIds: [] as string[]
  });

  const availableModels = products
    .filter(p => formData.productIds.includes(p.id))
    .flatMap(p => p.models);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUploadProgress("Uploading image...");

    try {
      let finalImageUrl = "";
      
      if (formData.coverImage.length > 0) {
        const img = formData.coverImage[0];
        if (img.file) {
          finalImageUrl = await uploadFile(img.file);
        } else if (img.url) {
          finalImageUrl = img.url;
        }
      }

      setUploadProgress("Saving...");

      const res = await createConsumable({
        name: formData.name,
        description: formData.description,
        keywords: formData.keywords,
        image: finalImageUrl,
        productIds: formData.productIds,
        modelIds: formData.modelIds
      });

      if (res.success) {
        toast.success("Consumable created!");
        router.push("/admin/consumables");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to create");
      }
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
      setUploadProgress("");
    }
  };

  const toggleProduct = (id: string) => {
    setFormData(prev => ({
      ...prev,
      productIds: prev.productIds.includes(id) 
        ? prev.productIds.filter(pid => pid !== id)
        : [...prev.productIds, id],
      // Remove models if their product is unselected
      modelIds: prev.productIds.includes(id) 
        ? prev.modelIds.filter(mid => !products.find(p => p.id === id)?.models.some((m: any) => m.id === mid))
        : prev.modelIds
    }));
  };

  const toggleModel = (id: string) => {
    setFormData(prev => ({
      ...prev,
      modelIds: prev.modelIds.includes(id)
        ? prev.modelIds.filter(mid => mid !== id)
        : [...prev.modelIds, id]
    }));
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/consumables" className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400 hover:text-white">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">Add Consumable</h1>
          <p className="text-slate-400 text-sm mt-1">Create a new accessory or part.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="glass-panel p-8 rounded-2xl space-y-6 border border-white/5">
          <h2 className="text-xl font-semibold border-b border-white/10 pb-4">Basic Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-slate-300">Name *</label>
              <input
                required
                value={formData.name}
                onChange={e => setFormData(f => ({ ...f, name: e.target.value }))}
                className="w-full bg-[#050b14] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="e.g. Diamond Polishing Pads (Set of 3)"
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-slate-300">Description</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={e => setFormData(f => ({ ...f, description: e.target.value }))}
                className="w-full bg-[#050b14] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
                placeholder="Brief description of the consumable..."
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-slate-300">SEO Keywords (Optional)</label>
              <input
                value={formData.keywords}
                onChange={e => setFormData(f => ({ ...f, keywords: e.target.value }))}
                className="w-full bg-[#050b14] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Comma separated keywords (e.g. cutting pad, polisher pad). Leave empty to auto-generate."
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-slate-300">Cover Image</label>
              <ImageUpload
                maxFiles={1}
                value={formData.coverImage}
                onChange={(images) => setFormData(f => ({ ...f, coverImage: images }))}
              />
            </div>
          </div>
        </div>

        <div className="glass-panel p-8 rounded-2xl space-y-6 border border-white/5">
          <h2 className="text-xl font-semibold border-b border-white/10 pb-4">Compatibility</h2>
          <p className="text-sm text-slate-400">Select which products and specific models this consumable is compatible with.</p>
          
          <div className="space-y-4">
            <h3 className="font-medium text-blue-400">Products</h3>
            <div className="flex flex-wrap gap-3">
              {products.map(product => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => toggleProduct(product.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors border ${
                    formData.productIds.includes(product.id)
                      ? "bg-blue-600/20 border-blue-500 text-blue-300"
                      : "bg-[#050b14] border-white/10 text-slate-400 hover:border-white/30"
                  }`}
                >
                  {product.name}
                </button>
              ))}
            </div>
          </div>

          {availableModels.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-white/5">
              <h3 className="font-medium text-emerald-400">Specific Models</h3>
              <div className="flex flex-wrap gap-3">
                {availableModels.map((model: any) => (
                  <button
                    key={model.id}
                    type="button"
                    onClick={() => toggleModel(model.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors border ${
                      formData.modelIds.includes(model.id)
                        ? "bg-emerald-600/20 border-emerald-500 text-emerald-300"
                        : "bg-[#050b14] border-white/10 text-slate-400 hover:border-white/30"
                    }`}
                  >
                    {model.modelName}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-4">
          <Link href="/admin/consumables" className="px-6 py-3 rounded-xl font-medium text-slate-300 hover:text-white transition-colors">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)] disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {isSubmitting ? (uploadProgress || "Saving...") : "Save Consumable"}
          </button>
        </div>
      </form>
    </div>
  );
}
