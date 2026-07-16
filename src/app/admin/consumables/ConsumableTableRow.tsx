"use client";

import { useState } from "react";
import Link from "next/link";
import { Edit, Trash2, Package } from "lucide-react";
import { deleteConsumable } from "@/app/actions/consumable";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Consumable {
  id: string;
  name: string;
  image: string | null;
  products: { id: string; name: string }[];
  models: { id: string; modelName: string }[];
}

export default function ConsumableTableRow({ item }: { item: Consumable }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteConsumable(item.id);
    setIsDeleting(false);
    
    if (result.success) {
      setIsModalOpen(false);
      router.refresh();
    } else {
      alert("Failed to delete consumable");
    }
  };

  return (
    <>
      <tr className="hover:bg-white/[0.02] transition-colors">
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
        <td className="p-4 text-right flex justify-end gap-2 items-center h-full pt-6">
          <Link href={`/admin/consumables/${item.id}/edit`} className="p-2 text-slate-400 hover:text-blue-400 transition-colors">
            <Edit className="w-5 h-5" />
          </Link>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="p-2 text-slate-400 hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </td>
      </tr>

      <ConfirmModal 
        isOpen={isModalOpen}
        title="Delete Consumable"
        description={`Are you sure you want to delete "${item.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setIsModalOpen(false)}
        isLoading={isDeleting}
      />
    </>
  );
}
