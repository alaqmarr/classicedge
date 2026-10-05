"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, Loader2, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { createContact } from "@/app/actions/contact";
import toast from "react-hot-toast";

type FormValues = {
  title: string;
  address: string;
  phones: { value: string }[];
  emails: { value: string }[];
  mapEmbedUrl?: string;
};

export default function NewContactPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, control, handleSubmit, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      phones: [{ value: "" }],
      emails: [{ value: "" }]
    }
  });

  const { fields: phoneFields, append: appendPhone, remove: removePhone } = useFieldArray({
    control,
    name: "phones"
  });

  const { fields: emailFields, append: appendEmail, remove: removeEmail } = useFieldArray({
    control,
    name: "emails"
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const phone = data.phones.map(p => p.value.trim()).filter(Boolean).join(', ');
      const email = data.emails.map(e => e.value.trim()).filter(Boolean).join(', ');
      
      const payload = {
        title: data.title,
        address: data.address,
        phone,
        email,
        mapEmbedUrl: data.mapEmbedUrl,
      };

      const res = await createContact(payload);
      if (res.success) {
        toast.success("Contact info saved successfully");
        router.push("/admin/contact");
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
        <Link href="/admin/contact" className="p-2 glass rounded-lg hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-bold text-white">Add Contact Office</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="glass-panel border border-white/5 p-8 rounded-2xl space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Office Title *</label>
          <input
            {...register("title", { required: true })}
            className="w-full bg-[#050b14] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="e.g. Headquarters, Factory, Branch Office"
          />
          {errors.title && <span className="text-red-400 text-xs mt-1">Required</span>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Address *</label>
          <textarea
            {...register("address", { required: true })}
            rows={3}
            className="w-full bg-[#050b14] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
            placeholder="Full physical address..."
          />
          {errors.address && <span className="text-red-400 text-xs mt-1">Required</span>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Phone Numbers *</label>
            <div className="space-y-3">
              {phoneFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <input
                    {...register(`phones.${index}.value` as const, { required: true })}
                    className="flex-1 bg-[#050b14] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="+1 234 567 890"
                  />
                  {phoneFields.length > 1 && (
                    <button type="button" onClick={() => removePhone(index)} className="p-3 text-slate-400 hover:text-red-400 bg-white/5 rounded-xl transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => appendPhone({ value: "" })} className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors">
                <Plus className="w-4 h-4" /> Add another phone
              </button>
            </div>
            {errors.phones && <span className="text-red-400 text-xs mt-1">Required</span>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Email Addresses *</label>
            <div className="space-y-3">
              {emailFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <input
                    {...register(`emails.${index}.value` as const, { required: true })}
                    type="email"
                    className="flex-1 bg-[#050b14] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="contact@company.com"
                  />
                  {emailFields.length > 1 && (
                    <button type="button" onClick={() => removeEmail(index)} className="p-3 text-slate-400 hover:text-red-400 bg-white/5 rounded-xl transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => appendEmail({ value: "" })} className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors">
                <Plus className="w-4 h-4" /> Add another email
              </button>
            </div>
            {errors.emails && <span className="text-red-400 text-xs mt-1">Required</span>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Google Maps Embed Code (Optional)</label>
          <textarea
            {...register("mapEmbedUrl")}
            rows={4}
            className="w-full bg-[#050b14] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none font-mono text-sm"
            placeholder='<iframe src="https://www.google.com/maps/embed?..." width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>'
          />
          <p className="text-xs text-slate-500 mt-1">Paste the entire &lt;iframe&gt; code generated by Google Maps.</p>
        </div>

        <div className="flex justify-end pt-6 border-t border-white/10">
          <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 shadow-[0_0_15px_rgba(37,99,235,0.4)]">
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {isSubmitting ? "Saving..." : "Save Office"}
          </button>
        </div>
      </form>
    </div>
  );
}

