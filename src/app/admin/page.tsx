import prisma from "@/lib/prisma";
import { Package, Inbox, FileBadge, Settings, Plus, ArrowRight, Activity, Cpu } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  // Fetch stats concurrently
  const [
    totalProducts,
    totalConsumables,
    totalEnquiries,
    totalCertificates,
    recentEnquiries
  ] = await Promise.all([
    prisma.product.count(),
    prisma.consumable.count(),
    prisma.enquiry.count(),
    prisma.certificate.count(),
    prisma.enquiry.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' }
    })
  ]);

  const stats = [
    { label: "Total Products", value: totalProducts, icon: Package, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Consumables", value: totalConsumables, icon: Cpu, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Enquiries", value: totalEnquiries, icon: Inbox, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Certificates", value: totalCertificates, icon: FileBadge, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Activity className="w-8 h-8 text-blue-500" />
          Dashboard Overview
        </h1>
        <div className="text-slate-400 text-sm">
          Welcome back, Admin
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-colors flex items-center gap-4">
            <div className={`p-4 rounded-xl ${stat.bg}`}>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
            <div>
              <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
              <h3 className="text-3xl font-bold text-white mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Enquiries (Takes up 2 columns on large screens) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Inbox className="w-5 h-5 text-slate-400" />
              Recent Enquiries
            </h2>
            <Link href="/admin/enquiries" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
            {recentEnquiries.length === 0 ? (
              <div className="p-8 text-center text-slate-400">No enquiries found.</div>
            ) : (
              <div className="divide-y divide-white/5">
                {recentEnquiries.map(enquiry => (
                  <div key={enquiry.id} className="p-4 hover:bg-white/[0.02] transition-colors flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-white truncate">{enquiry.name}</span>
                        {!enquiry.repliedAt && (
                          <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-wider">New</span>
                        )}
                      </div>
                      <div className="text-sm text-slate-400 truncate">
                        {enquiry.email} {enquiry.productName ? ` • Interested in ${enquiry.productName}` : ''}
                      </div>
                    </div>
                    <div className="text-xs text-slate-500 shrink-0 whitespace-nowrap">
                      {formatDistanceToNow(new Date(enquiry.createdAt), { addSuffix: true })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-3">
            <Link href="/admin/products/new" className="flex items-center gap-3 p-4 rounded-xl bg-[#0a1120] border border-white/5 hover:border-blue-500/50 hover:bg-[#0d162a] transition-all group">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <div className="text-white font-medium">Add Product</div>
                <div className="text-xs text-slate-500">Create a new machine entry</div>
              </div>
            </Link>

            <Link href="/admin/consumables/new" className="flex items-center gap-3 p-4 rounded-xl bg-[#0a1120] border border-white/5 hover:border-emerald-500/50 hover:bg-[#0d162a] transition-all group">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 group-hover:scale-110 transition-transform">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <div className="text-white font-medium">Add Consumable</div>
                <div className="text-xs text-slate-500">Create a new consumable part</div>
              </div>
            </Link>

            <Link href="/admin/settings" className="flex items-center gap-3 p-4 rounded-xl bg-[#0a1120] border border-white/5 hover:border-purple-500/50 hover:bg-[#0d162a] transition-all group">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500 group-hover:scale-110 transition-transform">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <div className="text-white font-medium">Site Settings</div>
                <div className="text-xs text-slate-500">Manage emails & WhatsApp</div>
              </div>
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
