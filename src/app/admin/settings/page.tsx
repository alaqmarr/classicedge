"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Save, Loader2, Settings as SettingsIcon, Mail, Send, Eye } from "lucide-react";
import toast from "react-hot-toast";
import { updateSettings, getSettings, testSmtpConnection, getPreviewHtml } from "@/app/actions/settings";

type SettingsFormValues = {
  smtpEmail: string;
  smtpPassword?: string;
  adminEmail: string;
  whatsappNumber: string;
};

export default function SettingsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Email Testing State
  const [previewTemplate, setPreviewTemplate] = useState("CLIENT_THANK_YOU");
  const [previewHtml, setPreviewHtml] = useState("");
  const [testEmail, setTestEmail] = useState("");
  const [isSendingTest, setIsSendingTest] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<SettingsFormValues>();

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await getSettings();
        if (data) {
          reset({
            smtpEmail: data.smtpEmail || "",
            adminEmail: data.adminEmail || "",
            whatsappNumber: data.whatsappNumber || "",
            smtpPassword: "" // Never populate password for security
          });
        }
      } catch (error) {
        toast.error("Failed to load settings");
      } finally {
        setIsLoading(false);
      }
    }
    loadSettings();
  }, [reset]);

  // Fetch Preview HTML when template changes
  useEffect(() => {
    async function loadPreview() {
      const html = await getPreviewHtml(previewTemplate);
      setPreviewHtml(html);
    }
    loadPreview();
  }, [previewTemplate]);

  const onSubmit = async (data: SettingsFormValues) => {
    setIsSubmitting(true);
    try {
      const res = await updateSettings(data);
      if (res.success) {
        toast.success("Settings saved successfully");
      } else {
        toast.error(res.error || "Failed to save settings");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTestSmtp = async () => {
    if (!testEmail) {
      toast.error("Please enter a test email address");
      return;
    }
    setIsSendingTest(true);
    try {
      const res = await testSmtpConnection(testEmail, previewTemplate);
      if (res.success) {
        toast.success(`Test email sent successfully to ${testEmail}`);
      } else {
        toast.error(res.error || "Failed to send test email");
      }
    } catch (err) {
      toast.error("An unexpected error occurred while sending");
    } finally {
      setIsSendingTest(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <SettingsIcon className="w-8 h-8 text-blue-500" />
        <h1 className="text-3xl font-bold text-white">Site Settings</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Communications Section */}
        <div className="glass-panel border border-white/5 p-6 rounded-xl space-y-4">
          <h2 className="text-xl font-semibold text-white mb-4">Communications</h2>
          
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">WhatsApp Number</label>
            <input
              {...register("whatsappNumber")}
              className="w-full bg-[#050b14] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="+919849050752"
            />
            <p className="text-xs text-slate-500 mt-1">Include country code. Used for floating CTA button.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Admin Receiving Email</label>
            <input
              type="email"
              {...register("adminEmail", { required: true })}
              className="w-full bg-[#050b14] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="admin@classicedge53.com"
            />
            <p className="text-xs text-slate-500 mt-1">Where all website enquiries will be sent.</p>
            {errors.adminEmail && <span className="text-red-400 text-xs mt-1">Required</span>}
          </div>
        </div>

        {/* Email SMTP Settings */}
        <div className="glass-panel border border-white/5 p-6 rounded-xl space-y-4">
          <h2 className="text-xl font-semibold text-white mb-4">SMTP Configuration (Gmail)</h2>
          <p className="text-sm text-slate-400 mb-4">Configure the Gmail account used to send automated emails.</p>
          
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">SMTP Email (Gmail Address)</label>
            <input
              type="email"
              {...register("smtpEmail")}
              className="w-full bg-[#050b14] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="your-email@gmail.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">App Password</label>
            <input
              type="password"
              {...register("smtpPassword")}
              className="w-full bg-[#050b14] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Leave blank to keep existing password"
            />
            <p className="text-xs text-slate-500 mt-1">Generate an App Password from your Google Account settings.</p>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-colors disabled:opacity-50">
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {isSubmitting ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>

      {/* Email Preview & Testing Section */}
      <div className="mt-8 glass-panel border border-white/5 p-6 rounded-xl space-y-6">
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <Mail className="w-6 h-6 text-blue-400" />
          <h2 className="text-xl font-semibold text-white">Email Preview & Testing</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Select Template to Preview</label>
              <select 
                value={previewTemplate}
                onChange={(e) => setPreviewTemplate(e.target.value)}
                className="w-full bg-[#050b14] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="CLIENT_THANK_YOU">Client Thank You (Auto-Reply)</option>
                <option value="ADMIN_ENQUIRY">Admin Notification (New Enquiry)</option>
                <option value="ADMIN_REPLY">Admin Manual Reply</option>
              </select>
            </div>

            <div className="pt-4 border-t border-white/5">
              <label className="block text-sm font-medium text-slate-400 mb-2">Send Test Email</label>
              <div className="flex gap-3">
                <input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  className="flex-1 bg-[#050b14] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Enter test email address"
                />
                <button 
                  onClick={handleTestSmtp}
                  disabled={isSendingTest || !testEmail}
                  className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 shrink-0"
                >
                  {isSendingTest ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Test
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Make sure you save your SMTP credentials above before testing.
              </p>
            </div>
          </div>

          {/* Preview Box */}
          <div className="bg-white rounded-xl overflow-hidden border border-slate-200 h-[400px] flex flex-col">
            <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center gap-2">
              <Eye className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Live Preview</span>
            </div>
            <div className="flex-1 overflow-auto bg-[#f8fafc]">
              <div 
                className="w-full origin-top scale-[0.65] sm:scale-75 md:scale-90 lg:scale-100"
                dangerouslySetInnerHTML={{ __html: previewHtml }} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
