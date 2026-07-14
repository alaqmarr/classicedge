"use client";

import { useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, X } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

export type UploadableImage = {
  file?: File;
  url?: string;
  preview: string;
};

interface ImageUploadProps {
  value: UploadableImage[];
  onChange: (images: UploadableImage[]) => void;
  maxFiles?: number;
}

export function ImageUpload({ value = [], onChange, maxFiles = 1 }: ImageUploadProps) {
  // Cleanup object URLs on unmount to avoid memory leaks
  useEffect(() => {
    return () => {
      value.forEach(item => {
        if (item.file && item.preview.startsWith('blob:')) {
          URL.revokeObjectURL(item.preview);
        }
      });
    };
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    // Check if adding these files would exceed maxFiles
    if (value.length + acceptedFiles.length > maxFiles) {
      toast.error(`You can only upload a maximum of ${maxFiles} image(s)`);
      return;
    }

    const newItems: UploadableImage[] = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    onChange([...value, ...newItems]);
  }, [value, maxFiles, onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    },
    disabled: value.length >= maxFiles,
    maxFiles: maxFiles - value.length,
  });

  const removeImage = (indexToRemove: number) => {
    const itemToRemove = value[indexToRemove];
    if (itemToRemove.file && itemToRemove.preview.startsWith('blob:')) {
      URL.revokeObjectURL(itemToRemove.preview);
    }
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
                {isDragActive ? "Drop the files here..." : "Drag & drop images here"}
              </p>
              <p className="text-slate-400 text-sm mt-1">or click to select files</p>
            </div>
          </div>
        </div>
      )}

      {/* Preview Area */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {value.map((item, index) => (
            <div key={index} className="relative aspect-video rounded-xl overflow-hidden border border-white/10 group">
              <Image 
                src={item.preview} 
                alt={`Uploaded image ${index + 1}`} 
                fill 
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all z-10"
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
