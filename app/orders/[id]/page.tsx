'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOrder, useCancelOrder } from '@/lib/hooks';
import { useToast } from '@/lib/hooks/useToast';
import { formatPrice } from '@3asoftwares/utils/client';
import { Button, Confirm } from '@3asoftwares/ui';
import {
  faClipboard,
  faCheckCircle,
  faCog,
  faBox,
  faSmile,
  faArrowLeft,
  faBan,
  faSpinner,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface OrderDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

const STATUS_STEPS = [
  { key: 'pending', label: 'Order Placed', icon: faClipboard },
  { key: 'confirmed', label: 'Confirmed', icon: faCheckCircle },
  { key: 'processing', label: 'Processing', icon: faCog },
  { key: 'shipped', label: 'Shipped', icon: faBox },
  { key: 'delivered', label: 'Delivered', icon: faSmile },
];

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const { showToast } = useToast();

  const { data: order, isLoading, error } = useOrder(id);
  const { mutateAsync: cancelOrder } = useCancelOrder();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="max-w-md rounded-lg bg-white p-8 text-center shadow-md">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">Order Not Found</h1>
          <p className="mb-6 text-gray-600">We couldn&apos;t find this order.</p>
          <Button onClick={() => router.push('/orders')} variant="primary" size="md">
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  const currentStepIndex = STATUS_STEPS.findIndex((step) => step.key === order.status);
  const isCompleted = (stepIndex: number) => stepIndex <= currentStepIndex;

  // Check if order can be cancelled (only pending or confirmed orders)
  const canCancel = ['pending', 'confirmed', 'PENDING', 'CONFIRMED'].includes(
    order.status || order.orderStatus
  );
  const isCancelled = ['cancelled', 'CANCELLED'].includes(order.status || order.orderStatus);

  const handleCancelOrder = async () => {
    try {
      await cancelOrder(id);
      setShowCancelConfirm(false);
      showToast('Order cancelled successfully', 'success');
    } catch (error: any) {
      // Extract error message from GraphQL response
      const graphqlError =
        error?.graphQLErrors?.[0]?.message ||
        error?.networkError?.result?.errors?.[0]?.message ||
        error?.message ||
        'Failed to cancel order';
      showToast(graphqlError, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl justify-between px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Order #{order.orderNumber}</h1>
          <Button
            onClick={() => router.push('/orders')}
            variant="ghost"
            size="sm"
            fullWidth={false}
            className="!no-underline"
          >
            <FontAwesomeIcon icon={faArrowLeft} /> Back to Orders
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <div className="rounded-lg bg-white p-8 shadow-md">
              <h2 className="mb-6 text-lg font-semibold text-gray-900">Order Status</h2>
              <div className="relative">
                <div className="flex items-center">
                  {STATUS_STEPS.map((step, idx) => (
                    <div key={step.key} className="relative flex-1">
                      <div className="flex flex-col items-center">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold transition ${
                            isCompleted(idx)
                              ? 'bg-green-500 text-white'
                              : idx === currentStepIndex
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-300 text-gray-600'
                          }`}
                        >
                          <FontAwesomeIcon icon={step.icon} />
                        </div>
                        <p className="mt-2 text-center text-sm font-medium text-gray-900">
                          {step.label}
                        </p>
                      </div>

                      {idx < STATUS_STEPS.length - 1 && (
                        <div
                          className={`absolute left-1/2 right-0 top-6 h-0.5 ${
                            isCompleted(idx + 1) ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                          style={{ width: 'calc(100% - 24px)' }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {order.estimatedDelivery && (
                <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <p className="text-sm text-blue-800">
                    <span className="font-semibold">Estimated Delivery: </span>
                    {new Date(order.estimatedDelivery).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              )}
            </div>

            <div className="rounded-lg bg-white p-8 shadow-md">
              <h2 className="mb-6 text-lg font-semibold text-gray-900">Order Items</h2>

              <div className="space-y-4">
                {order.items.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 rounded-lg border border-gray-200 p-4"
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded bg-gray-200 text-2xl">
                      📦
                    </div>

                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{item.productName}</p>
                      <p className="text-sm text-gray-600">SKU: {item.productId}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                      <p className="text-sm text-gray-600">{formatPrice(item.price)} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg bg-white p-8 shadow-md">
              <h2 className="mb-6 text-lg font-semibold text-gray-900">Shipping Address</h2>

              <div className="rounded-lg bg-gray-50 p-4">
                {order.shippingAddress.name && (
                  <p className="font-semibold text-gray-900">{order.shippingAddress.name}</p>
                )}
                {(order.shippingAddress.mobile || order.shippingAddress.email) && (
                  <p className="mb-2 text-sm text-gray-600">
                    {order.shippingAddress.mobile && (
                      <span className="mr-3">📱 {order.shippingAddress.mobile}</span>
                    )}
                    {order.shippingAddress.email && <span>✉️ {order.shippingAddress.email}</span>}
                  </p>
                )}
                <p className="text-gray-700">{order.shippingAddress.street}</p>
                <p className="text-gray-700">
                  {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                  {order.shippingAddress.zip}
                </p>
                <p className="text-gray-700">{order.shippingAddress.country}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-lg bg-white p-6 shadow-md">
              <h2 className="mb-6 text-lg font-semibold text-gray-900">Order Summary</h2>

              <div className="mb-6 space-y-3 border-b pb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span>{formatPrice(order.shipping)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax</span>
                  <span>{formatPrice(order.tax)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>
                      Discount
                      {order.couponCode && (
                        <span className="ml-1 rounded bg-green-100 px-2 py-0.5 text-xs text-green-700">
                          {order.couponCode}
                        </span>
                      )}
                    </span>
                    <span>-{formatPrice(order.discount)}</span>
                  </div>
                )}
              </div>

              <div className="mb-6 flex items-baseline justify-between">
                <span className="font-semibold text-gray-700">Total</span>
                <span className="text-2xl font-bold text-gray-900">{formatPrice(order.total)}</span>
              </div>

              <div className="space-y-3 border-t pt-6 text-sm text-gray-600">
                <div>
                  <p className="text-xs uppercase text-gray-500">Order Date</p>
                  <p className="font-medium text-gray-900">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500">Order Number</p>
                  <p className="font-medium text-gray-900">{order.orderNumber}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500">Status</p>
                  <p className="font-medium capitalize text-gray-900">{order.orderStatus}</p>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <Button variant="outline" size="md">
                  Print Order
                </Button>

                {isCancelled ? (
                  <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4">
                    <div className="flex items-center justify-center gap-2 text-red-700">
                      <FontAwesomeIcon icon={faBan} className="h-4 w-4" />
                      <span className="font-medium">Order Cancelled</span>
                    </div>
                  </div>
                ) : canCancel ? (
                  <>
                    {!showCancelConfirm ? (
                      <Button
                        onClick={() => setShowCancelConfirm(true)}
                        variant="primary"
                        size="md"
                        className="!hover:text-red-700 !hover:bg-red-50 !border-red-600 !bg-red-100 !text-red-600"
                      >
                        <FontAwesomeIcon icon={faBan} className="" />
                        Cancel Order
                      </Button>
                    ) : (
                      <Confirm
                        open={showCancelConfirm}
                        title="Cancel Order"
                        message={
                          <>
                            <span>Are you sure you want to cancel this order?</span>
                          </>
                        }
                        confirmText="Yes, Cancel Order"
                        cancelText="Keep Order"
                        onConfirm={handleCancelOrder}
                        onCancel={() => {
                          setShowCancelConfirm(false);
                        }}
                      />
                    )}
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
