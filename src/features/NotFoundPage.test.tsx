import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { NotFoundPage } from './NotFoundPage';

it('links a lost visitor back to the dashboard', () => {
  render(
    <MemoryRouter>
      <NotFoundPage />
    </MemoryRouter>,
  );
  expect(screen.getByRole('heading', { name: 'Seite nicht gefunden' })).toBeVisible();
  expect(screen.getByRole('link', { name: 'Zur Übersicht' })).toHaveAttribute('href', '/');
});
