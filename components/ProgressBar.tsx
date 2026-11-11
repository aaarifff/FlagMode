'use client';

import React from 'react';

interface ProgressBarProps {
  currentInside: number;
  totalRoundFlags: number;
}

export function ProgressBar({ currentInside, totalRoundFlags }: ProgressBarProps) {
  const percentage = totalRoundFlags > 0 ? (currentInside / totalRoundFlags) * 100 : 0;

  return (
    <div className="w-full px-4 my-1 select-none flex flex-col items-center">
      {/* Yellow progress line */}
      <div className="w-full max-w-[280px] h-1.5 bg-blue-950/80 rounded-full overflow-hidden border border-blue-500/30">
        <div
          className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 shadow-[0_0_8px_rgba(251,191,36,0.8)] transition-all duration-300 rounded-full"
          style={{ width: `${Math.max(percentage, 2)}%` }}
        />
      </div>

      {/* Label: e.g. 19 / 98 FLAGS */}
      <div className="text-[11px] font-black tracking-widest uppercase text-amber-300/90 mt-1 drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]">
        {currentInside} / {totalRoundFlags} FLAGS
      </div>
    </div>
  );
}

