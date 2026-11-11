import { Country } from './countries';

export interface FlagBody {
  id: string;
  country: Country;
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  vRot: number;
  width: number;
  height: number;
  state: 'inside' | 'escaping' | 'tray';
  trayTargetX?: number;
  trayTargetY?: number;
  image?: HTMLImageElement;
}

export interface EngineConfig {
  ringRadius: number;
  ringCenterX: number;
  ringCenterY: number;
  gapDegrees: number;
  ringRotationSpeed: number;
  gravity: number;
  bounceRestitution: number;
  gapAngle: number;
}

export class BattlePhysicsEngine {
  public flags: FlagBody[] = [];
  public config: EngineConfig;
  public eliminatedCount: number = 0;
  public lastEliminationTime: number = Date.now();
  public onEliminated?: (country: Country) => void;
  public onBounce?: () => void;

  private imageCache: Map<string, HTMLImageElement> = new Map();

  constructor(config: Partial<EngineConfig> = {}) {
    this.config = {
      ringRadius: 175,
      ringCenterX: 225,
      ringCenterY: 380,
      gapDegrees: 48,
      ringRotationSpeed: 0.016,
      gravity: 0.35,
      bounceRestitution: 0.88,
      gapAngle: 0,
      ...config,
    };
  }

  public preloadImages(countries: Country[]) {
    if (typeof window === 'undefined') return;
    for (const c of countries) {
      if (!this.imageCache.has(c.code)) {
        const img = new Image();
        img.src = c.flagUrl;
        this.imageCache.set(c.code, img);
      }
    }
  }

  public initRound(countries: Country[], width: number, height: number) {
    this.flags = [];
    this.eliminatedCount = 0;
    this.lastEliminationTime = Date.now();
    this.config.gapAngle = 0;

    const cx = this.config.ringCenterX;
    const cy = this.config.ringCenterY;
    const rMax = this.config.ringRadius * 0.75;

    // Distribute flags randomly within ring
    for (const country of countries) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.sqrt(Math.random()) * rMax;
      const x = cx + Math.cos(angle) * dist;
      const y = cy + Math.sin(angle) * dist;

      const speed = 1.2 + Math.random() * 2.2;
      const vAngle = Math.random() * Math.PI * 2;

      let img = this.imageCache.get(country.code);
      if (!img && typeof window !== 'undefined') {
        img = new Image();
        img.src = country.flagUrl;
        this.imageCache.set(country.code, img);
      }

      this.flags.push({
        id: country.code,
        country,
        x,
        y,
        vx: Math.cos(vAngle) * speed,
        vy: Math.sin(vAngle) * speed,
        angle: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.08,
        width: 32,
        height: 22,
        state: 'inside',
        image: img,
      });
    }
  }

  public update(canvasWidth: number, canvasHeight: number, trayY: number) {
    const { ringCenterX: cx, ringCenterY: cy, ringRadius: R } = this.config;

    // Rotate ring
    this.config.gapAngle = (this.config.gapAngle + this.config.ringRotationSpeed) % (Math.PI * 2);

    // Dynamic stalemate guard: widen gap or nudge if quiet for > 6 seconds
    const timeSinceElim = Date.now() - this.lastEliminationTime;
    let effectiveGap = (this.config.gapDegrees * Math.PI) / 180;
    if (timeSinceElim > 6000) {
      effectiveGap *= 1.4; // Widen gap to end duels smoothly
    }

    const gapHalf = effectiveGap / 2;
    const gapCenter = this.config.gapAngle;

    const insideFlags = this.flags.filter((f) => f.state === 'inside');

    // Update flags
    for (let i = 0; i < this.flags.length; i++) {
      const f = this.flags[i];

      if (f.state === 'inside') {
        // Light agitation/speed maintenance so they don't stop
        const currentSpeed = Math.hypot(f.vx, f.vy);
        if (currentSpeed < 1.0) {
          f.vx *= 1.2;
          f.vy *= 1.2;
        } else if (currentSpeed > 5.0) {
          f.vx *= 0.95;
          f.vy *= 0.95;
        }

        // Slight drift toward gap when dueling with <= 3 flags
        if (insideFlags.length <= 3) {
          const toGapAngle = gapCenter;
          const targetX = cx + Math.cos(toGapAngle) * (R * 0.9);
          const targetY = cy + Math.sin(toGapAngle) * (R * 0.9);
          f.vx += (targetX - f.x) * 0.001;
          f.vy += (targetY - f.y) * 0.001;
        }

        f.x += f.vx;
        f.y += f.vy;
        f.angle += f.vRot;

        // Check distance to ring center
        const dx = f.x - cx;
        const dy = f.y - cy;
        const dist = Math.hypot(dx, dy);

        // Radius threshold for touching ring wall
        const effectiveRadius = R - 14;

        if (dist >= effectiveRadius) {
          // Angle of flag relative to ring center
          let angleFromCenter = Math.atan2(dy, dx);
          if (angleFromCenter < 0) angleFromCenter += Math.PI * 2;

          // Compute angular distance to gap center
          let angleDiff = Math.abs(angleFromCenter - gapCenter);
          if (angleDiff > Math.PI) angleDiff = Math.PI * 2 - angleDiff;

          if (angleDiff < gapHalf) {
            // FALL THROUGH THE GAP! Flag eliminated!
            f.state = 'escaping';
            this.eliminatedCount++;
            this.lastEliminationTime = Date.now();

            // Give outward push through gap
            const pushSpeed = 2.5 + Math.random() * 2;
            f.vx = Math.cos(angleFromCenter) * pushSpeed;
            f.vy = Math.sin(angleFromCenter) * pushSpeed + 1.0;
            f.vRot = (Math.random() - 0.5) * 0.2;

            if (this.onEliminated) {
              this.onEliminated(f.country);
            }
          } else {
            // Bounce off the wall
            const normalX = -dx / dist;
            const normalY = -dy / dist;

            // Dot product (velocity • normal)
            const dot = f.vx * normalX + f.vy * normalY;

            // Reflect velocity if moving towards wall
            if (dot < 0) {
              f.vx = (f.vx - 2 * dot * normalX) * this.config.bounceRestitution;
              f.vy = (f.vy - 2 * dot * normalY) * this.config.bounceRestitution;

              // Spin impulse from tangential bounce
              f.vRot = (Math.random() - 0.5) * 0.12;

              // Reposition inside boundary
              f.x = cx - normalX * (effectiveRadius - 1);
              f.y = cy - normalY * (effectiveRadius - 1);

              if (this.onBounce && Math.random() < 0.2) {
                this.onBounce();
              }
            }
          }
        }
      } else if (f.state === 'escaping') {
        // Gravity applies as it tumbles down
        f.vy += this.config.gravity;
        f.x += f.vx;
        f.y += f.vy;
        f.angle += f.vRot;

        // Bounce off canvas side walls
        if (f.x < 16) {
          f.x = 16;
          f.vx = Math.abs(f.vx) * 0.7;
        } else if (f.x > canvasWidth - 16) {
          f.x = canvasWidth - 16;
          f.vx = -Math.abs(f.vx) * 0.7;
        }

        // When reaching bottom tray area
        if (f.y >= trayY) {
          f.state = 'tray';
          // Stack neatly in bottom eliminated tray grid
          const trayIndex = this.eliminatedCount - 1;
          const cols = Math.max(12, Math.floor(canvasWidth / 26));
          const col = trayIndex % cols;
          const row = Math.floor(trayIndex / cols);

          f.trayTargetX = 14 + col * 25;
          f.trayTargetY = trayY + 12 + row * 18;
          f.x = f.trayTargetX;
          f.y = f.trayTargetY;
          f.vx = 0;
          f.vy = 0;
          f.vRot = 0;
          f.angle = 0;
          f.width = 23;
          f.height = 15;
        }
      }
    }

    // Flag-to-flag collision inside ring
    for (let i = 0; i < insideFlags.length; i++) {
      for (let j = i + 1; j < insideFlags.length; j++) {
        const a = insideFlags[i];
        const b = insideFlags[j];

        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.hypot(dx, dy);
        const minDist = 22; // Flag collision radius

        if (dist < minDist && dist > 0) {
          const nx = dx / dist;
          const ny = dy / dist;

          const kx = a.vx - b.vx;
          const ky = a.vy - b.vy;
          const p = 2 * (nx * kx + ny * ky) / 2;

          a.vx -= p * nx * 0.8;
          a.vy -= p * ny * 0.8;
          b.vx += p * nx * 0.8;
          b.vy += p * ny * 0.8;

          // Separate them slightly
          const overlap = 0.5 * (minDist - dist);
          a.x -= overlap * nx;
          a.y -= overlap * ny;
          b.x += overlap * nx;
          b.y += overlap * ny;
        }
      }
    }
  }

  public getRemainingInside(): FlagBody[] {
    return this.flags.filter((f) => f.state === 'inside');
  }

  public getEliminated(): FlagBody[] {
    return this.flags.filter((f) => f.state !== 'inside');
  }
}

