"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FileText, UploadCloud, X } from "lucide-react";
import toast from "react-hot-toast";

export type UploadableResource = {
  name: string;
  file?: File;
  url?: string;
};

interface ResourceUploadProps {
  value: UploadableResource[];
  onChange: (resources: UploadableResource[]) => void;
  maxFiles?: number;
}

export function ResourceUpload({ value = [], onChange, maxFiles = 5 }: ResourceUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    if (value.length + acceptedFiles.length > maxFiles) {
      toast.error(`You can only upload a maximum of ${maxFiles} resource(s)`);
      return;
    }

    const newItems: UploadableResource[] = acceptedFiles.map(file => ({
      name: file.name,
      file: file
    }));

    onChange([...value, ...newItems]);
  }, [value, maxFiles, onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    disabled: value.length >= maxFiles,
    maxFiles: maxFiles - value.length,
  });

  const removeResource = (indexToRemove: number) => {
    onChange(value.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {value.length < maxFiles && (
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? "border-blue-500 bg-blue-500/10" : "border-white/20 bg-[#050b14] hover:bg-white/5"
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-3">
            <UploadCloud className="w-10 h-10 text-blue-500" />
            <div>
              <p className="text-slate-200 font-medium">
                {isDragActive ? "Drop the documents here..." : "Drag & drop documents here"}
              </p>
              <p className="text-slate-400 text-sm mt-1">PDF or Word documents up to 10MB</p>
            </div>
          </div>
        </div>
      )}

      {/* List Area */}
      {value.length > 0 && (
        <div className="space-y-2">
          {value.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl group">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-blue-500" />
                </div>
                <div className="truncate">
                  <p className="text-sm font-medium text-slate-200 truncate">{item.name}</p>
                  <p className="text-xs text-slate-500">{item.file ? "Ready to upload" : "Uploaded"}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeResource(index)}
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
