'use client';

import React, { useCallback, useMemo } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShoppingCart,
  faHeart as faHeartSolid,
  faBox,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import { formatPrice } from '@3asoftwares/utils/client';
import { Button } from '@3asoftwares/ui';
import { useCartStore } from '@/store/cartStore';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl?: string;
    stock?: number;
    rating?: number;
    reviewCount?: number;
    sellerId?: string;
  };
  onAddToCart?: (product: any) => void;
  onWishlistToggle?: (product: any) => void;
  isInWishlist?: boolean;
  showWishlistButton?: boolean;
  variant?: 'default' | 'compact' | 'large';
}

export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  e.currentTarget.style.display = 'none';
  const parent = e.currentTarget.parentElement;
  if (parent && !parent.querySelector('.fallback-icon')) {
    const fallback = document.createElement('div');
    fallback.className =
      'fallback-icon absolute inset-0 flex items-center justify-center text-6xl text-gray-400';
    const icon = document.createElement('i');
    icon.className = 'fa fa-box';
    fallback.appendChild(icon);
    parent.appendChild(fallback);
  }
};

const ProductCardComponent: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onWishlistToggle,
  isInWishlist = false,
  showWishlistButton = false,
  variant = 'default',
}) => {
  const isOutOfStock = useMemo(() => product.stock === 0, [product.stock]);
  const { items } = useCartStore();
  const isInCart = useMemo(() => items.some((item) => item.id === product.id), [items, product.id]);

  const heightClasses = useMemo(
    () => ({
      default: 'h-40 xs:h-48 sm:h-56',
      compact: 'h-28 xs:h-32',
      large: 'h-52 xs:h-60 sm:h-64',
    }),
    []
  );

  const handleAddToCart = useCallback(() => {
    onAddToCart?.(product);
  }, [onAddToCart, product]);

  const handleWishlistToggle = useCallback(() => {
    onWishlistToggle?.(product);
  }, [onWishlistToggle, product]);

  return (
    <div className="group transform overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md transition-all duration-300 hover:border-gray-400 hover:shadow-xl active:scale-[0.98] xs:rounded-2xl sm:hover:shadow-2xl touch:hover:translate-y-0 pointer:hover:-translate-y-2">
      <div
        className={`relative ${heightClasses[variant]} overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200`}
      >
        <Link href={`/products/${product.id}`} className="block h-full w-full">
          {product.imageUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={product.imageUrl}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 pointer:group-hover:scale-110"
              onError={handleImageError}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <FontAwesomeIcon
                icon={faBox}
                className="h-10 w-10 text-gray-400 xs:h-12 xs:w-12 sm:h-16 sm:w-16"
              />
            </div>
          )}
        </Link>

        {showWishlistButton && onWishlistToggle && (
          <button
            onClick={handleWishlistToggle}
            className="absolute right-2 top-2 flex h-9 min-h-[36px] w-9 min-w-[36px] items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm transition-all hover:bg-white active:scale-95 xs:right-3 xs:top-3 xs:h-10 xs:w-10"
            title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <FontAwesomeIcon
              icon={faHeartSolid}
              className={`h-4 w-4 xs:h-5 xs:w-5 ${isInWishlist ? 'text-pink-600' : 'text-gray-600'}`}
            />
          </button>
        )}

        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white xs:px-4 xs:py-2 xs:text-sm">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="p-3 xs:p-4 sm:p-5">
        <Link
          href={`/products/${product.id}`}
          className="line-clamp-2 block min-h-[40px] text-sm font-bold text-gray-900 transition-colors hover:text-gray-600 xs:min-h-[48px] xs:text-base sm:min-h-[56px] sm:text-lg"
        >
          {product.name}
        </Link>

        <div className="mb-2 flex h-4 items-center xs:mb-3 xs:h-5">
          {variant !== 'compact' && (product.rating || product.reviewCount !== 0) && (
            <>
              <div className="flex text-xs text-yellow-500 xs:text-sm sm:text-base">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>{i < Math.floor(product.rating || 0) ? '★' : '☆'}</span>
                ))}
              </div>
              {product.reviewCount !== undefined && (
                <span className="ml-1.5 text-[10px] font-medium text-gray-600 xs:ml-2 xs:text-xs">
                  ({product.reviewCount})
                </span>
              )}
            </>
          )}
        </div>

        <p className="mb-3 text-xl font-extrabold text-gray-900 xs:mb-4 xs:text-2xl sm:text-3xl">
          {formatPrice(product.price)}
        </p>

        {onAddToCart && (
          <div className="flex justify-center">
            {isOutOfStock ? (
              <div className="py-2 text-center text-xs font-semibold text-red-600 xs:text-sm">
                Out of Stock
              </div>
            ) : isInCart ? (
              <Button
                size="sm"
                variant="primary"
                disabled
                className="min-h-[44px] w-full cursor-default opacity-75 xs:w-auto"
              >
                <FontAwesomeIcon icon={faCheck} className="mr-1.5 xs:mr-2" />
                <span className="text-xs xs:text-sm">In Cart</span>
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={handleAddToCart}
                className="min-h-[44px] w-full transition-transform active:scale-95 xs:w-auto"
              >
                <FontAwesomeIcon icon={faShoppingCart} className="mr-1.5 xs:mr-2" />
                <span className="text-xs xs:text-sm">Add to Cart</span>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Memoized export to prevent unnecessary re-renders
export const ProductCard = React.memo(ProductCardComponent);
