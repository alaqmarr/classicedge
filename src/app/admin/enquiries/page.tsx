import { getEnquiries } from "@/app/actions/enquiry";
import { Inbox } from "lucide-react";
import { EnquiriesList } from "./EnquiriesList";

export const dynamic = "force-dynamic";

export default async function EnquiriesPage() {
  const enquiries = await getEnquiries();

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Inbox className="w-8 h-8 text-blue-500" />
          <h1 className="text-3xl font-bold text-white">Enquiries</h1>
        </div>
      </div>

      <div className="glass-panel border border-white/5 rounded-xl overflow-hidden">
        <EnquiriesList initialEnquiries={enquiries} />
      </div>
    </div>
  );
}
