"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Loader2, FileText, Settings, PackageOpen } from "lucide-react";
import { globalSearch, SearchResult } from "@/app/actions/search";
import Image from "next/image";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      setQuery("");
      setResults([]);
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setIsLoading(true);
        try {
          const res = await globalSearch(query);
          setResults(res);
        } catch (error) {
          console.error("Search failed:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  if (!isOpen) return null;

  const navigateTo = (url: string) => {
    onClose();
    router.push(url);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "MACHINE": return <Settings className="w-5 h-5 text-blue-400" />;
      case "CONSUMABLE": return <PackageOpen className="w-5 h-5 text-emerald-400" />;
      default: return <FileText className="w-5 h-5 text-purple-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4 sm:px-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#02060d]/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal content */}
      <div className="relative w-full max-w-3xl bg-[#0a1120] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in slide-in-from-top-4 duration-200">
        
        {/* Search Input Area */}
        <div className="relative border-b border-white/10 flex items-center px-4 py-4 shrink-0">
          <Search className="w-6 h-6 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            className="w-full bg-transparent border-none outline-none text-white text-xl px-4 placeholder:text-slate-500"
            placeholder="Search machines, parts, or pages..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {isLoading ? (
            <Loader2 className="w-6 h-6 text-blue-500 animate-spin shrink-0" />
          ) : (
            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Results Area */}
        <div className="overflow-y-auto p-4 flex-1">
          {query.trim().length > 0 && query.trim().length < 2 && (
            <div className="text-center py-10 text-slate-500">
              Type at least 2 characters to search...
            </div>
          )}

          {query.trim().length >= 2 && !isLoading && results.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 text-lg">No results found for "{query}"</p>
              <p className="text-slate-500 text-sm mt-1">Try checking for typos or using different keywords.</p>
            </div>
          )}

          {results.length > 0 && (
            <div className="space-y-2">
              {results.map((result) => (
                <button
                  key={result.id}
                  onClick={() => navigateTo(result.url)}
                  className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10 group text-left"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5 relative overflow-hidden group-hover:border-blue-500/30 transition-colors">
                    {result.image ? (
                      <Image src={result.image} alt={result.title} fill className="object-cover" />
                    ) : (
                      getIcon(result.type)
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-medium truncate group-hover:text-blue-400 transition-colors">
                        {result.title}
                      </span>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-slate-300 shrink-0">
                        {result.type}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 truncate">
                      {result.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="px-4 py-3 border-t border-white/10 bg-white/[0.02] flex justify-between items-center text-xs text-slate-500 shrink-0">
          <span>Press <kbd className="bg-white/10 px-1.5 py-0.5 rounded font-sans text-slate-300">ESC</kbd> to close</span>
          <span>Search powered by Classic Edge 53</span>
        </div>
      </div>
    </div>
  );
}
