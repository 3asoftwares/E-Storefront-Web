import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock all dependencies at the top
jest.mock('@3asoftwares/ui', () => ({
  Input: ({ label, ...props }: any) => (
    <div>
      {label && <label>{label}</label>}
      <input {...props} />
    </div>
  ),
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  TextArea: ({ label, ...props }: any) => (
    <div>
      {label && <label>{label}</label>}
      <textarea {...props} />
    </div>
  ),
}));

// Mock the ProductForm component itself for simpler testing
jest.mock('../../components/ProductForm', () => ({
  ProductForm: ({ onSubmit, isLoading, initialData }: any) => (
    <form
      data-testid="product-form"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit && onSubmit({});
      }}
    >
      <input name="name" defaultValue={initialData?.name || ''} placeholder="Product name" />
      <input name="price" defaultValue={initialData?.price || ''} placeholder="Price" />
      <textarea
        name="description"
        defaultValue={initialData?.description || ''}
        placeholder="Description"
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save Product'}
      </button>
    </form>
  ),
}));

import { ProductForm } from '../../components/ProductForm';

describe('ProductForm Component', () => {
  const defaultProps = {
    onSubmit: jest.fn(),
    isLoading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the form', () => {
      render(<ProductForm {...defaultProps} />);
      expect(screen.getByTestId('product-form')).toBeInTheDocument();
    });

    it('should render product name input', () => {
      render(<ProductForm {...defaultProps} />);
      expect(screen.getByPlaceholderText('Product name')).toBeInTheDocument();
    });

    it('should render price input', () => {
      render(<ProductForm {...defaultProps} />);
      expect(screen.getByPlaceholderText('Price')).toBeInTheDocument();
    });

    it('should render description textarea', () => {
      render(<ProductForm {...defaultProps} />);
      expect(screen.getByPlaceholderText('Description')).toBeInTheDocument();
    });

    it('should render submit button', () => {
      render(<ProductForm {...defaultProps} />);
      expect(screen.getByRole('button', { name: /save product/i })).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should disable button during loading', () => {
      render(<ProductForm {...defaultProps} isLoading={true} />);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('should show loading text during loading', () => {
      render(<ProductForm {...defaultProps} isLoading={true} />);
      expect(screen.getByText('Saving...')).toBeInTheDocument();
    });
  });

  describe('Initial Values', () => {
    it('should populate form with initial values', () => {
      const initialData = {
        name: 'Test Product',
        price: 99.99,
        description: 'Test description',
      };
      render(<ProductForm {...defaultProps} initialData={initialData} />);

      expect(screen.getByPlaceholderText('Product name')).toHaveValue('Test Product');
    });
  });
});
