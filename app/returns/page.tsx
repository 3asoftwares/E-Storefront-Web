'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUndo,
  faCheckCircle,
  faBoxOpen,
  faClock,
  faShieldAlt,
  faDollarSign,
} from '@fortawesome/free-solid-svg-icons';
import { Button } from '@3asoftwares/ui';

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="border-b border-gray-200 bg-white/95 backdrop-blur-lg">
        <div className="mx-auto max-w-7xl px-3 py-6 xs:px-4 xs:py-8 sm:px-6 lg:px-8">
          <div className="flex w-full flex-col items-center text-center">
            <div className="mb-3 inline-block rounded-xl bg-gradient-to-br from-gray-700 to-gray-900 p-3 shadow-lg xs:mb-4 xs:rounded-2xl xs:p-4">
              <FontAwesomeIcon
                icon={faUndo}
                className="h-7 w-7 text-white xs:h-8 xs:w-8 sm:h-10 sm:w-10"
              />
            </div>
            <h1 className="mb-3 bg-gradient-to-r from-black to-gray-300 bg-clip-text text-3xl font-extrabold text-transparent xs:mb-4 xs:text-4xl sm:text-5xl">
              Returns & Refunds
            </h1>
            <p className="mx-auto max-w-2xl px-2 text-base text-gray-600 xs:text-lg sm:text-xl">
              Shop with confidence - we offer hassle-free returns and quick refunds
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-3 py-8 xs:px-4 xs:py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mb-8 rounded-xl bg-gradient-to-r from-black to-gray-400 p-5 text-center text-white shadow-2xl xs:mb-10 xs:rounded-2xl xs:p-6 sm:mb-12 sm:p-8">
          <FontAwesomeIcon
            icon={faCheckCircle}
            className="mb-3 h-12 w-12 xs:mb-4 xs:h-14 xs:w-14 sm:h-16 sm:w-16"
          />
          <h2 className="mb-2 text-2xl font-bold xs:mb-3 xs:text-3xl">30-Day Return Policy</h2>
          <p className="text-lg text-orange-100 xs:text-xl">
            Not satisfied? Return your items within 30 days for a full refund - no questions asked!
          </p>
        </div>

        <div className="mb-8 xs:mb-10 sm:mb-12">
          <h2 className="mb-6 text-2xl font-bold text-gray-900 xs:mb-8 xs:text-3xl">
            How to Return an Item
          </h2>
          <div className="grid grid-cols-2 gap-3 xs:gap-4 sm:gap-6 md:grid-cols-4">
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-lg transition-transform active:scale-[0.98] xs:rounded-2xl xs:p-5 sm:p-6">
              <div className="mb-3 inline-block rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 p-2 xs:mb-4 xs:rounded-xl xs:p-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white xs:h-7 xs:w-7 xs:text-sm sm:h-8 sm:w-8">
                  1
                </div>
              </div>
              <h3 className="mb-2 text-base font-bold text-gray-900 xs:mb-3 xs:text-lg">
                Initiate Return
              </h3>
              <p className="text-xs text-gray-600 xs:text-sm">
                Log into your account and go to Orders. Select the item you want to return and click
                &quot;Return Item&quot;.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-lg transition-transform active:scale-[0.98] xs:rounded-2xl xs:p-5 sm:p-6">
              <div className="mb-3 inline-block rounded-lg bg-gradient-to-br from-green-100 to-green-200 p-2 xs:mb-4 xs:rounded-xl xs:p-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white xs:h-7 xs:w-7 xs:text-sm sm:h-8 sm:w-8">
                  2
                </div>
              </div>
              <h3 className="mb-2 text-base font-bold text-gray-900 xs:mb-3 xs:text-lg">
                Pack Your Item
              </h3>
              <p className="text-xs text-gray-600 xs:text-sm">
                Pack the item securely in its original packaging if possible. Include all
                accessories and documentation.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-lg transition-transform active:scale-[0.98] xs:rounded-2xl xs:p-5 sm:p-6">
              <div className="mb-3 inline-block rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 p-2 xs:mb-4 xs:rounded-xl xs:p-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-600 text-xs font-bold text-white xs:h-7 xs:w-7 xs:text-sm sm:h-8 sm:w-8">
                  3
                </div>
              </div>
              <h3 className="mb-2 text-base font-bold text-gray-900 xs:mb-3 xs:text-lg">
                Ship It Back
              </h3>
              <p className="text-xs text-gray-600 xs:text-sm">
                Use the prepaid return label we email you. Drop off at any authorized carrier
                location.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-lg transition-transform active:scale-[0.98] xs:rounded-2xl xs:p-5 sm:p-6">
              <div className="mb-3 inline-block rounded-lg bg-gradient-to-br from-orange-100 to-orange-200 p-2 xs:mb-4 xs:rounded-xl xs:p-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-600 text-xs font-bold text-white xs:h-7 xs:w-7 xs:text-sm sm:h-8 sm:w-8">
                  4
                </div>
              </div>
              <h3 className="mb-2 text-base font-bold text-gray-900 xs:mb-3 xs:text-lg">
                Get Refunded
              </h3>
              <p className="text-xs text-gray-600 xs:text-sm">
                Once we receive your return, we&apos;ll process your refund within 3-5 business
                days.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-5 xs:mb-10 xs:gap-6 sm:mb-12 sm:gap-8 lg:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xl xs:rounded-2xl xs:p-6 sm:p-8">
            <h2 className="mb-4 text-xl font-bold text-gray-900 xs:mb-6 xs:text-2xl">
              Return Policy Details
            </h2>
            <div className="space-y-3 text-gray-600 xs:space-y-4">
              <div>
                <h3 className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-gray-900 xs:mb-2 xs:text-base">
                  <FontAwesomeIcon
                    icon={faClock}
                    className="h-4 w-4 flex-shrink-0 text-orange-600 xs:h-5 xs:w-5"
                  />
                  Return Window
                </h3>
                <p className="ml-6 text-xs xs:ml-7 xs:text-sm">
                  You have 30 days from the delivery date to initiate a return. After 30 days, we
                  cannot accept returns, but warranty claims may still apply.
                </p>
              </div>
              <div>
                <h3 className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-gray-900 xs:mb-2 xs:text-base">
                  <FontAwesomeIcon
                    icon={faBoxOpen}
                    className="h-4 w-4 flex-shrink-0 text-orange-600 xs:h-5 xs:w-5"
                  />
                  Item Condition
                </h3>
                <p className="ml-6 text-xs xs:ml-7 xs:text-sm">
                  Items must be unused, unworn, and in their original condition with all tags
                  attached. Products showing signs of use may not be eligible for return.
                </p>
              </div>
              <div>
                <h3 className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-gray-900 xs:mb-2 xs:text-base">
                  <FontAwesomeIcon
                    icon={faShieldAlt}
                    className="h-4 w-4 flex-shrink-0 text-orange-600 xs:h-5 xs:w-5"
                  />
                  Non-Returnable Items
                </h3>
                <p className="ml-6 text-xs xs:ml-7 xs:text-sm">
                  For hygiene reasons, certain items like cosmetics, underwear, earrings, and
                  perishable goods cannot be returned once opened.
                </p>
              </div>
              <div>
                <h3 className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-gray-900 xs:mb-2 xs:text-base">
                  <FontAwesomeIcon
                    icon={faDollarSign}
                    className="h-4 w-4 flex-shrink-0 text-orange-600 xs:h-5 xs:w-5"
                  />
                  Return Shipping
                </h3>
                <p className="ml-6 text-xs xs:ml-7 xs:text-sm">
                  We provide free return shipping labels for all US domestic returns. International
                  returns may require the customer to cover shipping costs.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xl xs:rounded-2xl xs:p-6 sm:p-8">
            <h2 className="mb-4 text-xl font-bold text-gray-900 xs:mb-6 xs:text-2xl">
              Refund Information
            </h2>
            <div className="space-y-3 text-gray-600 xs:space-y-4">
              <div>
                <h3 className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-gray-900 xs:mb-2 xs:text-base">
                  <FontAwesomeIcon
                    icon={faClock}
                    className="h-4 w-4 flex-shrink-0 text-green-600 xs:h-5 xs:w-5"
                  />
                  Processing Time
                </h3>
                <p className="ml-6 text-xs xs:ml-7 xs:text-sm">
                  Once we receive and inspect your return, we&apos;ll process your refund within 3-5
                  business days. You&apos;ll receive an email confirmation when the refund is
                  issued.
                </p>
              </div>
              <div>
                <h3 className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-gray-900 xs:mb-2 xs:text-base">
                  <FontAwesomeIcon
                    icon={faDollarSign}
                    className="h-4 w-4 flex-shrink-0 text-green-600 xs:h-5 xs:w-5"
                  />
                  Refund Method
                </h3>
                <p className="ml-6 text-xs xs:ml-7 xs:text-sm">
                  Refunds are issued to the original payment method. Credit card refunds may take
                  5-10 business days to appear on your statement depending on your bank.
                </p>
              </div>
              <div>
                <h3 className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-gray-900 xs:mb-2 xs:text-base">
                  <FontAwesomeIcon
                    icon={faBoxOpen}
                    className="h-4 w-4 flex-shrink-0 text-green-600 xs:h-5 xs:w-5"
                  />
                  Partial Refunds
                </h3>
                <p className="ml-6 text-xs xs:ml-7 xs:text-sm">
                  In some cases, partial refunds may be granted for items returned with obvious
                  signs of use, missing parts, or not in original condition.
                </p>
              </div>
              <div>
                <h3 className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-gray-900 xs:mb-2 xs:text-base">
                  <FontAwesomeIcon
                    icon={faShieldAlt}
                    className="h-4 w-4 flex-shrink-0 text-green-600 xs:h-5 xs:w-5"
                  />
                  Exchanges
                </h3>
                <p className="ml-6 text-xs xs:ml-7 xs:text-sm">
                  We don&apos;t offer direct exchanges. If you need a different size or color,
                  please return the original item for a refund and place a new order.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-5 shadow-xl xs:mb-10 xs:rounded-2xl xs:p-6 sm:mb-12 sm:p-8">
          <h2 className="mb-4 text-xl font-bold text-gray-900 xs:mb-6 xs:text-2xl">
            Special Cases
          </h2>
          <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 xs:gap-5 sm:gap-6 md:grid-cols-3">
            <div>
              <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-900 xs:mb-3 xs:text-base">
                <FontAwesomeIcon
                  icon={faBoxOpen}
                  className="h-4 w-4 flex-shrink-0 text-red-600 xs:h-5 xs:w-5"
                />
                <span className="leading-tight">Damaged or Defective Items</span>
              </h3>
              <p className="text-xs text-gray-600 xs:text-sm">
                If you receive a damaged or defective item, contact us immediately with photos.
                We&apos;ll send a replacement or issue a full refund including return shipping
                costs.
              </p>
            </div>
            <div>
              <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-900 xs:mb-3 xs:text-base">
                <FontAwesomeIcon
                  icon={faBoxOpen}
                  className="h-4 w-4 flex-shrink-0 text-blue-600 xs:h-5 xs:w-5"
                />
                Wrong Item Received
              </h3>
              <p className="text-xs text-gray-600 xs:text-sm">
                If you received the wrong item, we apologize! Contact us and we&apos;ll arrange to
                send the correct item at no additional cost and provide a return label for the wrong
                item.
              </p>
            </div>
            <div className="xs:col-span-2 md:col-span-1">
              <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-900 xs:mb-3 xs:text-base">
                <FontAwesomeIcon
                  icon={faBoxOpen}
                  className="h-4 w-4 flex-shrink-0 text-purple-600 xs:h-5 xs:w-5"
                />
                Missing Items
              </h3>
              <p className="text-xs text-gray-600 xs:text-sm">
                If your package is missing items from your order, please contact us within 48 hours
                of delivery. We&apos;ll investigate and send the missing items or issue a refund.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-r from-black to-gray-400 p-5 text-center text-white shadow-xl xs:rounded-2xl xs:p-6 sm:p-8">
          <h2 className="mb-2 text-xl font-bold xs:mb-3 xs:text-2xl">Need Help with a Return?</h2>
          <p className="mx-auto mb-4 max-w-2xl text-sm text-gray-200 xs:mb-6 xs:text-base">
            Our customer support team is here to assist you with any questions about returns or
            refunds.
          </p>
          <Button variant="secondary" size="lg" fullWidth={false} className="min-h-[48px]">
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
}
