import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MidnightPlayer } from '@/components/midnight-player';

describe('Authorized, user-initiated music', () => {
  it('does not connect the player until requested and preserves the original song', () => {
    const { container } = render(<MidnightPlayer />);
    expect(container.querySelector('iframe')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Open Spotify player' }));
    const player = screen.getByTitle('Spotify player: Dilruba Dilnasheen by Rito Riba');
    expect(player).toHaveAttribute('src', 'https://open.spotify.com/embed/track/3ZhV3K4tmdYofyLKPS5KqF?utm_source=generator&theme=0');
  });
});