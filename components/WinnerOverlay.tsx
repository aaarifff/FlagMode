'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Country } from '@/lib/countries';
import { Trophy, Crown } from 'lucide-react';

interface WinnerOverlayProps {
  winner: Country;
  round: number;
}

export function WinnerOverlay({ winner, round }: WinnerOverlayProps) {
  useEffect(() => {
    // Launch celebratory confetti bursts
    const end = Date.now() + 2.5 * 1000;
    const colors = ['#fbbf24', '#3b82f6', '#10b981', '#f43f5e', '#a855f7'];

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, [winner]);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none select-none bg-black/60 backdrop-blur-[3px] animate-fadeIn">
      {/* Sun-ray burst rotating background */}
      <div className="relative flex flex-col items-center">
        <div className="absolute -inset-24 w-80 h-80 sun-rays opacity-90 -z-10" />

        {/* Golden Crown */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 text-xs font-black uppercase tracking-wider mb-2 shadow-[0_0_15px_rgba(251,191,36,0.5)]">
          <Crown className="w-4 h-4 fill-amber-400" />
          <span>ROUND {round} WINNER</span>
        </div>

        {/* Large framed flag with golden glow */}
        <div className="w-40 h-28 rounded-xl overflow-hidden glow-gold-box relative transform hover:scale-105 transition-transform bg-black">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={winner.flagUrl}
            alt={winner.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Country Name */}
        <div className="mt-4 text-3xl font-black tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-300 to-yellow-400 drop-shadow-[0_0_20px_rgba(251,191,36,0.9)]">
          {winner.name}
        </div>

        {/* Tag */}
        <div className="mt-2 text-xs font-black tracking-widest uppercase text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/50 shadow-md">
          ✓ QUALIFIED FOR FINAL
        </div>
      </div>
    </div>
  );
}

