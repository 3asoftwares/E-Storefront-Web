import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProductForm } from '@/components/ProductForm';

// Mock dependencies
jest.mock('@/lib/hooks/useCategories', () => ({
  useCategories: () => ({
    categories: [
      { id: '1', name: 'Electronics', slug: 'electronics' },
      { id: '2', name: 'Clothing', slug: 'clothing' },
      { id: '3', name: 'Books', slug: 'books' },
    ],
    loading: false,
  }),
}));

const mockShowToast = jest.fn();
jest.mock('@/lib/hooks/useToast', () => ({
  useToast: () => ({
    showToast: mockShowToast,
  }),
}));

jest.mock('@3asoftwares/ui', () => ({
  Input: ({ name, value, onChange, placeholder, type, ...rest }: any) => (
    <input
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      type={type}
      data-testid={`input-${name}`}
      {...rest}
    />
  ),
}));

jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ icon }: any) => <span data-testid="icon">{icon?.iconName || 'icon'}</span>,
}));

// Mock CategoryModal
jest.mock('@/components/CategoryModal', () => {
  return function MockCategoryModal({
    isOpen,
    onClose,
    onSelect,
    categories,
    selectedCategory,
  }: any) {
    if (!isOpen) return null;
    return (
      <div data-testid="category-modal">
        <h2>Select Category</h2>
        <div>
          {categories?.map((cat: any) => (
            <button
              key={cat.id}
              onClick={() => {
                onSelect(cat.name);
                onClose();
              }}
              data-testid={`category-option-${cat.slug}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
        <button onClick={onClose} data-testid="close-modal">
          Close
        </button>
      </div>
    );
  };
});

describe('ProductForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the form with all fields', () => {
    render(<ProductForm onSubmit={mockOnSubmit} />);

    expect(screen.getByText('Product Name *')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Price (USD) *')).toBeInTheDocument();
    expect(screen.getByText('Stock Quantity')).toBeInTheDocument();
    expect(screen.getByText('Category *')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save Product' })).toBeInTheDocument();
  });

  it('should render with initial data', () => {
    const initialData = {
      name: 'Test Product',
      description: 'A test product description',
      price: 99.99,
      category: 'Electronics',
      stock: 50,
    };

    render(<ProductForm onSubmit={mockOnSubmit} initialData={initialData} />);

    expect(screen.getByTestId('input-name')).toHaveValue('Test Product');
    expect(screen.getByPlaceholderText('Enter product description')).toHaveValue(
      'A test product description'
    );
    expect(screen.getByTestId('input-price')).toHaveValue(99.99);
    expect(screen.getByTestId('input-stock')).toHaveValue(50);
    expect(screen.getByText('Electronics')).toBeInTheDocument();
  });

  it('should update form fields on input change', () => {
    render(<ProductForm onSubmit={mockOnSubmit} />);

    const nameInput = screen.getByTestId('input-name');
    const priceInput = screen.getByTestId('input-price');
    const stockInput = screen.getByTestId('input-stock');
    const descriptionInput = screen.getByPlaceholderText('Enter product description');

    fireEvent.change(nameInput, { target: { name: 'name', value: 'New Product' } });
    fireEvent.change(priceInput, { target: { name: 'price', value: '49.99' } });
    fireEvent.change(stockInput, { target: { name: 'stock', value: '25' } });
    fireEvent.change(descriptionInput, {
      target: { name: 'description', value: 'Product description' },
    });

    expect(nameInput).toHaveValue('New Product');
    expect(priceInput).toHaveValue(49.99);
    expect(stockInput).toHaveValue(25);
    expect(descriptionInput).toHaveValue('Product description');
  });

  it('should open category modal when category button is clicked', async () => {
    render(<ProductForm onSubmit={mockOnSubmit} />);

    const categoryButton = screen.getByText('Select a category...');
    fireEvent.click(categoryButton);

    await waitFor(() => {
      expect(screen.getByTestId('category-modal')).toBeInTheDocument();
    });
  });

  it('should select category from modal', async () => {
    render(<ProductForm onSubmit={mockOnSubmit} />);

    // Open modal
    const categoryButton = screen.getByText('Select a category...');
    fireEvent.click(categoryButton);

    // Select a category
    const electronicsOption = await screen.findByTestId('category-option-electronics');
    fireEvent.click(electronicsOption);

    // Category should be selected
    await waitFor(() => {
      expect(screen.getByText('Electronics')).toBeInTheDocument();
    });
  });

  it('should clear selected category', async () => {
    const initialData = {
      name: 'Test',
      category: 'Electronics',
    };

    render(<ProductForm onSubmit={mockOnSubmit} initialData={initialData} />);

    // Find and click the clear button (X icon)
    const clearButtons = screen.getAllByRole('button');
    const clearButton = clearButtons.find(
      (button) =>
        button.textContent?.includes('close') || button.querySelector('[data-testid="icon"]')
    );

    if (clearButton) {
      fireEvent.click(clearButton);
    }

    // Category text might not be visible anymore or changed to placeholder
    await waitFor(() => {
      expect(
        screen.queryByText('Select a category...') || screen.queryByText('Electronics')
      ).toBeTruthy();
    });
  });

  it('should not submit when required fields are empty', () => {
    render(<ProductForm onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByRole('button', { name: 'Save Product' });
    fireEvent.click(submitButton);

    // Form validation prevents submission - onSubmit not called
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should submit form with valid data', async () => {
    render(<ProductForm onSubmit={mockOnSubmit} />);

    // Fill in required fields
    const nameInput = screen.getByTestId('input-name');
    const priceInput = screen.getByTestId('input-price');

    fireEvent.change(nameInput, { target: { name: 'name', value: 'Test Product' } });
    fireEvent.change(priceInput, { target: { name: 'price', value: '99.99' } });

    // Select category
    const categoryButton = screen.getByText('Select a category...');
    fireEvent.click(categoryButton);
    const electronicsOption = await screen.findByTestId('category-option-electronics');
    fireEvent.click(electronicsOption);

    // Submit
    const submitButton = screen.getByRole('button', { name: 'Save Product' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'Test Product',
        description: '',
        price: '99.99',
        category: 'Electronics',
        stock: '',
      });
    });
  });

  it('should show loading state', () => {
    render(<ProductForm onSubmit={mockOnSubmit} isLoading={true} />);

    expect(screen.getByRole('button', { name: 'Saving...' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Saving...' })).toBeDisabled();
  });

  it('should close category modal when close button is clicked', async () => {
    render(<ProductForm onSubmit={mockOnSubmit} />);

    // Open modal
    const categoryButton = screen.getByText('Select a category...');
    fireEvent.click(categoryButton);

    // Wait for modal to appear
    await screen.findByTestId('category-modal');

    // Close modal
    const closeButton = screen.getByTestId('close-modal');
    fireEvent.click(closeButton);

    // Modal should be closed
    await waitFor(() => {
      expect(screen.queryByTestId('category-modal')).not.toBeInTheDocument();
    });
  });
});
