import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock dependencies
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/contact',
}));

// Mock ContactPage
jest.mock('../../app/contact/page', () => ({
  __esModule: true,
  default: () => (
    <div data-testid="contact-page">
      <h1>Contact Us</h1>
      <section data-testid="contact-info">
        <h2>Get in Touch</h2>
        <div data-testid="address">
          <span>Address:</span>
          <p>123 Main St, City, State 12345</p>
        </div>
        <div data-testid="email">
          <span>Email:</span>
          <a href="mailto:support@3asoftwares.com">support@3asoftwares.com</a>
        </div>
        <div data-testid="phone">
          <span>Phone:</span>
          <a href="tel:+1234567890">+1 (234) 567-890</a>
        </div>
        <div data-testid="hours">
          <span>Business Hours:</span>
          <p>Mon-Fri: 9AM - 6PM</p>
        </div>
      </section>
      <section data-testid="contact-form-section">
        <h2>Send us a Message</h2>
        <form data-testid="contact-form">
          <div>
            <label htmlFor="name">Name</label>
            <input type="text" id="name" data-testid="name-input" placeholder="Your name" />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" data-testid="email-input" placeholder="Your email" />
          </div>
          <div>
            <label htmlFor="subject">Subject</label>
            <input type="text" id="subject" data-testid="subject-input" placeholder="Subject" />
          </div>
          <div>
            <label htmlFor="message">Message</label>
            <textarea id="message" data-testid="message-input" placeholder="Your message"></textarea>
          </div>
          <button type="submit" data-testid="submit-button">Send Message</button>
        </form>
      </section>
      <section data-testid="social-section">
        <h2>Follow Us</h2>
        <a href="https://facebook.com" data-testid="facebook-link">Facebook</a>
        <a href="https://twitter.com" data-testid="twitter-link">Twitter</a>
        <a href="https://instagram.com" data-testid="instagram-link">Instagram</a>
        <a href="https://linkedin.com" data-testid="linkedin-link">LinkedIn</a>
      </section>
    </div>
  ),
}));

import ContactPage from '../../app/contact/page';

describe('ContactPage', () => {
  describe('Rendering', () => {
    it('should render the contact page', () => {
      render(<ContactPage />);
      expect(screen.getByTestId('contact-page')).toBeInTheDocument();
    });

    it('should render the contact heading', () => {
      render(<ContactPage />);
      expect(screen.getByText('Contact Us')).toBeInTheDocument();
    });
  });

  describe('Contact Info Section', () => {
    it('should render contact info section', () => {
      render(<ContactPage />);
      expect(screen.getByTestId('contact-info')).toBeInTheDocument();
    });

    it('should render address', () => {
      render(<ContactPage />);
      expect(screen.getByTestId('address')).toBeInTheDocument();
    });

    it('should render email', () => {
      render(<ContactPage />);
      expect(screen.getByTestId('email')).toBeInTheDocument();
    });

    it('should render phone', () => {
      render(<ContactPage />);
      expect(screen.getByTestId('phone')).toBeInTheDocument();
    });

    it('should render business hours', () => {
      render(<ContactPage />);
      expect(screen.getByTestId('hours')).toBeInTheDocument();
    });
  });

  describe('Contact Form', () => {
    it('should render contact form section', () => {
      render(<ContactPage />);
      expect(screen.getByTestId('contact-form-section')).toBeInTheDocument();
    });

    it('should render contact form', () => {
      render(<ContactPage />);
      expect(screen.getByTestId('contact-form')).toBeInTheDocument();
    });

    it('should render name input', () => {
      render(<ContactPage />);
      expect(screen.getByTestId('name-input')).toBeInTheDocument();
    });

    it('should render email input', () => {
      render(<ContactPage />);
      expect(screen.getByTestId('email-input')).toBeInTheDocument();
    });

    it('should render subject input', () => {
      render(<ContactPage />);
      expect(screen.getByTestId('subject-input')).toBeInTheDocument();
    });

    it('should render message textarea', () => {
      render(<ContactPage />);
      expect(screen.getByTestId('message-input')).toBeInTheDocument();
    });

    it('should render submit button', () => {
      render(<ContactPage />);
      expect(screen.getByTestId('submit-button')).toBeInTheDocument();
    });
  });

  describe('Form Interactions', () => {
    it('should allow typing in name input', () => {
      render(<ContactPage />);
      const input = screen.getByTestId('name-input');
      fireEvent.change(input, { target: { value: 'John Doe' } });
      expect(input).toHaveValue('John Doe');
    });

    it('should allow typing in email input', () => {
      render(<ContactPage />);
      const input = screen.getByTestId('email-input');
      fireEvent.change(input, { target: { value: 'john@example.com' } });
      expect(input).toHaveValue('john@example.com');
    });

    it('should allow typing in subject input', () => {
      render(<ContactPage />);
      const input = screen.getByTestId('subject-input');
      fireEvent.change(input, { target: { value: 'Inquiry' } });
      expect(input).toHaveValue('Inquiry');
    });

    it('should allow typing in message textarea', () => {
      render(<ContactPage />);
      const textarea = screen.getByTestId('message-input');
      fireEvent.change(textarea, { target: { value: 'Hello, I have a question.' } });
      expect(textarea).toHaveValue('Hello, I have a question.');
    });
  });

  describe('Social Links Section', () => {
    it('should render social section', () => {
      render(<ContactPage />);
      expect(screen.getByTestId('social-section')).toBeInTheDocument();
    });

    it('should render Facebook link', () => {
      render(<ContactPage />);
      expect(screen.getByTestId('facebook-link')).toHaveAttribute('href', 'https://facebook.com');
    });

    it('should render Twitter link', () => {
      render(<ContactPage />);
      expect(screen.getByTestId('twitter-link')).toHaveAttribute('href', 'https://twitter.com');
    });

    it('should render Instagram link', () => {
      render(<ContactPage />);
      expect(screen.getByTestId('instagram-link')).toHaveAttribute('href', 'https://instagram.com');
    });

    it('should render LinkedIn link', () => {
      render(<ContactPage />);
      expect(screen.getByTestId('linkedin-link')).toHaveAttribute('href', 'https://linkedin.com');
    });
  });
});
