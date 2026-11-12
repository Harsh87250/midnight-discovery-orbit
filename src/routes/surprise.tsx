import { useState } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChapterHeading, UniverseShell, SafeImage } from '@/components/universe-shell';
import { pageHead } from '@/lib/universe-content';
import sky from '@/assets/midnight-universe.jpg';
import road from '@/assets/night-road.asset.json';
import momos from '@/assets/momos.asset.json';
import galaxy from '@/assets/galaxy.asset.json';
const wishes = [
 {title:'A Sky Full of Stars',symbol:'🌌',image:sky,message:'Some nights are made for simply looking up.'},
 {title:'A Peaceful Midnight Drive',symbol:'🚗',image:road.url,message:'Sometimes, the journey is more beautiful than the destination.'},
 {title:'A Plate of Delicious Momos',symbol:'🥟',image:momos.url,message:'Some happiness comes in little bites.'},
 {title:'A World Filled With Music',symbol:'🎧',image:galaxy.url,message:'Some feelings are easier to hear than explain.'},
];
export const Route = createFileRoute('/surprise')({ head: () => pageHead('The Midnight Surprise', 'A sky of stars, a peaceful drive, momos, or music. A little choice for a magical night.'), component: Surprise });
function Surprise() { const reduced = useReducedMotion(); const [selected,setSelected] = useState<number | null>(null); const selectedWish = selected === null ? undefined : wishes[selected]; return <UniverseShell><div className="chapter-content"><ChapterHeading number="06" title="The Midnight Surprise" subtitle="If tonight could be anything, what would you choose?" /><div className="surprise-grid">{wishes.map((wish,i) => <Button key={wish.title} variant="ghost" className={`surprise-card ${selected === i ? 'selected' : ''}`} onClick={() => setSelected(i)} aria-pressed={selected === i}><SafeImage src={wish.image} alt={wish.title} /><span>{wish.symbol}<br />{wish.title}</span></Button>)}</div><div className="surprise-result" aria-live="polite"><AnimatePresence mode="wait">{selectedWish && <motion.div className="thought" key={selected} initial={reduced ? false : { opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}><motion.span animate={reduced ? {} : { rotate: [0,20,-20,0] }} transition={{ duration: 2 }}>{selectedWish.symbol}</motion.span><blockquote>“{selectedWish.message}”</blockquote>{selected === 3 && <Button asChild variant="ghost"><Link to="/music">To the music room <ArrowRight /></Link></Button>}</motion.div>}</AnimatePresence></div><div className="text-center"><Button asChild variant="cosmic"><Link to="/reveal"><Sparkles /> ONE LAST LITTLE THING <ArrowRight /></Link></Button></div></div></UniverseShell>; }