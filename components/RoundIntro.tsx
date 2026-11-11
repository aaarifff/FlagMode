'use client';

import React from 'react';

interface RoundIntroProps {
  round: number;
  flagCount: number;
  mode?: string;
}

export function RoundIntro({ round, flagCount, mode = 'CLASSIC' }: RoundIntroProps) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none select-none bg-black/40 backdrop-blur-[2px] animate-fadeIn">
      <div className="flex flex-col items-center text-center p-6 rounded-3xl bg-[#0a132c]/90 border border-blue-400/40 shadow-[0_0_50px_rgba(59,130,246,0.4)] scale-100 animate-pulseGlow">
        <div className="text-4xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-white to-blue-200 uppercase drop-shadow-[0_0_20px_rgba(59,130,246,0.8)]">
          ROUND {round}
        </div>

        <div className="mt-2 px-3 py-0.5 rounded-full bg-blue-600/30 border border-blue-400/50 text-[11px] font-black tracking-widest text-blue-300 uppercase">
          {mode}
        </div>

        <div className="mt-4 text-2xl font-black tracking-wider text-amber-300 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]">
          {flagCount} FLAGS
        </div>

        <div className="mt-2 text-xs font-semibold text-blue-300/80">
          Get ready...
        </div>
      </div>
    </div>
  );
}

