'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

interface ProductSliderProps {
  children: React.ReactNode[];
  itemsPerView?: number;
  autoplay?: boolean;
  autoplayDelay?: number;
}

function ProductSliderComponent({
  children,
  itemsPerView = 4,
  autoplay = false,
  autoplayDelay = 5000,
}: ProductSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responsive, setResponsive] = useState(itemsPerView);
  const totalItems = children.length;

  const maxIndex = useMemo(
    () => Math.max(0, Math.ceil(totalItems / responsive) - 1),
    [totalItems, responsive]
  );

  const handleResize = useCallback(() => {
    const width = window.innerWidth;
    if (width < 640) {
      setResponsive(1);
    } else if (width < 768) {
      setResponsive(2);
    } else if (width < 1024) {
      setResponsive(3);
    } else {
      setResponsive(itemsPerView);
    }
  }, [itemsPerView]);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  useEffect(() => {
    if (!autoplay) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, autoplayDelay);

    return () => clearInterval(interval);
  }, [autoplay, autoplayDelay, maxIndex]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const slides = useMemo(
    () =>
      Array.from({ length: Math.ceil(totalItems / responsive) }).map((_, slideIndex) => (
        <div
          key={slideIndex}
          className="grid w-full flex-shrink-0 gap-3 px-1 xs:gap-4 xs:px-2 sm:gap-5 sm:px-0 md:gap-6"
          style={{
            gridTemplateColumns: `repeat(${responsive}, minmax(0, 1fr))`,
          }}
        >
          {children.slice(slideIndex * responsive, slideIndex * responsive + responsive)}
        </div>
      )),
    [totalItems, responsive, children]
  );

  return (
    <div className="relative px-2 xs:px-4 sm:px-6 md:px-8">
      <div className="overflow-hidden">
        <div
          className="flex py-3 transition-transform duration-500 ease-out xs:py-4 sm:py-5"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {slides}
        </div>
      </div>

      {maxIndex > 0 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 z-10 flex h-8 w-8 -translate-x-1 -translate-y-1/2 items-center justify-center rounded-full bg-white text-gray-700 shadow-xl transition-all hover:scale-110 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 hover:text-white active:scale-95 xs:h-9 xs:w-9 xs:-translate-x-2 sm:h-10 sm:w-10 sm:-translate-x-4 md:h-12 md:w-12 md:-translate-x-6"
            aria-label="Previous slide"
          >
            <FontAwesomeIcon icon={faChevronLeft} className="h-3 w-3 xs:h-4 xs:w-4 md:h-5 md:w-5" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 translate-x-1 items-center justify-center rounded-full bg-white text-gray-700 shadow-xl transition-all hover:scale-110 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 hover:text-white active:scale-95 xs:h-9 xs:w-9 xs:translate-x-2 sm:h-10 sm:w-10 sm:translate-x-4 md:h-12 md:w-12 md:translate-x-6"
            aria-label="Next slide"
          >
            <FontAwesomeIcon
              icon={faChevronRight}
              className="h-3 w-3 xs:h-4 xs:w-4 md:h-5 md:w-5"
            />
          </button>
        </>
      )}

      {maxIndex > 0 && (
        <div className="mt-4 flex justify-center gap-1.5 xs:mt-6 xs:gap-2 sm:mt-8">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`min-h-[10px] min-w-[10px] transition-all xs:min-h-3 xs:min-w-3 sm:min-h-4 sm:min-w-4 ${
                index === currentIndex
                  ? 'scale-110 bg-gradient-to-r from-black to-gray-400'
                  : 'bg-gray-300 hover:bg-gray-400'
              } rounded-full`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Memoized export to prevent unnecessary re-renders
export const ProductSlider = React.memo(ProductSliderComponent);
