'use client';

import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import Link from 'next/link';
import { useToast } from '@/lib/hooks/useToast';
import { useIsAuthenticated } from '@/lib/hooks/useAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShoppingCart,
  faBox,
  faSmile,
  faCheckCircle,
  faCreditCard,
  faBuilding,
  faMobileAlt,
  faMinus,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { formatPrice } from '@3asoftwares/utils/client';
import { PageHeader, EmptyState } from '@/components';
import { Button } from '@3asoftwares/ui';
import { handleImageError } from '@/components/ProductCard';

export const dynamic = 'force-dynamic';

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const { showToast } = useToast();
  const { isAuthenticated } = useIsAuthenticated();

  const handleCheckout = () => {
    if (isAuthenticated) {
      router.push('/checkout');
    } else {
      router.push('/login?redirect=/checkout');
    }
  };

  const subtotal = items.reduce(
    (sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.08;
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + tax + shipping;

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <PageHeader
          icon={faShoppingCart}
          title="Shopping Cart"
          badge={
            items.length > 0
              ? {
                  count: items.length,
                  label: items.length === 1 ? 'item' : 'items',
                }
              : undefined
          }
          iconGradient="from-gray-700 to-gray-900"
          titleGradient="from-gray-900 to-black"
        />

        <div className="mx-auto max-w-7xl px-3 py-6 xs:px-4 xs:py-8 sm:px-6 sm:py-12 lg:px-8">
          {items.length === 0 ? (
            <EmptyState
              icon={faShoppingCart}
              title="Your Cart is Empty"
              description="Looks like you haven't added anything yet. Discover amazing products now!"
              actionText="Start Shopping →"
              actionHref="/products"
              iconColor="text-indigo-600"
              iconBgColor="from-indigo-100 to-purple-100"
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 xs:gap-6 lg:grid-cols-3 lg:gap-8">
              <div className="lg:col-span-2">
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg xs:rounded-2xl xs:shadow-xl">
                  {items.map((item: any, index: number) => (
                    <div
                      key={`${item.id}-${index}`}
                      className="flex flex-col gap-3 border-b border-gray-100 p-4 transition hover:bg-gray-50 xs:flex-row xs:gap-4 xs:p-5 sm:p-6"
                    >
                      <div className="flex flex-shrink-0 justify-center xs:justify-start">
                        <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 xs:h-24 xs:w-24">
                          {item.image ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={item.image}
                              alt={item.name}
                              loading="lazy"
                              className="h-full w-full object-cover"
                              onError={handleImageError}
                            />
                          ) : (
                            <FontAwesomeIcon
                              icon={faBox}
                              className="h-10 w-10 text-gray-400 xs:h-12 xs:w-12 sm:h-16 sm:w-16"
                            />
                          )}
                        </div>
                      </div>

                      <div className="min-w-0 flex-grow text-center xs:text-left">
                        <Link
                          href={`/products/${item.productId}`}
                          className="mb-1 line-clamp-2 block text-sm font-semibold text-gray-900 hover:text-blue-600 xs:text-base"
                        >
                          {item.name}
                        </Link>
                        <p className="mb-2 hidden text-xs text-gray-600 xs:mb-3 xs:block xs:text-sm">
                          SKU: {item.productId}
                        </p>
                        <p className="text-base font-bold text-blue-600 xs:text-lg">
                          {formatPrice(item.price)}
                        </p>
                      </div>

                      <div className="mt-2 flex flex-row items-center justify-between gap-2 xs:mt-0 xs:flex-col xs:items-end xs:justify-between">
                        <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-1">
                          <Button
                            onClick={() => {
                              updateQuantity(item.id, Math.max(1, item.quantity - 1));
                              if (item.quantity > 1) {
                                showToast('Quantity updated', 'info');
                              }
                            }}
                            variant="ghost"
                            size="sm"
                            className="min-h-[36px] min-w-[36px] !no-underline xs:min-h-[40px] xs:min-w-[40px]"
                            disabled={item.quantity <= 1}
                          >
                            <FontAwesomeIcon icon={faMinus} className="h-3 w-3" />
                          </Button>
                          <span className="min-w-[2rem] px-2 py-1 text-center text-sm font-semibold text-gray-900 xs:min-w-[2.5rem] xs:px-3 xs:text-base">
                            {item.quantity}
                          </span>
                          <Button
                            onClick={() => {
                              updateQuantity(item.id, item.quantity + 1);
                              showToast('Quantity updated', 'info');
                            }}
                            variant="ghost"
                            size="sm"
                            className="min-h-[36px] min-w-[36px] !no-underline xs:min-h-[40px] xs:min-w-[40px]"
                            disabled={item.quantity >= 99}
                          >
                            <FontAwesomeIcon icon={faPlus} className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="flex items-center gap-2 text-right xs:flex-col xs:items-end xs:gap-0">
                          <p className="text-base font-bold text-gray-900 xs:mb-2 xs:text-lg">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                          <Button
                            onClick={() => {
                              removeItem(item.id);
                              showToast('Item removed from cart', 'success');
                            }}
                            variant="ghost"
                            size="sm"
                            fullWidth={false}
                            className="min-h-[36px] text-xs font-medium text-red-600 hover:text-red-700 hover:underline xs:text-sm"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="border-t border-gray-100 bg-gray-50 p-4 text-right xs:p-5 sm:p-6">
                    <Button
                      onClick={() => {
                        if (confirm('Are you sure you want to clear the cart?')) {
                          clearCart();
                          showToast('Cart cleared', 'success');
                        }
                      }}
                      variant="ghost"
                      size="sm"
                      fullWidth={false}
                      className="min-h-[44px] text-xs font-medium text-red-600 hover:text-red-700 hover:underline xs:text-sm"
                    >
                      Clear Cart
                    </Button>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  className="!no-underline"
                  onClick={() => router.push('/products')}
                >
                  ← Continue Shopping
                </Button>
              </div>

              <div className="lg:col-span-1">
                <div className="sticky top-20 rounded-xl bg-white p-4 shadow-md xs:top-24 xs:p-5 sm:p-6">
                  <h2 className="mb-4 text-xl font-bold text-gray-900 xs:mb-6 xs:text-2xl">
                    Order Summary
                  </h2>

                  <div className="mb-4 space-y-3 border-b border-gray-200 pb-4 xs:mb-6 xs:space-y-4 xs:pb-6">
                    <div className="flex justify-between text-sm text-gray-700 xs:text-base">
                      <span className="font-medium">Subtotal</span>
                      <span className="font-semibold">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-700 xs:text-base">
                      <span className="font-medium">Tax (8%)</span>
                      <span className="font-semibold">{formatPrice(tax)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-700 xs:text-base">
                      <span className="font-medium">Shipping</span>
                      {shipping === 0 ? (
                        <span className="flex items-center gap-1 font-bold text-green-600">
                          FREE <FontAwesomeIcon icon={faCheckCircle} className="text-green-600" />
                        </span>
                      ) : (
                        <span className="font-semibold">{formatPrice(shipping)}</span>
                      )}
                    </div>
                  </div>

                  {shipping > 0 && subtotal < 100 && (
                    <div className="mb-6 rounded-lg border-2 border-blue-200 bg-blue-50 p-4">
                      <p className="mb-1 font-semibold text-blue-900">
                        <FontAwesomeIcon icon={faSmile} className="mr-2" />
                        Free Shipping Alert!
                      </p>
                      <p className="text-sm text-blue-800">
                        Add {formatPrice(100 - subtotal)} more for free shipping.
                      </p>
                    </div>
                  )}

                  <div className="mb-4 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 p-3 xs:mb-6 xs:p-4">
                    <p className="mb-1 text-xs font-medium text-gray-700 xs:text-sm">
                      Total Amount
                    </p>
                    <p className="text-2xl font-bold text-gray-900 xs:text-3xl sm:text-4xl">
                      {formatPrice(total)}
                    </p>
                  </div>

                  <Button onClick={handleCheckout} className="min-h-[48px]">
                    Proceed to Checkout
                  </Button>

                  <div className="mb-3 rounded-lg bg-gray-50 p-3 xs:mb-4">
                    <p className="mb-2 text-sm font-semibold text-gray-900">We Accept:</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="flex items-center gap-1 rounded border border-gray-200 bg-white px-2 py-1 text-xs">
                        <FontAwesomeIcon icon={faCreditCard} />
                        Card
                      </span>
                      <span className="flex items-center gap-1 rounded border border-gray-200 bg-white px-2 py-1 text-xs">
                        <FontAwesomeIcon icon={faBuilding} />
                        Bank
                      </span>
                      <span className="flex items-center gap-1 rounded border border-gray-200 bg-white px-2 py-1 text-xs">
                        <FontAwesomeIcon icon={faMobileAlt} />
                        UPI
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-start gap-2">
                      <FontAwesomeIcon icon={faCheckCircle} className="mt-0.5 text-green-600" />
                      <span>Secure SSL encrypted checkout</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <FontAwesomeIcon icon={faCheckCircle} className="mt-0.5 text-green-600" />
                      <span>Free returns within 30 days</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <FontAwesomeIcon icon={faCheckCircle} className="mt-0.5 text-green-600" />
                      <span>24/7 customer support</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
