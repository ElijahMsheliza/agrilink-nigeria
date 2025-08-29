import { render, screen } from '@testing-library/react';
import Home from '../app/page';

describe('Home Page', () => {
  it('renders the main heading', () => {
    render(<Home />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
  });

  it('renders farmer and buyer buttons', () => {
    render(<Home />);
    expect(screen.getByText(/I'm a Farmer/i)).toBeInTheDocument();
    expect(screen.getByText(/I'm a Buyer/i)).toBeInTheDocument();
  });

  it('renders the description', () => {
    render(<Home />);
    expect(screen.getByText(/Connecting Nigerian farmers with buyers/i)).toBeInTheDocument();
  });
});
