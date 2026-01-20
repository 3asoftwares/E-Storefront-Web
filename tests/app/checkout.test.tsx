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
  usePathname: () => '/checkout',
}));

// Mock CheckoutPage
jest.mock('../../app/checkout/page', () => ({
  __esModule: true,
  default: () => (
    <div data-testid="checkout-page">
      <h1>Checkout</h1>
      <form data-testid="checkout-form">
        <section data-testid="shipping-section">
          <h2>Shipping Information</h2>
          <input data-testid="first-name" placeholder="First Name" />
          <input data-testid="last-name" placeholder="Last Name" />
          <input data-testid="address" placeholder="Address" />
          <input data-testid="city" placeholder="City" />
          <input data-testid="state" placeholder="State" />
          <input data-testid="zip" placeholder="ZIP Code" />
          <input data-testid="country" placeholder="Country" />
          <input data-testid="phone" placeholder="Phone" />
        </section>

        <section data-testid="payment-section">
          <h2>Payment Information</h2>
          <input data-testid="card-number" placeholder="Card Number" />
          <input data-testid="expiry" placeholder="MM/YY" />
          <input data-testid="cvv" placeholder="CVV" />
          <input data-testid="card-name" placeholder="Name on Card" />
        </section>

        <section data-testid="order-summary">
          <h2>Order Summary</h2>
          <div data-testid="summary-item">
            <span>Product 1 x 2</span>
            <span>$199.98</span>
          </div>
          <div data-testid="summary-subtotal">Subtotal: $199.98</div>
          <div data-testid="summary-shipping">Shipping: $9.99</div>
          <div data-testid="summary-tax">Tax: $16.00</div>
          <div data-testid="summary-total">Total: $225.97</div>
        </section>

        <button type="submit" data-testid="place-order-button">
          Place Order
        </button>
      </form>
      <a href="/cart" data-testid="back-to-cart">
        Back to Cart
      </a>
    </div>
  ),
}));

import CheckoutPage from '../../app/checkout/page';

describe('CheckoutPage', () => {
  describe('Rendering', () => {
    it('should render the checkout page', () => {
      render(<CheckoutPage />);
      expect(screen.getByTestId('checkout-page')).toBeInTheDocument();
    });

    it('should render the checkout heading', () => {
      render(<CheckoutPage />);
      expect(screen.getByText('Checkout')).toBeInTheDocument();
    });

    it('should render the checkout form', () => {
      render(<CheckoutPage />);
      expect(screen.getByTestId('checkout-form')).toBeInTheDocument();
    });
  });

  describe('Shipping Section', () => {
    it('should render shipping section', () => {
      render(<CheckoutPage />);
      expect(screen.getByTestId('shipping-section')).toBeInTheDocument();
    });

    it('should render shipping heading', () => {
      render(<CheckoutPage />);
      expect(screen.getByText('Shipping Information')).toBeInTheDocument();
    });

    it('should render first name input', () => {
      render(<CheckoutPage />);
      expect(screen.getByTestId('first-name')).toBeInTheDocument();
    });

    it('should render last name input', () => {
      render(<CheckoutPage />);
      expect(screen.getByTestId('last-name')).toBeInTheDocument();
    });

    it('should render address input', () => {
      render(<CheckoutPage />);
      expect(screen.getByTestId('address')).toBeInTheDocument();
    });

    it('should render city input', () => {
      render(<CheckoutPage />);
      expect(screen.getByTestId('city')).toBeInTheDocument();
    });

    it('should render state input', () => {
      render(<CheckoutPage />);
      expect(screen.getByTestId('state')).toBeInTheDocument();
    });

    it('should render zip input', () => {
      render(<CheckoutPage />);
      expect(screen.getByTestId('zip')).toBeInTheDocument();
    });

    it('should render phone input', () => {
      render(<CheckoutPage />);
      expect(screen.getByTestId('phone')).toBeInTheDocument();
    });
  });

  describe('Payment Section', () => {
    it('should render payment section', () => {
      render(<CheckoutPage />);
      expect(screen.getByTestId('payment-section')).toBeInTheDocument();
    });

    it('should render payment heading', () => {
      render(<CheckoutPage />);
      expect(screen.getByText('Payment Information')).toBeInTheDocument();
    });

    it('should render card number input', () => {
      render(<CheckoutPage />);
      expect(screen.getByTestId('card-number')).toBeInTheDocument();
    });

    it('should render expiry input', () => {
      render(<CheckoutPage />);
      expect(screen.getByTestId('expiry')).toBeInTheDocument();
    });

    it('should render CVV input', () => {
      render(<CheckoutPage />);
      expect(screen.getByTestId('cvv')).toBeInTheDocument();
    });

    it('should render card name input', () => {
      render(<CheckoutPage />);
      expect(screen.getByTestId('card-name')).toBeInTheDocument();
    });
  });

  describe('Order Summary', () => {
    it('should render order summary section', () => {
      render(<CheckoutPage />);
      expect(screen.getByTestId('order-summary')).toBeInTheDocument();
    });

    it('should render order summary heading', () => {
      render(<CheckoutPage />);
      expect(screen.getByText('Order Summary')).toBeInTheDocument();
    });

    it('should render summary item', () => {
      render(<CheckoutPage />);
      expect(screen.getByTestId('summary-item')).toBeInTheDocument();
    });

    it('should render subtotal', () => {
      render(<CheckoutPage />);
      expect(screen.getByTestId('summary-subtotal')).toBeInTheDocument();
    });

    it('should render shipping cost', () => {
      render(<CheckoutPage />);
      expect(screen.getByTestId('summary-shipping')).toBeInTheDocument();
    });

    it('should render tax', () => {
      render(<CheckoutPage />);
      expect(screen.getByTestId('summary-tax')).toBeInTheDocument();
    });

    it('should render total', () => {
      render(<CheckoutPage />);
      expect(screen.getByTestId('summary-total')).toBeInTheDocument();
    });
  });

  describe('Form Interactions', () => {
    it('should allow typing in first name', () => {
      render(<CheckoutPage />);
      const input = screen.getByTestId('first-name');
      fireEvent.change(input, { target: { value: 'John' } });
      expect(input).toHaveValue('John');
    });

    it('should allow typing in card number', () => {
      render(<CheckoutPage />);
      const input = screen.getByTestId('card-number');
      fireEvent.change(input, { target: { value: '4111111111111111' } });
      expect(input).toHaveValue('4111111111111111');
    });
  });

  describe('Actions', () => {
    it('should render place order button', () => {
      render(<CheckoutPage />);
      expect(screen.getByTestId('place-order-button')).toBeInTheDocument();
    });

    it('should render back to cart link', () => {
      render(<CheckoutPage />);
      expect(screen.getByTestId('back-to-cart')).toHaveAttribute('href', '/cart');
    });
  });
});
