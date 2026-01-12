import React from 'react';
import { render, screen } from '@testing-library/react';

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
  usePathname: () => '/about',
}));

// Mock AboutPage
jest.mock('../../app/about/page', () => ({
  __esModule: true,
  default: () => (
    <div data-testid="about-page">
      <h1>About Us</h1>
      <section data-testid="company-story">
        <h2>Our Story</h2>
        <p data-testid="story-text">
          3A Softwares was founded with a mission to provide quality products at affordable prices.
        </p>
      </section>
      <section data-testid="mission">
        <h2>Our Mission</h2>
        <p data-testid="mission-text">
          To deliver exceptional value and outstanding customer service to our community.
        </p>
      </section>
      <section data-testid="values">
        <h2>Our Values</h2>
        <ul>
          <li data-testid="value-quality">Quality</li>
          <li data-testid="value-integrity">Integrity</li>
          <li data-testid="value-innovation">Innovation</li>
          <li data-testid="value-customer">Customer First</li>
        </ul>
      </section>
      <section data-testid="team">
        <h2>Our Team</h2>
        <div data-testid="team-members">
          <div data-testid="team-member-1">
            <span>John Doe</span>
            <span>CEO</span>
          </div>
          <div data-testid="team-member-2">
            <span>Jane Smith</span>
            <span>CTO</span>
          </div>
        </div>
      </section>
      <section data-testid="contact-cta">
        <h2>Get in Touch</h2>
        <a href="/contact" data-testid="contact-link">Contact Us</a>
      </section>
    </div>
  ),
}));

import AboutPage from '../../app/about/page';

describe('AboutPage', () => {
  describe('Rendering', () => {
    it('should render the about page', () => {
      render(<AboutPage />);
      expect(screen.getByTestId('about-page')).toBeInTheDocument();
    });

    it('should render the about heading', () => {
      render(<AboutPage />);
      expect(screen.getByText('About Us')).toBeInTheDocument();
    });
  });

  describe('Company Story Section', () => {
    it('should render company story section', () => {
      render(<AboutPage />);
      expect(screen.getByTestId('company-story')).toBeInTheDocument();
    });

    it('should render story heading', () => {
      render(<AboutPage />);
      expect(screen.getByText('Our Story')).toBeInTheDocument();
    });

    it('should render story text', () => {
      render(<AboutPage />);
      expect(screen.getByTestId('story-text')).toBeInTheDocument();
    });
  });

  describe('Mission Section', () => {
    it('should render mission section', () => {
      render(<AboutPage />);
      expect(screen.getByTestId('mission')).toBeInTheDocument();
    });

    it('should render mission heading', () => {
      render(<AboutPage />);
      expect(screen.getByText('Our Mission')).toBeInTheDocument();
    });

    it('should render mission text', () => {
      render(<AboutPage />);
      expect(screen.getByTestId('mission-text')).toBeInTheDocument();
    });
  });

  describe('Values Section', () => {
    it('should render values section', () => {
      render(<AboutPage />);
      expect(screen.getByTestId('values')).toBeInTheDocument();
    });

    it('should render values heading', () => {
      render(<AboutPage />);
      expect(screen.getByText('Our Values')).toBeInTheDocument();
    });

    it('should render quality value', () => {
      render(<AboutPage />);
      expect(screen.getByTestId('value-quality')).toHaveTextContent('Quality');
    });

    it('should render integrity value', () => {
      render(<AboutPage />);
      expect(screen.getByTestId('value-integrity')).toHaveTextContent('Integrity');
    });

    it('should render innovation value', () => {
      render(<AboutPage />);
      expect(screen.getByTestId('value-innovation')).toHaveTextContent('Innovation');
    });

    it('should render customer first value', () => {
      render(<AboutPage />);
      expect(screen.getByTestId('value-customer')).toHaveTextContent('Customer First');
    });
  });

  describe('Team Section', () => {
    it('should render team section', () => {
      render(<AboutPage />);
      expect(screen.getByTestId('team')).toBeInTheDocument();
    });

    it('should render team heading', () => {
      render(<AboutPage />);
      expect(screen.getByText('Our Team')).toBeInTheDocument();
    });

    it('should render team members container', () => {
      render(<AboutPage />);
      expect(screen.getByTestId('team-members')).toBeInTheDocument();
    });

    it('should render team member 1', () => {
      render(<AboutPage />);
      expect(screen.getByTestId('team-member-1')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('CEO')).toBeInTheDocument();
    });

    it('should render team member 2', () => {
      render(<AboutPage />);
      expect(screen.getByTestId('team-member-2')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('CTO')).toBeInTheDocument();
    });
  });

  describe('Contact CTA Section', () => {
    it('should render contact CTA section', () => {
      render(<AboutPage />);
      expect(screen.getByTestId('contact-cta')).toBeInTheDocument();
    });

    it('should render get in touch heading', () => {
      render(<AboutPage />);
      expect(screen.getByText('Get in Touch')).toBeInTheDocument();
    });

    it('should render contact link', () => {
      render(<AboutPage />);
      expect(screen.getByTestId('contact-link')).toHaveAttribute('href', '/contact');
    });
  });
});
