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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md">
          <h1 className="text-xl font-semibold text-red-800 mb-2">Product Not Found</h1>
          <p className="text-red-700 mb-4">The product you're looking for doesn't exist.</p>
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
      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-3 xs:py-4 flex gap-2 text-xs xs:text-sm text-gray-600 overflow-x-auto">
        <a href="/" className="hover:text-blue-600 whitespace-nowrap">
          Home
        </a>
        <span>/</span>
        <a href="/products" className="hover:text-blue-600 whitespace-nowrap">
          Products
        </a>
        <span>/</span>
        <span className="truncate">{product?.category || 'Product'}</span>
      </div>

      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-4 xs:py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 xs:gap-6 sm:gap-8 bg-white rounded-lg xs:rounded-xl shadow-md xs:shadow-lg p-4 xs:p-5 sm:p-6 md:p-8">
          <div>
            <div className="mb-3 xs:mb-4 relative">
              <img
                src={images[selectedImage]}
                alt={product?.name || 'Product'}
                className="w-full h-64 xs:h-72 sm:h-80 md:h-96 object-cover rounded-lg bg-gray-200"
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
                    className={`w-16 h-16 rounded border-2 overflow-hidden ${
                      selectedImage === idx ? 'border-blue-500' : 'border-gray-300'
                    }`}
                  >
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>

            <div className="flex items-center mb-3 xs:mb-4 flex-wrap gap-1">
              <div className="flex text-yellow-400 text-base xs:text-lg">
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
              <span className="text-gray-600 ml-2 text-sm xs:text-base">
                {(product.rating || 0).toFixed(1)} ({product.reviewCount || 0} reviews)
              </span>
            </div>

            <div className="mb-4 xs:mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl xs:text-3xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
              </div>
            </div>

            <div className="mb-4 xs:mb-6">
              {product.stock > 0 ? (
                <div className="text-green-600 font-semibold text-sm xs:text-base">
                  {product.stock > 10 ? 'In Stock' : `Only ${product.stock} left in stock`}
                </div>
              ) : (
                  <div className="text-red-600 font-semibold text-sm xs:text-base">Out of Stock</div>
              )}
            </div>

            <div className="mb-4 xs:mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
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
                  className="w-14 xs:w-16 text-center !mb-0"
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

            <div className="flex flex-col xs:flex-row gap-2 xs:gap-3 mb-6 xs:mb-8">
              <Button onClick={handleAddToCart} disabled={product.stock === 0} className="flex-1 min-h-[48px]">
                Add to Cart
              </Button>
              <Button
                onClick={handleWishlistToggle}
                variant={isInWishlist(product.id) ? 'secondary' : 'outline'}
                className="flex-1 min-h-[48px]"
              >
                {isInWishlist(product.id) ? '♥ Wishlist' : '♡ Add to Wishlist'}
              </Button>
            </div>

            <div className="border-t pt-4 xs:pt-6">
              <h3 className="text-base xs:text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700 text-sm xs:text-base line-clamp-4">{product.description}</p>
              <p className="text-gray-700 text-sm xs:text-base line-clamp-4 mt-2">{product.tags.join(', ')}</p>
            </div>

            <div className="border-t mt-4 xs:mt-6 pt-4 xs:pt-6 text-xs xs:text-sm text-gray-600">
              <p>
                Category: <span className="text-gray-900 font-medium">{product.category}</span>
              </p>
              <p className="mt-1">
                Sold by:{' '}
                <span className="text-gray-900 font-medium">
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
