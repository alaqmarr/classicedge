"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Mail, Phone, Package, Reply, CheckCircle2, Loader2, X } from "lucide-react";
import { replyToEnquiry } from "@/app/actions/enquiry";
import toast from "react-hot-toast";

type Enquiry = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  productName: string | null;
  repliedAt: Date | null;
  createdAt: Date;
};

export function EnquiriesList({ initialEnquiries }: { initialEnquiries: Enquiry[] }) {
  const [enquiries, setEnquiries] = useState<Enquiry[]>(initialEnquiries);
  const [replyingTo, setReplyingTo] = useState<Enquiry | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyingTo || !replyMessage.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await replyToEnquiry(replyingTo.id, replyMessage);
      if (res.success) {
        toast.success("Reply sent successfully!");
        setEnquiries(enquiries.map(enq => 
          enq.id === replyingTo.id ? { ...enq, repliedAt: new Date() } : enq
        ));
        setReplyingTo(null);
        setReplyMessage("");
      } else {
        toast.error(res.error || "Failed to send reply");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (enquiries.length === 0) {
    return (
      <div className="p-12 text-center text-slate-400">
        <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No enquiries found.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="divide-y divide-white/5">
        {enquiries.map((enquiry) => (
          <div key={enquiry.id} className="p-6 hover:bg-white/[0.02] transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  {enquiry.name}
                  {enquiry.repliedAt && (
                    <span className="flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" /> Replied
                    </span>
                  )}
                </h3>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-400">
                  <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {enquiry.email}</span>
                  {enquiry.phone && (
                    <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {enquiry.phone}</span>
                  )}
                  {enquiry.productName && (
                    <span className="flex items-center gap-1 text-blue-400"><Package className="w-4 h-4" /> {enquiry.productName}</span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500 mb-2">
                  {format(new Date(enquiry.createdAt), "MMM d, yyyy 'at' h:mm a")}
                </div>
                {!enquiry.repliedAt && (
                  <button 
                    onClick={() => setReplyingTo(enquiry)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Reply className="w-4 h-4" /> Reply
                  </button>
                )}
              </div>
            </div>
            <div className="bg-[#050b14] p-4 rounded-lg border border-white/5 text-slate-300 text-sm whitespace-pre-wrap">
              {enquiry.message}
            </div>
          </div>
        ))}
      </div>

      {/* Reply Modal */}
      {replyingTo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#050b14] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5">
              <h2 className="text-xl font-semibold text-white">Reply to {replyingTo.name}</h2>
              <button onClick={() => setReplyingTo(null)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleReply} className="p-6">
              <div className="mb-4 text-sm text-slate-400 bg-white/5 p-3 rounded-lg border border-white/5">
                <span className="font-semibold text-slate-300">To:</span> {replyingTo.email}
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-400 mb-2">Your Message</label>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  required
                  rows={6}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
                  placeholder="Type your reply here. It will be sent via email."
                />
              </div>

              <div className="flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setReplyingTo(null)}
                  className="px-5 py-2.5 text-slate-300 hover:bg-white/5 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Reply className="w-4 h-4" />}
                  {isSubmitting ? "Sending..." : "Send Reply"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
