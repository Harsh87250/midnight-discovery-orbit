import { useState } from 'react';
import { Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function MidnightPlayer() {
  const [opened, setOpened] = useState(false);
  return <div className="midnight-player">{opened ? <iframe title="Spotify player: Dilruba Dilnasheen by Rito Riba" src="https://open.spotify.com/embed/track/3ZhV3K4tmdYofyLKPS5KqF?utm_source=generator&theme=0" width="100%" height="152" allow="encrypted-media; fullscreen; picture-in-picture; autoplay" loading="lazy" /> : <Button variant="outline" onClick={() => setOpened(true)}><Headphones size={16} /> Open Spotify player</Button>}</div>;
}