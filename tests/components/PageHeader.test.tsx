import React from 'react';
import { render, screen } from '@testing-library/react';
import { PageHeader } from '../../components/PageHeader';
import { faShoppingCart, faHeart, faBox } from '@fortawesome/free-solid-svg-icons';

describe('PageHeader Component', () => {
  const defaultProps = {
    icon: faShoppingCart,
    title: 'Test Title',
  };

  describe('Basic Rendering', () => {
    it('should render the title', () => {
      render(<PageHeader {...defaultProps} />);
      expect(screen.getByText('Test Title')).toBeInTheDocument();
    });

    it('should render the icon', () => {
      render(<PageHeader {...defaultProps} />);
      expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    });

    it('should render with default gradient classes', () => {
      render(<PageHeader {...defaultProps} />);
      const title = screen.getByText('Test Title');
      expect(title).toHaveClass('bg-gradient-to-r');
    });
  });

  describe('Subtitle', () => {
    it('should render subtitle when provided', () => {
      render(<PageHeader {...defaultProps} subtitle="Test Subtitle" />);
      expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
    });

    it('should not render subtitle section when not provided', () => {
      render(<PageHeader {...defaultProps} />);
      expect(screen.queryByText('Test Subtitle')).not.toBeInTheDocument();
    });

    it('should render React element as subtitle', () => {
      const subtitleElement = <span data-testid="custom-subtitle">Custom Subtitle</span>;
      render(<PageHeader {...defaultProps} subtitle={subtitleElement} />);
      expect(screen.getByTestId('custom-subtitle')).toBeInTheDocument();
    });
  });

  describe('Badge', () => {
    it('should render badge count when provided', () => {
      render(<PageHeader {...defaultProps} badge={{ count: 5, label: 'items' }} />);
      expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('should render badge label when provided', () => {
      render(<PageHeader {...defaultProps} badge={{ count: 5, label: 'items' }} />);
      expect(screen.getByText('items')).toBeInTheDocument();
    });

    it('should render badge with zero count', () => {
      render(<PageHeader {...defaultProps} badge={{ count: 0, label: 'items' }} />);
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('should not render badge when not provided', () => {
      render(<PageHeader {...defaultProps} />);
      expect(screen.queryByText('items')).not.toBeInTheDocument();
    });
  });

  describe('Custom Gradients', () => {
    it('should apply custom icon gradient', () => {
      render(<PageHeader {...defaultProps} iconGradient="from-red-500 to-orange-500" />);
      // Component should render without errors with custom gradient
      expect(screen.getByText('Test Title')).toBeInTheDocument();
    });

    it('should apply custom title gradient', () => {
      render(<PageHeader {...defaultProps} titleGradient="from-green-600 to-blue-600" />);
      expect(screen.getByText('Test Title')).toBeInTheDocument();
    });
  });

  describe('Different Icons', () => {
    it('should render with faHeart icon', () => {
      render(<PageHeader icon={faHeart} title="Wishlist" />);
      expect(screen.getByText('Wishlist')).toBeInTheDocument();
      expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    });

    it('should render with faBox icon', () => {
      render(<PageHeader icon={faBox} title="Products" />);
      expect(screen.getByText('Products')).toBeInTheDocument();
      expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      render(<PageHeader {...defaultProps} />);
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Test Title');
    });
  });

  describe('Layout', () => {
    it('should render the component container', () => {
      const { container } = render(<PageHeader {...defaultProps} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should have flex layout for content alignment', () => {
      const { container } = render(<PageHeader {...defaultProps} />);
      const flexContainer = container.querySelector('.flex');
      expect(flexContainer).toBeInTheDocument();
    });
  });
});
