"use client";

import { useState, useRef, useEffect } from "react";

const QUICK_ICONS = [
  "✓", "✅", "⭐", "💎", "🚀", "🔥", "🛡️", "🔒", "⚖️", "💼", 
  "💡", "📌", "⚡", "✨", "🎯", "🥇", "📈", "🤝", "📝", "📁",
  "📱", "💻", "🌐", "🔍", "⏱️", "⏳", "🎁", "🎉", "👑", "👍",
  "❤️", "🔥", "💯", "💰", "💳", "🛒", "📦", "🚚", "🏠", "🏢",
  "👨‍⚖️", "👩‍⚖️", "📜", "📑", "📊", "📉", "📈", "📅", "🗓️", "🔔",
  "📢", "📣", "💬", "💭", "❗", "❓", "✅", "❌", "🚫", "🛑",
  "🟢", "🔴", "🟡", "🔵", "🔶", "🔷", "🔸", "🔹", "🔺", "🔻",
  "😊", "😎", "🤩", "🤔", "🙌", "👏", "🙏", "💪", "✍️", "👀"
];

interface FeatureInputProps {
  name: string;
  rows?: number;
  placeholder?: string;
  defaultValue?: string;
}

export default function FeatureInput({ name, rows = 6, placeholder, defaultValue = "" }: FeatureInputProps) {
  const [value, setValue] = useState(defaultValue);
  const [showPicker, setShowPicker] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const insertIcon = (icon: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    const textBefore = value.substring(0, start);
    const needsSpace = textBefore.length > 0 && !textBefore.endsWith("\n") && !textBefore.endsWith(" ");
    const insertText = (textBefore === "" || textBefore.endsWith("\n")) ? `${icon} ` : (needsSpace ? ` ${icon} ` : `${icon} `);

    const newValue = value.substring(0, start) + insertText + value.substring(end);
    setValue(newValue);
    setShowPicker(false);

    setTimeout(() => {
      textarea.selectionStart = start + insertText.length;
      textarea.selectionEnd = start + insertText.length;
      textarea.focus();
    }, 0);
  };

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        name={name}
        rows={rows}
        required={name === "description"}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-navy text-gray-900 resize-none leading-relaxed"
      />
      
      {/* Icon Smiley / Emoji Button */}
      <div className="absolute bottom-3 right-3" ref={pickerRef}>
        <button
          type="button"
          onClick={() => setShowPicker(!showPicker)}
          className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
            showPicker ? "bg-gray-200 text-gray-700" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          }`}
          title="Pilih Icon"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>

        {/* Popover Menu Icon */}
        {showPicker && (
          <div className="absolute bottom-full right-0 mb-2 w-72 bg-white border border-gray-200 shadow-xl rounded-lg p-3 z-10">
            <div className="text-xs font-semibold text-gray-500 mb-2">Pilih Icon:</div>
            <div className="grid grid-cols-7 gap-1 max-h-48 overflow-y-auto no-scrollbar pb-1">
              {QUICK_ICONS.map((icon, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => insertIcon(icon)}
                  className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 hover:scale-110 transition-transform text-base"
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
