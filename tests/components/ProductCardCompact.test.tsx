import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCardCompact } from '../../components/ProductCardCompact';
import { formatPrice } from '@3asoftwares/utils/client';

describe('ProductCardCompact Component', () => {
  const defaultProduct = {
    id: 'prod1',
    name: 'Test Product',
    price: 29.99,
    imageUrl: 'https://example.com/image.jpg',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render product name', () => {
      render(<ProductCardCompact product={defaultProduct} />);
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    it('should render product price', () => {
      render(<ProductCardCompact product={defaultProduct} />);
      expect(formatPrice).toHaveBeenCalledWith(29.99);
    });

    it('should render product image when imageUrl is provided', () => {
      render(<ProductCardCompact product={defaultProduct} />);
      const image = screen.getByAltText('Test Product');
      expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
    });

    it('should render fallback icon when no image is provided', () => {
      const productWithoutImage = { ...defaultProduct, imageUrl: undefined };
      render(<ProductCardCompact product={productWithoutImage} />);
      expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    });

    it('should link to product detail page', () => {
      render(<ProductCardCompact product={defaultProduct} />);
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/products/prod1');
    });
  });

  describe('Image Error Handling', () => {
    it('should handle image error gracefully', () => {
      render(<ProductCardCompact product={defaultProduct} />);
      const image = screen.getByAltText('Test Product');

      // Simulate image error
      fireEvent.error(image);

      // Image should be hidden after error
      expect(image).toHaveStyle({ display: 'none' });
    });
  });

  describe('Styling', () => {
    it('should render with proper structure', () => {
      const { container } = render(<ProductCardCompact product={defaultProduct} />);
      // Check that component renders
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should have link to product page', () => {
      render(<ProductCardCompact product={defaultProduct} />);
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/products/prod1');
    });
  });

  describe('Different Products', () => {
    it('should render correctly with different product data', () => {
      const anotherProduct = {
        id: 'prod2',
        name: 'Another Product',
        price: 99.99,
        imageUrl: 'https://example.com/another.jpg',
      };
      render(<ProductCardCompact product={anotherProduct} />);
      expect(screen.getByText('Another Product')).toBeInTheDocument();
      expect(formatPrice).toHaveBeenCalledWith(99.99);
    });

    it('should handle long product names', () => {
      const longNameProduct = {
        ...defaultProduct,
        name: 'This is a very long product name that should be truncated in the UI',
      };
      render(<ProductCardCompact product={longNameProduct} />);
      expect(screen.getByText(longNameProduct.name)).toBeInTheDocument();
    });
  });
});
