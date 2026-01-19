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

        <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-6 xs:py-8 sm:py-12">
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 xs:gap-6 lg:gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl xs:rounded-2xl shadow-lg xs:shadow-xl overflow-hidden border border-gray-200">
                  {items.map((item: any, index: number) => (
                    <div
                      key={`${item.id}-${index}`}
                      className="flex flex-col xs:flex-row gap-3 xs:gap-4 p-4 xs:p-5 sm:p-6 border-b border-gray-100 hover:bg-gray-50 transition"
                    >
                      <div className="flex-shrink-0 flex justify-center xs:justify-start">
                        <div className="w-20 h-20 xs:w-24 xs:h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              loading="lazy"
                              className="w-full h-full object-cover"
                              onError={handleImageError}
                            />
                          ) : (
                            <FontAwesomeIcon icon={faBox} className="w-10 h-10 xs:w-12 xs:h-12 sm:w-16 sm:h-16 text-gray-400" />
                          )}
                        </div>
                      </div>

                      <div className="flex-grow min-w-0 text-center xs:text-left">
                        <Link
                          href={`/products/${item.productId}`}
                          className="font-semibold text-gray-900 hover:text-blue-600 block mb-1 text-sm xs:text-base line-clamp-2"
                        >
                          {item.name}
                        </Link>
                        <p className="text-xs xs:text-sm text-gray-600 mb-2 xs:mb-3 hidden xs:block">SKU: {item.productId}</p>
                        <p className="text-base xs:text-lg font-bold text-blue-600">{formatPrice(item.price)}</p>
                      </div>

                      <div className="flex flex-row xs:flex-col items-center xs:items-end justify-between xs:justify-between mt-2 xs:mt-0 gap-2">
                        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                          <Button
                            onClick={() => {
                              updateQuantity(item.id, Math.max(1, item.quantity - 1));
                              if (item.quantity > 1) {
                                showToast('Quantity updated', 'info');
                              }
                            }}
                            variant="ghost"
                            size="sm"
                            className="!no-underline min-h-[36px] min-w-[36px] xs:min-h-[40px] xs:min-w-[40px]"
                            disabled={item.quantity <= 1}
                          >
                            <FontAwesomeIcon icon={faMinus} className="w-3 h-3" />
                          </Button>
                          <span className="px-2 xs:px-3 py-1 font-semibold text-gray-900 min-w-[2rem] xs:min-w-[2.5rem] text-center text-sm xs:text-base">
                            {item.quantity}
                          </span>
                          <Button
                            onClick={() => {
                              updateQuantity(item.id, item.quantity + 1);
                              showToast('Quantity updated', 'info');
                            }}
                            variant="ghost"
                            size="sm"
                            className="!no-underline min-h-[36px] min-w-[36px] xs:min-h-[40px] xs:min-w-[40px]"
                            disabled={item.quantity >= 99}
                          >
                            <FontAwesomeIcon icon={faPlus} className="w-3 h-3" />
                          </Button>
                        </div>

                        <div className="text-right flex xs:flex-col items-center xs:items-end gap-2 xs:gap-0">
                          <p className="text-base xs:text-lg font-bold text-gray-900 xs:mb-2">
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
                            className="text-red-600 hover:text-red-700 text-xs xs:text-sm font-medium hover:underline min-h-[36px]"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                    <div className="p-4 xs:p-5 sm:p-6 bg-gray-50 border-t border-gray-100 text-right">
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
                        className="text-red-600 hover:text-red-700 text-xs xs:text-sm font-medium hover:underline min-h-[44px]"
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
                <div className="bg-white rounded-xl shadow-md p-4 xs:p-5 sm:p-6 sticky top-20 xs:top-24">
                  <h2 className="text-xl xs:text-2xl font-bold text-gray-900 mb-4 xs:mb-6">Order Summary</h2>

                  <div className="space-y-3 xs:space-y-4 mb-4 xs:mb-6 pb-4 xs:pb-6 border-b border-gray-200">
                    <div className="flex justify-between text-gray-700 text-sm xs:text-base">
                      <span className="font-medium">Subtotal</span>
                      <span className="font-semibold">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-gray-700 text-sm xs:text-base">
                      <span className="font-medium">Tax (8%)</span>
                      <span className="font-semibold">{formatPrice(tax)}</span>
                    </div>
                    <div className="flex justify-between text-gray-700 text-sm xs:text-base">
                      <span className="font-medium">Shipping</span>
                      {shipping === 0 ? (
                        <span className="text-green-600 font-bold flex items-center gap-1">
                          FREE <FontAwesomeIcon icon={faCheckCircle} className="text-green-600" />
                        </span>
                      ) : (
                        <span className="font-semibold">{formatPrice(shipping)}</span>
                      )}
                    </div>
                  </div>

                  {shipping > 0 && subtotal < 100 && (
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
                      <p className="font-semibold text-blue-900 mb-1">
                        <FontAwesomeIcon icon={faSmile} className="mr-2" />
                        Free Shipping Alert!
                      </p>
                      <p className="text-sm text-blue-800">
                        Add {formatPrice(100 - subtotal)} more for free shipping.
                      </p>
                    </div>
                  )}

                  <div className="mb-4 xs:mb-6 p-3 xs:p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                    <p className="text-gray-700 text-xs xs:text-sm font-medium mb-1">Total Amount</p>
                    <p className="text-2xl xs:text-3xl sm:text-4xl font-bold text-gray-900">{formatPrice(total)}</p>
                  </div>

                  <Button onClick={handleCheckout} className="min-h-[48px]">Proceed to Checkout</Button>

                  <div className="bg-gray-50 rounded-lg p-3 mb-3 xs:mb-4">
                    <p className="font-semibold text-gray-900 text-sm mb-2">We Accept:</p>
                    <div className="flex gap-2 flex-wrap">
                      <span className="text-xs bg-white px-2 py-1 rounded border border-gray-200 flex items-center gap-1">
                        <FontAwesomeIcon icon={faCreditCard} />
                        Card
                      </span>
                      <span className="text-xs bg-white px-2 py-1 rounded border border-gray-200 flex items-center gap-1">
                        <FontAwesomeIcon icon={faBuilding} />
                        Bank
                      </span>
                      <span className="text-xs bg-white px-2 py-1 rounded border border-gray-200 flex items-center gap-1">
                        <FontAwesomeIcon icon={faMobileAlt} />
                        UPI
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-start gap-2">
                      <FontAwesomeIcon icon={faCheckCircle} className="text-green-600 mt-0.5" />
                      <span>Secure SSL encrypted checkout</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <FontAwesomeIcon icon={faCheckCircle} className="text-green-600 mt-0.5" />
                      <span>Free returns within 30 days</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <FontAwesomeIcon icon={faCheckCircle} className="text-green-600 mt-0.5" />
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
