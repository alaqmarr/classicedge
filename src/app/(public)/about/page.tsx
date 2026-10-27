import { getClassicConceptsBrandInfo } from "@/lib/brandInfo";
import Image from "next/image";
import Link from "next/link";
import {
  Trophy,
  Shield,
  Wrench,
  Settings,
  Cpu,
  Zap,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  Award,
  FileText,
  User,
  ArrowRight,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "About Us | Classic Edge 53",
  description:
    "Learn about Classic Edge 53, a sister brand of Classic Concepts Acrylic Private Limited — pioneering precision acrylic fabrication machinery for over two decades.",
};

export default async function AboutPage() {
  const brandInfo = await getClassicConceptsBrandInfo();
  const brand = brandInfo?.brand;
  const contact = brandInfo?.contact;
  const branches = brandInfo?.branches?.sort((a, b) => a.sortOrder - b.sortOrder) || [];
  const team = brandInfo?.team?.sort((a, b) => a.sortOrder - b.sortOrder) || [];
  const clients = brand?.clients || [];
  const certificates =
    brand?.certifications?.allCertificates?.sort((a, b) => a.sortOrder - b.sortOrder) || [];

  const introImage =
    brand?.aboutIntroImageUrl && !brand.aboutIntroImageUrl.includes("localhost")
      ? brand.aboutIntroImageUrl
      : "/hero-machine.jpeg";

  return (
    <div className="container mx-auto px-4 py-16 md:py-24 space-y-24">
      {/* Hero / Story Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
        <div>
          <div className="inline-block px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-semibold tracking-wide mb-6 uppercase">
            About Classic Edge 53
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Engineering the Future of{" "}
            <span className="text-gradient">Acrylic Fabrication</span>
          </h1>
          <p className="text-lg text-slate-300 mb-6 leading-relaxed">
            <strong>Classic Edge 53</strong> is the dedicated machinery division and sister brand of{" "}
            <a
              href={brand?.website || "https://classicconcepts.in"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline font-semibold"
            >
              {brand?.companyName || "Classic Concepts Acrylic Private Limited"}
            </a>
            .
          </p>
          <p className="text-slate-400 mb-8 leading-relaxed">
            {brand?.tagline ||
              "Two Decades of Excellence. Endless Possibilities in Acrylic."}{" "}
            Born from over 25 years of hands-on industrial acrylic fabrication experience, we design and supply state-of-the-art diamond edge polishers, CNC routers, laser cutting systems, and bending machinery built to elevate production quality and efficiency.
          </p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            {[
              "25+ Years Industry Heritage",
              "Precision Servo & PLC Control",
              "Pan-India & Global Support",
              "ISO 9001:2015 Certified Quality",
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2.5 text-sm text-slate-200">
                <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-7 py-3.5 rounded-full font-medium transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)]"
            >
              Explore Our Machines <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href={brand?.website || "https://classicconcepts.in"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 glass px-7 py-3.5 rounded-full font-medium text-slate-200 hover:text-white hover:bg-white/5 transition-all border border-white/10"
            >
              Visit {brand?.brandName || "Classic Concepts"} <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-blue-600/15 blur-3xl rounded-full -z-10" />
          <div className="glass-panel p-3 rounded-3xl border border-white/10">
            <div className="aspect-[4/3] relative rounded-2xl overflow-hidden bg-[#0a1120]">
              <Image
                src={introImage}
                alt={brand?.companyName || "Classic Edge 53"}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Core Strengths */}
      <section className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h4 className="text-blue-500 font-semibold tracking-wider text-sm mb-2 uppercase">
            Our Engineering DNA
          </h4>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Why Industry Leaders Trust Us
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { title: "German Inspired Technology", icon: Shield },
            { title: "Heavy Duty Industrial Build", icon: Wrench },
            { title: "Servo Motor Precision", icon: Settings },
            { title: "Advanced PLC Control", icon: Cpu },
            { title: "High Production Efficiency", icon: Zap },
          ].map((feature, i) => (
            <div
              key={i}
              className="glass border border-white/5 p-6 rounded-2xl flex flex-col items-center text-center gap-4 hover:border-blue-500/50 transition-all bg-gradient-to-b from-blue-900/10 to-transparent group"
            >
              <feature.icon className="w-8 h-8 text-blue-400 group-hover:scale-110 transition-transform duration-300" />
              <p className="text-sm font-medium text-slate-200">{feature.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Leadership & Team Section */}
      {team.length > 0 && (
        <section className="max-w-6xl mx-auto pt-8 border-t border-white/10">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h4 className="text-blue-500 font-semibold tracking-wider text-sm mb-2 uppercase">
              Our People
            </h4>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Leadership & Sales Specialists
            </h2>
            <p className="text-slate-400">
              Meet the dedicated team behind {brand?.companyName || "Classic Concepts"} and Classic Edge 53.
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

                <div className="pt-4 border-t border-white/10 flex flex-col gap-2 text-sm">
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
        </section>
      )}

      {/* Branches & Head Office */}
      {branches.length > 0 && (
        <section className="max-w-6xl mx-auto pt-8 border-t border-white/10">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h4 className="text-blue-500 font-semibold tracking-wider text-sm mb-2 uppercase">
              Locations
            </h4>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Our Manufacturing & Office Branches
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {branches.map((branch) => (
              <div
                key={branch.id}
                className="glass-panel p-8 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all flex flex-col justify-between gap-6"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                    <Building2 className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{branch.name}</h3>
                    {contact?.address && (
                      <p className="text-slate-400 text-sm mt-2 leading-relaxed">{contact.address}</p>
                    )}
                  </div>
                </div>

                {branch.mapUrl && (
                  <div className="pt-4 border-t border-white/10 flex justify-end">
                    <a
                      href={branch.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/20 text-sm font-medium transition-all"
                    >
                      <MapPin className="w-4 h-4" />
                      View on Google Maps
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Trusted Clients */}
      {clients.length > 0 && (
        <section className="max-w-6xl mx-auto pt-8 border-t border-white/10">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h4 className="text-blue-500 font-semibold tracking-wider text-sm mb-2 uppercase">
              Trusted Across Industries
            </h4>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Our Esteemed Clients
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {clients.slice(0, 18).map((client) => (
              <div
                key={client.id}
                className="glass-panel p-4 rounded-xl border border-white/5 flex flex-col items-center justify-center gap-3 text-center hover:border-blue-500/30 transition-all"
              >
                {client.logoUrl && (
                  <div className="w-full h-14 relative bg-white rounded-lg p-2">
                    <Image
                      src={client.logoUrl}
                      alt={client.name}
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                )}
                <span className="text-xs text-slate-400 line-clamp-1 font-medium">
                  {client.name}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications Preview */}
      {certificates.length > 0 && (
        <section className="max-w-6xl mx-auto pt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
            <div>
              <h4 className="text-blue-500 font-semibold tracking-wider text-sm mb-2 uppercase">
                Quality Assurance
              </h4>
              <h2 className="text-3xl font-bold text-white">Certifications & Registrations</h2>
            </div>
            <Link
              href="/certificates"
              className="text-blue-400 hover:text-blue-300 text-sm font-medium inline-flex items-center gap-1.5"
            >
              View All Certificates <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.slice(0, 3).map((cert) => {
              const isPdf = cert.fileUrl?.toLowerCase().endsWith(".pdf");
              return (
                <a
                  key={cert.id}
                  href={cert.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-panel p-5 rounded-2xl border border-white/5 hover:border-blue-500/40 transition-all flex items-center gap-4 group"
                >
                  <div className="w-14 h-14 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                    {isPdf ? (
                      <FileText className="w-7 h-7 text-blue-400" />
                    ) : (
                      <Award className="w-7 h-7 text-blue-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors truncate">
                      {cert.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                      View Document <ExternalLink className="w-3 h-3" />
                    </p>
                  </div>
                </a>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
