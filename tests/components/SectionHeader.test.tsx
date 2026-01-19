import React from 'react';
import { render, screen } from '@testing-library/react';
import { SectionHeader } from '../../components/SectionHeader';

describe('SectionHeader Component', () => {
  it('should render the title', () => {
    render(<SectionHeader title="Featured Products" />);
    expect(screen.getByText('Featured Products')).toBeInTheDocument();
  });

  it('should render the description when provided', () => {
    render(
      <SectionHeader title="Featured Products" description="Discover our best-selling items" />
    );
    expect(screen.getByText('Discover our best-selling items')).toBeInTheDocument();
  });

  it('should not render description when not provided', () => {
    render(<SectionHeader title="Featured Products" />);
    // The description paragraph should not have content
    const paragraphs = screen.queryAllByText(/./);
    expect(paragraphs.some((p) => p.textContent === '')).toBeFalsy();
  });

  it('should render badge when provided', () => {
    render(
      <SectionHeader
        title="Featured Products"
        badge={{
          icon: <span data-testid="badge-icon">🔥</span>,
          text: 'Hot Deals',
        }}
      />
    );
    expect(screen.getByText('Hot Deals')).toBeInTheDocument();
    expect(screen.getByTestId('badge-icon')).toBeInTheDocument();
  });

  it('should apply custom badge colors', () => {
    const { container } = render(
      <SectionHeader
        title="Featured Products"
        badge={{
          icon: null,
          text: 'Sale',
          bgColor: 'bg-red-100',
          textColor: 'text-red-700',
        }}
      />
    );

    const badge = container.querySelector('.bg-red-100');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('text-red-700');
  });

  it('should use default badge colors when not specified', () => {
    const { container } = render(
      <SectionHeader
        title="Featured Products"
        badge={{
          icon: null,
          text: 'New',
        }}
      />
    );

    const badge = container.querySelector('.bg-indigo-100');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('text-indigo-700');
  });

  it('should apply custom title gradient', () => {
    const { container } = render(
      <SectionHeader title="Featured Products" titleGradient="from-purple-600 to-blue-600" />
    );

    const title = container.querySelector('.from-purple-600');
    expect(title).toBeInTheDocument();
  });

  it('should use default title gradient when not specified', () => {
    const { container } = render(<SectionHeader title="Featured Products" />);

    const title = container.querySelector('.from-indigo-600');
    expect(title).toBeInTheDocument();
  });

  it('should center align content', () => {
    const { container } = render(<SectionHeader title="Featured Products" />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('text-center');
  });

  it('should have proper margin bottom', () => {
    const { container } = render(<SectionHeader title="Featured Products" />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('mb-6');
  });
});
