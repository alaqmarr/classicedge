import { prisma } from "@/lib/db";
import { BarChart3, TrendingUp, Eye, Activity } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const analytics = await prisma.pageAnalytics.findMany({
    orderBy: {
      visits: 'desc',
    },
  });

  const totalVisits = analytics.reduce((acc, curr) => acc + curr.visits, 0);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-blue-500" />
            Page Analytics
          </h1>
          <p className="text-slate-400 mt-1">Track unique sessions and page views across your site.</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Eye className="w-16 h-16 text-blue-500" />
          </div>
          <p className="text-slate-400 font-medium mb-1">Total Unique Views</p>
          <h3 className="text-4xl font-bold text-white">{totalVisits.toLocaleString()}</h3>
        </div>
        <div className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp className="w-16 h-16 text-emerald-500" />
          </div>
          <p className="text-slate-400 font-medium mb-1">Most Visited Page</p>
          <h3 className="text-xl font-bold text-emerald-400 mt-2 truncate pr-10">
            {analytics[0]?.path || "N/A"}
          </h3>
        </div>
        <div className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Activity className="w-16 h-16 text-purple-500" />
          </div>
          <p className="text-slate-400 font-medium mb-1">Pages Tracked</p>
          <h3 className="text-4xl font-bold text-white">{analytics.length}</h3>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <h2 className="text-xl font-semibold text-white">Top Pages</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-white/5 text-slate-300 text-sm">
                <th className="p-4 font-medium">Page Path</th>
                <th className="p-4 font-medium text-right">Unique Sessions (Visits)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-200">
              {analytics.map((page, index) => (
                <tr key={page.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <span className="w-6 text-slate-500 text-sm">{index + 1}.</span>
                    <span className="font-mono text-sm text-blue-400">{page.path}</span>
                  </td>
                  <td className="p-4 text-right font-medium">
                    {page.visits.toLocaleString()}
                  </td>
                </tr>
              ))}
              {analytics.length === 0 && (
                <tr>
                  <td colSpan={2} className="p-8 text-center text-slate-400">
                    No analytics data recorded yet. Visit some pages on the public site!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
