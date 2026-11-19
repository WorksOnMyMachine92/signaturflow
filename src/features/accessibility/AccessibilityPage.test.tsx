import { render, screen } from '@testing-library/react';
import { AccessibilityPage } from './AccessibilityPage';
import { getAccessibilityResults } from '../../test/axe';

describe('AccessibilityPage', () => {
  it('documents the accessibility measures actually used by the app', () => {
    render(<AccessibilityPage />);
    expect(screen.getByText(/WCAG 2.2 AA/)).toBeVisible();
    expect(screen.getAllByText(/Tastatur/).length).toBeGreaterThan(0);
    expect(screen.getByText(/reduzierter Bewegungen/i)).toBeVisible();
  });

  it('has no automatically detectable accessibility violations', async () => {
    const { container } = render(<AccessibilityPage />);
    expect((await getAccessibilityResults(container)).violations).toEqual([]);
  });
});
