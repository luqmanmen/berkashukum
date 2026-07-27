import React, { useEffect, useState } from 'react';
import Image from 'next/image';

export default function LogoLoader({ className = "w-40 h-40" }: { className?: string }) {
  const [progress, setProgress] = useState(0);

  // Simulasi progress bar ala Pentagon (naik perlahan dari 0 ke 100)
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Random lompatan angka agar terlihat seperti loading data beneran
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 200);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#FAF9F6] z-[9999]">
      <style dangerouslySetInnerHTML={{__html: `
        .animate-subtle-pulse {
          animation: subtle-pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animate-white-splash {
          position: absolute;
          inset: -30%;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(212,175,55,0.15) 0%, rgba(212,175,55,0) 60%);
          animation: white-splash 1.5s ease-in-out infinite alternate;
          z-index: -1;
          filter: blur(15px);
        }
        @keyframes subtle-pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.85;
            transform: scale(0.96);
          }
        }
        @keyframes white-splash {
          0% {
            transform: scale(0.7);
            opacity: 0.5;
          }
          100% {
            transform: scale(1.3);
            opacity: 1;
          }
        }
        .progress-bar-container {
          width: 200px;
          height: 2px;
          background: rgba(0, 0, 0, 0.05);
          overflow: hidden;
          margin-top: 40px;
          position: relative;
        }
        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, transparent, #222222, transparent);
          background-size: 200% 100%;
          animation: scan 2s linear infinite;
          box-shadow: 0 0 5px rgba(0,0,0,0.1);
          transition: width 0.3s ease-out;
        }
        @keyframes scan {
          0% { background-position: 100% 0; }
          100% { background-position: -100% 0; }
        }
      `}} />
      
      {/* Kontainer Logo */}
      <div className={`relative flex items-center justify-center ${className}`}>
        {/* Efek White Splash di belakang */}
        <div className="animate-white-splash"></div>
        
        {/* Logo Utama berdenyut tipis */}
        <div className="relative w-full h-full animate-subtle-pulse">
          <Image 
            src="/images/logo-1.png" 
            alt="Loading..." 
            fill 
            className="object-contain drop-shadow-2xl brightness-110"
            priority
          />
        </div>
      </div>

      {/* Progress Bar ala Pentagon */}
      <div className="progress-bar-container">
        <div 
          className="progress-bar-fill" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}
