import React from 'react';
import { render, screen } from '@testing-library/react';
import { EmptyState } from '../../components/EmptyState';
import { faBox } from '@fortawesome/free-solid-svg-icons';

describe('EmptyState Component', () => {
  const defaultProps = {
    icon: faBox,
    title: 'No Items Found',
    description: 'There are no items to display.',
  };

  it('should render the title', () => {
    render(<EmptyState {...defaultProps} />);
    expect(screen.getByText('No Items Found')).toBeInTheDocument();
  });

  it('should render the description', () => {
    render(<EmptyState {...defaultProps} />);
    expect(screen.getByText('There are no items to display.')).toBeInTheDocument();
  });

  it('should render action button when actionText and actionHref are provided', () => {
    render(<EmptyState {...defaultProps} actionText="Browse Products" actionHref="/products" />);

    const actionLink = screen.getByRole('link', { name: /browse products/i });
    expect(actionLink).toBeInTheDocument();
    expect(actionLink).toHaveAttribute('href', '/products');
  });

  it('should not render action button when actionText is not provided', () => {
    render(<EmptyState {...defaultProps} />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('should not render action button when actionHref is not provided', () => {
    render(<EmptyState {...defaultProps} actionText="Browse" />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('should apply custom icon color', () => {
    const { container } = render(<EmptyState {...defaultProps} iconColor="text-blue-600" />);

    const icon = container.querySelector('.text-blue-600');
    expect(icon).toBeInTheDocument();
  });

  it('should apply custom icon background color', () => {
    const { container } = render(
      <EmptyState {...defaultProps} iconBgColor="from-blue-100 to-blue-200" />
    );

    const iconContainer = container.querySelector('.from-blue-100');
    expect(iconContainer).toBeInTheDocument();
  });

  it('should have proper styling classes', () => {
    const { container } = render(<EmptyState {...defaultProps} />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('bg-white', 'rounded-xl', 'shadow-lg');
  });
});
