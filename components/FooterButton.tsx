'use client';

import React from 'react';
import { Timer } from 'lucide-react';

interface FooterButtonProps {
  durationMin: number;
  onClick: () => void;
}

export function FooterButton({ durationMin, onClick }: FooterButtonProps) {
  return (
    <div className="w-full flex justify-center py-2 select-none">
      <button
        onClick={onClick}
        className="glow-pill-blue px-5 py-1.5 rounded-full text-xs font-black tracking-wider text-blue-200 uppercase flex items-center gap-1.5 hover:bg-blue-900/60 active:scale-95 transition shadow-lg border border-blue-400/50"
      >
        <Timer className="w-3.5 h-3.5 text-blue-400" />
        <span>TIMER · {durationMin} MIN</span>
      </button>
    </div>
  );
}

