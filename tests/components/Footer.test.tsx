import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../../components/Footer';

describe('Footer Component', () => {
  it('should render the footer', () => {
    render(<Footer />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('should display company name', () => {
    render(<Footer />);
    expect(screen.getByText('3A Softwares')).toBeInTheDocument();
  });

  it('should display company description', () => {
    render(<Footer />);
    expect(screen.getByText(/trusted online marketplace/i)).toBeInTheDocument();
  });

  it('should have Products link', () => {
    render(<Footer />);
    const productsLink = screen.getByRole('link', { name: /products/i });
    expect(productsLink).toHaveAttribute('href', '/products');
  });

  it('should have Featured Items link', () => {
    render(<Footer />);
    const featuredLink = screen.getByRole('link', { name: /featured items/i });
    expect(featuredLink).toHaveAttribute('href', '/products?featured=true');
  });

  it('should have New Arrivals link', () => {
    render(<Footer />);
    const newArrivalsLink = screen.getByRole('link', { name: /new arrivals/i });
    expect(newArrivalsLink).toHaveAttribute('href', '/products?sortBy=newest');
  });

  it('should have About Us link', () => {
    render(<Footer />);
    const aboutLink = screen.getByRole('link', { name: /about us/i });
    expect(aboutLink).toHaveAttribute('href', '/about');
  });

  it('should have Contact Us link', () => {
    render(<Footer />);
    const contactLink = screen.getByRole('link', { name: /contact us/i });
    expect(contactLink).toHaveAttribute('href', '/contact');
  });

  it('should have Shipping Info link', () => {
    render(<Footer />);
    const shippingLink = screen.getByRole('link', { name: /shipping info/i });
    expect(shippingLink).toHaveAttribute('href', '/shipping');
  });

  it('should have Returns & Refunds link', () => {
    render(<Footer />);
    const returnsLink = screen.getByRole('link', { name: /returns & refunds/i });
    expect(returnsLink).toHaveAttribute('href', '/returns');
  });

  it('should have FAQ link', () => {
    render(<Footer />);
    const faqLink = screen.getByRole('link', { name: /faq/i });
    expect(faqLink).toHaveAttribute('href', '/faq');
  });

  it('should display email contact', () => {
    render(<Footer />);
    expect(screen.getByText('3asoftwares@gmail.com')).toBeInTheDocument();
  });

  it('should have email as a link', () => {
    render(<Footer />);
    const emailLink = screen.getByRole('link', { name: /3asoftwares@gmail.com/i });
    expect(emailLink).toHaveAttribute('href', 'mailto:3asoftwares@gmail.com');
  });

  it('should display Shop section heading', () => {
    render(<Footer />);
    expect(screen.getByText('Shop')).toBeInTheDocument();
  });

  it('should display Support section heading', () => {
    render(<Footer />);
    expect(screen.getByText('Support')).toBeInTheDocument();
  });

  it('should display Get in Touch section heading', () => {
    render(<Footer />);
    expect(screen.getByText('Get in Touch')).toBeInTheDocument();
  });
});
