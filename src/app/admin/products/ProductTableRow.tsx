"use client";

import { useState } from "react";
import Link from "next/link";
import { Edit, Trash2 } from "lucide-react";
import { deleteProduct } from "@/app/actions/product";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { useRouter } from "next/navigation";

interface ProductModel {
  modelName: string;
}

interface Product {
  id: string;
  name: string;
  models: ProductModel[];
  createdAt: Date;
}

export default function ProductTableRow({ product }: { product: Product }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteProduct(product.id);
    setIsDeleting(false);
    
    if (result.success) {
      setIsModalOpen(false);
      router.refresh();
    } else {
      alert("Failed to delete product");
    }
  };

  return (
    <>
      <tr className="hover:bg-white/[0.02] transition-colors">
        <td className="px-6 py-4 font-medium text-white">{product.name}</td>
        <td className="px-6 py-4 text-slate-400">
          {product.models.map(m => m.modelName).join(", ") || "No models"}
        </td>
        <td className="px-6 py-4 text-slate-400">
          {new Date(product.createdAt).toLocaleDateString()}
        </td>
        <td className="px-6 py-4 text-right flex justify-end gap-2">
          <Link href={`/admin/products/${product.id}/edit`} className="p-2 text-slate-400 hover:text-blue-400 transition-colors">
            <Edit className="w-4 h-4" />
          </Link>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="p-2 text-slate-400 hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </td>
      </tr>

      <ConfirmModal 
        isOpen={isModalOpen}
        title="Delete Product"
        description={`Are you sure you want to delete "${product.name}"? This action cannot be undone and will delete all associated models.`}
        onConfirm={handleDelete}
        onCancel={() => setIsModalOpen(false)}
        isLoading={isDeleting}
      />
    </>
  );
}
