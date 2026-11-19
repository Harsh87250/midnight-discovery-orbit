import { useState, type ReactNode } from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { ArrowLeft, ArrowRight, AudioLines, Menu, Moon, Sparkles, X } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { chapters } from '@/lib/universe-content';
import sky from '@/assets/midnight-universe.jpg';
import { CursorStardust, MagicAtmosphere } from '@/components/universe-magic';

export function Starfield() {
  return <div className="starfield" aria-hidden="true">{Array.from({ length: 35 }, (_, i) => <i key={i} className={`star star-${i}`} />)}<span className="shooting-star" /></div>;
}

export function UniverseShell({ children, immersive = false }: { children: ReactNode; immersive?: boolean }) {
  const [menu, setMenu] = useState(false);
  const location = useLocation();
  const current = chapters.findIndex(c => c.path === location.pathname);
  const nextChapter = chapters[current + 1];
  const reduceMotion = useReducedMotion();
  return <div className={`universe-shell ${immersive ? 'immersive' : ''}`}>
    <div className="sky-background" aria-hidden="true"><img src={sky} alt="" width={1920} height={1088} /><div className="sky-shade" /></div>
    <Starfield /><MagicAtmosphere /><CursorStardust />
    <header className="site-header">
      <Link to="/" className="wordmark" aria-label="Somewhere Between Dreams and Stars home"><Moon size={22} strokeWidth={1.2} /><span>somewhere<span className="wordmark-sub">BETWEEN DREAMS & STARS</span></span></Link>
      <nav className="desktop-nav" aria-label="Main navigation"><Link to="/universe" activeProps={{ className: 'nav-active' }}>The universe</Link><Link to="/gallery" activeProps={{ className: 'nav-active' }}>Little pieces</Link><Link to="/letter" activeProps={{ className: 'nav-active' }}>A letter for you</Link></nav>
      <div className="header-tools"><Button asChild variant="ghost" size="icon" className="music-link"><Link to="/music" aria-label="Music for the Midnight" title="Music for the Midnight"><AudioLines size={19} /></Link></Button><span className="header-divider" /><span className="made-with">made of a little stardust <Sparkles size={13} /></span><Button variant="ghost" size="icon" className="mobile-menu" onClick={() => setMenu(!menu)} aria-label={menu ? 'Close navigation' : 'Open navigation'} aria-expanded={menu}>{menu ? <X /> : <Menu />}</Button></div>
    </header>
    {menu && <nav className="mobile-navigation" aria-label="Mobile navigation"><Link to="/universe" onClick={() => setMenu(false)}>The universe</Link><Link to="/gallery" onClick={() => setMenu(false)}>Little pieces</Link>{chapters.map(c => <Link key={c.path} to={c.path} onClick={() => setMenu(false)}>{c.symbol} {c.label}</Link>)}</nav>}
    <motion.main key={location.pathname} initial={reduceMotion ? false : { opacity: 0, y: 18, scale: .99, filter: 'blur(6px)' }} animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }} transition={{ duration: .9, ease: 'easeOut' }}>{children}</motion.main>
    <Button asChild variant="outline" size="icon" className="floating-music"><Link to="/music" aria-label="Visit midnight music" title="Visit midnight music"><AudioLines size={19} /></Link></Button>
    {!immersive && <footer className="chapter-footer"><Button asChild variant="ghost"><Link to="/universe"><ArrowLeft /> The universe</Link></Button><div className="chapter-progress" aria-label={current >= 0 ? `Chapter ${current + 1} of 6` : 'Explore the universe'}>{chapters.map((c,i) => <Link to={c.path} key={c.path} className={current === i ? 'progress-active' : ''} aria-label={c.label} title={c.label}><span /></Link>)}</div>{current >= 0 && nextChapter ? <Button asChild variant="ghost"><Link to={nextChapter.path}>Next discovery <ArrowRight /></Link></Button> : <Button asChild variant="ghost"><Link to="/reveal">One last little thing <Sparkles /></Link></Button>}</footer>}
  </div>;
}

export function ChapterHeading({ number, title, subtitle }: { number: string; title: string; subtitle: string }) {
  const reduced = useReducedMotion();
  return <motion.div className="chapter-heading" initial={reduced ? false : { opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: reduced ? 0 : .15 }}><span className="eyebrow">A LITTLE DISCOVERY · {number}</span><h1>{title}</h1><p>{subtitle}</p><span className="heading-star" aria-hidden="true">✧</span></motion.div>;
}

export function Quote({ children, attribution = 'a little thought, just for you' }: { children: ReactNode; attribution?: string }) {
  const reduced = useReducedMotion();
  return <motion.div className="thought" initial={reduced ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .9 }}><span aria-hidden="true">✧</span><blockquote>{children}</blockquote><small>{attribution}</small></motion.div>;
}

export function SafeImage({ src, alt, className = '', eager = false }: { src: string; alt: string; className?: string; eager?: boolean }) {
  const [failed, setFailed] = useState(false);
  return failed ? <div className={`image-fallback ${className}`} role="img" aria-label={alt}><Moon size={36} strokeWidth={1} /><span>{alt}</span></div> : <img src={src} alt={alt} className={className} loading={eager ? 'eager' : 'lazy'} onError={() => setFailed(true)} />;
}