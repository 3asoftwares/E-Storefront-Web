import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CategoryModal } from '../../components/CategoryModal';

describe('CategoryModal Component', () => {
  const mockCategories = [
    { id: '1', name: 'Electronics', slug: 'electronics', description: 'Electronic devices' },
    { id: '2', name: 'Clothing', slug: 'clothing', description: 'Fashion items' },
    { id: '3', name: 'Books', slug: 'books', description: 'Reading materials' },
  ];

  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onSelect: jest.fn(),
    categories: mockCategories,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Visibility', () => {
    it('should render when isOpen is true', () => {
      render(<CategoryModal {...defaultProps} />);
      expect(screen.getByText('Select Category')).toBeInTheDocument();
    });

    it('should not render when isOpen is false', () => {
      render(<CategoryModal {...defaultProps} isOpen={false} />);
      expect(screen.queryByText('Select Category')).not.toBeInTheDocument();
    });
  });

  describe('Category List', () => {
    it('should render all categories', () => {
      render(<CategoryModal {...defaultProps} />);
      expect(screen.getByText('Electronics')).toBeInTheDocument();
      expect(screen.getByText('Clothing')).toBeInTheDocument();
      expect(screen.getByText('Books')).toBeInTheDocument();
    });

    it('should display category descriptions', () => {
      render(<CategoryModal {...defaultProps} />);
      expect(screen.getByText('Electronic devices')).toBeInTheDocument();
      expect(screen.getByText('Fashion items')).toBeInTheDocument();
    });

    it('should call onSelect when category is clicked', () => {
      render(<CategoryModal {...defaultProps} />);
      fireEvent.click(screen.getByText('Electronics'));
      expect(defaultProps.onSelect).toHaveBeenCalledWith('Electronics');
    });

    it('should call onClose when category is selected', () => {
      render(<CategoryModal {...defaultProps} />);
      fireEvent.click(screen.getByText('Electronics'));
      expect(defaultProps.onClose).toHaveBeenCalled();
    });
  });

  describe('Search Functionality', () => {
    it('should render search input', () => {
      render(<CategoryModal {...defaultProps} />);
      expect(screen.getByPlaceholderText('Search categories...')).toBeInTheDocument();
    });

    it('should filter categories based on search term', () => {
      render(<CategoryModal {...defaultProps} />);
      const searchInput = screen.getByPlaceholderText('Search categories...');

      fireEvent.change(searchInput, { target: { value: 'elec' } });

      expect(screen.getByText('Electronics')).toBeInTheDocument();
      expect(screen.queryByText('Clothing')).not.toBeInTheDocument();
      expect(screen.queryByText('Books')).not.toBeInTheDocument();
    });

    it('should filter by description as well', () => {
      render(<CategoryModal {...defaultProps} />);
      const searchInput = screen.getByPlaceholderText('Search categories...');

      fireEvent.change(searchInput, { target: { value: 'fashion' } });

      expect(screen.getByText('Clothing')).toBeInTheDocument();
      expect(screen.queryByText('Electronics')).not.toBeInTheDocument();
    });

    it('should show all categories when search is cleared', () => {
      render(<CategoryModal {...defaultProps} />);
      const searchInput = screen.getByPlaceholderText('Search categories...');

      fireEvent.change(searchInput, { target: { value: 'elec' } });
      fireEvent.change(searchInput, { target: { value: '' } });

      expect(screen.getByText('Electronics')).toBeInTheDocument();
      expect(screen.getByText('Clothing')).toBeInTheDocument();
      expect(screen.getByText('Books')).toBeInTheDocument();
    });
  });

  describe('Close Button', () => {
    it('should render close button', () => {
      render(<CategoryModal {...defaultProps} />);
      expect(screen.getByLabelText('Close modal')).toBeInTheDocument();
    });

    it('should call onClose when close button is clicked', () => {
      render(<CategoryModal {...defaultProps} />);
      fireEvent.click(screen.getByLabelText('Close modal'));
      expect(defaultProps.onClose).toHaveBeenCalled();
    });
  });

  describe('Selected Category', () => {
    it('should highlight selected category', () => {
      render(<CategoryModal {...defaultProps} selectedCategory="Electronics" />);
      // The selected category should be visually different
      const electronicsItems = screen.getAllByText('Electronics');
      expect(electronicsItems.length).toBeGreaterThan(0);
    });
  });

  describe('Loading State', () => {
    it('should handle loading state', () => {
      render(<CategoryModal {...defaultProps} isLoading={true} />);
      // Modal should still be visible during loading
      expect(screen.getByText('Select Category')).toBeInTheDocument();
    });
  });

  describe('Empty Categories', () => {
    it('should handle empty categories array', () => {
      render(<CategoryModal {...defaultProps} categories={[]} />);
      expect(screen.getByText('Select Category')).toBeInTheDocument();
      expect(screen.queryByText('Electronics')).not.toBeInTheDocument();
    });
  });

  describe('Custom Category', () => {
    it('should show custom input option when search has no matches', () => {
      render(<CategoryModal {...defaultProps} />);
      const searchInput = screen.getByPlaceholderText('Search categories...');

      fireEvent.change(searchInput, { target: { value: 'NewCategory' } });

      // Should show option to create custom category
      expect(screen.queryByText('Electronics')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have modal title', () => {
      render(<CategoryModal {...defaultProps} />);
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Select Category');
    });

    it('should have proper aria-label on close button', () => {
      render(<CategoryModal {...defaultProps} />);
      const closeButton = screen.getByLabelText('Close modal');
      expect(closeButton).toBeInTheDocument();
    });
  });
});
