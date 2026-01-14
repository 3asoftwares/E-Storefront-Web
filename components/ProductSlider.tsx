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
  autoplayDelay = 5000 
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
          className="w-full flex-shrink-0 grid gap-6"
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
    <div className="relative">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out"
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
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-xl flex items-center justify-center text-gray-700 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 hover:text-white transition-all z-10 hover:scale-110"
            aria-label="Previous slide"
          >
            <FontAwesomeIcon icon={faChevronLeft} className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-xl flex items-center justify-center text-gray-700 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 hover:text-white transition-all z-10 hover:scale-110"
            aria-label="Next slide"
          >
            <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </>
      )}

      {maxIndex > 0 && (
        <div className="flex justify-center gap-1 mt-8">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all min-h-4 min-w-4 ${
                index === currentIndex
                ? 'bg-gradient-to-r from-black to-gray-400'
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
