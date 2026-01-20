'use client';

import { useCartStore } from '@/store/cartStore';
import Link from 'next/link';
import { useToast } from '@/lib/hooks/useToast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faShoppingCart, faSmile } from '@fortawesome/free-solid-svg-icons';
import { PageHeader, EmptyState } from '@/components';
import { Button } from '@3asoftwares/ui';

export const dynamic = 'force-dynamic';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, addItem } = useCartStore();
  const { showToast } = useToast();

  const handleAddToCart = (item: any) => {
    addItem({
      productId: item.productId,
      id: item.productId,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
    });
    showToast('Added to cart!', 'success');
  };

  const handleRemove = (productId: string) => {
    removeFromWishlist(productId);
    showToast('Removed from wishlist', 'info');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        icon={faHeart}
        title="My Wishlist"
        badge={
          wishlist.length > 0
            ? {
                count: wishlist.length,
                label: wishlist.length === 1 ? 'item' : 'items',
              }
            : undefined
        }
        iconGradient="from-gray-700 to-gray-900"
        titleGradient="from-gray-900 to-black"
      />

      <div className="mx-auto max-w-7xl px-3 py-6 xs:px-4 xs:py-8 sm:px-6 sm:py-12 lg:px-8">
        {wishlist.length === 0 ? (
          <EmptyState
            icon={faHeart}
            title="Your Wishlist is Empty"
            description="Save items you love so you can find them easily later. Start adding your favorites!"
            actionText="Discover Products →"
            actionHref="/products"
            iconColor="text-pink-600"
            iconBgColor="from-pink-100 to-rose-100"
          />
        ) : (
          <div className="space-y-4 xs:space-y-5 sm:space-y-6">
            <div className="flex flex-col items-start justify-between gap-2 rounded-lg bg-white p-3 shadow-md xs:flex-row xs:items-center xs:gap-4 xs:rounded-xl xs:p-4">
              <p className="text-sm font-semibold text-gray-700 xs:text-base">
                Showing {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}
              </p>
              <Link
                href="/products"
                className="flex items-center gap-2 text-sm font-semibold text-pink-600 hover:text-pink-700 xs:text-base"
              >
                <FontAwesomeIcon icon={faShoppingCart} className="h-3.5 w-3.5 xs:h-4 xs:w-4" />
                Continue Shopping
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-3 xs:grid-cols-2 xs:gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
              {wishlist.map((item) => (
                <div
                  key={item.productId}
                  className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg transition-all duration-300 hover:border-pink-300 hover:shadow-2xl xs:rounded-2xl"
                >
                  <Link href={`/products/${item.productId}`}>
                    <div className="relative h-40 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 xs:h-48 sm:h-56">
                      {item.image ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={item.image}
                          alt={item.name}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-300 pointer:group-hover:scale-110"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <FontAwesomeIcon
                            icon={faHeart}
                            className="h-10 w-10 text-gray-400 xs:h-12 xs:w-12 sm:h-16 sm:w-16"
                          />
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="p-3 xs:p-4 sm:p-5">
                    <Link
                      href={`/products/${item.productId}`}
                      className="mb-2 line-clamp-2 block h-12 text-sm font-bold text-gray-900 transition-colors hover:text-pink-600 xs:mb-3 xs:h-14 xs:text-base sm:h-20 sm:text-lg"
                    >
                      {item.name}
                    </Link>

                    <p className="mb-3 bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-xl font-extrabold text-transparent xs:mb-4 xs:text-2xl sm:text-3xl">
                      ${item.price.toFixed(2)}
                    </p>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAddToCart(item)}
                        className="flex min-h-[40px] flex-1 items-center justify-center gap-1 xs:min-h-[44px] xs:gap-2"
                      >
                        <FontAwesomeIcon
                          icon={faShoppingCart}
                          className="h-3.5 w-3.5 xs:h-4 xs:w-4"
                        />
                        <span className="text-xs xs:text-sm">Add</span>
                      </Button>
                      <Button
                        onClick={() => handleRemove(item.productId)}
                        variant="primary"
                        size="sm"
                        fullWidth={false}
                        className="flex min-h-[40px] items-center gap-2 px-3 xs:min-h-[44px] xs:px-4"
                      >
                        <FontAwesomeIcon icon={faHeart} className="h-3.5 w-3.5 xs:h-4 xs:w-4" />
                      </Button>
                    </div>

                    <p className="mt-2 text-center text-[10px] text-gray-500 xs:mt-3 xs:text-xs">
                      Added {new Date(item.addedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col items-center justify-between gap-3 rounded-lg bg-white p-4 shadow-md xs:gap-4 xs:rounded-xl xs:p-5 sm:flex-row sm:p-6">
              <div className="text-center sm:text-left">
                <p className="mb-1 text-base font-bold text-gray-900 xs:text-lg">
                  <FontAwesomeIcon icon={faSmile} className="mr-2" />
                  Love Everything?
                </p>
                <p className="text-xs text-gray-600 xs:text-sm">
                  Add all items to your cart and checkout in seconds!
                </p>
              </div>
              <Button
                onClick={() => {
                  if (wishlist.length === 0) return;
                  wishlist.forEach((item) => {
                    addItem({
                      productId: item.productId,
                      id: item.productId,
                      name: item.name,
                      price: item.price,
                      quantity: 1,
                      image: item.image,
                    });
                  });
                  showToast(`Added ${wishlist.length} items to cart!`, 'success');
                }}
                disabled={wishlist.length === 0}
                variant="primary"
                size="md"
                fullWidth={false}
                className="min-h-[44px] w-full xs:w-auto"
              >
                Add All to Cart
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
