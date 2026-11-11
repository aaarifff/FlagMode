'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Swords, Lock, User, Sparkles, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Invalid credentials');
      } else {
        router.push('/battle');
        router.refresh();
      }
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4 bg-[#030612] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-950/40 via-[#030612] to-black">
      <div className="w-full max-w-md glow-card rounded-2xl p-8 border border-blue-500/40 shadow-2xl relative overflow-hidden">
        {/* Neon corner accent */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -translate-x-12 -translate-y-12 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl translate-x-12 translate-y-12 pointer-events-none" />

        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30 mb-4 border border-blue-400/30">
            <Swords className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black tracking-wider uppercase text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-blue-300">
            100-Country Flags Battle
          </h1>
          <p className="text-sm text-blue-300/70 mt-1 font-medium">
            Sign in to start live arena simulation
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-950/70 border border-red-500/50 text-red-200 text-sm text-center font-medium animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-blue-300/90 uppercase tracking-wider mb-2">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400/60" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full bg-[#070e24] text-white pl-10 pr-4 py-3 rounded-xl border border-blue-500/30 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 outline-none transition text-sm font-medium"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-blue-300/90 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400/60" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="123"
                className="w-full bg-[#070e24] text-white pl-10 pr-4 py-3 rounded-xl border border-blue-500/30 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 outline-none transition text-sm font-medium"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl font-bold text-sm uppercase tracking-wider bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-600/30 border border-blue-400/40 flex items-center justify-center gap-2 transition active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing In...
              </span>
            ) : (
              <>
                <span>Enter Arena</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-blue-500/20 flex flex-col items-center gap-3">
          <div className="text-xs text-blue-300/60 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Default demo credentials:</span>
            <span className="font-mono text-blue-200 bg-blue-950/60 px-1.5 py-0.5 rounded border border-blue-800">
              admin / 123
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              setUsername('admin');
              setPassword('123');
            }}
            className="text-xs text-blue-400 hover:text-blue-300 underline underline-offset-4 cursor-pointer"
          >
            Auto-fill credentials
          </button>
        </div>
      </div>
    </div>
  );
}

