'use client';

import Link from 'next/link';
import { formatPrice } from '@3asoftwares/utils/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox } from '@fortawesome/free-solid-svg-icons';

interface ProductCardCompactProps {
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl?: string;
  };
}

export const ProductCardCompact: React.FC<ProductCardCompactProps> = ({ product }) => {
  return (
    <Link
      href={`/products/${product.id}`}
      className="rounded-lg xs:rounded-xl overflow-hidden bg-white shadow hover:shadow-lg transition-all group active:scale-[0.98] min-h-[44px]"
    >
      <div className="relative h-24 xs:h-28 sm:h-32 bg-gray-100 overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover pointer:group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const parent = e.currentTarget.parentElement;
              if (parent && !parent.querySelector('.fallback-icon')) {
                const fallback = document.createElement('div');
                fallback.className = 'fallback-icon absolute inset-0 flex items-center justify-center text-3xl text-gray-400';
                const icon = document.createElement('i');
                icon.className = 'fa fa-box';
                fallback.appendChild(icon);
                parent.appendChild(fallback);
              }
            }}
          />
        ) : (
            <div className="absolute inset-0 flex items-center justify-center text-2xl xs:text-3xl text-gray-400">
            <FontAwesomeIcon icon={faBox} />
          </div>
        )}
      </div>
      <div className="p-2 xs:p-2.5 sm:p-3">
        <h3 className="font-semibold text-xs xs:text-sm text-gray-900 line-clamp-2 mb-1 xs:mb-2 group-hover:text-gray-600 transition-colors min-h-[32px] xs:min-h-[40px]">
          {product.name}
        </h3>
        <p className="text-base xs:text-lg font-bold text-gray-900">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
};
