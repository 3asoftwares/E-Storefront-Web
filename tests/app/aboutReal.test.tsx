import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock FontAwesome
jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ icon, ...props }: any) => <svg data-testid="fa-icon" {...props} />,
}));

import AboutPage from '../../app/about/page';

describe('AboutPage - Real Component', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_LOGO_URL = '/test-logo.png';
  });

  it('should render the page title', () => {
    render(<AboutPage />);
    expect(screen.getByText('About 3A Softwares')).toBeInTheDocument();
  });

  it('should render the logo image', () => {
    render(<AboutPage />);
    const logo = screen.getByAltText('3A Softwares');
    expect(logo).toBeInTheDocument();
  });

  it('should render the tagline', () => {
    render(<AboutPage />);
    expect(
      screen.getByText(
        'Your trusted online marketplace for quality products and exceptional service'
      )
    ).toBeInTheDocument();
  });

  it('should render Our Story section', () => {
    render(<AboutPage />);
    expect(screen.getByText('Our Story')).toBeInTheDocument();
    expect(screen.getByText(/Founded in 2020/)).toBeInTheDocument();
  });

  it('should render Our Core Values section', () => {
    render(<AboutPage />);
    expect(screen.getByText('Our Core Values')).toBeInTheDocument();
  });

  it('should render all core value cards', () => {
    render(<AboutPage />);
    expect(screen.getByText('Trust & Security')).toBeInTheDocument();
    expect(screen.getByText('Quality First')).toBeInTheDocument();
    expect(screen.getByText('Customer Love')).toBeInTheDocument();
    expect(screen.getByText('Community')).toBeInTheDocument();
  });

  it('should render Why Choose section', () => {
    render(<AboutPage />);
    expect(screen.getByText('Why Choose 3A Softwares?')).toBeInTheDocument();
  });

  it('should render feature cards', () => {
    render(<AboutPage />);
    expect(screen.getByText('Fast Shipping')).toBeInTheDocument();
    expect(screen.getByText('Secure Payments')).toBeInTheDocument();
    expect(screen.getByText('24/7 Support')).toBeInTheDocument();
  });

  it('should render statistics', () => {
    render(<AboutPage />);
    expect(screen.getByText('50K+')).toBeInTheDocument();
    expect(screen.getByText('10K+')).toBeInTheDocument();
    expect(screen.getByText('500+')).toBeInTheDocument();
    expect(screen.getByText('4.8/5')).toBeInTheDocument();
  });

  it('should render statistic labels', () => {
    render(<AboutPage />);
    expect(screen.getByText('Happy Customers')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Trusted Sellers')).toBeInTheDocument();
    expect(screen.getByText('Customer Rating')).toBeInTheDocument();
  });

  it('should render FontAwesome icons', () => {
    render(<AboutPage />);
    const icons = screen.getAllByTestId('fa-icon');
    expect(icons.length).toBeGreaterThan(0);
  });
});
