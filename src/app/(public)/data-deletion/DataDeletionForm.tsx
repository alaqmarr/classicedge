"use client";

import React, { useState } from "react";
import { CheckCircle2, Copy, Send } from "lucide-react";

export function DataDeletionForm({ initialCode }: { initialCode?: string }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [channel, setChannel] = useState("WhatsApp & Website Records");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [confirmationCode, setConfirmationCode] = useState(initialCode || "");
  const [statusUrl, setStatusUrl] = useState("");
  const [copied, setCopied] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!phone.trim() && !email.trim()) {
      setError("Please enter your WhatsApp phone number or email address.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/data-deletion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || "Customer",
          phone: phone.trim(),
          email: email.trim(),
          channel,
          notes: notes.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.confirmation_code) {
        setError(
          data.error || "Could not submit your request right now. Please try again."
        );
        return;
      }
      setConfirmationCode(String(data.confirmation_code));
      setStatusUrl(String(data.url || ""));
    } catch {
      setError("Network error while submitting your request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (confirmationCode) {
    return (
      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-6 space-y-3 text-slate-200">
        <div className="flex items-center gap-2.5 text-emerald-400 font-semibold text-base">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>Data Deletion Request Logged</span>
        </div>
        <p className="text-sm text-slate-300">
          We have recorded your personal data deletion request. Our privacy team
          completes deletion of WhatsApp chat records, Meta login identifiers,
          marketing opt-ins, and website enquiry data within{" "}
          <strong className="text-white">7 business days</strong>.
        </p>
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-medium text-slate-400">
            Confirmation Code:
          </span>
          <code className="px-2.5 py-1 rounded bg-slate-900 border border-emerald-500/40 font-mono text-xs font-bold text-emerald-300">
            {confirmationCode}
          </code>
          <button
            type="button"
            onClick={() => {
              void navigator.clipboard?.writeText(confirmationCode);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-emerald-500/40 text-xs font-semibold text-emerald-300 cursor-pointer"
          >
            <Copy className="w-3 h-3" />
            <span>{copied ? "Copied" : "Copy Code"}</span>
          </button>
        </div>
        {statusUrl && (
          <p className="text-xs text-slate-400 break-all">
            Status Page:{" "}
            <a
              href={statusUrl}
              className="text-blue-400 font-semibold underline"
            >
              {statusUrl}
            </a>
          </p>
        )}
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-white/10 bg-slate-900/80 p-6 space-y-4"
    >
      <h3 className="text-base font-semibold text-white">
        Submit an Online Data Deletion Request
      </h3>
      <p className="text-xs text-slate-400">
        Enter the phone number or email linked to your WhatsApp chat, Meta
        account, or Classic Edge 53 enquiry to receive an instant confirmation
        code.
      </p>

      {error && (
        <div className="rounded-lg bg-red-500/15 border border-red-500/30 px-3.5 py-2.5 text-xs font-medium text-red-300">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
            className="w-full rounded-lg border border-white/15 bg-slate-950 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            WhatsApp / Phone Number
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98490 00000"
            className="w-full rounded-lg border border-white/15 bg-slate-950 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@workshop.com"
            className="w-full rounded-lg border border-white/15 bg-slate-950 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Records to Delete
          </label>
          <select
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
            className="w-full rounded-lg border border-white/15 bg-slate-950 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
          >
            <option value="WhatsApp & Website Records">
              All WhatsApp, Meta Login &amp; Website Records
            </option>
            <option value="WhatsApp Chat & Contact Only">
              WhatsApp Chat History &amp; Contact Profile
            </option>
            <option value="Meta Login / Facebook App Data">
              Meta Login / Facebook App Connection Data
            </option>
            <option value="Website Enquiry Data">
              Website Enquiry &amp; Quote Records
            </option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-300 mb-1">
          Additional Details (Optional)
        </label>
        <textarea
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Optional note or Meta User ID if applicable"
          className="w-full rounded-lg border border-white/15 bg-slate-950 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors cursor-pointer disabled:opacity-60"
      >
        <Send className="w-4 h-4" />
        <span>
          {submitting ? "Submitting Request..." : "Submit Deletion Request"}
        </span>
      </button>
    </form>
  );
}
