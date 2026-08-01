import prisma from "@/lib/prisma";
import Link from "next/link";
import { ArrowRight, Download, Play, Trophy, Cpu, Globe, Users, CheckCircle2, Shield, Settings, Wrench, Zap, HeadphonesIcon } from "lucide-react";
import Image from "next/image";
import { HeroImageCarousel } from "./HeroImageCarousel";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Classic Edge 53 | Premium Acrylic Fabrication Machinery",
  description: "Engineering Tomorrow's Acrylic Industry with state-of-the-art precision machinery, heavy-duty industrial build, and unmatched reliability.",
  keywords: ["acrylic fabrication machine", "CNC machine", "acrylic polisher", "industrial machinery", "Classic Edge 53"],
};

export const dynamic = "force-dynamic";

export default async function Home() {
  const machines = await prisma.product.findMany({
    take: 4,
    orderBy: { createdAt: "desc" }
  });

  const heroImages = [
    "/hero-machine.jpeg",
    ...machines.map(m => m.coverImage).filter(Boolean)
  ] as string[];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-[#050b14] to-[#050b14] -z-10"></div>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-semibold tracking-wide mb-6">
                PRECISION MACHINES FOR
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
                ACRYLIC FABRICATION <br />
                <span className="text-gradient">EXCELLENCE</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-lg leading-relaxed">
                Engineering Tomorrow's Acrylic Industry with state-of-the-art precision machinery and unmatched reliability.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/products" className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-medium transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)]">
                  EXPLORE MACHINES <ArrowRight className="w-5 h-5" />
                </Link>
                <a href="/Machinery%20Catalogue.pdf" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 glass px-8 py-4 rounded-full font-medium text-slate-300 hover:text-white transition-all hover:bg-white/5 text-center">
                  DOWNLOAD CATALOGUE <Download className="w-5 h-5 shrink-0" />
                </a>
              </div>

              <div className="mt-12 flex items-center gap-4">
                <button className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors">
                  <Play className="w-4 h-4 ml-1 text-slate-300" />
                </button>
                <div className="text-sm">
                  <p className="font-semibold text-slate-200">WATCH VIDEO</p>
                  <p className="text-slate-500">See Machines in Action</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-600/10 rounded-full blur-3xl -z-10"></div>

              <HeroImageCarousel images={heroImages} />
            </div>
          </div>
        </div>
      </section>

      {/* Heritage / Experience Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto relative group">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-blue-600/10 blur-3xl rounded-full group-hover:bg-blue-500/20 transition-colors duration-700"></div>
            
            {/* Card */}
            <div className="relative glass-panel rounded-3xl p-8 md:p-12 border border-white/10 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 text-center md:text-left overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500/20 to-transparent border border-blue-500/30 flex items-center justify-center shrink-0 shadow-[0_0_30px_rgba(37,99,235,0.2)]">
                <Trophy className="w-12 h-12 text-blue-400" />
              </div>
              
              <div>
                <h3 className="text-5xl md:text-6xl font-black text-white tracking-tight mb-2">
                  25<span className="text-blue-500">+</span>
                </h3>
                <p className="text-xl md:text-2xl text-slate-300 font-bold uppercase tracking-widest">
                  Years of Excellence
                </p>
                <p className="text-base text-slate-400 mt-4 max-w-lg leading-relaxed">
                  Pioneering innovation, extreme precision, and absolute reliability in the acrylic fabrication industry since our inception.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Machines Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h4 className="text-blue-500 font-semibold tracking-wider text-sm mb-2 uppercase">Our Machines</h4>
              <h2 className="text-3xl md:text-4xl font-bold">Precision. Performance. Perfection.</h2>
            </div>
            <Link href="/products" className="hidden md:flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition-colors">
              VIEW ALL MACHINES <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {machines.map((machine) => (
              <Link href={`/products/${machine.id}`} key={machine.id} className="glass-panel p-6 rounded-2xl group hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(37,99,235,0.1)] transition-all cursor-pointer block relative overflow-hidden z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 pointer-events-none"></div>
                <div className="aspect-square bg-[#0a1120] rounded-xl mb-6 flex items-center justify-center border border-white/5 overflow-hidden relative">
                  {machine.coverImage ? (
                    <Image src={machine.coverImage} alt={machine.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <Settings className="w-16 h-16 text-blue-500/20 group-hover:scale-110 transition-transform duration-500" />
                  )}
                </div>
                <h3 className="font-semibold text-lg mb-4 h-14 line-clamp-2">{machine.name}</h3>
                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="text-sm text-blue-400 font-medium">View Machine</span>
                  <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-blue-400 transition-colors group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
            {machines.length === 0 && (
              <div className="col-span-4 text-center py-12 text-slate-400 border border-white/5 rounded-2xl">
                No machines added yet.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-[#050b14] to-[#050b14]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h4 className="text-blue-500 font-semibold tracking-wider text-sm mb-2 uppercase">Why Choose Classic Edge 53</h4>
            <h2 className="text-3xl md:text-4xl font-bold">Uncompromising Quality</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { title: "German Inspired Technology", icon: Shield },
              { title: "Heavy Duty Industrial Build", icon: Wrench },
              { title: "Servo Motor Precision", icon: Settings },
              { title: "Advanced PLC Control", icon: Cpu },
              { title: "High Efficiency", icon: Zap },
              { title: "24x7 Support", icon: HeadphonesIcon },
            ].map((feature, i) => (
              <div key={i} className="glass border border-white/5 p-6 rounded-xl flex flex-col items-center text-center gap-4 hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(37,99,235,0.15)] transition-all bg-gradient-to-b from-blue-900/10 to-transparent group">
                <feature.icon className="w-8 h-8 text-blue-400 group-hover:scale-110 transition-transform duration-300" />
                <p className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{feature.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dual CTA Section */}
      <section className="py-20 border-t border-white/5 bg-[#02060d]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* CTA 1: Machines */}
            <div className="relative rounded-3xl p-8 md:p-12 overflow-hidden group border border-white/10 hover:border-blue-500/50 transition-all flex flex-col justify-center min-h-[300px] z-0">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-[#050b14] to-[#050b14] -z-10 group-hover:from-blue-800/50 transition-colors duration-500"></div>
              <Settings className="w-32 h-32 text-blue-500/10 absolute -bottom-8 -right-8 group-hover:rotate-90 transition-transform duration-1000 -z-10" />
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Upgrade Your Production?</h3>
              <p className="text-slate-400 mb-8 max-w-sm text-lg">Discover our range of high-precision acrylic fabrication machines designed for excellence.</p>
              <Link href="/products" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium transition-all w-max shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)]">
                View All Machines <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* CTA 2: Consumables */}
            <div className="relative rounded-3xl p-8 md:p-12 overflow-hidden group border border-white/10 hover:border-emerald-500/50 transition-all flex flex-col justify-center min-h-[300px] z-0">
              <div className="absolute inset-0 bg-gradient-to-bl from-emerald-900/40 via-[#050b14] to-[#050b14] -z-10 group-hover:from-emerald-800/50 transition-colors duration-500"></div>
              <Wrench className="w-32 h-32 text-emerald-500/10 absolute -bottom-8 -right-8 group-hover:-rotate-12 transition-transform duration-500 -z-10" />
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">Need Parts & Accessories?</h3>
              <p className="text-slate-400 mb-8 max-w-sm text-lg">Keep your machines running at peak performance with our premium consumables.</p>
              <Link href="/consumables" className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-full font-medium transition-all w-max shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]">
                Browse Consumables <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
