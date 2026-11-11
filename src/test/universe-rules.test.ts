import { describe, expect, it } from 'vitest';
import { chapters, compliments, encouragements, featuredTrack, letter, pageHead, revealIdentity } from '@/lib/universe-content';
describe('The secret universe rules',()=>{
 it('does not reveal the name before the final name scene',()=>{expect(revealIdentity(12).name).toBeNull();expect(revealIdentity(13).name).toBe('Shalu');});
 it('reveals the nickname only after the name',()=>{expect(revealIdentity(13).nickname).toBeNull();expect(revealIdentity(17).nickname).toBeNull();expect(revealIdentity(18)).toEqual({name:'Shalu',nickname:'Ugglu Buglu'});});
 it('keeps both identities out of all pre-reveal content and metadata',()=>{const publicContent=JSON.stringify({chapters,compliments,encouragements,letter,head:pageHead('The Little Universe','A secret gift')});expect(publicContent).not.toMatch(/Shalu|Ugglu Buglu/i);});
 it('features the requested Hindi song through a verified authorized source',()=>{expect(featuredTrack.title).toBe('Dilruba Dilnashi');expect(featuredTrack.artist).toBe('Rito Riba');expect(featuredTrack.language).toBe('Hindi');expect(featuredTrack.url).toBe('https://open.spotify.com/track/3ZhV3K4tmdYofyLKPS5KqF');});
 it('excludes forbidden subjects from shared content',()=>{expect(JSON.stringify({chapters,compliments,encouragements,letter,featuredTrack})).not.toMatch(/Sprite|BTS|exam|family pressure/i);});
});