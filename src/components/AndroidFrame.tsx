import React from 'react';

interface AndroidFrameProps {
  children: React.ReactNode;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-emerald-950/15 flex flex-col items-center justify-start text-slate-800 antialiased font-sans selection:bg-emerald-600 selection:text-white">
      {/* Clean Full-Bleed Mobile Web Container (No Mockup Phone Frame) */}
      <div className="w-full max-w-md min-h-screen h-screen flex flex-col relative bg-[#f0fdf4] shadow-2xl overflow-hidden">
        {children}
      </div>
    </div>
  );
};
