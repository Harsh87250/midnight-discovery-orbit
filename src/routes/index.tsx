import { useState } from 'react';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { ArrowDown, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { UniverseShell } from '@/components/universe-shell';
import { Button } from '@/components/ui/button';
import { chapters, pageHead } from '@/lib/universe-content';

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
      <span className="eyebrow">A LITTLE UNIVERSE. A LITTLE MAGIC.</span>
      <h1>Somewhere Between<br /><em>Dreams & Stars</em></h1>
      <p className="subtitle">“Not every beautiful story needs a name.”</p>
      <p className="supporting">A little universe is waiting...</p>
      <Button variant="cosmic" onClick={enter} disabled={entering}><Sparkles size={14} /> ENTER THE UNKNOWN <ArrowRight size={14} /></Button>
      <p className="opening-note">no rush. just a little wonder.</p>
      <span className="orbit-decoration" aria-hidden="true">✧</span><span className="orbit-decoration right" aria-hidden="true">✦</span>
      <div className="opening-divider"><span>SOMETHING BEAUTIFUL LIES AHEAD</span><ArrowDown strokeWidth={1} /></div>
    </section>
    <section className="preview-discoveries"><h2 className="preview-title">Six little worlds. One beautiful universe.</h2><p className="preview-subtitle">A few things to discover, a few reasons to smile.</p><div className="preview-grid">{chapters.map(c => <Link to={c.path} key={c.path} className="preview-item"><span className="preview-symbol">{c.symbol}</span><span>{c.label}</span></Link>)}</div></section>
    <p className="bottom-whisper"><span>✧</span> Not every beautiful thing needs an explanation. <span>✧</span></p>
    <AnimatePresence>{entering && <motion.div className="enter-warp" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><motion.span animate={reduced ? {} : { scale: [1, 8, 35], opacity: [0, 1, 0] }} transition={{ duration: 1.1 }}>✧</motion.span></motion.div>}</AnimatePresence>
  </UniverseShell>;
}
