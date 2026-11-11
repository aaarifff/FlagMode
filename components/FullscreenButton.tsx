'use client';

import { useEffect, useState } from 'react';
import { Maximize, Minimize } from 'lucide-react';

export function FullscreenButton({ iconOnly = false }: { iconOnly?: boolean }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [supported, setSupported] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setSupported(Boolean(document.fullscreenEnabled));
    const syncFullscreen = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
      setError('');
    };
    syncFullscreen();
    document.addEventListener('fullscreenchange', syncFullscreen);
    return () => document.removeEventListener('fullscreenchange', syncFullscreen);
  }, []);

  async function toggleFullscreen() {
    setPending(true);
    setError('');
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      setError('Unable to change full screen. Please try again.');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={toggleFullscreen}
        disabled={!supported || pending}
        aria-pressed={isFullscreen}
        aria-label={isFullscreen ? 'Exit full screen' : 'Enter full screen'}
        title={supported ? (isFullscreen ? 'Exit full screen (Esc)' : 'Enter full screen') : 'Full screen is not supported in this browser'}
        className={`flex items-center justify-center text-blue-200 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition ${iconOnly
          ? 'p-1.5 rounded-lg bg-blue-950/70 border border-blue-500/40 hover:bg-blue-900/80 active:scale-95'
          : 'gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold hover:bg-blue-600/60'}`}
      >
        {isFullscreen ? <Minimize size={14} aria-hidden="true" /> : <Maximize size={14} aria-hidden="true" />}
        {!iconOnly && (isFullscreen ? 'Exit Full Screen' : 'Full Screen')}
      </button>
      {error && (
        <p role="alert" className="absolute right-0 top-full mt-2 w-52 rounded-lg border border-red-400/40 bg-slate-950 p-2 text-xs text-red-200 shadow-lg">
          {error}
        </p>
      )}
    </div>
  );
}
