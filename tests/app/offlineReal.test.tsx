import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock FontAwesome
jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ icon, ...props }: any) => <svg data-testid="fa-icon" {...props} />,
}));

// Mock next/link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

// Mock UI components
jest.mock('@3asoftwares/ui', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

import OfflinePage from '../../app/offline/page';

describe('OfflinePage', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    // Mock window.location.reload
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...originalLocation, reload: jest.fn() },
    });
  });

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    });
  });

  it('should render the page title', () => {
    render(<OfflinePage />);
    expect(screen.getByText("You're Offline")).toBeInTheDocument();
  });

  it('should render the offline icon', () => {
    render(<OfflinePage />);
    const icons = screen.getAllByTestId('fa-icon');
    expect(icons.length).toBeGreaterThan(0);
  });

  it('should render retry button', () => {
    render(<OfflinePage />);
    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });

  it('should call window.location.reload when retry button is clicked', () => {
    render(<OfflinePage />);

    const retryButton = screen.getByText('Try Again');
    fireEvent.click(retryButton);

    expect(window.location.reload).toHaveBeenCalled();
  });

  it('should render home link', () => {
    render(<OfflinePage />);
    expect(screen.getByText('Go Home')).toBeInTheDocument();
  });

  it('should render offline message', () => {
    render(<OfflinePage />);
    expect(
      screen.getByText(/It looks like you've lost your internet connection/)
    ).toBeInTheDocument();
  });

  it('should render tips section', () => {
    render(<OfflinePage />);
    expect(screen.getByText(/While you're offline/)).toBeInTheDocument();
    expect(screen.getByText('Troubleshooting Tips')).toBeInTheDocument();
  });

  it('should render available actions', () => {
    render(<OfflinePage />);
    expect(screen.getByText(/Check if your Wi-Fi or mobile data is turned on/)).toBeInTheDocument();
    expect(screen.getByText(/Try moving closer to your router/)).toBeInTheDocument();
  });
});
