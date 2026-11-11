'use client';

import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Music,
  Minus,
  Plus,
  RefreshCw,
  Sparkles,
  Zap,
  Flame,
  Radio,
  Timer,
  Trophy,
} from 'lucide-react';

interface DesktopSidebarLeftProps {
  title: string;
  onUpdateTitle?: (t: string) => void;
  isRunning: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
  flagCount: number;
  onUpdateFlagCount: (val: number) => void;
  durationMin: number;
  onUpdateDuration: (mins: number) => void;
  qualifierTarget: number;
  onUpdateQualifierTarget: (rounds: number) => void;
  isMusicOn: boolean;
  isSoundOn: boolean;
  onToggleMusic: () => void;
  onToggleSound: () => void;
  autoMode: boolean;
  onToggleAutoMode: () => void;
  chaosMode: boolean;
  onToggleChaosMode: () => void;
}

export function DesktopSidebarLeft({
  title,
  onUpdateTitle,
  isRunning,
  onTogglePlay,
  onReset,
  flagCount,
  onUpdateFlagCount,
  durationMin,
  onUpdateDuration,
  qualifierTarget,
  onUpdateQualifierTarget,
  isMusicOn,
  isSoundOn,
  onToggleMusic,
  onToggleSound,
  autoMode,
  onToggleAutoMode,
  chaosMode,
  onToggleChaosMode,
}: DesktopSidebarLeftProps) {
  const durationOptions = [15, 30, 60];
  const roundOptions = [3, 5, 10];

  return (
    <aside className="w-72 bg-[#090f22] border-r border-blue-900/40 p-4 flex flex-col justify-between select-none overflow-y-auto text-white">
      <div className="space-y-4">
        {/* Logo / Title Header */}
        <div className="flex items-center justify-between pb-3 border-b border-blue-950">
          <div className="flex items-center gap-2 flex-1 mr-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center font-black text-xs shrink-0">
              FB
            </div>
            <div className="overflow-hidden">
              <span className="font-black text-xs tracking-wider uppercase text-white block truncate">
                {title || 'FLAGS BATTLE'}
              </span>
              <span className="text-[10px] font-bold text-amber-400">Pro 3.0</span>
            </div>
          </div>
          <div className="flex rounded-md bg-blue-950/70 p-0.5 border border-blue-900/50 text-[10px] font-bold shrink-0">
            <span className="px-1.5 py-0.5 rounded bg-blue-600 text-white">EN</span>
            <span className="px-1.5 py-0.5 text-gray-400">TR</span>
          </div>
        </div>

        {/* Match Section */}
        <div>
          <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-2">
            Match Controls
          </h3>

          <div className="grid grid-cols-2 gap-2 mb-3">
            <button
              onClick={onTogglePlay}
              className="py-2.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20 active:scale-95 transition"
            >
              {isRunning ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Start</span>
                </>
              )}
            </button>

            <button
              onClick={onReset}
              className="py-2.5 px-3 rounded-xl bg-blue-950/60 hover:bg-blue-900/60 border border-blue-800/60 text-blue-200 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 active:scale-95 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {/* DURATION SELECTOR (15m, 30m, 60m) */}
          <div className="mb-3 bg-blue-950/30 p-2.5 rounded-xl border border-blue-900/40">
            <div className="flex items-center justify-between text-xs font-semibold text-gray-300 mb-1.5">
              <span className="flex items-center gap-1 text-[11px] font-bold text-amber-300">
                <Timer className="w-3 h-3 text-amber-400" />
                Duration
              </span>
              <span className="font-mono text-xs font-bold text-amber-400">{durationMin} Min</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {durationOptions.map((mins) => (
                <button
                  key={mins}
                  onClick={() => onUpdateDuration(mins)}
                  className={`py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border transition ${
                    durationMin === mins
                      ? 'bg-amber-500 border-amber-300 text-black shadow'
                      : 'bg-blue-950/40 border-blue-900/40 text-blue-300 hover:bg-blue-900'
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>
          </div>

          {/* ROUNDS OPTION (3, 5, 10 rounds) */}
          <div className="mb-3 bg-blue-950/30 p-2.5 rounded-xl border border-blue-900/40">
            <div className="flex items-center justify-between text-xs font-semibold text-gray-300 mb-1.5">
              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-300">
                <Trophy className="w-3 h-3 text-emerald-400" />
                Rounds Target
              </span>
              <span className="font-mono text-xs font-bold text-emerald-400">{qualifierTarget}</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {roundOptions.map((r) => (
                <button
                  key={r}
                  onClick={() => onUpdateQualifierTarget(r)}
                  className={`py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border transition ${
                    qualifierTarget === r
                      ? 'bg-emerald-500 border-emerald-300 text-black shadow'
                      : 'bg-blue-950/40 border-blue-900/40 text-blue-300 hover:bg-blue-900'
                  }`}
                >
                  {r} Rnds
                </button>
              ))}
            </div>
          </div>

          {/* Flags in Arena Counter */}
          <div className="bg-blue-950/30 p-2.5 rounded-xl border border-blue-900/40 flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-300">Flags in arena</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onUpdateFlagCount(Math.max(10, flagCount - 5))}
                className="w-6 h-6 rounded-md bg-blue-900/60 hover:bg-blue-800 flex items-center justify-center text-white"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="font-mono font-bold text-sm text-white w-8 text-center">
                {flagCount}
              </span>
              <button
                onClick={() => onUpdateFlagCount(Math.min(100, flagCount + 5))}
                className="w-6 h-6 rounded-md bg-blue-900/60 hover:bg-blue-800 flex items-center justify-center text-white"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Quick Buttons: Sound, Music, State, Reload */}
          <div className="grid grid-cols-4 gap-1.5">
            <button
              onClick={onToggleMusic}
              className={`py-2 rounded-lg border flex flex-col items-center justify-center gap-1 transition ${
                isMusicOn
                  ? 'bg-blue-600/80 border-blue-400 text-white shadow-[0_0_8px_rgba(59,130,246,0.5)]'
                  : 'bg-blue-950/40 border-blue-900/40 text-gray-400'
              }`}
              title={isMusicOn ? 'Mute Music' : 'Enable Music'}
            >
              <Music className="w-3.5 h-3.5" />
              <span className="text-[9px] font-bold">Music</span>
            </button>

            <button
              onClick={onToggleSound}
              className={`py-2 rounded-lg border flex flex-col items-center justify-center gap-1 transition ${
                isSoundOn
                  ? 'bg-indigo-600/80 border-indigo-400 text-white shadow-[0_0_8px_rgba(99,102,241,0.5)]'
                  : 'bg-blue-950/40 border-blue-900/40 text-gray-400'
              }`}
              title={isSoundOn ? 'Mute Sound FX' : 'Enable Sound FX'}
            >
              {isSoundOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span className="text-[9px] font-bold">SFX</span>
            </button>

            <button
              onClick={onTogglePlay}
              className="py-2 rounded-lg bg-blue-950/40 border border-blue-900/40 text-gray-300 hover:text-white flex flex-col items-center justify-center gap-1 transition"
              title="Toggle State"
            >
              {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span className="text-[9px] font-bold">State</span>
            </button>

            <button
              onClick={onReset}
              className="py-2 rounded-lg bg-blue-950/40 border border-blue-900/40 text-gray-300 hover:text-white flex flex-col items-center justify-center gap-1 transition"
              title="Reload Tournament"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="text-[9px] font-bold">Reload</span>
            </button>
          </div>
        </div>

        {/* Modes */}
        <div>
          <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-2">
            Game Modes
          </h3>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between p-2 rounded-xl bg-blue-950/30 border border-blue-900/30">
              <div>
                <span className="text-xs font-bold text-white block">Auto</span>
                <span className="text-[10px] text-gray-400">Next round starts by itself</span>
              </div>
              <input
                type="checkbox"
                checked={autoMode}
                onChange={onToggleAutoMode}
                className="w-4 h-4 accent-amber-400 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-blue-950/30 border border-blue-900/30">
              <div>
                <span className="text-xs font-bold text-white block">Chaos Arena</span>
                <span className="text-[10px] text-gray-400">Speed bursts & tumbles</span>
              </div>
              <input
                type="checkbox"
                checked={chaosMode}
                onChange={onToggleChaosMode}
                className="w-4 h-4 accent-amber-400 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-blue-950 text-[10px] text-gray-500 text-center">
        100-Country Flags Elimination Engine v3.0
      </div>
    </aside>
  );
}
