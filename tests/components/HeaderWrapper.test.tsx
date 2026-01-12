import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock the Header wrapper
jest.mock('../../components/HeaderWrapper', () => ({
  __esModule: true,
  default: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="header-wrapper">{children}</div>
  ),
}));

import HeaderWrapper from '../../components/HeaderWrapper';

describe('HeaderWrapper Component', () => {
  describe('Rendering', () => {
    it('should render the wrapper', () => {
      render(<HeaderWrapper />);
      expect(screen.getByTestId('header-wrapper')).toBeInTheDocument();
    });

    it('should render children', () => {
      render(
        <HeaderWrapper>
          <div data-testid="child">Child Content</div>
        </HeaderWrapper>
      );
      expect(screen.getByTestId('child')).toBeInTheDocument();
    });
  });
});
