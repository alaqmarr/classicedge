import prisma from "@/lib/prisma";
import Link from "next/link";
import { Plus, Package } from "lucide-react";
import ConsumableTableRow from "./ConsumableTableRow";

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
                <ConsumableTableRow key={item.id} item={item} />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
