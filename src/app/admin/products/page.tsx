import Link from "next/link";
import { getProducts } from "@/app/actions/product";
import { Plus } from "lucide-react";
import ProductTableRow from "./ProductTableRow";

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Products & Models</h1>
        <Link href="/admin/products/new" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
          <Plus className="w-4 h-4" /> Add Product
        </Link>
      </div>

      <div className="glass-panel border border-white/5 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-300">Name</th>
              <th className="px-6 py-4 font-semibold text-slate-300">Models</th>
              <th className="px-6 py-4 font-semibold text-slate-300">Created At</th>
              <th className="px-6 py-4 font-semibold text-slate-300 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {products.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                  No products found. Add one to get started.
                </td>
              </tr>
            ) : (
              products.map(product => (
                <ProductTableRow key={product.id} product={product} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
