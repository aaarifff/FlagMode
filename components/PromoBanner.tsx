'use client';

import React from 'react';

interface PromoBannerProps {
  name: string;
  handle: string;
  visible?: boolean;
}

export function PromoBanner({ name, handle, visible = true }: PromoBannerProps) {
  if (!visible) return null;

  return (
    <div className="w-full px-4 my-1 select-none flex justify-start">
      <div className="flex items-center gap-2 p-1 pl-1.5 pr-3 rounded-full bg-blue-950/80 border border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.25)] backdrop-blur-md transform transition-all duration-500 hover:scale-105">
        {/* Red YouTube Subscribe Pill */}
        <div className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white shadow-md shadow-red-600/40">
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
          <span>SUBSCRIBE</span>
        </div>

        {/* Channel Info */}
        <div className="flex flex-col text-left leading-none">
          <span className="text-[11px] font-extrabold text-amber-300 tracking-wide">
            @{name}
          </span>
          <span className="text-[9px] font-medium text-blue-300/70">
            {handle}
          </span>
        </div>
      </div>
    </div>
  );
}

