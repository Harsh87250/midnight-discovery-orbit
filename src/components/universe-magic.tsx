import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { compliments } from '@/lib/universe-content';

export function ScrollReveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={reduced ? false : { opacity: 0, y: 24, filter: 'blur(5px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }} viewport={{ once: true, amount: .12 }} transition={{ duration: .9, delay: reduced ? 0 : delay, ease: 'easeOut' }}>{children}</motion.div>;
}

const BUTTERFLY_SVG = <svg viewBox="0 0 60 44" aria-hidden="true"><g className="butterfly-wing left-wing"><path d="M30 23C19 0 2-3 5 12C2 22 13 29 25 27C6 24 7 43 19 39C25 37 29 30 30 23Z" /><path className="wing-veins" d="M29 23 9 9m20 14L8 20m21 3L16 35" /><path className="wing-speckles" d="m9 10 2 1m-3 7 2 1m5 14 2-1" /></g><g className="butterfly-wing right-wing"><path d="M30 23C41 0 58-3 55 12C58 22 47 29 35 27C54 24 53 43 41 39C35 37 31 30 30 23Z" /><path className="wing-veins" d="M31 23 51 9m-20 14 21-3m-21 3 13 12" /><path className="wing-speckles" d="m51 10-2 1m3 7-2 1m-5 14-2-1" /></g><path className="butterfly-body" d="M30 14v22m0-18-5-8m5 8 5-8" /></svg>;

const BUTTERFLY_COLORS = ['#cabcf2', '#8fb9ff', '#86e2f4', '#e6c9f4', '#b28cf0', '#f2bcda', '#79a9ff', '#d8e7fa', '#a68cef', '#8fd7ee', '#dfbaf0'];
const MAX_BUTTERFLIES = BUTTERFLY_COLORS.length;

interface TrailParticle { x: number; y: number; vx: number; vy: number; life: number; decay: number; size: number; color: string }

interface Flyer {
  el: HTMLSpanElement;
  x: number; y: number; angle: number; speed: number;
  cruise: number; depth: number; color: string; filter: string;
  halfW: number; halfH: number;
  tx: number; ty: number;
  bobPhase: number; bobFreq: number; bobAmp: number; turn: number;
  hoverUntil: number; retargetAt: number; spiralUntil: number; spiralDir: number; fleeUntil: number; trailAt: number;
  landed: boolean; startledClass: boolean;
}

export function ButterflyFlight({ celebrating = false }: { celebrating?: boolean }) {
  const reduced = useReducedMotion();
  const layerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const celebratingRef = useRef(celebrating);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { celebratingRef.current = celebrating; }, [celebrating]);
  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (reduced || typeof requestAnimationFrame !== 'function') return;
    const layer = layerRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!layer || !canvas || !context) return;

    const rand = (min: number, max: number) => min + Math.random() * (max - min);
    const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
    const wrap = (angle: number) => { while (angle > Math.PI) angle -= Math.PI * 2; while (angle < -Math.PI) angle += Math.PI * 2; return angle; };
    const width = () => window.innerWidth;
    const height = () => window.innerHeight;

    const particles: TrailParticle[] = [];
    const spawnParticle = (x: number, y: number, color: string, burst = 0) => {
      if (particles.length > 150) return;
      particles.push({
        x, y, color,
        vx: rand(-12, 12) + (burst ? rand(-48, 48) : 0),
        vy: rand(-10, 10) + (burst ? rand(-50, 18) : 0),
        life: 1,
        decay: burst ? rand(1.1, 1.7) : rand(.65, 1.05),
        size: burst ? rand(1.4, 3) : rand(.8, 1.8),
      });
    };

    const pointer = { x: -9999, y: -9999, active: false };
    const onPointerMove = (event: PointerEvent) => { pointer.x = event.clientX; pointer.y = event.clientY; pointer.active = true; };
    const onPointerLeave = () => { pointer.active = false; };

    const count = width() < 700 ? 5 : MAX_BUTTERFLIES;
    const els = Array.from(layer.querySelectorAll<HTMLSpanElement>('.magic-butterfly'));
    const flyers: Flyer[] = [];
    els.forEach((el, i) => {
      el.style.display = i < count ? '' : 'none';
      if (i >= count) return;
      const depth = rand(0, 1);
      const size = 24 + depth * 28;
      el.style.width = `${Math.round(size)}px`;
      el.style.height = `${Math.round(size * .75)}px`;
      el.style.filter = `drop-shadow(0 0 ${2 + depth * 5}px ${BUTTERFLY_COLORS[i]})${depth < .4 ? ` blur(${((.4 - depth) * 2.4).toFixed(2)}px)` : ''}`;
      el.classList.toggle('bf-soft', depth < .35);
      const flyer: Flyer = {
        el,
        x: rand(60, width() - 60), y: rand(120, height() - 160),
        angle: rand(0, Math.PI * 2), speed: rand(10, 24),
        cruise: rand(24, 44) * (.7 + depth * .6), depth, color: BUTTERFLY_COLORS[i],
        filter: '', halfW: size / 2, halfH: size * .375,
        tx: 0, ty: 0,
        bobPhase: rand(0, Math.PI * 2), bobFreq: rand(1.2, 2.4), bobAmp: rand(6, 16),
        turn: rand(1.2, 2.2),
        hoverUntil: 0, retargetAt: 0, spiralUntil: 0, spiralDir: 1, fleeUntil: 0, trailAt: 0,
        landed: false, startledClass: false,
      };
      flyers.push(flyer);
    });

    const pickTarget = (f: Flyer, t: number, initial = false) => {
      const w = width(), h = height();
      const flowers = initial ? [] : Array.from(layer.querySelectorAll('.garden-flower'));
      let hovered = false;
      if (flowers.length && Math.random() < .35) {
        const rect = flowers[Math.floor(Math.random() * flowers.length)].getBoundingClientRect();
        if (rect.top > 60 && rect.bottom < h - 40 && rect.left > 0 && rect.right < w) {
          f.tx = rect.left + rect.width / 2;
          f.ty = rect.top + 18;
          f.hoverUntil = t + rand(2.2, 4.5);
          hovered = true;
        }
      }
      if (!hovered) {
        f.hoverUntil = 0;
        if (!initial && Math.random() < .14) {
          f.tx = Math.random() < .5 ? -70 : w + 70;
          f.ty = rand(80, h - 160);
        } else {
          f.tx = rand(50, w - 50);
          f.ty = rand(90, h - 150);
        }
      }
      f.retargetAt = t + rand(7, 15);
      if (!initial && Math.random() < .22) { f.spiralUntil = t + rand(.8, 1.6); f.spiralDir = Math.random() < .5 ? -1 : 1; }
    };

    const update = (f: Flyer, dt: number, t: number) => {
      const w = width(), h = height();
      let desired = Math.atan2(f.ty - f.y, f.tx - f.x);
      const dx = f.x - pointer.x, dy = f.y - pointer.y;
      const startled = pointer.active && dx * dx + dy * dy < 140 * 140;
      if (startled) desired = Math.atan2(dy, dx);
      const diff = wrap(desired - f.angle);
      const maxTurn = f.turn * (startled ? 2.6 : 1) * dt;
      f.angle = wrap(f.angle + clamp(diff, -maxTurn, maxTurn));
      if (t < f.spiralUntil) f.angle = wrap(f.angle + f.spiralDir * dt * 2.2);
      const targetSpeed = f.cruise * (startled ? 2 : 1) * (t < f.fleeUntil ? 2.6 : 1) * (t < f.hoverUntil ? .18 : 1);
      f.speed += (targetSpeed - f.speed) * Math.min(1, dt * 2.5);
      f.x = clamp(f.x + Math.cos(f.angle) * f.speed * dt, -90, w + 90);
      f.y = clamp(f.y + Math.sin(f.angle) * f.speed * dt, -90, h + 90);
      const renderY = f.y + Math.sin(t * f.bobFreq + f.bobPhase) * f.bobAmp;

      const distX = f.tx - f.x, distY = f.ty - f.y;
      if (distX * distX + distY * distY < 32 * 32 && t >= f.hoverUntil) pickTarget(f, t);
      if (t > f.retargetAt) {
        pickTarget(f, t);
        spawnParticle(f.x, renderY, f.color, 1);
        spawnParticle(f.x, renderY, f.color, 1);
      }
      if (t > f.trailAt) {
        spawnParticle(f.x + rand(-6, 6), renderY + rand(-4, 4), f.color);
        const rate = celebratingRef.current ? .5 : 1;
        f.trailAt = t + rand(.16, .3) * rate * (startled ? .5 : 1);
      }

      const facing = Math.cos(f.angle) >= 0 ? 1 : -1;
      const bank = clamp(diff, -.6, .6) * -24;
      const rot = Math.sin(f.angle) * 14 + bank;
      const scale = .8 + f.depth * .45;
      const edge = Math.min(f.x + 70, w + 70 - f.x, renderY + 50, h + 50 - renderY);
      f.el.style.opacity = String((.4 + f.depth * .5) * clamp(edge / 120, 0, 1));
      f.el.style.transform = `translate3d(${f.x - f.halfW}px,${renderY - f.halfH}px,0) rotate(${rot.toFixed(2)}deg) scale(${(facing * scale).toFixed(3)},${scale.toFixed(3)})`;
      const landed = t < f.hoverUntil && f.speed < 14;
      if (landed !== f.landed) { f.landed = landed; f.el.classList.toggle('is-landed', landed); }
      if (startled !== f.startledClass) { f.startledClass = startled; f.el.classList.toggle('is-startled', startled); }
    };

    const drawParticles = (dt: number) => {
      context.clearRect(0, 0, layer.clientWidth, layer.clientHeight);
      context.globalCompositeOperation = 'lighter';
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= p.decay * dt;
        if (p.life <= 0) { particles.splice(i, 1); continue; }
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        context.globalAlpha = Math.min(1, p.life) * .8;
        context.fillStyle = p.color;
        context.beginPath();
        context.arc(p.x, p.y, p.size * (.5 + p.life * .5), 0, Math.PI * 2);
        context.fill();
      }
      context.globalAlpha = 1;
      context.globalCompositeOperation = 'source-over';
    };

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(layer.clientWidth * dpr));
      canvas.height = Math.max(1, Math.round(layer.clientHeight * dpr));
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resizeCanvas();

    const onClick = (event: MouseEvent) => {
      const t = performance.now() / 1000;
      for (const f of flyers) {
        const dx = event.clientX - f.x, dy = event.clientY - f.y;
        if (dx * dx + dy * dy < 48 * 48) {
          for (let k = 0; k < 12; k++) spawnParticle(f.x, f.y, f.color, 1);
          f.fleeUntil = t + 2.6;
          f.hoverUntil = 0;
          f.spiralUntil = 0;
          f.tx = f.x < width() / 2 ? width() - 40 : 40;
          f.ty = rand(60, height() - 160);
          f.retargetAt = t + rand(4, 7);
          break;
        }
      }
    };

    flyers.forEach(f => pickTarget(f, performance.now() / 1000, true));
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('pointerleave', onPointerLeave);
    document.addEventListener('click', onClick);

    let rafId = 0;
    let last = performance.now();
    const frame = (now: number) => {
      const dt = Math.min(.05, (now - last) / 1000);
      last = now;
      const t = now / 1000;
      if (!document.hidden) {
        for (const f of flyers) update(f, dt, t);
        drawParticles(dt);
      }
      rafId = requestAnimationFrame(frame);
    };
    rafId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerleave', onPointerLeave);
      document.removeEventListener('click', onClick);
    };
  }, [reduced]);
  if (reduced || !mounted) return null;
  return <div ref={layerRef} className={`butterfly-flight-layer ${celebrating ? 'is-celebrating' : ''}`} aria-hidden="true">
    <canvas ref={canvasRef} className="butterfly-trail-canvas" />
    {Array.from({ length: MAX_BUTTERFLIES }, (_, i) => <span key={i} className={`magic-butterfly butterfly-${i % 5}`} style={{ color: BUTTERFLY_COLORS[i] }}>{BUTTERFLY_SVG}</span>)}
  </div>;
}

export function MagicAtmosphere({ celebration = false }: { celebration?: boolean }) {
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1800], [0, -100]);
  return <><div className={`magic-atmosphere ${celebration ? 'is-celebrating' : ''}`} aria-hidden="true">
    <motion.div className="distant-stars" style={reduced ? { y: 0 } : { y }} />
    <div className="near-stars" />
    <div className="sky-aurora" />
    <div className="moonlight-rays" />
    <div className="floating-particles">{Array.from({ length: 10 }, (_, i) => <i key={i} className={`particle particle-${i}`} />)}</div>
    <div className="drifting-petals">{Array.from({ length: 8 }, (_, i) => <i key={i} className={`drift-petal drift-petal-${i}`} />)}</div>
    {celebration && <div className="petal-shower">{Array.from({ length: 12 }, (_, i) => <i key={i} className={`petal petal-${i}`} />)}</div>}
  </div></>;
}

export function CursorStardust() {
  const reduced = useReducedMotion();
  const x = useMotionValue(-100), y = useMotionValue(-100);
  const smoothX = useSpring(x, { stiffness: 90, damping: 24 });
  const smoothY = useSpring(y, { stiffness: 90, damping: 24 });
  useEffect(() => {
    if (reduced || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const move = (event: PointerEvent) => { x.set(event.clientX); y.set(event.clientY); };
    const hide = () => { x.set(-100); y.set(-100); };
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', hide);
    return () => { window.removeEventListener('pointermove', move); document.removeEventListener('pointerleave', hide); };
  }, [reduced, x, y]);
  return <motion.span className="cursor-stardust" style={{ x: smoothX, y: smoothY }} aria-hidden="true">✧</motion.span>;
}

export function MoonlitGarden() {
  const [bloom, setBloom] = useState<number | null>(null);
  const reduced = useReducedMotion();
  return <ScrollReveal className="moonlit-garden"><div className="garden-petals" aria-hidden="true">{[0,1,2,3].map(i => <i key={i} className={`garden-petal garden-petal-${i}`} />)}</div><div className="garden-flowers">{[0, 1, 2].map(i => <Button key={i} variant="ghost" className={`garden-flower flower-${i} ${bloom === i ? 'bloomed' : ''}`} aria-label={`Bloom flower ${i + 1}`} aria-expanded={bloom === i} onClick={() => setBloom(bloom === i ? null : i)}>
    <svg viewBox="0 0 120 170" aria-hidden="true"><path className="flower-stem" d="M60 165Q45 110 60 60M56 120Q15 90 26 122Q40 138 56 133M57 107Q96 76 90 106Q81 122 57 120" /><g className="flower-head">{[0, 60, 120, 180, 240, 300].map(angle => <ellipse className="flower-petal" key={angle} cx="60" cy="43" rx="12" ry="24" transform={`rotate(${angle} 60 65)`} />)}<circle className="flower-center" cx="60" cy="65" r="10" /></g></svg>
  </Button>)}</div><div className="garden-message" aria-live="polite"><AnimatePresence mode="wait">{bloom !== null && <motion.blockquote key={bloom} initial={reduced ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: .5 }}>“{compliments[bloom]}”</motion.blockquote>}</AnimatePresence></div></ScrollReveal>;
}