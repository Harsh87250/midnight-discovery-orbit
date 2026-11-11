import { useEffect, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChapterHeading, SafeImage, UniverseShell } from '@/components/universe-shell';
import { pageHead } from '@/lib/universe-content';
import sky from '@/assets/midnight-universe.jpg';
import galaxy from '@/assets/galaxy.asset.json';
import ocean from '@/assets/moonlit-ocean.jpg';
import flowers from '@/assets/moonlit-flowers.jpg';
import night from '@/assets/night-sky.asset.json';
import landscape from '@/assets/peaceful-night.jpg';
import reading from '@/assets/reading.asset.json';
import momos from '@/assets/momos.asset.json';
const pictures = [
 {src:sky,title:'A little crescent magic',emoji:'🌙',caption:'THE QUIET OF THE SKY'},
 {src:galaxy.url,title:'A universe of possibility',emoji:'🌌',caption:'SOMEWHERE, FAR AWAY'},
 {src:ocean,title:'Where the moon meets the sea',emoji:'💙',caption:'A MOMENT OF STILLNESS'},
 {src:flowers,title:'Even flowers dream',emoji:'🌷',caption:'BLOOMING IN THE MOONLIGHT'},
 {src:night.url,title:'A sky full of wishes',emoji:'🌠',caption:'A THOUSAND TINY LIGHTS'},
 {src:landscape,title:'A peaceful little somewhere',emoji:'☁️',caption:'LET THE WORLD BE QUIET'},
 {src:reading.url,title:'Between beautiful pages',emoji:'📚',caption:'STORIES WAITING TO BE FOUND'},
 {src:momos.url,title:'Little bites of happiness',emoji:'🥟',caption:'SOME JOYS ARE SIMPLE'},
];
export const Route = createFileRoute('/gallery')({ head: () => pageHead('Little Pieces of a Beautiful World', 'Moonlight, stars, flowers, books, and little bites of happiness: a midnight photographic collection.'), component: Gallery });
function Gallery() {
 const [active,setActive] = useState<number | null>(null);
 const activePicture = active === null ? undefined : pictures[active];
 useEffect(() => {
  if(active === null)return;
  const before = document.body.style.overflow;document.body.style.overflow='hidden';
  function key(e:KeyboardEvent){if(e.key==='Escape')setActive(null);if(e.key==='ArrowRight')setActive(v=>v===null?null:(v+1)%pictures.length);if(e.key==='ArrowLeft')setActive(v=>v===null?null:(v+pictures.length-1)%pictures.length);}
  window.addEventListener('keydown',key);return()=>{window.removeEventListener('keydown',key);document.body.style.overflow=before;};
 },[active]);
 return <UniverseShell><div className="chapter-content"><ChapterHeading number="LITTLE PIECES" title="A Beautiful Little World" subtitle="The kind of beautiful that asks for nothing, except a moment of your time." /><div className="gallery-grid">{pictures.map((p,i) => <Button key={p.title} variant="ghost" className="gallery-item" onClick={()=>setActive(i)} aria-label={`Expand ${p.title}`}><SafeImage src={p.src} alt={p.title} /><span>{p.emoji} {p.title}</span><small>{p.caption}</small></Button>)}</div></div><AnimatePresence>{active!==null && activePicture && <motion.div className="lightbox" role="dialog" aria-modal="true" aria-label={activePicture.title} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setActive(null)}><Button variant="ghost" size="icon" className="lightbox-close" aria-label="Close photograph" autoFocus onClick={()=>setActive(null)}><X /></Button><Button variant="ghost" size="icon" aria-label="Previous photograph" onClick={e=>{e.stopPropagation();setActive((active+pictures.length-1)%pictures.length);}}><ChevronLeft /></Button><figure onClick={e=>e.stopPropagation()}><SafeImage src={activePicture.src} alt={activePicture.title} eager /><figcaption>{activePicture.emoji} {activePicture.title}</figcaption></figure><Button variant="ghost" size="icon" aria-label="Next photograph" onClick={e=>{e.stopPropagation();setActive((active+1)%pictures.length);}}><ChevronRight /></Button></motion.div>}</AnimatePresence></UniverseShell>;
}