'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { useProduct } from '@/lib/hooks';
import ProductReviews from '@/components/ProductReviews';
import { useToast } from '@/lib/hooks/useToast';
import { Button, Input } from '@3asoftwares/ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus, faStar } from '@fortawesome/free-solid-svg-icons';
import { formatPrice } from '@3asoftwares/utils/client';

export default function ProductDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addItem, isInWishlist, addToWishlist, removeFromWishlist, addRecentlyViewed } =
    useCartStore();
  const { showToast } = useToast();

  const { data: product, isLoading, error } = useProduct(id);

  useEffect(() => {
    if (product) {
      addRecentlyViewed({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.imageUrl || '/placeholder.png',
        category: product.category,
        viewedAt: Date.now(),
      });
    }
  }, [product, addRecentlyViewed]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="max-w-md rounded-lg border border-red-200 bg-red-50 p-8">
          <h1 className="mb-2 text-xl font-semibold text-red-800">Product Not Found</h1>
          <p className="mb-4 text-red-700">
            The product you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button
            variant="ghost"
            className="!no-underline"
            onClick={() => (window.location.href = '/products')}
          >
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!product) return;

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.imageUrl || '/placeholder.png',
      productId: product.id,
      sellerId: product.sellerId,
    });

    showToast(`${product.name} added to cart!`, 'success');
  };

  const handleWishlistToggle = () => {
    if (!product) return;

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      showToast('Removed from wishlist', 'info');
    } else {
      addToWishlist({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.imageUrl || '/placeholder.png',
        addedAt: Date.now(),
      });
      showToast('Added to wishlist', 'success');
    }
  };

  const images = [product?.imageUrl || '/placeholder.png'];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-3 py-3 text-xs text-gray-600 xs:px-4 xs:py-4 xs:text-sm sm:px-6 lg:px-8">
        <a href="/" className="whitespace-nowrap hover:text-blue-600">
          Home
        </a>
        <span>/</span>
        <a href="/products" className="whitespace-nowrap hover:text-blue-600">
          Products
        </a>
        <span>/</span>
        <span className="truncate">{product?.category || 'Product'}</span>
      </div>

      <div className="mx-auto max-w-7xl px-3 py-4 xs:px-4 xs:py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="grid grid-cols-1 gap-4 rounded-lg bg-white p-4 shadow-md xs:gap-6 xs:rounded-xl xs:p-5 xs:shadow-lg sm:gap-8 sm:p-6 md:p-8 lg:grid-cols-2">
          <div>
            <div className="relative mb-3 xs:mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={images[selectedImage]}
                alt={product?.name || 'Product'}
                className="h-64 w-full rounded-lg bg-gray-200 object-cover xs:h-72 sm:h-80 md:h-96"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent && !parent.querySelector('.fallback-icon')) {
                    const fallback = document.createElement('div');
                    fallback.className =
                      'fallback-icon absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-200 rounded-lg';
                    const icon = document.createElement('i');
                    icon.className = 'fas fa-box fa-5x';
                    fallback.appendChild(icon);
                    parent.appendChild(fallback);
                  }
                }}
              />
            </div>

            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`h-16 w-16 overflow-hidden rounded border-2 ${
                      selectedImage === idx ? 'border-blue-500' : 'border-gray-300'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt={`View ${idx + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <h1 className="mb-2 text-xl font-bold text-gray-900 xs:text-2xl sm:text-3xl">
              {product.name}
            </h1>

            <div className="mb-3 flex flex-wrap items-center gap-1 xs:mb-4">
              <div className="flex text-base text-yellow-400 xs:text-lg">
                {[...Array(5)].map((_, i) => (
                  <FontAwesomeIcon
                    key={i}
                    icon={faStar}
                    className={
                      i < Math.floor(product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'
                    }
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-600 xs:text-base">
                {(product.rating || 0).toFixed(1)} ({product.reviewCount || 0} reviews)
              </span>
            </div>

            <div className="mb-4 xs:mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900 xs:text-3xl">
                  {formatPrice(product.price)}
                </span>
              </div>
            </div>

            <div className="mb-4 xs:mb-6">
              {product.stock > 0 ? (
                <div className="text-sm font-semibold text-green-600 xs:text-base">
                  {product.stock > 10 ? 'In Stock' : `Only ${product.stock} left in stock`}
                </div>
              ) : (
                <div className="text-sm font-semibold text-red-600 xs:text-base">Out of Stock</div>
              )}
            </div>

            <div className="mb-4 xs:mb-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">Quantity</label>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity === 1}
                  variant="outline"
                  size="md"
                  fullWidth={false}
                  className="min-h-[44px] min-w-[44px]"
                >
                  <FontAwesomeIcon icon={faMinus} />
                </Button>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e: any) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  size="md"
                  max={product.stock}
                  className="!mb-0 w-14 text-center xs:w-16"
                />
                <Button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                  variant="outline"
                  size="md"
                  fullWidth={false}
                  className="min-h-[44px] min-w-[44px]"
                >
                  <FontAwesomeIcon icon={faPlus} />
                </Button>
              </div>
            </div>

            <div className="mb-6 flex flex-col gap-2 xs:mb-8 xs:flex-row xs:gap-3">
              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="min-h-[48px] flex-1"
              >
                Add to Cart
              </Button>
              <Button
                onClick={handleWishlistToggle}
                variant={isInWishlist(product.id) ? 'secondary' : 'outline'}
                className="min-h-[48px] flex-1"
              >
                {isInWishlist(product.id) ? '♥ Wishlist' : '♡ Add to Wishlist'}
              </Button>
            </div>

            <div className="border-t pt-4 xs:pt-6">
              <h3 className="mb-2 text-base font-semibold text-gray-900 xs:text-lg">Description</h3>
              <p className="line-clamp-4 text-sm text-gray-700 xs:text-base">
                {product.description}
              </p>
              <p className="mt-2 line-clamp-4 text-sm text-gray-700 xs:text-base">
                {product.tags.join(', ')}
              </p>
            </div>

            <div className="mt-4 border-t pt-4 text-xs text-gray-600 xs:mt-6 xs:pt-6 xs:text-sm">
              <p>
                Category: <span className="font-medium text-gray-900">{product.category}</span>
              </p>
              <p className="mt-1">
                Sold by:{' '}
                <span className="font-medium text-gray-900">
                  {product.seller?.name || 'Unknown Seller'}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 xs:mt-10 sm:mt-12">
          <ProductReviews
            productId={product.id}
            averageRating={product.rating || 0}
            totalReviews={product.reviewCount || 0}
          />
        </div>
      </div>
    </div>
  );
}
