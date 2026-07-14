import Link from "next/link";
import { getContacts } from "@/app/actions/contact";
import { Plus, Edit, Trash2 } from "lucide-react";

export default async function AdminContactsPage() {
  const contacts = await getContacts();

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Contact Information</h1>
        <Link href="/admin/contact/new" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
          <Plus className="w-4 h-4" /> Add Office
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contacts.length === 0 ? (
          <div className="col-span-full text-slate-500 p-8 border border-white/10 rounded-xl text-center">
            No contact information found. Add one to display on the contact page.
          </div>
        ) : (
          contacts.map((contact) => (
            <div key={contact.id} className="bg-[#050b14] border border-white/5 p-6 rounded-xl relative group">
              <h3 className="text-xl font-semibold text-blue-400 mb-4">{contact.title}</h3>
              <div className="space-y-2 text-sm text-slate-400 mb-6">
                <p><span className="text-slate-300 font-medium">Address:</span> {contact.address}</p>
                <p><span className="text-slate-300 font-medium">Phone:</span> {contact.phone}</p>
                <p><span className="text-slate-300 font-medium">Email:</span> {contact.email}</p>
              </div>
              <div className="flex justify-end gap-2 border-t border-white/10 pt-4">
                <button className="p-2 text-slate-400 hover:text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
