"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { submitEnquiry } from "@/app/actions/enquiry";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";

export function ContactForm() {
  const searchParams = useSearchParams();
  const defaultSubject = searchParams.get("subject") || "";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: defaultSubject ? `Hi, ${defaultSubject}.\n\n` : "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await submitEnquiry({
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
      });

      if (res.success) {
        toast.success("Message sent successfully! We will contact you soon.");
        setFormData({ firstName: "", lastName: "", email: "", phone: "", message: "" });
      } else {
        toast.error(res.error || "Failed to send message.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-panel p-8 lg:p-10 rounded-3xl">
      <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">First Name *</label>
            <input 
              required
              value={formData.firstName}
              onChange={e => setFormData(f => ({ ...f, firstName: e.target.value }))}
              className="w-full bg-[#050b14] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" 
              placeholder="John" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Last Name</label>
            <input 
              value={formData.lastName}
              onChange={e => setFormData(f => ({ ...f, lastName: e.target.value }))}
              className="w-full bg-[#050b14] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" 
              placeholder="Doe" 
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Email Address *</label>
            <input 
              required
              type="email" 
              value={formData.email}
              onChange={e => setFormData(f => ({ ...f, email: e.target.value }))}
              className="w-full bg-[#050b14] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" 
              placeholder="john@example.com" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Phone Number</label>
            <input 
              type="tel" 
              value={formData.phone}
              onChange={e => setFormData(f => ({ ...f, phone: e.target.value }))}
              className="w-full bg-[#050b14] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" 
              placeholder="+1 234 567 890" 
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Message *</label>
          <textarea 
            required
            rows={5} 
            value={formData.message}
            onChange={e => setFormData(f => ({ ...f, message: e.target.value }))}
            className="w-full bg-[#050b14] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none" 
            placeholder="How can we help you?"
          />
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] disabled:opacity-50"
        >
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          {isSubmitting ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
}
