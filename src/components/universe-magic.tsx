import { useEffect, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { compliments } from '@/lib/universe-content';

export function ScrollReveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={reduced ? false : { opacity: 0, y: 24, filter: 'blur(5px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }} viewport={{ once: true, amount: .12 }} transition={{ duration: .9, ease: 'easeOut' }}>{children}</motion.div>;
}

export function Butterfly({ index }: { index: number }) {
  return <span className={`magic-butterfly butterfly-${index}`}><svg viewBox="0 0 60 44" aria-hidden="true"><g className="butterfly-wing left-wing"><path d="M30 23C7-8 0 2 7 22c-9 16 10 27 23 1Z" /></g><g className="butterfly-wing right-wing"><path d="M30 23C53-8 60 2 53 22c9 16-10 27-23 1Z" /></g><path className="butterfly-body" d="M30 14v22m0-18-5-8m5 8 5-8" /></svg></span>;
}

export function MagicAtmosphere({ celebration = false }: { celebration?: boolean }) {
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1800], [0, -100]);
  return <div className={`magic-atmosphere ${celebration ? 'is-celebrating' : ''}`} aria-hidden="true">
    <motion.div className="distant-stars" style={reduced ? { y: 0 } : { y }} />
    <div className="near-stars" />
    <div className="sky-aurora" />
    <div className="floating-particles">{Array.from({ length: 10 }, (_, i) => <i key={i} className={`particle particle-${i}`} />)}</div>
    {[0, 1, 2].map(i => <Butterfly key={i} index={i} />)}
    {celebration && <div className="petal-shower">{Array.from({ length: 12 }, (_, i) => <i key={i} className={`petal petal-${i}`} />)}</div>}
  </div>;
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
  return <ScrollReveal className="moonlit-garden"><div className="garden-flowers">{[0, 1, 2].map(i => <Button key={i} variant="ghost" className={`garden-flower flower-${i} ${bloom === i ? 'bloomed' : ''}`} aria-label={`Bloom flower ${i + 1}`} aria-expanded={bloom === i} onClick={() => setBloom(bloom === i ? null : i)}>
    <svg viewBox="0 0 120 170" aria-hidden="true"><path className="flower-stem" d="M60 165Q45 110 60 60M56 120Q15 90 26 122Q40 138 56 133M57 107Q96 76 90 106Q81 122 57 120" /><g className="flower-head">{[0, 60, 120, 180, 240, 300].map(angle => <ellipse className="flower-petal" key={angle} cx="60" cy="43" rx="12" ry="24" transform={`rotate(${angle} 60 65)`} />)}<circle className="flower-center" cx="60" cy="65" r="10" /></g></svg>
  </Button>)}</div><div className="garden-message" aria-live="polite"><AnimatePresence mode="wait">{bloom !== null && <motion.blockquote key={bloom} initial={reduced ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: .5 }}>“{compliments[bloom]}”</motion.blockquote>}</AnimatePresence></div></ScrollReveal>;
}