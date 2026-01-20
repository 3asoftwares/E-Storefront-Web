import React from 'react';
import { render, screen } from '@testing-library/react';
import { Recommendations } from '../../components/Recommendations';

describe('Recommendations Component', () => {
  const mockProducts = [
    {
      _id: { $oid: '1' },
      name: 'Product 1',
      price: 29.99,
      images: ['https://example.com/image1.jpg'],
    },
    {
      _id: { $oid: '2' },
      name: 'Product 2',
      price: 49.99,
      images: ['https://example.com/image2.jpg'],
    },
    {
      _id: { $oid: '3' },
      name: 'Product 3',
      price: 19.99,
      images: ['https://example.com/image3.jpg'],
    },
  ];

  describe('Rendering', () => {
    it('should render the section heading', () => {
      render(<Recommendations products={mockProducts} />);
      expect(screen.getByText('Recommended for You')).toBeInTheDocument();
    });

    it('should render all products', () => {
      render(<Recommendations products={mockProducts} />);
      expect(screen.getByText('Product 1')).toBeInTheDocument();
      expect(screen.getByText('Product 2')).toBeInTheDocument();
      expect(screen.getByText('Product 3')).toBeInTheDocument();
    });

    it('should render product prices', () => {
      render(<Recommendations products={mockProducts} />);
      expect(screen.getByText('$29.99')).toBeInTheDocument();
      expect(screen.getByText('$49.99')).toBeInTheDocument();
      expect(screen.getByText('$19.99')).toBeInTheDocument();
    });

    it('should render product images', () => {
      render(<Recommendations products={mockProducts} />);
      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(3);
      expect(images[0]).toHaveAttribute('src', 'https://example.com/image1.jpg');
      expect(images[0]).toHaveAttribute('alt', 'Product 1');
    });
  });

  describe('Empty State', () => {
    it('should render empty grid when no products', () => {
      const { container } = render(<Recommendations products={[]} />);
      expect(screen.getByText('Recommended for You')).toBeInTheDocument();
      const grid = container.querySelector('.grid');
      expect(grid?.children.length).toBe(0);
    });
  });

  describe('Grid Layout', () => {
    it('should have proper grid classes', () => {
      const { container } = render(<Recommendations products={mockProducts} />);
      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass('grid-cols-1');
      expect(grid).toHaveClass('md:grid-cols-4');
      expect(grid).toHaveClass('gap-6');
    });
  });

  describe('Card Styling', () => {
    it('should have rounded corners on cards', () => {
      const { container } = render(<Recommendations products={mockProducts} />);
      const card = container.querySelector('.rounded-lg');
      expect(card).toBeInTheDocument();
    });

    it('should have shadow on cards', () => {
      const { container } = render(<Recommendations products={mockProducts} />);
      const card = container.querySelector('.shadow');
      expect(card).toBeInTheDocument();
    });

    it('should have white background on cards', () => {
      const { container } = render(<Recommendations products={mockProducts} />);
      const card = container.querySelector('.bg-white');
      expect(card).toBeInTheDocument();
    });
  });

  describe('Image Styling', () => {
    it('should have proper image dimensions', () => {
      render(<Recommendations products={mockProducts} />);
      const images = screen.getAllByRole('img');
      images.forEach((img) => {
        expect(img).toHaveClass('w-20');
        expect(img).toHaveClass('h-20');
      });
    });

    it('should have object-cover on images', () => {
      render(<Recommendations products={mockProducts} />);
      const images = screen.getAllByRole('img');
      images.forEach((img) => {
        expect(img).toHaveClass('object-cover');
      });
    });

    it('should have rounded corners on images', () => {
      render(<Recommendations products={mockProducts} />);
      const images = screen.getAllByRole('img');
      images.forEach((img) => {
        expect(img).toHaveClass('rounded');
      });
    });
  });

  describe('Typography', () => {
    it('should have bold heading', () => {
      render(<Recommendations products={mockProducts} />);
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveClass('font-bold');
    });

    it('should have proper text size for heading', () => {
      render(<Recommendations products={mockProducts} />);
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveClass('text-xl');
    });

    it('should have bold price styling', () => {
      const { container } = render(<Recommendations products={mockProducts} />);
      const prices = container.querySelectorAll('.font-bold');
      expect(prices.length).toBeGreaterThan(0);
    });
  });

  describe('Single Product', () => {
    it('should render single product correctly', () => {
      const singleProduct = [mockProducts[0]];
      render(<Recommendations products={singleProduct} />);
      expect(screen.getByText('Product 1')).toBeInTheDocument();
      expect(screen.queryByText('Product 2')).not.toBeInTheDocument();
    });
  });

  describe('Many Products', () => {
    it('should render many products correctly', () => {
      const manyProducts = Array(10)
        .fill(null)
        .map((_, i) => ({
          _id: { $oid: String(i) },
          name: `Product ${i}`,
          price: 10 * i,
          images: [`https://example.com/image${i}.jpg`],
        }));
      render(<Recommendations products={manyProducts} />);
      expect(screen.getByText('Product 0')).toBeInTheDocument();
      expect(screen.getByText('Product 9')).toBeInTheDocument();
    });
  });
});
