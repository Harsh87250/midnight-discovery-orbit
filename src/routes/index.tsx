import { useState } from 'react';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { ArrowDown, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { UniverseShell } from '@/components/universe-shell';
import { Button } from '@/components/ui/button';
import { chapters, pageHead } from '@/lib/universe-content';
import { ScrollReveal } from '@/components/universe-magic';

export const Route = createFileRoute('/')({ head: () => pageHead('Somewhere Between Dreams & Stars', 'Not every beautiful story needs a name. A secret midnight universe is waiting.'), component: Index });

function Index() {
  const [entering, setEntering] = useState(false);
  const navigate = useNavigate();
  const reduced = useReducedMotion();
  async function enter() {
    setEntering(true);
    await new Promise(resolve => setTimeout(resolve, reduced ? 0 : 1100));
    await navigate({ to: '/universe' });
  }
  return <UniverseShell immersive>
    <section className="opening">
      <div className="opening-moon" aria-hidden="true"><span /></div>
      <motion.span className="eyebrow" initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .2, duration: 1 }}>A LITTLE UNIVERSE. A LITTLE MAGIC.</motion.span>
      <motion.h1 initial={reduced ? false : { opacity: 0, y: 20, filter: 'blur(8px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ delay: .45, duration: 1.5 }}>Somewhere Between<br /><em>Dreams & Stars</em></motion.h1>
      <motion.p className="subtitle" initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1.2 }}>“Not every beautiful story needs a name.”</motion.p>
      <motion.div initial={reduced ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3, duration: .9 }}><p className="supporting">A little universe is waiting...</p>
      <Button variant="cosmic" onClick={enter} disabled={entering}><Sparkles size={14} className={entering ? 'entry-spark' : ''} /> {entering ? 'OPENING THE UNIVERSE' : 'ENTER THE UNKNOWN'} <ArrowRight size={14} /></Button>
      <p className="opening-note">no rush. just a little wonder.</p></motion.div>
      <span className="orbit-decoration" aria-hidden="true">✧</span><span className="orbit-decoration right" aria-hidden="true">✦</span>
      <div className="opening-divider"><span>SOMETHING BEAUTIFUL LIES AHEAD</span><ArrowDown strokeWidth={1} /></div>
    </section>
    <section className="preview-discoveries"><ScrollReveal><h2 className="preview-title">Six little worlds. One beautiful universe.</h2><p className="preview-subtitle">A few things to discover, a few reasons to smile.</p><div className="preview-grid">{chapters.map(c => <Link to={c.path} key={c.path} className="preview-item"><span className="preview-symbol">{c.symbol}</span><span>{c.label}</span></Link>)}</div></ScrollReveal></section>
    <p className="bottom-whisper"><span>✧</span> Not every beautiful thing needs an explanation. <span>✧</span></p>
    <AnimatePresence>{entering && <motion.div className="enter-warp" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><motion.span animate={reduced ? {} : { scale: [1, 8, 35], opacity: [0, 1, 0] }} transition={{ duration: 1.1 }}>✧</motion.span></motion.div>}</AnimatePresence>
  </UniverseShell>;
}
