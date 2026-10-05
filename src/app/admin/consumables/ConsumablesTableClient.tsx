"use client";

import { useState } from "react";
import ConsumableTableRow from "./ConsumableTableRow";
import { bulkUpdateConsumableCategory } from "@/app/actions/consumable";
import { Package } from "lucide-react";
import toast from "react-hot-toast";

export default function ConsumablesTableClient({ consumables }: { consumables: any[] }) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [categoryInput, setCategoryInput] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const toggleAll = () => {
    if (selectedIds.length === consumables.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(consumables.map(c => c.id));
    }
  };

  const toggleOne = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleBulkUpdate = async () => {
    if (selectedIds.length === 0) return;
    setIsUpdating(true);
    const res = await bulkUpdateConsumableCategory(selectedIds, categoryInput);
    if (res.success) {
      toast.success("Category updated for selected items");
      setSelectedIds([]);
      setCategoryInput("");
    } else {
      toast.error("Failed to update category");
    }
    setIsUpdating(false);
  };

  if (consumables.length === 0) {
    return (
      <div className="p-12 text-center text-slate-400">
        <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No consumables added yet.</p>
      </div>
    );
  }

  return (
    <div>
      {selectedIds.length > 0 && (
        <div className="bg-blue-900/30 p-4 border-b border-blue-500/30 flex items-center gap-4">
          <span className="text-blue-200">{selectedIds.length} selected</span>
          <input 
            value={categoryInput} 
            onChange={e => setCategoryInput(e.target.value)}
            placeholder="New Category..."
            className="bg-[#050b14] border border-white/10 rounded px-3 py-1.5 text-sm text-white"
          />
          <button 
            onClick={handleBulkUpdate}
            disabled={isUpdating}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded text-sm disabled:opacity-50"
          >
            {isUpdating ? "Updating..." : "Assign Category"}
          </button>
        </div>
      )}
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-white/5 border-b border-white/10">
            <th className="p-4 w-12">
              <input 
                type="checkbox" 
                checked={selectedIds.length === consumables.length && consumables.length > 0} 
                onChange={toggleAll}
                className="rounded border-white/20 bg-transparent"
              />
            </th>
            <th className="p-4 font-semibold text-slate-300">Name</th>
            <th className="p-4 font-semibold text-slate-300">Category</th>
            <th className="p-4 font-semibold text-slate-300">Linked Products</th>
            <th className="p-4 font-semibold text-slate-300 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {consumables.map((item) => (
            <ConsumableTableRow 
              key={item.id} 
              item={item} 
              isSelected={selectedIds.includes(item.id)}
              onToggle={() => toggleOne(item.id)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

