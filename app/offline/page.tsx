'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWifi, faRefresh, faHome, faShoppingBag } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@3asoftwares/ui';

export default function OfflinePage() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12">
      <div className="w-full max-w-md text-center">
        {/* Offline Icon */}
        <div className="relative mb-8">
          <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-gray-200 to-gray-300 shadow-xl xs:h-40 xs:w-40">
            <FontAwesomeIcon icon={faWifi} className="h-16 w-16 text-gray-400 xs:h-20 xs:w-20" />
            {/* Crossed out line */}
            <div className="absolute left-1/2 top-1/2 h-1 w-24 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-full bg-red-500"></div>
          </div>
        </div>

        {/* Title */}
        <h1 className="mb-4 text-2xl font-bold text-gray-900 xs:text-3xl sm:text-4xl">
          You&apos;re Offline
        </h1>

        {/* Description */}
        <p className="mx-auto mb-8 max-w-sm text-sm leading-relaxed text-gray-600 xs:text-base sm:text-lg">
          It looks like you&apos;ve lost your internet connection. Please check your network and try
          again.
        </p>

        {/* Actions */}
        <div className="flex flex-col items-center justify-center gap-3 xs:flex-row xs:gap-4">
          <Button
            onClick={handleRetry}
            variant="primary"
            size="lg"
            className="min-h-[48px] w-full px-6 xs:w-auto"
          >
            <FontAwesomeIcon icon={faRefresh} className="mr-2" />
            Try Again
          </Button>

          <Link
            href="/"
            className="inline-flex min-h-[48px] w-full items-center justify-center rounded-xl border-2 border-gray-300 px-6 py-3 font-semibold text-gray-700 transition-all hover:bg-gray-50 xs:w-auto"
          >
            <FontAwesomeIcon icon={faHome} className="mr-2" />
            Go Home
          </Link>
        </div>

        {/* Cached Pages Notice */}
        <div className="mt-12 rounded-2xl border border-gray-200 bg-white p-4 shadow-lg xs:p-6">
          <h2 className="mb-3 text-sm font-semibold text-gray-900 xs:text-base">
            <FontAwesomeIcon icon={faShoppingBag} className="mr-2 text-gray-600" />
            While you&apos;re offline
          </h2>
          <p className="mb-4 text-xs text-gray-600 xs:text-sm">
            Some pages you&apos;ve visited before may still be available:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link
              href="/"
              className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs text-gray-700 transition-colors hover:bg-gray-200 xs:text-sm"
            >
              Home
            </Link>
            <Link
              href="/products"
              className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs text-gray-700 transition-colors hover:bg-gray-200 xs:text-sm"
            >
              Products
            </Link>
            <Link
              href="/cart"
              className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs text-gray-700 transition-colors hover:bg-gray-200 xs:text-sm"
            >
              Cart
            </Link>
            <Link
              href="/wishlist"
              className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs text-gray-700 transition-colors hover:bg-gray-200 xs:text-sm"
            >
              Wishlist
            </Link>
          </div>
        </div>

        {/* Connection Tips */}
        <div className="mt-8 rounded-xl border border-blue-100 bg-blue-50 p-4 text-left xs:p-5">
          <h3 className="mb-2 text-sm font-semibold text-blue-900 xs:text-base">
            Troubleshooting Tips
          </h3>
          <ul className="space-y-2 text-xs text-blue-800 xs:text-sm">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-blue-500">•</span>
              Check if your Wi-Fi or mobile data is turned on
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-blue-500">•</span>
              Try moving closer to your router
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-blue-500">•</span>
              Restart your device or network connection
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-blue-500">•</span>
              Disable airplane mode if enabled
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
