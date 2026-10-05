import prisma from "@/lib/prisma";
import Link from "next/link";
import { Plus } from "lucide-react";
import ConsumablesTableClient from "./ConsumablesTableClient";

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
        <ConsumablesTableClient consumables={consumables} />
      </div>
    </div>
  );
}
