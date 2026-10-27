import { getClassicConceptsBrandInfo } from "@/lib/brandInfo";
import { Mail, Phone, MapPin, Clock, ExternalLink, User } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { Suspense } from "react";
import { ContactForm } from "./ContactForm";
import Image from "next/image";

export const revalidate = 60;

export default async function ContactPage() {
  const brandInfo = await getClassicConceptsBrandInfo();
  const contact = brandInfo?.contact;
  const branches = brandInfo?.branches?.sort((a, b) => a.sortOrder - b.sortOrder) || [];
  const team = brandInfo?.team?.sort((a, b) => a.sortOrder - b.sortOrder) || [];

  const isIframeHtml = contact?.mapEmbedUrl?.trim().startsWith("<iframe");

  return (
    <div className="container mx-auto px-4 py-20 space-y-24">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Get in Touch</h1>
        <p className="text-xl text-slate-400">
          We're here to answer any questions you have about our acrylic machines and how they can improve your production workflow.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {/* Contact Information & Branches */}
        <div className="space-y-8">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6">Head Office & Contact Details</h2>
          
          {!contact ? (
            <div className="glass-panel p-8 rounded-2xl text-slate-400">
              Please contact us via the form or check back later for our office locations.
            </div>
          ) : (
            <div className="glass-panel p-8 rounded-2xl space-y-6 hover:border-blue-500/30 transition-colors">
              <h3 className="text-2xl font-semibold text-blue-400">
                {brandInfo?.brand?.companyName || "Classic Concepts Acrylic Private Limited"}
              </h3>
              
              <div className="space-y-5">
                {contact.address && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <span className="block text-sm font-medium text-slate-500 mb-1">Address</span>
                      <p className="text-slate-200 whitespace-pre-wrap">{contact.address}</p>
                    </div>
                  </div>
                )}

                {contact.phones && contact.phones.length > 0 && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <span className="block text-sm font-medium text-slate-500 mb-1">Phone</span>
                      <div className="space-y-1">
                        {contact.phones.map((p, i) => (
                          <a
                            key={i}
                            href={`tel:${p.replace(/\s+/g, "")}`}
                            className="block text-slate-200 hover:text-blue-400 transition-colors"
                          >
                            {p.trim()}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {contact.whatsappNumber && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                      <FaWhatsapp className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <span className="block text-sm font-medium text-slate-500 mb-1">WhatsApp</span>
                      <a
                        href={contact.whatsappUrl || `https://wa.me/${contact.whatsappNumber.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-200 hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5"
                      >
                        {contact.whatsappNumber}
                        <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                      </a>
                    </div>
                  </div>
                )}

                {contact.emails && contact.emails.length > 0 && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <span className="block text-sm font-medium text-slate-500 mb-1">Email</span>
                      <div className="space-y-1">
                        {contact.emails.map((e, i) => (
                          <a
                            key={i}
                            href={`mailto:${e.trim()}`}
                            className="block text-slate-200 hover:text-blue-400 transition-colors"
                          >
                            {e.trim()}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {contact.businessHoursLines && contact.businessHoursLines.length > 0 && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <span className="block text-sm font-medium text-slate-500 mb-1">Business Hours</span>
                      <div className="space-y-1">
                        {contact.businessHoursLines.map((line, i) => (
                          <p key={i} className="text-slate-200">{line}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {contact.mapEmbedUrl && (
                <div className="pt-6 border-t border-white/10 mt-6">
                  {isIframeHtml ? (
                    <div 
                      className="w-full h-64 sm:h-72 rounded-xl overflow-hidden opacity-90 hover:opacity-100 transition-opacity duration-300 border border-white/10 [&>iframe]:w-full [&>iframe]:h-full"
                      dangerouslySetInnerHTML={{ __html: contact.mapEmbedUrl }}
                    />
                  ) : (
                    <div className="w-full h-64 sm:h-72 rounded-xl overflow-hidden opacity-90 hover:opacity-100 transition-opacity duration-300 border border-white/10">
                      <iframe
                        src={contact.mapEmbedUrl}
                        className="w-full h-full border-0"
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="strict-origin-when-cross-origin"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Branches Section */}
          {branches.length > 0 && (
            <div className="space-y-4 pt-4">
              <h3 className="text-xl font-semibold text-white">Our Branches</h3>
              <div className="grid grid-cols-1 gap-4">
                {branches.map((branch) => (
                  <div key={branch.id} className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {branch.imageUrl ? (
                        <div className="w-16 h-16 rounded-xl overflow-hidden relative shrink-0 border border-white/10">
                          <Image src={branch.imageUrl} alt={branch.name} fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                          <MapPin className="w-6 h-6 text-blue-400" />
                        </div>
                      )}
                      <div>
                        <h4 className="font-semibold text-lg text-white">{branch.name}</h4>
                        {contact?.address && branches.length === 1 && (
                          <p className="text-sm text-slate-400 mt-1 line-clamp-2">{contact.address}</p>
                        )}
                      </div>
                    </div>
                    {branch.mapUrl && (
                      <a
                        href={branch.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/20 text-sm font-medium transition-all shrink-0"
                      >
                        <MapPin className="w-4 h-4" />
                        Open in Maps
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Contact Form */}
        <div>
          <Suspense fallback={<div className="glass-panel p-8 lg:p-10 rounded-3xl h-96 flex items-center justify-center">Loading form...</div>}>
            <ContactForm />
          </Suspense>
        </div>
      </div>

      {/* Team Section */}
      {team.length > 0 && (
        <div className="max-w-6xl mx-auto pt-12 border-t border-white/10">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h4 className="text-blue-500 font-semibold tracking-wider text-sm mb-2 uppercase">Connect Directly</h4>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Leadership & Sales Team</h2>
            <p className="text-slate-400">
              Reach out directly to our experienced specialists for personalized guidance on machines, consumables, and custom solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {team.map((member) => (
              <div
                key={member.id}
                className="glass-panel rounded-2xl p-6 border border-white/5 hover:border-blue-500/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-[#0a1120] border border-white/10 overflow-hidden relative shrink-0 flex items-center justify-center">
                      {member.photoUrl ? (
                        <Image
                          src={member.photoUrl}
                          alt={member.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <User className="w-8 h-8 text-slate-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white group-hover:text-blue-400 transition-colors leading-snug">
                        {member.name}
                      </h3>
                      <p className="text-xs font-medium text-blue-400/90 mt-1">{member.position}</p>
                    </div>
                  </div>

                  {member.bio && (
                    <p className="text-sm text-slate-400 mb-4 line-clamp-3">{member.bio}</p>
                  )}
                </div>

                <div className="pt-4 border-t border-white/10 flex flex-col gap-2.5 text-sm">
                  {member.phone && (
                    <a
                      href={`tel:${member.phone.replace(/\s+/g, "")}`}
                      className="flex items-center gap-2.5 text-slate-300 hover:text-white transition-colors"
                    >
                      <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                      <span>{member.phone}</span>
                    </a>
                  )}
                  {member.whatsapp && (
                    <a
                      href={`https://wa.me/${member.whatsapp.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 text-slate-300 hover:text-emerald-400 transition-colors"
                    >
                      <FaWhatsapp className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>WhatsApp Chat</span>
                    </a>
                  )}
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="flex items-center gap-2.5 text-slate-300 hover:text-blue-400 transition-colors truncate"
                    >
                      <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                      <span className="truncate">{member.email}</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
