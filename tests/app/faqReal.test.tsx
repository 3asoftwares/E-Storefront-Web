import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock FontAwesome
jest.mock('@fortawesome/react-fontawesome', () => ({
    FontAwesomeIcon: ({ icon, ...props }: any) => <svg data-testid="fa-icon" {...props} />,
}));

// Mock UI components
jest.mock('@3asoftwares/ui', () => ({
    Button: ({ children, onClick, variant, ...props }: any) => (
        <button onClick={onClick} data-variant={variant} {...props}>{children}</button>
    ),
    Input: ({ placeholder, value, onChange, leftIcon, ...props }: any) => (
        <div>
            {leftIcon}
            <input
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                {...props}
            />
        </div>
    ),
}));

import FAQPage from '../../app/faq/page';

describe('FAQPage', () => {
    beforeEach(() => {
        process.env.NEXT_PUBLIC_LOGO_URL = '/test-logo.png';
    });

    it('should render the page title', () => {
        render(<FAQPage />);
        expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();
    });

    it('should render the logo', () => {
        render(<FAQPage />);
        expect(screen.getByAltText('3A Softwares')).toBeInTheDocument();
    });

    it('should render the search input', () => {
        render(<FAQPage />);
        expect(screen.getByPlaceholderText('Search for answers...')).toBeInTheDocument();
    });

    it('should render category filter buttons', () => {
        render(<FAQPage />);
        expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Orders & Shipping' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Returns & Refunds' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Payment & Security' })).toBeInTheDocument();
    });

    it('should render FAQ questions', () => {
        render(<FAQPage />);
        expect(screen.getByText('How can I track my order?')).toBeInTheDocument();
        expect(screen.getByText('What is your return policy?')).toBeInTheDocument();
        expect(screen.getByText('Are your products authentic?')).toBeInTheDocument();
    });

    it('should expand FAQ answer when question is clicked', () => {
        render(<FAQPage />);

        const question = screen.getByText('How can I track my order?');
        fireEvent.click(question);

        expect(screen.getByText(/Once your order ships, you'll receive a tracking number/)).toBeInTheDocument();
    });

    it('should collapse FAQ answer when clicked again', () => {
        render(<FAQPage />);

        const questionButton = screen.getByText('How can I track my order?').closest('button')!;

        // Expand
        fireEvent.click(questionButton);
        expect(screen.getByText(/Once your order ships, you'll receive a tracking number/)).toBeInTheDocument();

        // Collapse
        fireEvent.click(questionButton);
        expect(screen.queryByText(/Once your order ships, you'll receive a tracking number/)).not.toBeInTheDocument();
    });

    it('should filter FAQs by category', () => {
        render(<FAQPage />);

        const paymentButton = screen.getByRole('button', { name: 'Payment & Security' });
        fireEvent.click(paymentButton);

        expect(screen.getByText('What payment methods do you accept?')).toBeInTheDocument();
        expect(screen.queryByText('How can I track my order?')).not.toBeInTheDocument();
    });

    it('should filter FAQs by search query', () => {
        render(<FAQPage />);

        const searchInput = screen.getByPlaceholderText('Search for answers...');
        fireEvent.change(searchInput, { target: { value: 'refund' } });

        expect(screen.getByText('How long does it take to get a refund?')).toBeInTheDocument();
        expect(screen.queryByText('How can I track my order?')).not.toBeInTheDocument();
    });

    it('should show no results message when search has no matches', () => {
        render(<FAQPage />);

        const searchInput = screen.getByPlaceholderText('Search for answers...');
        fireEvent.change(searchInput, { target: { value: 'xyz123nonexistent' } });

        expect(screen.getByText('No results found')).toBeInTheDocument();
    });

    it('should render contact support section', () => {
        render(<FAQPage />);
        expect(screen.getByText('Still have questions?')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Contact Support' })).toBeInTheDocument();
    });

    it('should show category badge for each FAQ', () => {
        render(<FAQPage />);
        const categoryBadges = screen.getAllByText('Orders & Shipping');
        expect(categoryBadges.length).toBeGreaterThan(0);
    });

    it('should render FontAwesome icons', () => {
        render(<FAQPage />);
        const icons = screen.getAllByTestId('fa-icon');
        expect(icons.length).toBeGreaterThan(0);
    });

    it('should navigate to contact page when Contact Support is clicked', () => {
        // Mock window.location
        const originalLocation = window.location;
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: { ...originalLocation, href: '' },
        });

        render(<FAQPage />);

        const contactButton = screen.getByRole('button', { name: 'Contact Support' });
        fireEvent.click(contactButton);

        expect(window.location.href).toBe('/contact');

        Object.defineProperty(window, 'location', {
            configurable: true,
            value: originalLocation,
        });
    });
});
