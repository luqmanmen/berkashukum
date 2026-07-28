"use client";

import React, { useRef, useState } from "react";
import ImageCropperModal from "./ImageCropperModal";

interface ImageUploadWithCropProps {
  name: string;
  accept?: string;
  required?: boolean;
  className?: string;
  aspect?: number;
  defaultValue?: string; // Original URL if editing
}

export default function ImageUploadWithCrop({
  name,
  accept = "image/*",
  required = false,
  className,
  aspect,
  defaultValue,
}: ImageUploadWithCropProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(defaultValue || null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageToCrop(reader.result as string);
        setCropModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedFile: File) => {
    // Set the cropped file back to the input element using DataTransfer
    if (fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(croppedFile);
      fileInputRef.current.files = dataTransfer.files;
    }

    // Set preview URL
    const objUrl = URL.createObjectURL(croppedFile);
    setPreviewUrl(objUrl);

    setCropModalOpen(false);
    setImageToCrop(null);
  };

  const handleCropCancel = () => {
    setCropModalOpen(false);
    setImageToCrop(null);
    // Reset file input if user cancels cropping
    if (fileInputRef.current && !previewUrl) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full space-y-3">
      {previewUrl && (
        <div className="relative w-32 h-32 rounded-md overflow-hidden border border-gray-200">
          <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
        </div>
      )}
      <input
        ref={fileInputRef}
        name={name}
        type="file"
        accept={accept}
        required={required && !defaultValue} // Only require if no existing image
        className={className || "w-full px-4 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-navy text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer"}
        onChange={handleFileChange}
      />
      
      <ImageCropperModal
        isOpen={cropModalOpen}
        imageSrc={imageToCrop}
        onClose={handleCropCancel}
        onCropCompleteAction={handleCropComplete}
        aspect={aspect}
      />
    </div>
  );
}
