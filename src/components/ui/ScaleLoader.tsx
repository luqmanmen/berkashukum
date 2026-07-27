import React from 'react';

export default function ScaleLoader({ className = "w-24 h-24" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <style dangerouslySetInnerHTML={{__html: `
        .animate-draw {
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          animation: draw 2s ease-in-out infinite alternate;
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite alternate;
        }
        @keyframes draw {
          0% { stroke-dashoffset: 100; fill: transparent; }
          60% { stroke-dashoffset: 0; fill: transparent; }
          100% { stroke-dashoffset: 0; fill: currentColor; }
        }
        @keyframes pulse-glow {
          0% { filter: drop-shadow(0 0 2px rgba(212,175,55,0.2)); }
          100% { filter: drop-shadow(0 0 15px rgba(212,175,55,0.8)); }
        }
      `}} />
      <svg 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className="w-full h-full text-[#D4AF37] animate-pulse-glow"
      >
        <path className="animate-draw" d="M16 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
        <path className="animate-draw" d="M2 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
        <path className="animate-draw" d="M7 21h10" />
        <path className="animate-draw" d="M12 3v18" />
        <path className="animate-draw" d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
      </svg>
    </div>
  );
}
