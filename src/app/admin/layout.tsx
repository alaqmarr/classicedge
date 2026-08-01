"use client";

import Link from "next/link";
import { Settings, Package, Phone, FileBadge, LayoutDashboard, Inbox, Layers, Menu, X, BarChart3 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#020610] text-slate-200 overflow-hidden relative">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`absolute md:relative z-50 w-64 h-full border-r border-white/10 bg-[#020610] glass-panel flex flex-col transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <Link href="/" className="block">
            <Image src="/logo.png" alt="Classic Edge 53" width={140} height={40} className="object-contain w-[140px] h-auto" />
          </Link>
          <button className="md:hidden text-slate-400 p-1" onClick={() => setIsSidebarOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="px-6 py-3 border-b border-white/5">
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Admin Panel</p>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link href="/admin" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors">
            <LayoutDashboard className="w-5 h-5 text-slate-400" />
            <span>Dashboard</span>
          </Link>
          <Link href="/admin/enquiries" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors">
            <Inbox className="w-5 h-5 text-slate-400" />
            <span>Enquiries</span>
          </Link>
          <Link href="/admin/products" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors">
            <Package className="w-5 h-5 text-slate-400" />
            <span>Products & Models</span>
          </Link>
          <Link href="/admin/consumables" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors">
            <Layers className="w-5 h-5 text-slate-400" />
            <span>Consumables</span>
          </Link>
          <Link href="/admin/certificates" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors">
            <FileBadge className="w-5 h-5 text-slate-400" />
            <span>Certificates</span>
          </Link>
          <Link href="/admin/contact" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors">
            <Phone className="w-5 h-5 text-slate-400" />
            <span>Contact Offices</span>
          </Link>
          <Link href="/admin/analytics" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors">
            <BarChart3 className="w-5 h-5 text-slate-400" />
            <span>Analytics</span>
          </Link>
          <Link href="/admin/settings" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors">
            <Settings className="w-5 h-5 text-slate-400" />
            <span>Site Settings</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-[#050b14] flex flex-col">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-white/10 bg-[#020610] shrink-0">
          <p className="font-semibold text-slate-200">Admin Panel</p>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-300">
            <Menu className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
