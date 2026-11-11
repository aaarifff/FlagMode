'use client';

import React, { useState } from 'react';
import { Trophy, Flame, Flag, Award, History } from 'lucide-react';
import { Country } from '@/lib/countries';

interface DesktopSidebarRightProps {
  remainingCount: number;
  eliminatedCount: number;
  lastEliminated: Country | null;
  round: number;
  totalRounds: number;
  qualified: Country[];
}

export function DesktopSidebarRight({
  remainingCount,
  eliminatedCount,
  lastEliminated,
  round,
  totalRounds,
  qualified,
}: DesktopSidebarRightProps) {
  const [activeTab, setActiveTab] = useState<'rounds' | 'performers'>('rounds');

  return (
    <aside className="w-72 bg-[#090f22] border-l border-blue-900/40 p-4 flex flex-col justify-between select-none overflow-y-auto text-white">
      <div className="space-y-4">
        {/* Top Stats Cards */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-blue-950/40 border border-blue-800/40 p-3 rounded-xl flex flex-col items-center">
            <span className="text-2xl font-black text-white">{remainingCount}</span>
            <span className="text-[10px] uppercase font-bold text-gray-400">Remaining</span>
          </div>

          <div className="bg-rose-950/30 border border-rose-800/40 p-3 rounded-xl flex flex-col items-center">
            <span className="text-2xl font-black text-rose-400">{eliminatedCount}</span>
            <span className="text-[10px] uppercase font-bold text-gray-400">Eliminated</span>
          </div>
        </div>

        {/* Last Eliminated Tag */}
        {lastEliminated && (
          <div className="bg-blue-950/30 border border-blue-900/40 px-3 py-2 rounded-xl flex items-center justify-between text-xs">
            <span className="text-gray-400 font-medium">Last:</span>
            <div className="flex items-center gap-1.5 font-bold text-amber-300">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={lastEliminated.flagUrl}
                alt=""
                className="w-4 h-3 rounded-[2px] object-cover"
              />
              <span>{lastEliminated.name}</span>
            </div>
          </div>
        )}

        {/* Round Status */}
        <div className="flex items-center justify-between pt-2 border-t border-blue-950">
          <div className="font-black text-sm">
            Round <span className="text-amber-400">{round}</span>
            <span className="text-gray-500 text-xs font-normal"> / {totalRounds}</span>
          </div>
          <span className="text-xs text-blue-300 font-semibold">{remainingCount} flags</span>
        </div>

        {/* Scoreboard Tabs */}
        <div>
          <div className="grid grid-cols-2 gap-1 bg-blue-950/60 p-1 rounded-xl mb-3 border border-blue-900/40">
            <button
              onClick={() => setActiveTab('rounds')}
              className={`py-1.5 text-[11px] font-bold rounded-lg transition ${
                activeTab === 'rounds' ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              Round scores
            </button>
            <button
              onClick={() => setActiveTab('performers')}
              className={`py-1.5 text-[11px] font-bold rounded-lg transition ${
                activeTab === 'performers' ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              Top performers
            </button>
          </div>

          <div className="space-y-1.5">
            {qualified.length === 0 ? (
              <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-900/20 text-center text-xs text-gray-500 italic">
                Qualifiers will appear here as rounds finish...
              </div>
            ) : (
              qualified.map((c, idx) => (
                <div
                  key={c.code}
                  className="flex items-center justify-between px-3 py-2 rounded-xl bg-blue-950/40 border border-blue-900/40 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-amber-400 w-4">{idx + 1}</span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={c.flagUrl} alt="" className="w-5 h-3.5 rounded-[2px] object-cover" />
                    <span className="font-bold text-white">{c.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
                    {idx === 0 && (
                      <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* All time summary */}
        <div className="pt-3 border-t border-blue-950">
          <span className="text-[10px] uppercase font-bold text-gray-400 block mb-2">All time</span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-blue-950/20 p-2 rounded-lg border border-blue-900/20">
              <span className="font-black text-amber-400">{round - 1}</span>
              <span className="text-gray-400 text-[10px] block">Rounds completed</span>
            </div>
            <div className="bg-blue-950/20 p-2 rounded-lg border border-blue-900/20">
              <span className="font-black text-rose-400">{eliminatedCount}</span>
              <span className="text-gray-400 text-[10px] block">Total Eliminations</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-blue-950 text-xs text-blue-300">
        <span className="flex items-center gap-1 font-bold">
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span>Qualifiers: {qualified.length} / 5</span>
        </span>
      </div>
    </aside>
  );
}

