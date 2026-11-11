'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { COUNTRIES, Country } from '@/lib/countries';
import { BattlePhysicsEngine } from '@/lib/engine';
import { audio } from '@/lib/audio';

import { Header } from '@/components/Header';
import { FullscreenButton } from '@/components/FullscreenButton';
import { Leaderboard } from '@/components/Leaderboard';
import { ArenaCanvas } from '@/components/ArenaCanvas';
import { ProgressBar } from '@/components/ProgressBar';
import { PromoBanner } from '@/components/PromoBanner';
import { FooterButton } from '@/components/FooterButton';
import { RoundIntro } from '@/components/RoundIntro';
import { WinnerOverlay } from '@/components/WinnerOverlay';
import { MenuDrawer } from '@/components/MenuDrawer';
import { DesktopSidebarLeft } from '@/components/DesktopSidebarLeft';
import { DesktopSidebarRight } from '@/components/DesktopSidebarRight';

export default function BattlePage() {
  const router = useRouter();

  // Settings State (now includes title)
  const [settings, setSettings] = useState({
    title: '100-Country Flags Battle',
    durationMin: 30,
    flagCount: 100,
    qualifierTarget: 5,
    gapDegrees: 48,
    ringSpeed: 0.016,
    sound: true,
    music: true,
    promoName: 'Bright Arif',
    promoHandle: '@BrightArif',
    promoEnabled: true,
  });

  // Battle State
  const [status, setStatus] = useState<'idle' | 'intro' | 'running' | 'winner' | 'paused' | 'finished'>('idle');
  const [round, setRound] = useState(1);
  const [secondsLeft, setSecondsLeft] = useState(30 * 60);
  const [battleId, setBattleId] = useState<string>('');
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('mobile');
  const [autoMode, setAutoMode] = useState(true);
  const [chaosMode, setChaosMode] = useState(false);

  // Audio Toggles
  const [isMusicOn, setIsMusicOn] = useState(true);
  const [isSoundOn, setIsSoundOn] = useState(true);

  // Flags & Round data
  const [allFlags] = useState<Country[]>(COUNTRIES);
  const [remainingFlags, setRemainingFlags] = useState<Country[]>(COUNTRIES);
  const [qualified, setQualified] = useState<Country[]>([]);
  const [lastEliminated, setLastEliminated] = useState<Country | null>(null);
  const [roundWinner, setRoundWinner] = useState<Country | null>(null);
  const [currentInsideCount, setCurrentInsideCount] = useState<number>(100);
  const [totalRoundFlags, setTotalRoundFlags] = useState<number>(100);

  // UI state
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [promoVisible, setPromoVisible] = useState(true);

  // Physics Engine Instance
  const engine = useMemo(() => new BattlePhysicsEngine(), []);

  // Initialize tournament on mount
  useEffect(() => {
    setBattleId(`battle_${Date.now()}`);
    engine.preloadImages(COUNTRIES);

    engine.onBounce = () => { if (audio) audio.playBounce(); };
    engine.onEliminated = (country) => {
      setLastEliminated(country);
      if (audio) audio.playElimination();
    };

    // Load settings from API
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.durationMin) {
          setSettings((prev) => ({
            ...prev,
            title: data.title || '100-Country Flags Battle',
            durationMin: Number(data.durationMin) || 30,
            flagCount: Number(data.flagCount) || 100,
            qualifierTarget: Number(data.qualifierTarget) || 5,
            gapDegrees: Number(data.gapDegrees) || 48,
            ringSpeed: Number(data.ringSpeed) || 0.016,
            promoName: data.promoName || 'EpicSann',
            promoHandle: data.promoHandle || '@FlagsBattleOfficial',
          }));
          setSecondsLeft((Number(data.durationMin) || 30) * 60);
        }
      })
      .catch(() => { });
  }, [engine]);

  // Promo banner pulse every ~28s
  useEffect(() => {
    const interval = setInterval(() => {
      setPromoVisible(true);
      setTimeout(() => setPromoVisible(false), 5000);
    }, 28000);
    return () => clearInterval(interval);
  }, []);

  // Session timer countdown
  useEffect(() => {
    if (status !== 'running' && status !== 'intro' && status !== 'winner') return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) { setStatus('finished'); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [status]);

  // Sync physics config when settings change
  useEffect(() => {
    engine.config.gapDegrees = settings.gapDegrees;
    engine.config.ringRotationSpeed = settings.ringSpeed;
  }, [settings, engine]);

  // Sync inside count for progress bar
  useEffect(() => {
    const interval = setInterval(() => {
      if (status === 'running') {
        setCurrentInsideCount(engine.getRemainingInside().length);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [status, engine]);

  // --- HELPER: update a setting and persist to DB ---
  const updateSettings = (newVals: Partial<typeof settings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newVals };
      // If duration changed and game is idle/finished, reset timer
      if (newVals.durationMin !== undefined && (status === 'idle' || status === 'finished' || status === 'paused')) {
        setSecondsLeft(newVals.durationMin * 60);
      }
      return updated;
    });
    fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newVals),
    }).catch(() => { });
  };

  // Start a round
  const startRound = (roundNum: number, flagsToUse: Country[]) => {
    setRound(roundNum);
    setRoundWinner(null);
    setTotalRoundFlags(flagsToUse.length);
    setCurrentInsideCount(flagsToUse.length);

    const width = viewMode === 'mobile' ? 360 : 540;
    const height = viewMode === 'mobile' ? 440 : 520;
    const trayY = viewMode === 'mobile' ? 370 : 450;

    engine.config.ringCenterX = width / 2;
    engine.config.ringCenterY = viewMode === 'mobile' ? 180 : 220;
    engine.config.ringRadius = viewMode === 'mobile' ? 145 : 185;

    engine.initRound(flagsToUse, width, height);
    setStatus('intro');
    if (audio && isSoundOn) audio.playStart();
    setTimeout(() => {
      setStatus('running');
      if (isMusicOn && audio && !audio.isMusicPlaying) audio.startMusic();
    }, 2400);
  };

  const handleStartTournament = () => {
    if (status === 'paused') {
      setStatus('running');
      if (isMusicOn && audio) audio.startMusic();
      return;
    }
    const available = allFlags.slice(0, settings.flagCount);
    setRemainingFlags(available);
    setQualified([]);
    setLastEliminated(null);
    setSecondsLeft(settings.durationMin * 60);
    startRound(1, available);
  };

  const handleTogglePlay = () => {
    if (status === 'running') {
      setStatus('paused');
      if (audio) audio.stopMusic();
    } else if (status === 'paused') {
      setStatus('running');
      if (isMusicOn && audio) audio.startMusic();
    } else {
      handleStartTournament();
    }
  };

  const handleRestart = () => {
    if (audio) audio.stopMusic();
    setBattleId(`battle_${Date.now()}`);
    setQualified([]);
    setRoundWinner(null);
    setLastEliminated(null);
    setSecondsLeft(settings.durationMin * 60);
    const available = allFlags.slice(0, settings.flagCount);
    setRemainingFlags(available);
    startRound(1, available);
  };

  // Jump to a specific round (preserving qualified list at that point)
  const handleSelectRound = (roundNum: number) => {
    if (roundNum <= qualified.length || roundNum > settings.qualifierTarget) return;
    if (audio) audio.stopMusic();
    const pool = allFlags.filter((c) => !qualified.some((q) => q.code === c.code));
    setRemainingFlags(pool);
    startRound(roundNum, pool);
  };

  const handleRoundWin = async (winner: Country) => {
    setStatus('winner');
    setRoundWinner(winner);
    if (audio) audio.playWinnerFanfare();

    try {
      await fetch('/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ battleId, round, winnerCode: winner.code }),
      });
    } catch { }

    const updatedQualified = [...qualified, winner];
    setQualified(updatedQualified);
    const updatedRemaining = remainingFlags.filter((c) => c.code !== winner.code);
    setRemainingFlags(updatedRemaining);

    setTimeout(() => {
      if (updatedQualified.length >= settings.qualifierTarget || updatedRemaining.length <= 1) {
        setStatus('finished');
      } else if (autoMode) {
        startRound(round + 1, updatedRemaining);
      } else {
        setStatus('paused');
      }
    }, 4200);
  };

  const handleToggleMusic = () => {
    const next = !isMusicOn;
    setIsMusicOn(next);
    if (audio) audio.setMusicEnabled(next);
  };

  const handleToggleSound = () => {
    const next = !isSoundOn;
    setIsSoundOn(next);
    if (audio) audio.setSoundEnabled(next);
  };

  const handleLogout = async () => {
    if (audio) audio.stopMusic();
    await fetch('/api/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  const canvasWidth = viewMode === 'mobile' ? 360 : 540;
  const canvasHeight = viewMode === 'mobile' ? 440 : 520;
  const trayY = viewMode === 'mobile' ? 370 : 450;

  return (
    <div className="w-full min-h-screen bg-[#030612] flex items-center justify-center relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-950/20 via-[#030612] to-black pointer-events-none" />

      {/* View mode toggle pill (top right, desktop only) */}
      <div className="fixed top-2 right-4 z-40 hidden md:flex items-center gap-1 bg-blue-950/80 border border-blue-500/40 rounded-full p-1 backdrop-blur-md shadow-lg">
        <button
          onClick={() => setViewMode('mobile')}
          className={`px-2.5 py-1 rounded-full text-xs font-bold transition ${viewMode === 'mobile' ? 'bg-blue-600 text-white shadow' : 'text-blue-300 hover:text-white'}`}
        >
          📱 9:16 Shorts
        </button>
        <button
          onClick={() => setViewMode('desktop')}
          className={`px-2.5 py-1 rounded-full text-xs font-bold transition ${viewMode === 'desktop' ? 'bg-blue-600 text-white shadow' : 'text-blue-300 hover:text-white'}`}
        >
          🖥️ Studio Desk
        </button>
        <FullscreenButton />
      </div>

      {/* ───── MOBILE 9:16 VIEW ───── */}
      {viewMode === 'mobile' && (
        <div className="relative w-full max-w-[390px] h-[844px] max-h-screen flex flex-col justify-between bg-[#040817] border border-blue-500/30 shadow-[0_0_50px_rgba(30,58,138,0.4)] rounded-2xl overflow-hidden my-auto">
          <Header
            title={settings.title}
            round={round}
            totalRounds={settings.qualifierTarget}
            secondsLeft={secondsLeft}
            status={status === 'finished' ? 'FINAL' : 'QUALIFYING'}
            isMusicOn={isMusicOn}
            isSoundOn={isSoundOn}
            onToggleMusic={handleToggleMusic}
            onToggleSound={handleToggleSound}
            onOpenMenu={() => setIsMenuOpen(true)}
            onOpenDurationPicker={() => setIsMenuOpen(true)}
          />

          <Leaderboard
            qualified={qualified}
            targetSlots={settings.qualifierTarget}
            totalFlags={settings.flagCount}
          />

          <div className="relative flex-1 flex items-center justify-center my-auto">
            <ArenaCanvas
              engine={engine}
              isRunning={status === 'running'}
              onRoundWin={handleRoundWin}
              width={canvasWidth}
              height={canvasHeight}
              trayY={trayY}
            />

            {status === 'intro' && <RoundIntro round={round} flagCount={totalRoundFlags} mode="CLASSIC" />}
            {status === 'winner' && roundWinner && <WinnerOverlay winner={roundWinner} round={round} />}

            {status === 'idle' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                <button
                  onClick={handleStartTournament}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-black text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(251,191,36,0.8)] border border-amber-300 hover:scale-105 active:scale-95 transition"
                >
                  ▶ Start Battle
                </button>
              </div>
            )}

            {status === 'finished' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-[3px]">
                <div className="text-2xl font-black text-amber-400 mb-2 uppercase tracking-widest">TIME UP!</div>
                <div className="text-sm text-blue-200 mb-4">Tournament Complete</div>
                <button
                  onClick={handleRestart}
                  className="px-6 py-2.5 rounded-full bg-blue-600 text-white font-black text-sm uppercase tracking-wider border border-blue-400 hover:bg-blue-500 transition"
                >
                  ↺ Restart
                </button>
              </div>
            )}
          </div>

          <ProgressBar currentInside={currentInsideCount} totalRoundFlags={totalRoundFlags} />

          {settings.promoEnabled && (
            <PromoBanner name={settings.promoName} handle={settings.promoHandle} visible={promoVisible} />
          )}

          <FooterButton durationMin={settings.durationMin} onClick={() => setIsMenuOpen(true)} />
        </div>
      )}

      {/* ───── DESKTOP STUDIO VIEW ───── */}
      {viewMode === 'desktop' && (
        <div className="w-full h-screen flex justify-between bg-[#05091a] text-white overflow-hidden">
          <DesktopSidebarLeft
            title={settings.title}
            onUpdateTitle={(t) => updateSettings({ title: t })}
            isRunning={status === 'running'}
            onTogglePlay={handleTogglePlay}
            onReset={handleRestart}
            flagCount={settings.flagCount}
            onUpdateFlagCount={(val) => updateSettings({ flagCount: val })}
            durationMin={settings.durationMin}
            onUpdateDuration={(mins) => updateSettings({ durationMin: mins })}
            qualifierTarget={settings.qualifierTarget}
            onUpdateQualifierTarget={(r) => updateSettings({ qualifierTarget: r })}
            isMusicOn={isMusicOn}
            isSoundOn={isSoundOn}
            onToggleMusic={handleToggleMusic}
            onToggleSound={handleToggleSound}
            autoMode={autoMode}
            onToggleAutoMode={() => setAutoMode(!autoMode)}
            chaosMode={chaosMode}
            onToggleChaosMode={() => setChaosMode(!chaosMode)}
          />

          <main className="flex-1 flex flex-col items-center justify-between p-4 relative">
            {/* Desktop header bar */}
            <div className="w-full flex items-center justify-between px-6 pt-2">
              <div className="flex items-center gap-3">
                <span className="text-xl font-black tracking-wider uppercase text-white drop-shadow-[0_0_12px_rgba(59,130,246,0.6)]">
                  {settings.title}
                </span>
                <span className="px-3 py-0.5 rounded-full bg-blue-600/30 border border-blue-400/40 text-blue-300 text-xs font-black uppercase">
                  Round {round} / {settings.qualifierTarget}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="glow-pill-amber px-3 py-1 rounded-full text-xs font-black text-amber-300">
                  ⏱ {Math.floor(secondsLeft / 60)}:{(secondsLeft % 60).toString().padStart(2, '0')}
                </div>
                <div className="glow-pill-green px-3 py-1 rounded-full text-xs font-black text-emerald-300">
                  {status === 'finished' ? 'FINAL' : 'QUALIFYING'}
                </div>
              </div>
            </div>

            {/* Arena canvas */}
            <div className="relative flex-1 flex items-center justify-center w-full">
              <ArenaCanvas
                engine={engine}
                isRunning={status === 'running'}
                onRoundWin={handleRoundWin}
                width={canvasWidth}
                height={canvasHeight}
                trayY={trayY}
              />

              {status === 'intro' && <RoundIntro round={round} flagCount={totalRoundFlags} mode="CLASSIC" />}
              {status === 'winner' && roundWinner && <WinnerOverlay winner={roundWinner} round={round} />}

              {status === 'idle' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                  <button
                    onClick={handleStartTournament}
                    className="px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-black text-base uppercase tracking-wider shadow-[0_0_30px_rgba(251,191,36,0.8)] border border-amber-300 hover:scale-105 active:scale-95 transition"
                  >
                    ▶ Start Match
                  </button>
                </div>
              )}

              {/* Top Winners floating card */}
              {qualified.length > 0 && (
                <div className="absolute bottom-6 right-6 p-3 rounded-xl bg-blue-950/80 border border-blue-500/30 shadow-xl backdrop-blur-md w-52 text-xs">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block mb-1.5">
                    Top Qualifiers
                  </span>
                  {qualified.slice(0, 3).map((w, i) => (
                    <div key={w.code} className="flex items-center justify-between py-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-amber-300">{i + 1}.</span>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={w.flagUrl} alt="" className="w-3.5 h-2.5 rounded-[1px] object-cover" />
                        <span className="font-semibold text-white">{w.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="w-full max-w-xl flex flex-col items-center pb-2">
              <ProgressBar currentInside={currentInsideCount} totalRoundFlags={totalRoundFlags} />
              {settings.promoEnabled && (
                <div className="mt-1">
                  <PromoBanner name={settings.promoName} handle={settings.promoHandle} visible={promoVisible} />
                </div>
              )}
            </div>
          </main>

          <DesktopSidebarRight
            remainingCount={currentInsideCount}
            eliminatedCount={totalRoundFlags - currentInsideCount}
            lastEliminated={lastEliminated}
            round={round}
            totalRounds={settings.qualifierTarget}
            qualified={qualified}
          />
        </div>
      )}

      {/* Menu / Settings Drawer */}
      <MenuDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        isRunning={status === 'running'}
        onTogglePlay={handleTogglePlay}
        onRestart={handleRestart}
        isMusicOn={isMusicOn}
        isSoundOn={isSoundOn}
        onToggleMusic={handleToggleMusic}
        onToggleSound={handleToggleSound}
        viewMode={viewMode}
        onChangeViewMode={(mode) => setViewMode(mode)}
        currentRound={round}
        onSelectRound={handleSelectRound}
        settings={settings}
        onUpdateSettings={updateSettings}
        onLogout={handleLogout}
      />
    </div>
  );
}
