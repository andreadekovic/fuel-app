import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

beforeEach(() => {
  window.localStorage.clear();
});

test('renders the FUEL landing page', () => {
  render(<App />);

  expect(screen.getByText(/project payout automation for distributed teams/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /log in to start/i })).toBeInTheDocument();
});

test('allows username login and shows the dashboard', () => {
  render(<App />);

  userEvent.click(screen.getByRole('button', { name: /log in to start/i }));
  userEvent.type(screen.getByLabelText(/username/i), 'Andrea');
  userEvent.click(screen.getByRole('button', { name: /^continue$/i }));

  expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
  expect(screen.getByText('Andrea')).toBeInTheDocument();
});
