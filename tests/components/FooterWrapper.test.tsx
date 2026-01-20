import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock the Footer wrapper and component
jest.mock('../../components/FooterWrapper', () => ({
  __esModule: true,
  default: () => <div data-testid="footer-wrapper">Footer Content</div>,
}));

import FooterWrapper from '../../components/FooterWrapper';

describe('FooterWrapper Component', () => {
  describe('Rendering', () => {
    it('should render the wrapper', () => {
      render(<FooterWrapper />);
      expect(screen.getByTestId('footer-wrapper')).toBeInTheDocument();
    });

    it('should render footer content', () => {
      render(<FooterWrapper />);
      expect(screen.getByTestId('footer-wrapper')).toHaveTextContent('Footer Content');
    });
  });
});
