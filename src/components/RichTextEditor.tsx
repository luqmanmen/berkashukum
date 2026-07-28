"use client";

import dynamic from "next/dynamic";
import { useMemo, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabase";

// Dynamically import JoditEditor
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef(null);

  const config = useMemo(() => ({
    readonly: false,
    placeholder: placeholder || "Mulai menulis di sini...",
    height: 500,
    uploader: {
      insertImageAsBase64URI: false,
    },
    buttons: [
      'source', '|',
      'bold', 'strikethrough', 'underline', 'italic', '|',
      'ul', 'ol', '|',
      'outdent', 'indent', '|',
      'font', 'fontsize', 'brush', 'paragraph', '|',
      'image', 'video', 'table', 'link', '|',
      'align', 'undo', 'redo', '|',
      'hr', 'eraser', 'copyformat', '|',
      'fullsize'
    ],
    events: {
      beforeInsertImage: function (this: any, file: File, __: any, resolve: (val: string) => void, reject: () => void) {
        // Upload to Supabase manually
        const fileExt = file.name.split(".").pop();
        const fileName = `article-${Date.now()}-${Math.random()}.${fileExt}`;
        
        supabase.storage
          .from("images")
          .upload(`articles/${fileName}`, file, { cacheControl: "3600", upsert: false })
          .then(({ error }) => {
            if (error) {
              console.error("Upload error:", error);
              alert("Gagal mengunggah gambar: " + error.message);
              reject();
              return;
            }
            
            const { data } = supabase.storage
              .from("images")
              .getPublicUrl(`articles/${fileName}`);
              
            // Create an image node and insert it manually because resolve string sometimes doesn't work well
            this.selection.insertImage(data.publicUrl);
            resolve(data.publicUrl);
          })
          .catch((err) => {
             console.error(err);
             reject();
          });
          
        return false; // Prevent default Jodit upload
      }
    }
  }), [placeholder]);

  return (
    <div className="bg-white text-black">
      <JoditEditor
        ref={editorRef}
        value={value}
        config={config}
        onBlur={(newContent) => onChange(newContent)}
      />
    </div>
  );
}
