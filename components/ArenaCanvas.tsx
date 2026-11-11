'use client';

import React, { useEffect, useRef } from 'react';
import { BattlePhysicsEngine, FlagBody } from '@/lib/engine';
import { Country } from '@/lib/countries';

interface ArenaCanvasProps {
  engine: BattlePhysicsEngine;
  isRunning: boolean;
  onRoundWin: (winner: Country) => void;
  width?: number;
  height?: number;
  trayY?: number;
}

export function ArenaCanvas({
  engine,
  isRunning,
  onRoundWin,
  width = 360,
  height = 420,
  trayY = 360,
}: ArenaCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const winTriggeredRef = useRef<boolean>(false);

  useEffect(() => {
    winTriggeredRef.current = false;
  }, [engine.flags]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Support Retina displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    let lastTime = performance.now();

    const render = (time: number) => {
      // Step physics if running
      if (isRunning) {
        engine.update(width, height, trayY);

        // Check if only 1 flag remains inside
        const inside = engine.getRemainingInside();
        if (inside.length === 1 && !winTriggeredRef.current) {
          winTriggeredRef.current = true;
          onRoundWin(inside[0].country);
        }
      }

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      const cx = engine.config.ringCenterX;
      const cy = engine.config.ringCenterY;
      const r = engine.config.ringRadius;

      // Draw faint radial space glow behind arena ring
      const bgGrad = ctx.createRadialGradient(cx, cy, 20, cx, cy, r * 1.2);
      bgGrad.addColorStop(0, 'rgba(59, 130, 246, 0.08)');
      bgGrad.addColorStop(0.8, 'rgba(30, 58, 138, 0.04)');
      bgGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = bgGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.3, 0, Math.PI * 2);
      ctx.fill();

      // Draw rotating ring with gap
      const gapHalf = (engine.config.gapDegrees * Math.PI) / 180 / 2;
      const gapCenter = engine.config.gapAngle;

      const startAngle = gapCenter + gapHalf;
      const endAngle = gapCenter - gapHalf + Math.PI * 2;

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, startAngle, endAngle);

      // Neon Ring Outer Glow
      ctx.lineWidth = 7.5;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#ffffff';
      ctx.shadowColor = '#60a5fa';
      ctx.shadowBlur = 18;
      ctx.stroke();

      // Additional bright core stroke
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#f8fafc';
      ctx.shadowBlur = 6;
      ctx.shadowColor = '#ffffff';
      ctx.stroke();
      ctx.restore();

      // Draw flags
      for (const f of engine.flags) {
        ctx.save();
        ctx.translate(f.x, f.y);
        ctx.rotate(f.angle);

        const w = f.width;
        const h = f.height;

        if (f.image && f.image.complete && f.image.naturalWidth > 0) {
          // Draw flag border / shadow
          ctx.shadowColor = f.state === 'inside' ? 'rgba(0,0,0,0.5)' : 'rgba(239, 68, 68, 0.4)';
          ctx.shadowBlur = 4;

          // Draw the country flag image
          ctx.drawImage(f.image, -w / 2, -h / 2, w, h);

          // Subtle clean border
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
          ctx.lineWidth = 1;
          ctx.strokeRect(-w / 2, -h / 2, w, h);
        } else {
          // Fallback colored rectangle with text
          ctx.fillStyle = '#3b82f6';
          ctx.fillRect(-w / 2, -h / 2, w, h);
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 8px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(f.country.code.toUpperCase(), 0, 0);
        }

        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [engine, isRunning, width, height, trayY, onRoundWin]);

  return (
    <div className="relative flex items-center justify-center w-full select-none">
      <canvas
        ref={canvasRef}
        style={{ width: `${width}px`, height: `${height}px` }}
        className="block"
      />
    </div>
  );
}

