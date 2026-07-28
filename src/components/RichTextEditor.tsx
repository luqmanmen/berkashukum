"use client";

import dynamic from "next/dynamic";
import { useMemo, useRef, useCallback } from "react";
import "react-quill/dist/quill.snow.css";
import { supabase } from "@/lib/supabase";

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const reactQuillRef = useRef<any>(null);

  // Custom Image Handler to upload image to Supabase and insert URL instead of base64
  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files ? input.files[0] : null;
      if (!file) return;

      const quill = reactQuillRef.current?.getEditor();
      if (!quill) return;

      // Show some loading indicator if needed (optional)
      const range = quill.getSelection(true);

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
        quill.insertEmbed(range.index, "image", url);
        // Move cursor to next position
        quill.setSelection(range.index + 1);
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

  return (
    <div className="bg-white [&_.ql-container]:min-h-[400px] [&_.ql-editor]:text-base [&_.ql-editor]:text-gray-800">
      <ReactQuill
        ref={reactQuillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        placeholder={placeholder || "Mulai menulis di sini..."}
      />
    </div>
  );
}
