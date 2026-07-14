import prisma from "@/lib/prisma";
import Link from "next/link";
import { Plus, Package, Edit, Trash2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminConsumablesPage() {
  const consumables = await prisma.consumable.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      products: true,
      models: true
    }
  });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Consumables</h1>
          <p className="text-slate-400">Manage accessories, parts, and consumables for your machines.</p>
        </div>
        <Link href="/admin/consumables/new" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors">
          <Plus className="w-5 h-5" /> Add Consumable
        </Link>
      </div>

      <div className="glass-panel border border-white/5 rounded-2xl overflow-hidden">
        {consumables.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No consumables added yet.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="p-4 font-semibold text-slate-300">Name</th>
                <th className="p-4 font-semibold text-slate-300">Linked Products</th>
                <th className="p-4 font-semibold text-slate-300">Linked Models</th>
                <th className="p-4 font-semibold text-slate-300 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {consumables.map((item) => (
                <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-[#050b14] border border-white/10 overflow-hidden relative">
                        {item.image ? (
                           <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <Package className="w-5 h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-600" />
                        )}
                      </div>
                      <span className="font-semibold text-white">{item.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-300">
                    {item.products.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {item.products.map(p => (
                          <span key={p.id} className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded-md border border-emerald-500/20">{p.name}</span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-slate-500">-</span>
                    )}
                  </td>
                  <td className="p-4 text-slate-300">
                    {item.models.length > 0 ? (
                       <div className="flex flex-wrap gap-1">
                        {item.models.map(m => (
                          <span key={m.id} className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-md border border-blue-500/20">{m.modelName}</span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-slate-500">-</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    {/* Add edit/delete later if needed, right now we just list */}
                    <button className="p-2 text-slate-400 hover:text-red-400 transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
