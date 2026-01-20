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
      className="group min-h-[44px] overflow-hidden rounded-lg bg-white shadow transition-all hover:shadow-lg active:scale-[0.98] xs:rounded-xl"
    >
      <div className="relative h-24 overflow-hidden bg-gray-100 xs:h-28 sm:h-32">
        {product.imageUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 pointer:group-hover:scale-110"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const parent = e.currentTarget.parentElement;
              if (parent && !parent.querySelector('.fallback-icon')) {
                const fallback = document.createElement('div');
                fallback.className =
                  'fallback-icon absolute inset-0 flex items-center justify-center text-3xl text-gray-400';
                const icon = document.createElement('i');
                icon.className = 'fa fa-box';
                fallback.appendChild(icon);
                parent.appendChild(fallback);
              }
            }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-2xl text-gray-400 xs:text-3xl">
            <FontAwesomeIcon icon={faBox} />
          </div>
        )}
      </div>
      <div className="p-2 xs:p-2.5 sm:p-3">
        <h3 className="mb-1 line-clamp-2 min-h-[32px] text-xs font-semibold text-gray-900 transition-colors group-hover:text-gray-600 xs:mb-2 xs:min-h-[40px] xs:text-sm">
          {product.name}
        </h3>
        <p className="text-base font-bold text-gray-900 xs:text-lg">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
};
