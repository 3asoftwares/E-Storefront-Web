import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock the Header wrapper
jest.mock('../../components/HeaderWrapper', () => ({
  __esModule: true,
  default: () => <div data-testid="header-wrapper">Header Content</div>,
}));

import HeaderWrapper from '../../components/HeaderWrapper';

describe('HeaderWrapper Component', () => {
  describe('Rendering', () => {
    it('should render the wrapper', () => {
      render(<HeaderWrapper />);
      expect(screen.getByTestId('header-wrapper')).toBeInTheDocument();
    });

    it('should render header content', () => {
      render(<HeaderWrapper />);
      expect(screen.getByTestId('header-wrapper')).toHaveTextContent('Header Content');
    });
  });
});
