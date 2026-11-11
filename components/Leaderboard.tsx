'use client';

import React from 'react';
import Image from 'next/image';
import { Country } from '@/lib/countries';

interface LeaderboardProps {
  qualified: Country[];
  targetSlots?: number;
  totalFlags?: number;
}

export function Leaderboard({ qualified, targetSlots = 5, totalFlags = 100 }: LeaderboardProps) {
  const slots = Array.from({ length: targetSlots });

  const getRankBadge = (index: number) => {
    switch (index) {
      case 0:
        return 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-extrabold shadow-[0_0_8px_rgba(251,191,36,0.8)]';
      case 1:
        return 'bg-gradient-to-r from-slate-200 to-slate-400 text-slate-900 font-extrabold shadow-[0_0_8px_rgba(226,232,240,0.8)]';
      case 2:
        return 'bg-gradient-to-r from-amber-700 to-amber-600 text-white font-extrabold shadow-[0_0_8px_rgba(217,119,6,0.6)]';
      default:
        return 'bg-blue-950/80 text-blue-300 border border-blue-500/30';
    }
  };

  return (
    <div className="w-full px-3 my-1 select-none">
      <div className="glow-card rounded-xl p-2 border border-blue-500/40 shadow-lg">
        <div className="text-[11px] font-black tracking-wider uppercase text-center text-blue-200/90 mb-1.5 drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]">
          QUALIFIED FOR FINAL {qualified.length} / {totalFlags}
        </div>

        <div className="space-y-1">
          {slots.map((_, idx) => {
            const country = qualified[idx];

            if (country) {
              return (
                <div
                  key={country.code}
                  className="flex items-center justify-between px-2.5 py-1 rounded-lg bg-blue-950/60 border border-blue-500/30 shadow-sm transition-all"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-6 h-4 text-[10px] rounded flex items-center justify-center ${getRankBadge(
                        idx
                      )}`}
                    >
                      #{idx + 1}
                    </span>
                    <div className="w-5 h-3.5 relative overflow-hidden rounded-[2px] shadow-sm border border-white/20">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={country.flagUrl}
                        alt={country.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-xs font-bold text-white tracking-wide">
                      {country.name}
                    </span>
                  </div>

                  <span className="text-[10px] font-black tracking-wide text-emerald-400 flex items-center gap-0.5 bg-emerald-950/50 px-1.5 py-0.5 rounded border border-emerald-500/30">
                    ✓ QUALIFIED
                  </span>
                </div>
              );
            }

            return (
              <div
                key={`empty-${idx}`}
                className="flex items-center justify-between px-2.5 py-1 rounded-lg bg-blue-950/20 border border-blue-900/30 opacity-40"
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-4 text-[10px] rounded bg-gray-900/80 text-gray-400 flex items-center justify-center font-mono">
                    #{idx + 1}
                  </span>
                  <span className="text-xs italic text-gray-400 font-medium tracking-wide">
                    Waiting...
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

