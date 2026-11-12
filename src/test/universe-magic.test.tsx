import { fireEvent, render, screen } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { MoonlitGarden } from '@/components/universe-magic';
import { compliments } from '@/lib/universe-content';

describe('Blooming flower interaction', () => {
  beforeAll(() => {
    vi.stubGlobal('IntersectionObserver', class {
      observe() {}
      unobserve() {}
      disconnect() {}
    });
  });
  it('reveals the selected thought and lets the same flower close it', () => {
    render(<MoonlitGarden />);
    const flower = screen.getByRole('button', { name: 'Bloom flower 1' });
    expect(screen.queryByText(`“${compliments[0]}”`)).toBeNull();
    fireEvent.click(flower);
    expect(flower).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText(`“${compliments[0]}”`)).toBeInTheDocument();
    fireEvent.click(flower);
    expect(flower).toHaveAttribute('aria-expanded', 'false');
  });
});