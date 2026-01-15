import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock FontAwesome
jest.mock('@fortawesome/react-fontawesome', () => ({
    FontAwesomeIcon: ({ icon, ...props }: any) => <svg data-testid="fa-icon" {...props} />,
}));

import ShippingPage from '../../app/shipping/page';

describe('ShippingPage', () => {
    it('should render the page title', () => {
        render(<ShippingPage />);
        expect(screen.getByText('Shipping Information')).toBeInTheDocument();
    });

    it('should render the tagline', () => {
        render(<ShippingPage />);
        expect(screen.getByText(/Fast, reliable, and affordable shipping/)).toBeInTheDocument();
    });

    it('should render free shipping banner', () => {
        render(<ShippingPage />);
        expect(screen.getByText('Free Shipping Available!')).toBeInTheDocument();
    });

    it('should render free shipping threshold', () => {
        render(<ShippingPage />);
        expect(screen.getByText(/Get free standard shipping on all orders over ₹500/)).toBeInTheDocument();
    });

    it('should render shipping options section', () => {
        render(<ShippingPage />);
        expect(screen.getByText(/Shipping Methods/i)).toBeInTheDocument();
    });

    it('should render FontAwesome icons', () => {
        render(<ShippingPage />);
        const icons = screen.getAllByTestId('fa-icon');
        expect(icons.length).toBeGreaterThan(0);
    });

    it('should render delivery times information', () => {
        render(<ShippingPage />);
        expect(screen.getByRole('heading', { name: 'Standard Shipping' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Express Shipping' })).toBeInTheDocument();
    });

    it('should render shipping rates information', () => {
        render(<ShippingPage />);
        expect(screen.getByText(/Shipping Policy/i)).toBeInTheDocument();
    });
});
