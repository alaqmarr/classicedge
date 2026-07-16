"use client";

import { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Save, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { ImageUpload, UploadableImage } from "@/components/ui/ImageUpload";
import { ResourceUpload, UploadableResource } from "@/components/ui/ResourceUpload";
import { uploadFile } from "@/lib/uploadHelpers";

export type ConsumableOptions = { id: string, name: string, category: string | null }[];

export type FormValues = {
  name: string;
  description: string;
  keywords: string;
  images: UploadableImage[];
  resources: UploadableResource[];
  specifications: { key: string; value: string }[];
  consumables: string[];
  models: {
    modelName: string;
    specifications: { key: string; value: string }[];
    resources: UploadableResource[];
    consumables: string[];
  }[];
};

export function ProductForm({ 
  availableConsumables, 
  initialData, 
  productId 
}: { 
  availableConsumables: ConsumableOptions;
  initialData?: Partial<FormValues>;
  productId?: string;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");

  const { register, control, handleSubmit, formState: { errors } } = useForm<FormValues>({
    defaultValues: initialData || {
      name: "",
      description: "",
      keywords: "",
      images: [],
      resources: [],
      specifications: [],
      consumables: [],
      models: []
    }
  });

  const { fields: modelFields, append: appendModel, remove: removeModel } = useFieldArray({
    control,
    name: "models"
  });

  const { fields: rootSpecFields, append: appendRootSpec, remove: removeRootSpec } = useFieldArray({
    control,
    name: "specifications"
  });

  const handleAddModel = () => {
    let initialSpecs = [{ key: "", value: "" }];
    
    if (modelFields.length > 0) {
      const prevSpecs = modelFields[modelFields.length - 1].specifications;
      if (prevSpecs && prevSpecs.length > 0) {
        initialSpecs = prevSpecs.map(s => ({ key: s.key, value: "" }));
      }
    } else if (rootSpecFields.length > 0) {
       initialSpecs = rootSpecFields.map(s => ({ key: s.key, value: "" }));
    }

    appendModel({
      modelName: "",
      specifications: initialSpecs,
      resources: [],
      consumables: []
    });
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setUploadProgress("Uploading files...");
    
    try {
      // 1. Upload Product Images
      const uploadedImages = [];
      for (const img of data.images) {
        if (img.file) {
          const url = await uploadFile(img.file);
          uploadedImages.push(url);
        } else if (img.url) {
          uploadedImages.push(img.url);
        }
      }

      // 2. Upload Product Resources
      const uploadedResources = [];
      for (const res of data.resources) {
        if (res.file) {
          const url = await uploadFile(res.file);
          uploadedResources.push({ name: res.name, url });
        } else if (res.url) {
          uploadedResources.push({ name: res.name, url: res.url });
        }
      }

      // 3. Upload Model Resources
      const processedModels = [];
      for (const model of data.models) {
        const modelResources = [];
        for (const res of model.resources) {
          if (res.file) {
            const url = await uploadFile(res.file);
            modelResources.push({ name: res.name, url });
          } else if (res.url) {
            modelResources.push({ name: res.name, url: res.url });
          }
        }
        processedModels.push({
          ...model,
          resources: modelResources
        });
      }

      setUploadProgress("Saving product...");

      // 4. Submit to Database
      const payload = {
        ...data,
        images: uploadedImages,
        resources: uploadedResources,
        models: processedModels
      };

      const url = productId ? `/api/admin/products/${productId}` : "/api/admin/products";
      const method = productId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      const result = await res.json();
      if (res.ok) {
        toast.success(productId ? "Product updated successfully" : "Product created successfully");
        router.push("/admin/products");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to save product");
      }
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
      setUploadProgress("");
    }
  };

  const SpecificationsList = ({ modelIndex }: { modelIndex?: number }) => {
    const isRoot = modelIndex === undefined;
    const { fields: specFields, append: appendSpec, remove: removeSpec } = useFieldArray({
      control,
      name: isRoot ? "specifications" : `models.${modelIndex}.specifications` as const
    });

    return (
      <div className={`space-y-3 mt-4 ${!isRoot ? 'pl-4 border-l-2 border-white/10' : ''}`}>
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-sm font-medium text-slate-300">Specifications</h4>
          <button type="button" onClick={() => appendSpec({ key: "", value: "" })} className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
            <Plus className="w-3 h-3" /> Add Spec
          </button>
        </div>
        
        {specFields.map((spec, specIndex) => (
          <div key={spec.id} className="flex gap-3">
            <input
              {...register(isRoot ? `specifications.${specIndex}.key` : `models.${modelIndex}.specifications.${specIndex}.key`, { required: true })}
              placeholder="e.g. Power"
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
            <input
              {...register(isRoot ? `specifications.${specIndex}.value` : `models.${modelIndex}.specifications.${specIndex}.value`)}
              placeholder="Value (Optional)"
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
            <button type="button" onClick={() => removeSpec(specIndex)} className="p-2 text-slate-500 hover:text-red-400 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-8 max-w-4xl mx-auto pb-20">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="p-2 glass rounded-lg hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-bold text-white">{productId ? "Edit Product" : "Add New Product"}</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="glass-panel border border-white/5 p-6 rounded-xl space-y-6">
          <h2 className="text-xl font-semibold text-white mb-4">Basic Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Product Name *</label>
              <input
                {...register("name", { required: true })}
                className="w-full bg-[#050b14] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="e.g. Computer Automatic Double-tube Bending Machine"
              />
              {errors.name && <span className="text-red-400 text-xs mt-1">Name is required</span>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
              <textarea
                {...register("description")}
                rows={4}
                className="w-full bg-[#050b14] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
                placeholder="Brief description of the machine..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">SEO Keywords (Optional)</label>
              <input
                {...register("keywords")}
                className="w-full bg-[#050b14] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Comma separated keywords (e.g. acrylic machine, diamond polisher). Leave empty to auto-generate."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Product Images</label>
              <Controller
                name="images"
                control={control}
                render={({ field }) => (
                  <ImageUpload value={field.value || []} onChange={field.onChange} maxFiles={5} />
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Product Resources (PDF, DOC)</label>
              <Controller
                name="resources"
                control={control}
                render={({ field }) => (
                  <ResourceUpload value={field.value || []} onChange={field.onChange} maxFiles={5} />
                )}
              />
            </div>

            {availableConsumables.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Recommended Consumables</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {availableConsumables.map(c => (
                    <label key={c.id} className="flex items-center gap-2 p-3 rounded-lg bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                      <input type="checkbox" value={c.id} {...register("consumables")} className="rounded bg-black border-slate-600 text-blue-500 focus:ring-blue-500" />
                      <span className="text-sm text-slate-300">{c.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="glass-panel border border-white/5 p-6 rounded-xl space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Models & Specifications</h2>
            <button type="button" onClick={handleAddModel} className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-slate-300 px-3 py-1.5 rounded-lg text-sm transition-colors">
              <Plus className="w-4 h-4" /> Add Model
            </button>
          </div>
          
          <p className="text-sm text-slate-400 mb-4">
            If this product doesn't have different models, you can add specifications directly here. 
            If you add models, specifications should belong to those models instead.
          </p>

          {modelFields.length === 0 && (
             <div className="bg-[#050b14] p-5 rounded-lg border border-white/5">
                <h3 className="text-md font-medium text-white mb-2">General Specifications</h3>
                <SpecificationsList />
             </div>
          )}

          <div className="space-y-6">
            {modelFields.map((model, index) => (
              <div key={model.id} className="bg-[#050b14] p-5 rounded-lg border border-white/5">
                <div className="flex gap-4 items-start mb-4">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-slate-400 mb-1">Model Name *</label>
                    <input
                      {...register(`models.${index}.modelName` as const, { required: true })}
                      placeholder="e.g. YN-JW1200"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <button type="button" onClick={() => removeModel(index)} className="p-2 mt-5 text-slate-500 hover:text-red-400 transition-colors bg-white/5 rounded-lg">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-medium text-slate-400 mb-2">Model Specific Resources</label>
                  <Controller
                    name={`models.${index}.resources` as const}
                    control={control}
                    render={({ field }) => (
                      <ResourceUpload value={field.value || []} onChange={field.onChange} maxFiles={3} />
                    )}
                  />
                </div>

                <SpecificationsList modelIndex={index} />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 shadow-[0_0_15px_rgba(37,99,235,0.4)]">
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {isSubmitting ? uploadProgress : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
