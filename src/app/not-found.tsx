import Link from "next/link";
import { ArrowLeft, Settings, AlertTriangle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - Page Not Found | Classic Edge 53",
  description: "The page you are looking for does not exist.",
};

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-20 px-4">
      <div className="max-w-xl w-full relative">
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full -z-10"></div>
        
        <div className="glass-panel border border-white/10 p-10 md:p-14 rounded-3xl text-center relative overflow-hidden">
          {/* Decorative gear */}
          <Settings className="absolute -right-8 -top-8 w-40 h-40 text-blue-500/5 rotate-45 -z-10" />
          
          <div className="w-20 h-20 bg-blue-500/10 rounded-2xl border border-blue-500/20 flex items-center justify-center mx-auto mb-8">
            <AlertTriangle className="w-10 h-10 text-blue-400" />
          </div>
          
          <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-500 mb-4 tracking-tight">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Page Not Found
          </h2>
          <p className="text-slate-400 mb-10 text-lg leading-relaxed max-w-md mx-auto">
            The machine part or page you're looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/" 
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-medium transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] w-full sm:w-auto"
            >
              <ArrowLeft className="w-5 h-5" /> Back to Home
            </Link>
            <Link 
              href="/products" 
              className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-3.5 rounded-xl font-medium transition-colors w-full sm:w-auto"
            >
              Browse Machines
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
