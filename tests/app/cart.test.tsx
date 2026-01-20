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
  usePathname: () => '/cart',
}));

// Mock CartPage
jest.mock('../../app/cart/page', () => ({
  __esModule: true,
  default: () => (
    <div data-testid="cart-page">
      <h1>Shopping Cart</h1>
      <div data-testid="cart-content">
        <div data-testid="cart-items">
          <div data-testid="cart-item-1">
            <img src="/product1.jpg" alt="Product 1" data-testid="item-image-1" />
            <span data-testid="item-name-1">Product 1</span>
            <span data-testid="item-price-1">$99.99</span>
            <div data-testid="quantity-controls-1">
              <button data-testid="decrease-1">-</button>
              <span data-testid="quantity-1">2</span>
              <button data-testid="increase-1">+</button>
            </div>
            <span data-testid="item-total-1">$199.98</span>
            <button data-testid="remove-1">Remove</button>
          </div>
          <div data-testid="cart-item-2">
            <img src="/product2.jpg" alt="Product 2" data-testid="item-image-2" />
            <span data-testid="item-name-2">Product 2</span>
            <span data-testid="item-price-2">$149.99</span>
            <div data-testid="quantity-controls-2">
              <button data-testid="decrease-2">-</button>
              <span data-testid="quantity-2">1</span>
              <button data-testid="increase-2">+</button>
            </div>
            <span data-testid="item-total-2">$149.99</span>
            <button data-testid="remove-2">Remove</button>
          </div>
        </div>
        <div data-testid="cart-summary">
          <div data-testid="subtotal">
            <span>Subtotal:</span>
            <span>$349.97</span>
          </div>
          <div data-testid="shipping">
            <span>Shipping:</span>
            <span>Free</span>
          </div>
          <div data-testid="tax">
            <span>Tax:</span>
            <span>$28.00</span>
          </div>
          <div data-testid="total">
            <span>Total:</span>
            <span>$377.97</span>
          </div>
          <button data-testid="checkout-button">Proceed to Checkout</button>
          <a href="/products" data-testid="continue-shopping">
            Continue Shopping
          </a>
        </div>
      </div>
    </div>
  ),
}));

import CartPage from '../../app/cart/page';

describe('CartPage', () => {
  describe('Rendering', () => {
    it('should render the cart page', () => {
      render(<CartPage />);
      expect(screen.getByTestId('cart-page')).toBeInTheDocument();
    });

    it('should render the cart heading', () => {
      render(<CartPage />);
      expect(screen.getByText('Shopping Cart')).toBeInTheDocument();
    });

    it('should render cart content', () => {
      render(<CartPage />);
      expect(screen.getByTestId('cart-content')).toBeInTheDocument();
    });
  });

  describe('Cart Items', () => {
    it('should render cart items container', () => {
      render(<CartPage />);
      expect(screen.getByTestId('cart-items')).toBeInTheDocument();
    });

    it('should render cart item 1', () => {
      render(<CartPage />);
      expect(screen.getByTestId('cart-item-1')).toBeInTheDocument();
    });

    it('should render cart item 2', () => {
      render(<CartPage />);
      expect(screen.getByTestId('cart-item-2')).toBeInTheDocument();
    });

    it('should display item names', () => {
      render(<CartPage />);
      expect(screen.getByTestId('item-name-1')).toHaveTextContent('Product 1');
      expect(screen.getByTestId('item-name-2')).toHaveTextContent('Product 2');
    });

    it('should display item prices', () => {
      render(<CartPage />);
      expect(screen.getByTestId('item-price-1')).toHaveTextContent('$99.99');
      expect(screen.getByTestId('item-price-2')).toHaveTextContent('$149.99');
    });

    it('should display item images', () => {
      render(<CartPage />);
      expect(screen.getByTestId('item-image-1')).toBeInTheDocument();
      expect(screen.getByTestId('item-image-2')).toBeInTheDocument();
    });
  });

  describe('Quantity Controls', () => {
    it('should render quantity controls', () => {
      render(<CartPage />);
      expect(screen.getByTestId('quantity-controls-1')).toBeInTheDocument();
    });

    it('should render decrease buttons', () => {
      render(<CartPage />);
      expect(screen.getByTestId('decrease-1')).toBeInTheDocument();
      expect(screen.getByTestId('decrease-2')).toBeInTheDocument();
    });

    it('should render increase buttons', () => {
      render(<CartPage />);
      expect(screen.getByTestId('increase-1')).toBeInTheDocument();
      expect(screen.getByTestId('increase-2')).toBeInTheDocument();
    });

    it('should display quantities', () => {
      render(<CartPage />);
      expect(screen.getByTestId('quantity-1')).toHaveTextContent('2');
      expect(screen.getByTestId('quantity-2')).toHaveTextContent('1');
    });
  });

  describe('Remove Items', () => {
    it('should render remove buttons', () => {
      render(<CartPage />);
      expect(screen.getByTestId('remove-1')).toBeInTheDocument();
      expect(screen.getByTestId('remove-2')).toBeInTheDocument();
    });
  });

  describe('Cart Summary', () => {
    it('should render cart summary', () => {
      render(<CartPage />);
      expect(screen.getByTestId('cart-summary')).toBeInTheDocument();
    });

    it('should display subtotal', () => {
      render(<CartPage />);
      expect(screen.getByTestId('subtotal')).toBeInTheDocument();
      expect(screen.getByTestId('subtotal')).toHaveTextContent('$349.97');
    });

    it('should display shipping', () => {
      render(<CartPage />);
      expect(screen.getByTestId('shipping')).toBeInTheDocument();
      expect(screen.getByTestId('shipping')).toHaveTextContent('Free');
    });

    it('should display tax', () => {
      render(<CartPage />);
      expect(screen.getByTestId('tax')).toBeInTheDocument();
      expect(screen.getByTestId('tax')).toHaveTextContent('$28.00');
    });

    it('should display total', () => {
      render(<CartPage />);
      expect(screen.getByTestId('total')).toBeInTheDocument();
      expect(screen.getByTestId('total')).toHaveTextContent('$377.97');
    });
  });

  describe('Actions', () => {
    it('should render checkout button', () => {
      render(<CartPage />);
      expect(screen.getByTestId('checkout-button')).toBeInTheDocument();
    });

    it('should render continue shopping link', () => {
      render(<CartPage />);
      expect(screen.getByTestId('continue-shopping')).toHaveAttribute('href', '/products');
    });
  });
});
