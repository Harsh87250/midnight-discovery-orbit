import { useRef, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { createFileRoute } from '@tanstack/react-router';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChapterHeading, SafeImage, UniverseShell } from '@/components/universe-shell';
import { ScrollReveal } from '@/components/universe-magic';
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
 const [zoom,setZoom] = useState(false);
 const lastTrigger = useRef<HTMLButtonElement | null>(null);
 const touchStart = useRef<number | null>(null);
 const reduced = useReducedMotion();
 const activePicture = active === null ? undefined : pictures[active];
 function move(direction: number) { setZoom(false); setActive(v => v === null ? null : (v + direction + pictures.length) % pictures.length); }
 return <UniverseShell><div className="chapter-content"><ChapterHeading number="LITTLE PIECES" title="A Beautiful Little World" subtitle="The kind of beautiful that asks for nothing, except a moment of your time." /><div className="gallery-grid">{pictures.map((p,i) => <ScrollReveal key={p.title} delay={(i % 3) * .09}><Button variant="ghost" className="gallery-item" onClick={e=>{lastTrigger.current=e.currentTarget;setZoom(false);setActive(i);}} aria-label={`Expand ${p.title}`}><div className="gallery-image-frame"><SafeImage src={p.src} alt={p.title} /></div><span>{p.emoji} {p.title}</span><small>{p.caption}</small></Button></ScrollReveal>)}</div></div>
 <Dialog.Root open={active !== null} onOpenChange={open=>{if(!open){setActive(null);setZoom(false);}}}>
 {activePicture && <Dialog.Portal><Dialog.Overlay className="gallery-overlay" /><Dialog.Content className="lightbox cinematic-lightbox" aria-describedby={undefined} onCloseAutoFocus={e=>{e.preventDefault();lastTrigger.current?.focus();}} onKeyDown={e=>{if(e.key==='ArrowRight'){e.preventDefault();move(1);}if(e.key==='ArrowLeft'){e.preventDefault();move(-1);}}}>
 <div className="lightbox-toolbar"><span className="lightbox-count">{(active ?? 0)+1} / {pictures.length}</span><Button variant="ghost" size="icon" aria-label={zoom?'Zoom out':'Zoom in'} title={zoom?'Zoom out':'Zoom in'} aria-pressed={zoom} onClick={()=>setZoom(!zoom)}>{zoom?<ZoomOut />:<ZoomIn />}</Button><Dialog.Close asChild><Button variant="ghost" size="icon" aria-label="Close photograph" title="Close photograph"><X /></Button></Dialog.Close></div>
 <Button variant="ghost" size="icon" className="lightbox-prev" aria-label="Previous photograph" title="Previous photograph" onClick={()=>move(-1)}><ChevronLeft /></Button>
 <figure onTouchStart={e=>{touchStart.current=e.touches[0]?.clientX ?? null;}} onTouchEnd={e=>{const end=e.changedTouches[0]?.clientX;if(!zoom && end !== undefined && touchStart.current !== null && Math.abs(end-touchStart.current)>50)move(end<touchStart.current?1:-1);touchStart.current=null;}}>
 <div className={`lightbox-image-stage ${zoom?'is-zoomed':''}`}><AnimatePresence mode="wait"><motion.div key={activePicture.src} className="lightbox-image" initial={reduced?false:{opacity:0,scale:.96}} animate={{opacity:1,scale:zoom?1.65:1}} exit={{opacity:0,scale:.96}} transition={{duration:reduced?0:.35}}><SafeImage src={activePicture.src} alt={activePicture.title} eager /></motion.div></AnimatePresence></div>
 <figcaption><Dialog.Title>{activePicture.emoji} {activePicture.title}</Dialog.Title><small>{activePicture.caption}</small></figcaption></figure>
 <Button variant="ghost" size="icon" className="lightbox-next" aria-label="Next photograph" title="Next photograph" onClick={()=>move(1)}><ChevronRight /></Button>
 </Dialog.Content></Dialog.Portal>}
 </Dialog.Root></UniverseShell>;
}
