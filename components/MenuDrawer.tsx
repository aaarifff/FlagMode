'use client';

import React from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Music,
  Volume2,
  VolumeX,
  Sliders,
  LogOut,
  Smartphone,
  Monitor,
  Timer,
  Trophy,
  Type,
} from 'lucide-react';

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isRunning: boolean;
  onTogglePlay: () => void;
  onRestart: () => void;
  isMusicOn: boolean;
  isSoundOn: boolean;
  onToggleMusic: () => void;
  onToggleSound: () => void;
  viewMode: 'mobile' | 'desktop';
  onChangeViewMode: (mode: 'mobile' | 'desktop') => void;
  currentRound: number;
  onSelectRound?: (roundNum: number) => void;
  settings: {
    title: string;
    durationMin: number;
    flagCount: number;
    qualifierTarget: number;
    gapDegrees: number;
    ringSpeed: number;
    promoName: string;
    promoHandle: string;
    promoEnabled: boolean;
  };
  onUpdateSettings: (newSettings: any) => void;
  onLogout: () => void;
}

export function MenuDrawer({
  isOpen,
  onClose,
  isRunning,
  onTogglePlay,
  onRestart,
  isMusicOn,
  isSoundOn,
  onToggleMusic,
  onToggleSound,
  viewMode,
  onChangeViewMode,
  currentRound,
  onSelectRound,
  settings,
  onUpdateSettings,
  onLogout,
}: MenuDrawerProps) {
  if (!isOpen) return null;

  const durationOptions = [15, 30, 60];
  const roundOptions = [3, 5, 10];

  return (
    <div className="fixed inset-0 z-50 flex select-none">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="relative w-84 max-w-[90vw] h-full bg-[#080f24] border-r border-blue-500/40 shadow-2xl flex flex-col p-5 overflow-y-auto text-white z-10">
        <div className="flex items-center justify-between pb-3.5 border-b border-blue-500/20">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-blue-400" />
            <h2 className="text-sm font-black tracking-wider uppercase">Menu & Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 space-y-2">
          <button
            onClick={() => {
              onTogglePlay();
              onClose();
            }}
            className={`w-full py-2.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 border shadow-md transition ${
              isRunning
                ? 'bg-amber-600/80 hover:bg-amber-500 border-amber-400/50 text-white'
                : 'bg-emerald-600/80 hover:bg-emerald-500 border-emerald-400/50 text-white'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause Battle</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Start / Resume Battle</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              if (confirm('Restart battle from Round 1?')) {
                onRestart();
                onClose();
              }
            }}
            className="w-full py-2.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider bg-blue-950/70 hover:bg-blue-900 border border-blue-500/40 text-blue-200 flex items-center justify-center gap-2 transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restart Tournament</span>
          </button>
        </div>

        {/* 1. TITLE / LOGO OPTION */}
        <div className="mt-5 pt-4 border-t border-blue-500/20 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-blue-300">
            <Type className="w-3.5 h-3.5 text-amber-400" />
            <span>Title / Logo Header</span>
          </div>
          <input
            type="text"
            value={settings.title}
            onChange={(e) => onUpdateSettings({ title: e.target.value })}
            placeholder="e.g. 100-Country Flags Battle"
            className="w-full bg-blue-950/60 text-white px-3 py-2 rounded-xl border border-blue-500/40 text-xs font-semibold focus:outline-none focus:border-blue-400"
          />
          <div className="flex flex-wrap gap-1.5 pt-1">
            {['100-Country Flags Battle', 'World Flags Battle', 'Flag Arena 2026'].map((preset) => (
              <button
                key={preset}
                onClick={() => onUpdateSettings({ title: preset })}
                className="text-[10px] bg-blue-900/40 hover:bg-blue-800 border border-blue-700/50 px-2 py-0.5 rounded-md text-blue-200"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* 2. MATCH DURATION SELECTOR (15m, 30m, 60m) */}
        <div className="mt-5 pt-4 border-t border-blue-500/20 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-blue-300">
            <div className="flex items-center gap-1.5">
              <Timer className="w-3.5 h-3.5 text-amber-400" />
              <span>Match Duration</span>
            </div>
            <span className="text-amber-400 font-mono font-bold">{settings.durationMin} Min</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {durationOptions.map((mins) => (
              <button
                key={mins}
                onClick={() => onUpdateSettings({ durationMin: mins })}
                className={`py-2 px-2 rounded-xl text-xs font-black uppercase tracking-wider border transition ${
                  settings.durationMin === mins
                    ? 'bg-amber-500 border-amber-300 text-black shadow-[0_0_12px_rgba(251,191,36,0.6)]'
                    : 'bg-blue-950/50 border-blue-800/60 text-blue-200 hover:bg-blue-900'
                }`}
              >
                {mins} Min
              </button>
            ))}
          </div>

          {/* Slider for custom minute fine-tuning */}
          <div className="pt-1">
            <input
              type="range"
              min="5"
              max="120"
              step="5"
              value={settings.durationMin}
              onChange={(e) => onUpdateSettings({ durationMin: Number(e.target.value) })}
              className="w-full accent-amber-400"
            />
          </div>
        </div>

        {/* 3. ROUND OPTIONS (3, 5, 10 rounds & jump) */}
        <div className="mt-5 pt-4 border-t border-blue-500/20 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-blue-300">
            <div className="flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-emerald-400" />
              <span>Round Options</span>
            </div>
            <span className="text-emerald-400 font-mono font-bold">
              Round {currentRound} / {settings.qualifierTarget}
            </span>
          </div>

          {/* Total Qualifier Rounds Selection */}
          <div className="grid grid-cols-3 gap-2">
            {roundOptions.map((r) => (
              <button
                key={r}
                onClick={() => onUpdateSettings({ qualifierTarget: r })}
                className={`py-2 px-2 rounded-xl text-xs font-black uppercase tracking-wider border transition ${
                  settings.qualifierTarget === r
                    ? 'bg-emerald-500 border-emerald-300 text-black shadow-[0_0_12px_rgba(16,185,129,0.6)]'
                    : 'bg-blue-950/50 border-blue-800/60 text-blue-200 hover:bg-blue-900'
                }`}
              >
                {r} Rounds
              </button>
            ))}
          </div>

          {/* Quick round selector / jump */}
          {onSelectRound && (
            <div className="pt-1">
              <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                Jump to Round:
              </span>
              <div className="flex gap-1.5 flex-wrap">
                {Array.from({ length: Math.min(settings.qualifierTarget, 8) }).map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => {
                      onSelectRound(i + 1);
                      onClose();
                    }}
                    className={`w-7 h-7 rounded-lg text-xs font-bold border transition ${
                      currentRound === i + 1
                        ? 'bg-blue-500 border-blue-300 text-white font-black'
                        : 'bg-blue-950/40 border-blue-800 text-gray-400 hover:text-white'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 4. AUDIO & MUSIC CONTROLS */}
        <div className="mt-5 pt-4 border-t border-blue-500/20">
          <label className="text-xs font-black uppercase tracking-wider text-blue-300 block mb-2">
            Audio & Music
          </label>
          <div className="space-y-2">
            <button
              onClick={onToggleMusic}
              className={`w-full py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-between border transition ${
                isMusicOn
                  ? 'bg-blue-950/80 border-blue-500 text-blue-200 shadow-[0_0_10px_rgba(59,130,246,0.3)]'
                  : 'bg-gray-900 border-gray-700 text-gray-400'
              }`}
            >
              <span className="flex items-center gap-2">
                <Music className="w-4 h-4 text-blue-400" />
                <span>Background Beat / Music</span>
              </span>
              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${isMusicOn ? 'bg-blue-600 text-white' : 'bg-black/50 text-gray-400'}`}>
                {isMusicOn ? 'ON' : 'MUTED'}
              </span>
            </button>

            <button
              onClick={onToggleSound}
              className={`w-full py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-between border transition ${
                isSoundOn
                  ? 'bg-indigo-950/80 border-indigo-500 text-indigo-200 shadow-[0_0_10px_rgba(99,102,241,0.3)]'
                  : 'bg-gray-900 border-gray-700 text-gray-400'
              }`}
            >
              <span className="flex items-center gap-2">
                {isSoundOn ? (
                  <Volume2 className="w-4 h-4 text-indigo-400" />
                ) : (
                  <VolumeX className="w-4 h-4 text-gray-500" />
                )}
                <span>Sound FX & Fanfare</span>
              </span>
              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${isSoundOn ? 'bg-indigo-600 text-white' : 'bg-black/50 text-gray-400'}`}>
                {isSoundOn ? 'ON' : 'MUTED'}
              </span>
            </button>
          </div>
        </div>

        {/* 5. VIEW MODE SWITCHER */}
        <div className="mt-5 pt-4 border-t border-blue-500/20">
          <label className="text-xs font-black uppercase tracking-wider text-blue-300 block mb-2">
            Layout View
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onChangeViewMode('mobile')}
              className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border transition ${
                viewMode === 'mobile'
                  ? 'bg-blue-600 border-blue-400 text-white shadow-md'
                  : 'bg-blue-950/40 border-blue-900/50 text-blue-300/70 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>9:16 Shorts</span>
            </button>
            <button
              onClick={() => onChangeViewMode('desktop')}
              className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border transition ${
                viewMode === 'desktop'
                  ? 'bg-blue-600 border-blue-400 text-white shadow-md'
                  : 'bg-blue-950/40 border-blue-900/50 text-blue-300/70 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Studio Desk</span>
            </button>
          </div>
        </div>

        {/* 6. ARENA PHYSICS TUNING */}
        <div className="mt-5 pt-4 border-t border-blue-500/20 space-y-3">
          <label className="text-xs font-black uppercase tracking-wider text-blue-300 block">
            Arena Ring Settings
          </label>

          <div>
            <div className="flex justify-between text-xs font-medium text-gray-300 mb-1">
              <span>Ring Gap Opening:</span>
              <span className="text-amber-400 font-bold">{settings.gapDegrees}°</span>
            </div>
            <input
              type="range"
              min="30"
              max="70"
              value={settings.gapDegrees}
              onChange={(e) => onUpdateSettings({ gapDegrees: Number(e.target.value) })}
              className="w-full accent-blue-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-gray-300 mb-1">
              <span>Ring Rotation Speed:</span>
              <span className="text-amber-400 font-bold">
                {Math.round(settings.ringSpeed * 1000)}
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="35"
              value={Math.round(settings.ringSpeed * 1000)}
              onChange={(e) => onUpdateSettings({ ringSpeed: Number(e.target.value) / 1000 })}
              className="w-full accent-blue-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-gray-300 mb-1">
              <span>Initial Flags Count:</span>
              <span className="text-blue-400 font-bold">{settings.flagCount}</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              step="5"
              value={settings.flagCount}
              onChange={(e) => onUpdateSettings({ flagCount: Number(e.target.value) })}
              className="w-full accent-blue-500"
            />
          </div>
        </div>

        {/* PROMO BANNER SETTINGS */}
        <div className="mt-5 pt-4 border-t border-blue-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-blue-300">
              <svg className="w-3.5 h-3.5 fill-red-500" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"/>
              </svg>
              <span>Subscribe Banner</span>
            </div>
            {/* Toggle promo on/off */}
            <button
              onClick={() => onUpdateSettings({ promoEnabled: !settings.promoEnabled })}
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border transition ${
                settings.promoEnabled
                  ? 'bg-emerald-600 border-emerald-400 text-white'
                  : 'bg-gray-800 border-gray-600 text-gray-400'
              }`}
            >
              {settings.promoEnabled ? 'ENABLED' : 'DISABLED'}
            </button>
          </div>

          {/* Channel Name */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
              Channel Name
            </label>
            <input
              type="text"
              value={settings.promoName}
              onChange={(e) => onUpdateSettings({ promoName: e.target.value })}
              placeholder="e.g. EpicSann"
              className="w-full bg-blue-950/60 text-white px-3 py-2 rounded-xl border border-blue-500/40 text-xs font-semibold focus:outline-none focus:border-blue-400 placeholder-gray-500"
            />
          </div>

          {/* Channel Handle */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
              Channel Handle / Tagline
            </label>
            <input
              type="text"
              value={settings.promoHandle}
              onChange={(e) => onUpdateSettings({ promoHandle: e.target.value })}
              placeholder="e.g. @FlagsBattleOfficial"
              className="w-full bg-blue-950/60 text-white px-3 py-2 rounded-xl border border-blue-500/40 text-xs font-semibold focus:outline-none focus:border-blue-400 placeholder-gray-500"
            />
          </div>

          {/* Live Preview */}
          {settings.promoEnabled && (
            <div className="flex items-center gap-2 p-1.5 pl-2 pr-3 rounded-full bg-blue-950/80 border border-blue-500/40 w-fit text-xs">
              <div className="flex items-center gap-1 bg-red-600 px-2 py-0.5 rounded-full text-[9px] font-black uppercase text-white">
                <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"/>
                </svg>
                SUBSCRIBE
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-[10px] font-bold text-amber-300">@{settings.promoName || '...'}</span>
                <span className="text-[9px] text-blue-300/60">{settings.promoHandle || '...'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Logout */}
        <div className="mt-6 pt-4 border-t border-blue-500/20">
          <button
            onClick={onLogout}
            className="w-full py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-red-950/60 hover:bg-red-900/80 border border-red-500/40 text-red-200 flex items-center justify-center gap-2 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out Admin</span>
          </button>
        </div>
      </div>
    </div>
  );
}
