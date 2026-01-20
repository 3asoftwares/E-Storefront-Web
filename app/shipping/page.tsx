'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTruck,
  faBox,
  faMapMarkerAlt,
  faClock,
  faGlobe,
  faDollarSign,
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="border-b border-gray-200 bg-white/95 backdrop-blur-lg">
        <div className="mx-auto max-w-7xl px-3 py-6 xs:px-4 xs:py-8 sm:px-6 lg:px-8">
          <div className="flex w-full flex-col items-center text-center">
            <div className="mb-3 inline-block rounded-xl bg-gradient-to-br from-gray-700 to-gray-900 p-3 shadow-lg xs:mb-4 xs:rounded-2xl xs:p-4">
              <FontAwesomeIcon
                icon={faTruck}
                className="h-7 w-7 text-white xs:h-8 xs:w-8 sm:h-10 sm:w-10"
              />
            </div>
            <h1 className="mb-3 bg-gradient-to-r from-black to-gray-300 bg-clip-text text-3xl font-extrabold text-transparent xs:mb-4 xs:text-4xl sm:text-5xl">
              Shipping Information
            </h1>
            <p className="mx-auto max-w-2xl px-2 text-base text-gray-600 xs:text-lg sm:text-xl">
              Fast, reliable, and affordable shipping to get your orders delivered on time
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
          <h2 className="mb-2 text-2xl font-bold xs:mb-3 xs:text-3xl">Free Shipping Available!</h2>
          <p className="text-lg text-gray-200 xs:text-xl">
            Get free standard shipping on all orders over ₹500
          </p>
        </div>

        <div className="mb-8 xs:mb-10 sm:mb-12">
          <h2 className="mb-6 text-2xl font-bold text-gray-900 xs:mb-8 xs:text-3xl">
            Shipping Methods
          </h2>
          <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 xs:gap-5 sm:gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-lg transition-shadow hover:shadow-2xl active:scale-[0.98] xs:rounded-2xl xs:p-5 sm:p-6">
              <div className="mb-3 inline-block rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 p-2 xs:mb-4 xs:rounded-xl xs:p-3">
                <FontAwesomeIcon
                  icon={faTruck}
                  className="h-6 w-6 text-blue-600 xs:h-7 xs:w-7 sm:h-8 sm:w-8"
                />
              </div>
              <h3 className="mb-2 text-lg font-bold text-gray-900 xs:mb-3 xs:text-xl">
                Standard Shipping
              </h3>
              <div className="mb-3 xs:mb-4">
                <p className="mb-1 text-2xl font-bold text-blue-600 xs:text-3xl">₹100</p>
                <p className="text-xs text-gray-600 xs:text-sm">Free on orders over ₹500</p>
              </div>
              <div className="space-y-1.5 text-xs text-gray-600 xs:space-y-2 xs:text-sm">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={faClock}
                    className="h-3 w-3 text-green-600 xs:h-4 xs:w-4"
                  />
                  <span>5-7 business days</span>
                </div>
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={faMapMarkerAlt}
                    className="h-3 w-3 text-green-600 xs:h-4 xs:w-4"
                  />
                  <span>Domestic delivery</span>
                </div>
              </div>
            </div>

            <div className="relative rounded-xl border-2 border-green-500 bg-white p-4 shadow-lg transition-shadow hover:shadow-2xl active:scale-[0.98] xs:rounded-2xl xs:p-5 sm:p-6">
              <div className="absolute right-0 top-0 rounded-bl-lg rounded-tr-lg bg-green-500 px-2 py-0.5 text-xs font-bold text-white xs:rounded-tr-xl xs:px-3 xs:py-1">
                POPULAR
              </div>
              <div className="mb-3 inline-block rounded-lg bg-gradient-to-br from-green-100 to-green-200 p-2 xs:mb-4 xs:rounded-xl xs:p-3">
                <FontAwesomeIcon
                  icon={faTruck}
                  className="h-6 w-6 text-green-600 xs:h-7 xs:w-7 sm:h-8 sm:w-8"
                />
              </div>
              <h3 className="mb-2 text-lg font-bold text-gray-900 xs:mb-3 xs:text-xl">
                Express Shipping
              </h3>
              <div className="mb-3 xs:mb-4">
                <p className="mb-1 text-2xl font-bold text-green-600 xs:text-3xl">₹250</p>
                <p className="text-xs text-gray-600 xs:text-sm">Fastest option</p>
              </div>
              <div className="space-y-1.5 text-xs text-gray-600 xs:space-y-2 xs:text-sm">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={faClock}
                    className="h-3 w-3 text-green-600 xs:h-4 xs:w-4"
                  />
                  <span>2-3 business days</span>
                </div>
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={faMapMarkerAlt}
                    className="h-3 w-3 text-green-600 xs:h-4 xs:w-4"
                  />
                  <span>Domestic delivery</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-lg transition-shadow hover:shadow-2xl active:scale-[0.98] xs:col-span-2 xs:rounded-2xl xs:p-5 sm:p-6 md:col-span-1">
              <div className="mb-3 inline-block rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 p-2 xs:mb-4 xs:rounded-xl xs:p-3">
                <FontAwesomeIcon
                  icon={faGlobe}
                  className="h-6 w-6 text-purple-600 xs:h-7 xs:w-7 sm:h-8 sm:w-8"
                />
              </div>
              <h3 className="mb-2 text-lg font-bold text-gray-900 xs:mb-3 xs:text-xl">
                International
              </h3>
              <div className="mb-3 xs:mb-4">
                <p className="mb-1 text-2xl font-bold text-purple-600 xs:text-3xl">₹350+</p>
                <p className="text-xs text-gray-600 xs:text-sm">Varies by location</p>
              </div>
              <div className="space-y-1.5 text-xs text-gray-600 xs:space-y-2 xs:text-sm">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={faClock}
                    className="h-3 w-3 text-green-600 xs:h-4 xs:w-4"
                  />
                  <span>7-14 business days</span>
                </div>
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={faGlobe}
                    className="h-3 w-3 text-green-600 xs:h-4 xs:w-4"
                  />
                  <span>Worldwide delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-5 xs:mb-10 xs:gap-6 sm:mb-12 sm:gap-8 lg:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xl xs:rounded-2xl xs:p-6 sm:p-8">
            <h2 className="mb-4 text-xl font-bold text-gray-900 xs:mb-6 xs:text-2xl">
              Shipping Policy
            </h2>
            <div className="space-y-3 text-gray-600 xs:space-y-4">
              <div>
                <h3 className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-gray-900 xs:mb-2 xs:text-base">
                  <FontAwesomeIcon
                    icon={faBox}
                    className="h-4 w-4 flex-shrink-0 text-green-600 xs:h-5 xs:w-5"
                  />
                  Processing Time
                </h3>
                <p className="ml-6 text-xs xs:ml-7 xs:text-sm">
                  Orders are typically processed within 1-2 business days. You&apos;ll receive a
                  confirmation email once your order ships with tracking information.
                </p>
              </div>
              <div>
                <h3 className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-gray-900 xs:mb-2 xs:text-base">
                  <FontAwesomeIcon
                    icon={faMapMarkerAlt}
                    className="h-4 w-4 flex-shrink-0 text-green-600 xs:h-5 xs:w-5"
                  />
                  Delivery Areas
                </h3>
                <p className="ml-6 text-xs xs:ml-7 xs:text-sm">
                  We ship to all 50 US states and internationally to over 100 countries. Some remote
                  areas may require additional shipping time.
                </p>
              </div>
              <div>
                <h3 className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-gray-900 xs:mb-2 xs:text-base">
                  <FontAwesomeIcon
                    icon={faDollarSign}
                    className="h-4 w-4 flex-shrink-0 text-green-600 xs:h-5 xs:w-5"
                  />
                  Shipping Costs
                </h3>
                <p className="ml-6 text-xs xs:ml-7 xs:text-sm">
                  Shipping costs are calculated based on your location and the shipping method
                  selected at checkout. Orders over ₹500 qualify for free standard shipping.
                </p>
              </div>
              <div>
                <h3 className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-gray-900 xs:mb-2 xs:text-base">
                  <FontAwesomeIcon
                    icon={faClock}
                    className="h-4 w-4 flex-shrink-0 text-green-600 xs:h-5 xs:w-5"
                  />
                  Delivery Timeframes
                </h3>
                <p className="ml-6 text-xs xs:ml-7 xs:text-sm">
                  Delivery times are estimates and may vary due to carrier delays, weather
                  conditions, or other factors beyond our control. Tracking information is provided
                  for all shipments.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xl xs:rounded-2xl xs:p-6 sm:p-8">
            <h2 className="mb-4 text-xl font-bold text-gray-900 xs:mb-6 xs:text-2xl">
              Tracking Your Order
            </h2>
            <div className="space-y-4 xs:space-y-5 sm:space-y-6">
              <div className="flex gap-3 xs:gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-teal-500 text-sm font-bold text-white xs:h-9 xs:w-9 xs:text-base sm:h-10 sm:w-10">
                    1
                  </div>
                </div>
                <div>
                  <h3 className="mb-1 text-sm font-semibold text-gray-900 xs:text-base">
                    Order Confirmation
                  </h3>
                  <p className="text-xs text-gray-600 xs:text-sm">
                    You&apos;ll receive an email confirmation immediately after placing your order.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 xs:gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-teal-500 text-sm font-bold text-white xs:h-9 xs:w-9 xs:text-base sm:h-10 sm:w-10">
                    2
                  </div>
                </div>
                <div>
                  <h3 className="mb-1 text-sm font-semibold text-gray-900 xs:text-base">
                    Shipping Notification
                  </h3>
                  <p className="text-xs text-gray-600 xs:text-sm">
                    Once shipped, you&apos;ll get an email with your tracking number and carrier
                    information.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 xs:gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-teal-500 text-sm font-bold text-white xs:h-9 xs:w-9 xs:text-base sm:h-10 sm:w-10">
                    3
                  </div>
                </div>
                <div>
                  <h3 className="mb-1 text-sm font-semibold text-gray-900 xs:text-base">
                    Track Online
                  </h3>
                  <p className="text-xs text-gray-600 xs:text-sm">
                    Use your tracking number on our website or the carrier&apos;s site to monitor
                    delivery progress.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 xs:gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-teal-500 text-sm font-bold text-white xs:h-9 xs:w-9 xs:text-base sm:h-10 sm:w-10">
                    4
                  </div>
                </div>
                <div>
                  <h3 className="mb-1 text-sm font-semibold text-gray-900 xs:text-base">
                    Delivery
                  </h3>
                  <p className="text-xs text-gray-600 xs:text-sm">
                    Your package arrives! Sign if required, or it will be left at your doorstep.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xl xs:rounded-2xl xs:p-6 sm:p-8">
          <h2 className="mb-4 text-xl font-bold text-gray-900 xs:mb-6 xs:text-2xl">
            Shipping FAQs
          </h2>
          <div className="space-y-3 xs:space-y-4">
            <div>
              <h3 className="mb-1.5 text-sm font-semibold text-gray-900 xs:mb-2 xs:text-base">
                Can I change my shipping address after placing an order?
              </h3>
              <p className="text-xs text-gray-600 xs:text-sm">
                Please contact us immediately if you need to change your address. We can update it
                if the order hasn&apos;t been shipped yet.
              </p>
            </div>
            <div>
              <h3 className="mb-1.5 text-sm font-semibold text-gray-900 xs:mb-2 xs:text-base">
                Do you ship to PO boxes?
              </h3>
              <p className="text-xs text-gray-600 xs:text-sm">
                Yes, we ship to PO boxes using USPS. However, express shipping may not be available
                for PO box addresses.
              </p>
            </div>
            <div>
              <h3 className="mb-1.5 text-sm font-semibold text-gray-900 xs:mb-2 xs:text-base">
                What if my package is lost or damaged?
              </h3>
              <p className="text-xs text-gray-600 xs:text-sm">
                All shipments are insured. If your package is lost or arrives damaged, contact us
                within 48 hours and we&apos;ll arrange a replacement or refund.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
