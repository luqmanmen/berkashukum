"use client";

import dynamic from "next/dynamic";
import { useMemo, useCallback, useState } from "react";
import "react-quill/dist/quill.snow.css";
import { supabase } from "@/lib/supabase";

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

// We store the quill instance globally in a variable because
// the dynamically imported ReactQuill doesn't support ref prop cleanly.
let quillInstance: any = null;

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const [mounted, setMounted] = useState(false);

  // Custom Image Handler to upload image to Supabase and insert URL instead of base64
  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files ? input.files[0] : null;
      if (!file) return;

      if (!quillInstance) return;
      const range = quillInstance.getSelection(true);

      try {
        const fileExt = file.name.split(".").pop();
        const fileName = `article-${Date.now()}-${Math.random()}.${fileExt}`;

        // Upload to Supabase
        const { error } = await supabase.storage
          .from("images")
          .upload(`articles/${fileName}`, file, { cacheControl: "3600", upsert: false });

        if (error) {
          console.error("Upload error:", error);
          alert("Gagal mengunggah gambar: " + error.message);
          return;
        }

        // Get Public URL
        const { data: publicUrlData } = supabase.storage
          .from("images")
          .getPublicUrl(`articles/${fileName}`);

        const url = publicUrlData.publicUrl;

        // Insert image at cursor
        quillInstance.insertEmbed(range.index, "image", url);
        // Move cursor to next position
        quillInstance.setSelection(range.index + 1);
      } catch (err) {
        console.error("Unexpected upload error:", err);
        alert("Terjadi kesalahan saat mengunggah gambar.");
      }
    };
  }, []);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }, { font: [] }],
          [{ align: [] }],
          ["bold", "italic", "underline", "strike"],
          [{ color: [] }, { background: [] }],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ indent: "-1" }, { indent: "+1" }],
          ["link", "image", "video"],
          ["blockquote", "code-block"],
          ["clean"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
    }),
    [imageHandler]
  );

  // Grab the quill instance after mount via the container's querySelector
  const handleContainerRef = useCallback((el: HTMLDivElement | null) => {
    if (el && !mounted) {
      // Small delay to let ReactQuill fully mount
      setTimeout(() => {
        const quillEditor = el.querySelector(".ql-editor");
        if (quillEditor) {
          // Access quill via the Quill class attached to the container
          const quillContainer = el.querySelector(".ql-container");
          if (quillContainer && (quillContainer as any).__quill) {
            quillInstance = (quillContainer as any).__quill;
          }
        }
        setMounted(true);
      }, 500);
    }
  }, [mounted]);

  return (
    <div 
      ref={handleContainerRef}
      className="bg-white [&_.ql-container]:min-h-[400px] [&_.ql-editor]:text-base [&_.ql-editor]:text-gray-800"
    >
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        placeholder={placeholder || "Mulai menulis di sini..."}
      />
    </div>
  );
}
