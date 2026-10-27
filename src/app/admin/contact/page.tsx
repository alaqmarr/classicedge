import { getClassicConceptsBrandInfo } from "@/lib/brandInfo";
import { ExternalLink, MapPin, Phone, Mail, Clock, RefreshCw } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminContactsPage() {
  const brandInfo = await getClassicConceptsBrandInfo();
  const contact = brandInfo?.contact;
  const branches = brandInfo?.branches || [];

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Contact Information</h1>
          <p className="text-slate-400 text-sm mt-1">
            Synced automatically from <span className="text-blue-400">classicconcepts.in/api/brand-info</span>
          </p>
        </div>
        <a
          href="https://classicconcepts.in/admin"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
        >
          Manage on Classic Concepts <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {!contact ? (
        <div className="text-slate-500 p-8 border border-white/10 rounded-xl text-center">
          Unable to fetch contact information from classicconcepts.in API.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#050b14] border border-white/5 p-6 rounded-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-xl font-semibold text-blue-400">
                {brandInfo?.brand?.companyName || "Primary Contact"}
              </h3>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium flex items-center gap-1.5">
                <RefreshCw className="w-3 h-3" /> Live API
              </span>
            </div>

            <div className="space-y-3 text-sm text-slate-400">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span><strong className="text-slate-300">Address:</strong> {contact.address}</span>
              </p>

              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-300">Phones:</strong>
                  <ul className="list-disc list-inside ml-2 mt-1">
                    {contact.phones?.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-300">Emails:</strong>
                  <ul className="list-disc list-inside ml-2 mt-1">
                    {contact.emails?.map((e, i) => (
                      <li key={i}>{e}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {contact.businessHoursLines?.length > 0 && (
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-300">Business Hours:</strong>
                    <ul className="list-disc list-inside ml-2 mt-1">
                      {contact.businessHoursLines.map((line, i) => (
                        <li key={i}>{line}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-[#050b14] border border-white/5 p-6 rounded-xl space-y-4">
            <h3 className="text-xl font-semibold text-blue-400 border-b border-white/10 pb-4">
              Branches ({branches.length})
            </h3>
            <div className="space-y-3">
              {branches.map((branch) => (
                <div key={branch.id} className="p-4 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">{branch.name}</p>
                  </div>
                  {branch.mapUrl && (
                    <a
                      href={branch.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                    >
                      Map Link <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
