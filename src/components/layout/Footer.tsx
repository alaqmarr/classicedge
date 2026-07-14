import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { FaFacebook, FaInstagram, FaYoutube, FaLinkedin } from "react-icons/fa";
import Image from "next/image";
import prisma from "@/lib/prisma";

export default async function Footer() {
  const machines = await prisma.product.findMany({
    take: 4,
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true }
  });
  return (
    <footer className="bg-[#020610] pt-12 md:pt-16 pb-8 border-t border-white/10 mt-12 md:mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
             <div className="mb-6">
              <Image src="/logo.png" alt="Classic Edge 53" width={200} height={55} className="object-contain w-[200px] h-auto" />
            </div>
            <p className="text-sm text-slate-400 mb-4 leading-relaxed">
              Classic Edge 53 is a brand of Classic Concepts. We manufacture high precision acrylic processing machines for acrylic fabrication companies across the world.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4 md:mb-6 text-slate-200">QUICK LINKS</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link href="/" className="hover:text-blue-400 transition-colors">Home</Link></li>
              <li><Link href="/products" className="hover:text-blue-400 transition-colors">Machines</Link></li>
              <li><Link href="/consumables" className="hover:text-blue-400 transition-colors">Consumables</Link></li>
              <li><Link href="/classic-concepts" className="hover:text-blue-400 transition-colors">Classic Concepts</Link></li>
              <li><Link href="/certificates" className="hover:text-blue-400 transition-colors">Certificates</Link></li>
              <li><Link href="/contact" className="hover:text-blue-400 transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4 md:mb-6 text-slate-200">MACHINES</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              {machines.map(machine => (
                <li key={machine.id}>
                  <Link href={`/products/${machine.id}`} className="hover:text-blue-400 transition-colors truncate block">
                    {machine.name}
                  </Link>
                </li>
              ))}
              {machines.length === 0 && (
                <li><span className="text-slate-500 italic">More coming soon...</span></li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4 md:mb-6 text-slate-200">CONNECT WITH US</h4>
            <ul className="space-y-4 text-sm text-slate-400 mb-6">
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-blue-500" />
                <span>+91 98490 50752</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-blue-500" />
                <span>info@classicedge53.com</span>
              </li>
            </ul>
            <div className="flex gap-4">
              <Link href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-colors"><FaFacebook className="w-4 h-4" /></Link>
              <Link href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-colors"><FaInstagram className="w-4 h-4" /></Link>
              <Link href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-colors"><FaYoutube className="w-4 h-4" /></Link>
              <Link href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-colors"><FaLinkedin className="w-4 h-4" /></Link>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-sm text-slate-500">
          <p>© {new Date().getFullYear()} Classic Edge 53. All Rights Reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-slate-300">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-300">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
