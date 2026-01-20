'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOrders } from '@/lib/hooks';
import { Button } from '@3asoftwares/ui';
import { formatPrice } from '@3asoftwares/utils/client';
import { useCartStore } from '@/store/cartStore';
import {
  faClipboardList,
  faShoppingBag,
  faClock,
  faCheckCircle,
  faCog,
  faBox,
  faSmile,
  faTimesCircle,
  faClose,
} from '@fortawesome/free-solid-svg-icons';
import { PageHeader, EmptyState } from '@/components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

const isValidStatus = (status: string | undefined): status is OrderStatus => {
  return (
    status !== undefined &&
    ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)
  );
};

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const STATUS_ICONS = {
  pending: faClock,
  confirmed: faCheckCircle,
  processing: faCog,
  shipped: faBox,
  delivered: faSmile,
  cancelled: faTimesCircle,
};

export default function OrdersPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const { userProfile } = useCartStore();

  const { data, isLoading, error } = useOrders(page, 10, userProfile?.id);

  const orders = data?.orders || [];
  const totalPages = data?.pagination.pages || 1;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center">
            <h2 className="mb-2 text-xl font-semibold text-red-800">Error Loading Orders</h2>
            <p className="mb-4 text-red-700">Failed to load your orders. Please try again later.</p>
            <Button className="!no-underline" onClick={() => router.push('/')}>
              Go Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        icon={faClipboardList}
        title="My Orders"
        subtitle={`${orders.length} order(s) found`}
        iconGradient="from-gray-700 to-gray-900"
        titleGradient="from-gray-900 to-black"
      />

      <div className="mx-auto max-w-7xl px-3 py-4 xs:px-4 xs:py-6 sm:px-6 sm:py-8 lg:px-8">
        {orders.length === 0 ? (
          <EmptyState
            icon={faShoppingBag}
            title="No Orders Yet"
            description="Start shopping to create your first order!"
            actionText="Browse Products"
            actionHref="/products"
            iconColor="text-gray-600"
            iconBgColor="from-gray-100 to-gray-200"
          />
        ) : (
          <div className="space-y-3 xs:space-y-4">
            {orders.map((order: any) => (
              <div
                key={order.id}
                className="overflow-hidden rounded-lg bg-white shadow-md transition hover:shadow-lg xs:rounded-xl"
              >
                <div className="p-4 xs:p-5 sm:p-6">
                  <div className="mb-3 flex flex-col xs:mb-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-gray-900 xs:text-lg">
                        Order #{order.orderNumber}
                      </h3>
                      <p className="mt-1 text-xs text-gray-600 xs:text-sm">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <div className="mt-4 sm:mt-0">
                      {isValidStatus(order.status) && (
                        <span
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${
                            STATUS_COLORS[order.status as OrderStatus]
                          }`}
                        >
                          <FontAwesomeIcon icon={STATUS_ICONS[order.status as OrderStatus]} />
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mb-4 grid grid-cols-2 gap-2 border-b pb-4 xs:mb-5 xs:grid-cols-3 xs:gap-3 xs:pb-5 sm:mb-6 sm:gap-4 sm:pb-6">
                    <div>
                      <p className="text-xs text-gray-600 xs:text-sm">Items</p>
                      <p className="text-base font-semibold text-gray-900 xs:text-lg">
                        {order.items.reduce((sum: number, item: any) => sum + item.quantity, 0)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 xs:text-sm">Total Amount</p>
                      <p className="text-base font-semibold text-gray-900 xs:text-lg">
                        {formatPrice(order.total)}
                      </p>
                    </div>
                    <div className="col-span-2 xs:col-span-1">
                      <p className="text-xs text-gray-600 xs:text-sm">Order Date</p>
                      <p className="text-base font-semibold text-gray-900 xs:text-lg">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4 xs:mb-5 sm:mb-6">
                    <p className="mb-2 text-xs font-semibold text-gray-900 xs:mb-3 xs:text-sm">
                      Items ({order.items.length})
                    </p>
                    <div className="grid grid-cols-1 gap-2 xs:grid-cols-2 xs:gap-3 lg:grid-cols-3">
                      {order.items.slice(0, 3).map((item: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between gap-2 rounded bg-gray-50 p-2 text-sm text-gray-700"
                        >
                          <span className="">{item.productName}</span>
                          <span className="font-bold text-gray-500">
                            <FontAwesomeIcon icon={faClose} /> {item.quantity}
                          </span>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="flex items-center gap-2 rounded bg-gray-50 p-2 text-sm text-gray-700">
                          <span className="font-medium">+{order.items.length - 3} more</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 xs:flex-row xs:gap-3">
                    <Button
                      onClick={() => router.push(`/orders/${order.id}`)}
                      className="min-h-[44px] flex-1"
                      size="sm"
                    >
                      View Details
                    </Button>
                    {isValidStatus(order.status) &&
                    (order.status === 'shipped' || order.status === 'processing') ? (
                      <Button
                        onClick={() => router.push(`/orders/${order.id}/track`)}
                        variant="outline"
                        className="flex-1"
                        size="sm"
                      >
                        Track Package
                      </Button>
                    ) : null}
                    {isValidStatus(order.status) && order.status === 'delivered' ? (
                      <Button
                        onClick={() => router.push(`/products?reorder=${order.id}`)}
                        variant="outline"
                        className="flex-1"
                        size="sm"
                      >
                        Reorder
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}

            {totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                <Button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  variant="outline"
                >
                  Previous
                </Button>
                {[...Array(totalPages)].map((_, i) => (
                  <Button
                    key={i + 1}
                    onClick={() => setPage(i + 1)}
                    variant={page === i + 1 ? 'primary' : 'outline'}
                    size="sm"
                  >
                    {i + 1}
                  </Button>
                ))}
                <Button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  variant="outline"
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
