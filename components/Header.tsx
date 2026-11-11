'use client';

import React from 'react';
import { Menu, Volume2, VolumeX, Music } from 'lucide-react';
import { FullscreenButton } from '@/components/FullscreenButton';

interface HeaderProps {
  title?: string;
  round: number;
  totalRounds?: number;
  secondsLeft: number;
  status: string;
  isMusicOn: boolean;
  isSoundOn: boolean;
  onToggleMusic: () => void;
  onToggleSound: () => void;
  onOpenMenu: () => void;
  onOpenDurationPicker?: () => void;
}

export function Header({
  title = '100-Country Flags Battle',
  round,
  totalRounds = 5,
  secondsLeft,
  status,
  isMusicOn,
  isSoundOn,
  onToggleMusic,
  onToggleSound,
  onOpenMenu,
  onOpenDurationPicker,
}: HeaderProps) {
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <header className="w-full flex flex-col items-center pt-2 pb-1.5 px-3 relative z-30 select-none">
      {/* Top row: Menu button, Title, Sound controls */}
      <div className="w-full flex items-center justify-between">
        <button
          onClick={onOpenMenu}
          className="p-1.5 rounded-lg bg-blue-950/70 border border-blue-500/40 text-blue-200 hover:text-white hover:bg-blue-900/80 transition active:scale-95"
          title="Open Menu & Settings"
        >
          <Menu className="w-4 h-4" />
        </button>

        <h1 className="text-base font-black tracking-wider uppercase text-white drop-shadow-[0_0_12px_rgba(59,130,246,0.8)] text-center flex-1 mx-2 truncate">
          {title}
        </h1>

        <div className="flex shrink-0 items-center gap-1.5">
          <FullscreenButton iconOnly />
          {/* Music Button */}
          <button
            onClick={onToggleMusic}
            className={`p-1.5 rounded-lg border transition active:scale-95 flex items-center gap-1 text-[11px] font-bold ${
              isMusicOn
                ? 'bg-blue-600/80 border-blue-400 text-white shadow-[0_0_10px_rgba(59,130,246,0.6)]'
                : 'bg-gray-800/80 border-gray-600 text-gray-400'
            }`}
            title={isMusicOn ? 'Mute Music' : 'Enable Music'}
          >
            <Music className="w-3.5 h-3.5" />
            <span className="text-[10px] hidden sm:inline">{isMusicOn ? 'ON' : 'OFF'}</span>
          </button>

          {/* Sound FX Button */}
          <button
            onClick={onToggleSound}
            className={`p-1.5 rounded-lg border transition active:scale-95 ${
              isSoundOn
                ? 'bg-indigo-600/80 border-indigo-400 text-white shadow-[0_0_10px_rgba(99,102,241,0.5)]'
                : 'bg-gray-800/80 border-gray-600 text-gray-400'
            }`}
            title={isSoundOn ? 'Mute Sound FX' : 'Enable Sound FX'}
          >
            {isSoundOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Middle pills: Round, Timer, Status */}
      <div className="flex items-center justify-center gap-2 mt-1.5">
        <button
          onClick={onOpenMenu}
          className="glow-pill-blue px-2.5 py-0.5 rounded-full text-[11px] font-black tracking-wider text-blue-200 uppercase hover:brightness-125 transition"
          title="Round details"
        >
          ROUND {round}
          {totalRounds ? ` / ${totalRounds}` : ''}
        </button>
        <button
          onClick={onOpenDurationPicker || onOpenMenu}
          className="glow-pill-amber px-2.5 py-0.5 rounded-full text-[11px] font-black tracking-wider text-amber-300 flex items-center gap-1 hover:brightness-125 transition active:scale-95"
          title="Change Match Duration (15m, 30m, 60m)"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          {formatTime(secondsLeft)}
        </button>
        <div className="glow-pill-green px-2.5 py-0.5 rounded-full text-[11px] font-black tracking-wider text-emerald-300 uppercase">
          {status}
        </div>
      </div>
    </header>
  );
}
