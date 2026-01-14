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
  const isInCart = useMemo(
    () => items.some((item) => item.id === product.id),
    [items, product.id]
  );

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
    <div className="rounded-xl xs:rounded-2xl overflow-hidden bg-white border border-gray-200 hover:border-gray-400 shadow-md hover:shadow-xl sm:hover:shadow-2xl transition-all duration-300 group transform touch:hover:translate-y-0 pointer:hover:-translate-y-2 active:scale-[0.98]">
      <div
        className={`relative ${heightClasses[variant]} bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden`}
      >
        <Link href={`/products/${product.id}`} className="block w-full h-full">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-cover pointer:group-hover:scale-110 transition-transform duration-300"
              onError={handleImageError}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <FontAwesomeIcon icon={faBox} className="w-10 h-10 xs:w-12 xs:h-12 sm:w-16 sm:h-16 text-gray-400" />
            </div>
          )}
        </Link>

        {showWishlistButton && onWishlistToggle && (
          <button
            onClick={handleWishlistToggle}
            className="absolute top-2 right-2 xs:top-3 xs:right-3 w-9 h-9 xs:w-10 xs:h-10 min-w-[36px] min-h-[36px] bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white shadow-lg transition-all active:scale-95"
            title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <FontAwesomeIcon
              icon={faHeartSolid}
              className={`w-4 h-4 xs:w-5 xs:h-5 ${isInWishlist ? 'text-pink-600' : 'text-gray-600'}`}
            />
          </button>
        )}

        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white text-xs xs:text-sm font-semibold bg-red-500 px-3 py-1.5 xs:px-4 xs:py-2 rounded-lg">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="p-3 xs:p-4 sm:p-5">
        <Link
          href={`/products/${product.id}`}
          className="font-bold text-gray-900 hover:text-gray-600 text-sm xs:text-base sm:text-lg transition-colors line-clamp-2 min-h-[40px] xs:min-h-[48px] sm:min-h-[56px] block"
        >
          {product.name}
        </Link>

        <div className="flex items-center mb-2 xs:mb-3 h-4 xs:h-5">
          {variant !== 'compact' && (product.rating || product.reviewCount !== 0) && (
            <>
              <div className="flex text-yellow-500 text-xs xs:text-sm sm:text-base">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>{i < Math.floor(product.rating || 0) ? '★' : '☆'}</span>
                ))}
              </div>
              {product.reviewCount !== undefined && (
                <span className="text-[10px] xs:text-xs text-gray-600 ml-1.5 xs:ml-2 font-medium">
                  ({product.reviewCount})
                </span>
              )}
            </>
          )}
        </div>

        <p className="text-xl xs:text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3 xs:mb-4">{formatPrice(product.price)}</p>

        {onAddToCart && (
          <div className="flex justify-center">
            {isOutOfStock ? (
              <div className="text-center text-xs xs:text-sm text-red-600 font-semibold py-2">
                Out of Stock
              </div>
            ) : isInCart ? (
              <Button size="sm" variant="primary" disabled className="opacity-75 cursor-default w-full xs:w-auto min-h-[44px]">
                <FontAwesomeIcon icon={faCheck} className="mr-1.5 xs:mr-2" />
                <span className="text-xs xs:text-sm">In Cart</span>
              </Button>
            ) : (
                  <Button size="sm" variant="outline" onClick={handleAddToCart} className="w-full xs:w-auto min-h-[44px] active:scale-95 transition-transform">
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
