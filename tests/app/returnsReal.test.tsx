import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock FontAwesome
jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ icon, ...props }: any) => <svg data-testid="fa-icon" {...props} />,
}));

// Mock UI components
jest.mock('@3asoftwares/ui', () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));

import ReturnsPage from '../../app/returns/page';

describe('ReturnsPage', () => {
  it('should render the page title', () => {
    render(<ReturnsPage />);
    expect(screen.getByText('Returns & Refunds')).toBeInTheDocument();
  });

  it('should render the tagline', () => {
    render(<ReturnsPage />);
    expect(
      screen.getByText(/Shop with confidence - we offer hassle-free returns/)
    ).toBeInTheDocument();
  });

  it('should render 30-day return policy banner', () => {
    render(<ReturnsPage />);
    expect(screen.getByText('30-Day Return Policy')).toBeInTheDocument();
  });

  it('should render return process section', () => {
    render(<ReturnsPage />);
    expect(screen.getByText(/How to Return an Item/)).toBeInTheDocument();
  });

  it('should render refund information', () => {
    render(<ReturnsPage />);
    expect(screen.getByText(/Refund Information/)).toBeInTheDocument();
  });

  it('should render FontAwesome icons', () => {
    render(<ReturnsPage />);
    const icons = screen.getAllByTestId('fa-icon');
    expect(icons.length).toBeGreaterThan(0);
  });

  it('should render non-returnable items section', () => {
    render(<ReturnsPage />);
    expect(screen.getByText(/Non-Returnable Items/)).toBeInTheDocument();
  });

  it('should render special cases section', () => {
    render(<ReturnsPage />);
    expect(screen.getByText(/Special Cases/i)).toBeInTheDocument();
  });
});
