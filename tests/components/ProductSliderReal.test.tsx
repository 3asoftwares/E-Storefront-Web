import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ProductSlider } from '../../components/ProductSlider';

describe('ProductSlider', () => {
    const mockChildren = [
        <div key="1" data-testid="slide-1">Product 1</div>,
        <div key="2" data-testid="slide-2">Product 2</div>,
        <div key="3" data-testid="slide-3">Product 3</div>,
        <div key="4" data-testid="slide-4">Product 4</div>,
        <div key="5" data-testid="slide-5">Product 5</div>,
        <div key="6" data-testid="slide-6">Product 6</div>,
        <div key="7" data-testid="slide-7">Product 7</div>,
        <div key="8" data-testid="slide-8">Product 8</div>,
    ];

    beforeEach(() => {
        jest.useFakeTimers();
        // Mock window.innerWidth
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: 1200,
        });
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should render all children', () => {
        render(<ProductSlider>{mockChildren}</ProductSlider>);

        expect(screen.getByTestId('slide-1')).toBeInTheDocument();
        expect(screen.getByTestId('slide-2')).toBeInTheDocument();
    });

    it('should render navigation buttons when there are multiple slides', () => {
        render(<ProductSlider itemsPerView={2}>{mockChildren}</ProductSlider>);

        expect(screen.getByLabelText('Previous slide')).toBeInTheDocument();
        expect(screen.getByLabelText('Next slide')).toBeInTheDocument();
    });

    it('should not render navigation when all items fit in one slide', () => {
        const fewChildren = [
            <div key="1">Product 1</div>,
            <div key="2">Product 2</div>,
        ];
        render(<ProductSlider itemsPerView={4}>{fewChildren}</ProductSlider>);

        expect(screen.queryByLabelText('Previous slide')).not.toBeInTheDocument();
        expect(screen.queryByLabelText('Next slide')).not.toBeInTheDocument();
    });

    it('should navigate to next slide when clicking next button', () => {
        render(<ProductSlider itemsPerView={2}>{mockChildren}</ProductSlider>);

        const nextButton = screen.getByLabelText('Next slide');
        fireEvent.click(nextButton);

        // Check that the slider container has moved
        const slider = screen.getByTestId('slide-1').parentElement?.parentElement;
        expect(slider).toHaveStyle({ transform: 'translateX(-100%)' });
    });

    it('should navigate to previous slide when clicking previous button', () => {
        render(<ProductSlider itemsPerView={2}>{mockChildren}</ProductSlider>);

        const nextButton = screen.getByLabelText('Next slide');
        const prevButton = screen.getByLabelText('Previous slide');

        fireEvent.click(nextButton);
        fireEvent.click(prevButton);

        const slider = screen.getByTestId('slide-1').parentElement?.parentElement;
        expect(slider).toHaveStyle({ transform: 'translateX(-0%)' });
    });

    it('should loop to last slide when clicking previous on first slide', () => {
        render(<ProductSlider itemsPerView={2}>{mockChildren}</ProductSlider>);

        const prevButton = screen.getByLabelText('Previous slide');
        fireEvent.click(prevButton);

        // Should go to last slide
        const slider = screen.getByTestId('slide-1').parentElement?.parentElement;
        expect(slider).toHaveStyle({ transform: 'translateX(-300%)' });
    });

    it('should loop to first slide when clicking next on last slide', () => {
        render(<ProductSlider itemsPerView={2}>{mockChildren}</ProductSlider>);

        const nextButton = screen.getByLabelText('Next slide');

        // Go to last slide
        fireEvent.click(nextButton);
        fireEvent.click(nextButton);
        fireEvent.click(nextButton);
        fireEvent.click(nextButton);

        // Should loop back to first
        const slider = screen.getByTestId('slide-1').parentElement?.parentElement;
        expect(slider).toHaveStyle({ transform: 'translateX(-0%)' });
    });

    it('should render dot indicators', () => {
        render(<ProductSlider itemsPerView={2}>{mockChildren}</ProductSlider>);

        const indicators = screen.getAllByLabelText(/Go to slide/);
        expect(indicators.length).toBeGreaterThan(1);
    });

    it('should navigate to specific slide when clicking indicator', () => {
        render(<ProductSlider itemsPerView={2}>{mockChildren}</ProductSlider>);

        const indicator = screen.getByLabelText('Go to slide 3');
        fireEvent.click(indicator);

        const slider = screen.getByTestId('slide-1').parentElement?.parentElement;
        expect(slider).toHaveStyle({ transform: 'translateX(-200%)' });
    });

    it('should autoplay when enabled', () => {
        render(
            <ProductSlider itemsPerView={2} autoplay autoplayDelay={1000}>
                {mockChildren}
            </ProductSlider>
        );

        const slider = screen.getByTestId('slide-1').parentElement?.parentElement;
        expect(slider).toHaveStyle({ transform: 'translateX(-0%)' });

        act(() => {
            jest.advanceTimersByTime(1000);
        });

        expect(slider).toHaveStyle({ transform: 'translateX(-100%)' });
    });

    it('should be responsive on small screens', () => {
        Object.defineProperty(window, 'innerWidth', { value: 500 });

        render(<ProductSlider itemsPerView={4}>{mockChildren}</ProductSlider>);

        fireEvent(window, new Event('resize'));

        // On small screens, should show 1 item per view
        const slides = screen.getAllByTestId(/slide-/);
        expect(slides.length).toBe(8);
    });

    it('should be responsive on medium screens', () => {
        Object.defineProperty(window, 'innerWidth', { value: 700 });

        render(<ProductSlider itemsPerView={4}>{mockChildren}</ProductSlider>);

        fireEvent(window, new Event('resize'));

        const slides = screen.getAllByTestId(/slide-/);
        expect(slides.length).toBe(8);
    });

    it('should be responsive on tablet screens', () => {
        Object.defineProperty(window, 'innerWidth', { value: 900 });

        render(<ProductSlider itemsPerView={4}>{mockChildren}</ProductSlider>);

        fireEvent(window, new Event('resize'));

        const slides = screen.getAllByTestId(/slide-/);
        expect(slides.length).toBe(8);
    });

    it('should cleanup event listeners on unmount', () => {
        const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

        const { unmount } = render(<ProductSlider>{mockChildren}</ProductSlider>);
        unmount();

        expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
        removeEventListenerSpy.mockRestore();
    });

    it('should cleanup autoplay interval on unmount', () => {
        const clearIntervalSpy = jest.spyOn(global, 'clearInterval');

        const { unmount } = render(
            <ProductSlider autoplay autoplayDelay={1000}>
                {mockChildren}
            </ProductSlider>
        );
        unmount();

        expect(clearIntervalSpy).toHaveBeenCalled();
        clearIntervalSpy.mockRestore();
    });
});
