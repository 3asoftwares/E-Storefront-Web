'use client';

import React, { useState, useEffect, useRef } from 'react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
    fallback?: React.ReactNode;
    threshold?: number;
    className?: string;
    onError?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
}

/**
 * LazyImage Component - Implements lazy loading for images using Intersection Observer
 * Only loads images when they're about to enter the viewport
 * 
 * @param src - Image source URL
 * @param alt - Alternative text for the image
 * @param fallback - Optional fallback component to show on error
 * @param threshold - How far from viewport to start loading (0-1, default: 0.1)
 * @param className - CSS classes
 * @param onError - Error handler
 * 
 * @example
 * <LazyImage 
 *   src="/product.jpg" 
 *   alt="Product" 
 *   className="w-full h-full object-cover"
 * />
 */
export const LazyImage: React.FC<LazyImageProps> = React.memo(({
    src,
    alt,
    fallback,
    threshold = 0.1,
    className = '',
    onError,
    ...props
}) => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        if (!imgRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setImageSrc(src);
                        observer.disconnect();
                    }
                });
            },
            {
                rootMargin: '50px',
                threshold,
            }
        );

        observer.observe(imgRef.current);

        return () => {
            observer.disconnect();
        };
    }, [src, threshold]);

    const handleLoad = () => {
        setIsLoaded(true);
    };

    const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        setHasError(true);
        onError?.(e);
    };

    if (hasError && fallback) {
        return <>{fallback}</>;
    }

    return (
        <>
            <img
                ref={imgRef}
                src={imageSrc || undefined}
                alt={alt}
                className={`${className} ${!isLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
                onLoad={handleLoad}
                onError={handleError}
                {...props}
            />
            {!isLoaded && imageSrc && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            )}
        </>
    );
});

LazyImage.displayName = 'LazyImage';
