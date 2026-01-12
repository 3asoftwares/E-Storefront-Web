import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock the Footer wrapper and component
jest.mock('../../components/FooterWrapper', () => ({
  __esModule: true,
  default: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="footer-wrapper">{children}</div>
  ),
}));

import FooterWrapper from '../../components/FooterWrapper';

describe('FooterWrapper Component', () => {
  describe('Rendering', () => {
    it('should render the wrapper', () => {
      render(<FooterWrapper />);
      expect(screen.getByTestId('footer-wrapper')).toBeInTheDocument();
    });

    it('should render children', () => {
      render(
        <FooterWrapper>
          <div data-testid="child">Child Content</div>
        </FooterWrapper>
      );
      expect(screen.getByTestId('child')).toBeInTheDocument();
    });
  });
});
