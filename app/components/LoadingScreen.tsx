"use client";

import { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [loading, setLoading] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    // Start fading out after 1.5 seconds
    const fadeTimer = setTimeout(() => {
      setFade(true);
    }, 1500);

    // Remove from DOM after transition finishes (e.g. 500ms after fade starts)
    const removeTimer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!loading) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#A2D0F5] transition-opacity duration-500 ${fade ? 'opacity-0' : 'opacity-100'}`}
      style={{ backgroundImage: 'radial-gradient(#FFFFFF 2.5px, transparent 2.5px), radial-gradient(#FFFFFF 2.5px, transparent 2.5px)', backgroundSize: '50px 50px', backgroundPosition: '0 0, 25px 25px' }}
    >
       <div className="animate-bounce mb-6 text-7xl drop-shadow-lg">🥣</div>
       <h1 className="text-white text-4xl font-extrabold font-['Outfit'] drop-shadow-md text-center">
          Zagrijavam pećnicu...
       </h1>
       <div className="mt-6 flex gap-3">
         <div className="w-4 h-4 bg-white rounded-full animate-bounce shadow-sm" style={{ animationDelay: '0ms' }}></div>
         <div className="w-4 h-4 bg-white rounded-full animate-bounce shadow-sm" style={{ animationDelay: '150ms' }}></div>
         <div className="w-4 h-4 bg-white rounded-full animate-bounce shadow-sm" style={{ animationDelay: '300ms' }}></div>
       </div>
    </div>
  );
}
