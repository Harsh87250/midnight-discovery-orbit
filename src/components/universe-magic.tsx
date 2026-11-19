import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { compliments } from '@/lib/universe-content';

export function ScrollReveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={reduced ? false : { opacity: 0, y: 24, filter: 'blur(5px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }} viewport={{ once: true, amount: .12 }} transition={{ duration: .9, delay: reduced ? 0 : delay, ease: 'easeOut' }}>{children}</motion.div>;
}

export function Butterfly({ index }: { index: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const element = ref.current;
    if (!element || reduced || typeof element.animate !== 'function' || (window.innerWidth < 600 && index > 2)) return;
    let stopped = false;
    let animation: Animation | undefined;
    let x = window.innerWidth * (.15 + index * .16), y = window.innerHeight * (.2 + index * .13);
    let scale = .7;
    const random = (min: number, max: number) => min + Math.random() * (max - min);
    const transform = (px: number, py: number, size: number, angle: number) => `translate3d(${px}px,${py}px,0) rotate(${angle}deg) scale(${size})`;
    const fly = async () => {
      while (!stopped) {
        const width = window.innerWidth, height = window.innerHeight;
        const flowers = Array.from(document.querySelectorAll('.garden-flower')).map(f => f.getBoundingClientRect()).filter(r => r.top > 40 && r.bottom < height);
        const flower = flowers.length && Math.random() < .4 ? flowers[Math.floor(Math.random() * flowers.length)] : undefined;
        const nextX = flower ? flower.left + flower.width / 2 - 20 : random(12, Math.max(20, width - 65));
        const nextY = flower ? flower.top + 28 : random(90, Math.max(100, height - 100));
        const nextScale = flower ? .65 : random(.5, index === 0 ? 1.3 : .95);
        const turn = nextX > x ? -12 : 12;
        element.classList.remove('is-landed');
        animation = element.animate([
          { transform: transform(x, y, scale, 0), opacity: .75 },
          { transform: transform(x + (nextX - x) * .25, y + (nextY - y) * .2 - 35, (scale + nextScale) / 2, turn) },
          { transform: transform(x + (nextX - x) * .55, y + (nextY - y) * .6 + 24, nextScale, -turn / 2) },
          { transform: transform(nextX - 14, nextY - 12, nextScale, turn / 2) },
          { transform: transform(nextX, nextY, nextScale, 0), opacity: .8 },
        ], { duration: random(6500, 11000) + index * 650, easing: 'ease-in-out', fill: 'forwards' });
        try { await animation.finished; } catch { return; }
        if (stopped) return;
        x = nextX; y = nextY; scale = nextScale;
        element.classList.toggle('is-landed', Boolean(flower));
        animation = element.animate([
          { transform: transform(x, y, scale, 0) },
          { transform: transform(x + (flower ? 0 : 9), y - (flower ? 0 : 12), scale, flower ? 0 : 4) },
          { transform: transform(x, y, scale, 0) },
        ], { duration: flower ? random(2400, 4000) : random(900, 1800), fill: 'forwards', easing: 'ease-in-out' });
        try { await animation.finished; } catch { return; }
      }
    };
    const visibility = () => { if (document.hidden) animation?.pause(); else animation?.play(); };
    document.addEventListener('visibilitychange', visibility);
    void fly();
    return () => { stopped = true; animation?.cancel(); document.removeEventListener('visibilitychange', visibility); };
  }, [index, reduced]);
  return <span ref={ref} className={`magic-butterfly butterfly-${index}`}><span className="butterfly-hover"><svg viewBox="0 0 60 44" aria-hidden="true"><g className="butterfly-wing left-wing"><path d="M30 23C19 0 2-3 5 12C2 22 13 29 25 27C6 24 7 43 19 39C25 37 29 30 30 23Z" /><path className="wing-veins" d="M29 23 9 9m20 14L8 20m21 3L16 35" /><path className="wing-speckles" d="m9 10 2 1m-3 7 2 1m5 14 2-1" /></g><g className="butterfly-wing right-wing"><path d="M30 23C41 0 58-3 55 12C58 22 47 29 35 27C54 24 53 43 41 39C35 37 31 30 30 23Z" /><path className="wing-veins" d="M31 23 51 9m-20 14 21-3m-21 3 13 12" /><path className="wing-speckles" d="m51 10-2 1m3 7-2 1m-5 14-2-1" /></g><path className="butterfly-body" d="M30 14v22m0-18-5-8m5 8 5-8" /></svg></span></span>;
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
    {celebration && <div className="petal-shower">{Array.from({ length: 12 }, (_, i) => <i key={i} className={`petal petal-${i}`} />)}</div>}
  </div><div className="butterfly-flight-layer" aria-hidden="true">{[0, 1, 2, 3, 4].map(i => <Butterfly key={i} index={i} />)}</div></>;
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