'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruck, faBox, faMapMarkerAlt, faClock, faGlobe, faDollarSign, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="bg-white/95 backdrop-blur-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-6 xs:py-8">
          <div className="flex flex-col items-center w-full text-center">
            <div className="inline-block p-3 xs:p-4 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl xs:rounded-2xl shadow-lg mb-3 xs:mb-4">
              <FontAwesomeIcon icon={faTruck} className="w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h1 className="text-3xl xs:text-4xl sm:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-black to-gray-300 mb-3 xs:mb-4">
              Shipping Information
            </h1>
            <p className="text-base xs:text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-2">
              Fast, reliable, and affordable shipping to get your orders delivered on time
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-8 xs:py-12 sm:py-16">
        <div className="bg-gradient-to-r from-black to-gray-400 rounded-xl xs:rounded-2xl shadow-2xl p-5 xs:p-6 sm:p-8 mb-8 xs:mb-10 sm:mb-12 text-white text-center">
          <FontAwesomeIcon icon={faCheckCircle} className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 mb-3 xs:mb-4" />
          <h2 className="text-2xl xs:text-3xl font-bold mb-2 xs:mb-3">Free Shipping Available!</h2>
          <p className="text-lg xs:text-xl text-gray-200">
            Get free standard shipping on all orders over ₹500
          </p>
        </div>

        <div className="mb-8 xs:mb-10 sm:mb-12">
          <h2 className="text-2xl xs:text-3xl font-bold text-gray-900 mb-6 xs:mb-8">Shipping Methods</h2>
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-4 xs:gap-5 sm:gap-6">
            <div className="bg-white rounded-xl xs:rounded-2xl shadow-lg p-4 xs:p-5 sm:p-6 border border-gray-200 hover:shadow-2xl transition-shadow active:scale-[0.98]">
              <div className="inline-block p-2 xs:p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg xs:rounded-xl mb-3 xs:mb-4">
                <FontAwesomeIcon icon={faTruck} className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 text-blue-600" />
              </div>
              <h3 className="text-lg xs:text-xl font-bold text-gray-900 mb-2 xs:mb-3">Standard Shipping</h3>
              <div className="mb-3 xs:mb-4">
                <p className="text-2xl xs:text-3xl font-bold text-blue-600 mb-1">₹100</p>
                <p className="text-xs xs:text-sm text-gray-600">Free on orders over ₹500</p>
              </div>
              <div className="space-y-1.5 xs:space-y-2 text-xs xs:text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faClock} className="w-3 h-3 xs:w-4 xs:h-4 text-green-600" />
                  <span>5-7 business days</span>
                </div>
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="w-3 h-3 xs:w-4 xs:h-4 text-green-600" />
                  <span>Domestic delivery</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl xs:rounded-2xl shadow-lg p-4 xs:p-5 sm:p-6 border-2 border-green-500 hover:shadow-2xl transition-shadow active:scale-[0.98] relative">
              <div className="absolute top-0 right-0 bg-green-500 text-white px-2 xs:px-3 py-0.5 xs:py-1 rounded-bl-lg rounded-tr-lg xs:rounded-tr-xl text-xs font-bold">
                POPULAR
              </div>
              <div className="inline-block p-2 xs:p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-lg xs:rounded-xl mb-3 xs:mb-4">
                <FontAwesomeIcon icon={faTruck} className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 text-green-600" />
              </div>
              <h3 className="text-lg xs:text-xl font-bold text-gray-900 mb-2 xs:mb-3">Express Shipping</h3>
              <div className="mb-3 xs:mb-4">
                <p className="text-2xl xs:text-3xl font-bold text-green-600 mb-1">₹250</p>
                <p className="text-xs xs:text-sm text-gray-600">Fastest option</p>
              </div>
              <div className="space-y-1.5 xs:space-y-2 text-xs xs:text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faClock} className="w-3 h-3 xs:w-4 xs:h-4 text-green-600" />
                  <span>2-3 business days</span>
                </div>
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="w-3 h-3 xs:w-4 xs:h-4 text-green-600" />
                  <span>Domestic delivery</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl xs:rounded-2xl shadow-lg p-4 xs:p-5 sm:p-6 border border-gray-200 hover:shadow-2xl transition-shadow active:scale-[0.98] xs:col-span-2 md:col-span-1">
              <div className="inline-block p-2 xs:p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg xs:rounded-xl mb-3 xs:mb-4">
                <FontAwesomeIcon icon={faGlobe} className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 text-purple-600" />
              </div>
              <h3 className="text-lg xs:text-xl font-bold text-gray-900 mb-2 xs:mb-3">International</h3>
              <div className="mb-3 xs:mb-4">
                <p className="text-2xl xs:text-3xl font-bold text-purple-600 mb-1">₹350+</p>
                <p className="text-xs xs:text-sm text-gray-600">Varies by location</p>
              </div>
              <div className="space-y-1.5 xs:space-y-2 text-xs xs:text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faClock} className="w-3 h-3 xs:w-4 xs:h-4 text-green-600" />
                  <span>7-14 business days</span>
                </div>
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faGlobe} className="w-3 h-3 xs:w-4 xs:h-4 text-green-600" />
                  <span>Worldwide delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 xs:gap-6 sm:gap-8 mb-8 xs:mb-10 sm:mb-12">
          <div className="bg-white rounded-xl xs:rounded-2xl shadow-xl p-5 xs:p-6 sm:p-8 border border-gray-200">
            <h2 className="text-xl xs:text-2xl font-bold text-gray-900 mb-4 xs:mb-6">Shipping Policy</h2>
            <div className="space-y-3 xs:space-y-4 text-gray-600">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1.5 xs:mb-2 flex items-center gap-2 text-sm xs:text-base">
                  <FontAwesomeIcon icon={faBox} className="w-4 h-4 xs:w-5 xs:h-5 text-green-600 flex-shrink-0" />
                  Processing Time
                </h3>
                <p className="text-xs xs:text-sm ml-6 xs:ml-7">
                  Orders are typically processed within 1-2 business days. You'll receive a
                  confirmation email once your order ships with tracking information.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1.5 xs:mb-2 flex items-center gap-2 text-sm xs:text-base">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="w-4 h-4 xs:w-5 xs:h-5 text-green-600 flex-shrink-0" />
                  Delivery Areas
                </h3>
                <p className="text-xs xs:text-sm ml-6 xs:ml-7">
                  We ship to all 50 US states and internationally to over 100 countries. Some remote
                  areas may require additional shipping time.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1.5 xs:mb-2 flex items-center gap-2 text-sm xs:text-base">
                  <FontAwesomeIcon icon={faDollarSign} className="w-4 h-4 xs:w-5 xs:h-5 text-green-600 flex-shrink-0" />
                  Shipping Costs
                </h3>
                <p className="text-xs xs:text-sm ml-6 xs:ml-7">
                  Shipping costs are calculated based on your location and the shipping method
                  selected at checkout. Orders over ₹500 qualify for free standard shipping.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1.5 xs:mb-2 flex items-center gap-2 text-sm xs:text-base">
                  <FontAwesomeIcon icon={faClock} className="w-4 h-4 xs:w-5 xs:h-5 text-green-600 flex-shrink-0" />
                  Delivery Timeframes
                </h3>
                <p className="text-xs xs:text-sm ml-6 xs:ml-7">
                  Delivery times are estimates and may vary due to carrier delays, weather
                  conditions, or other factors beyond our control. Tracking information is provided
                  for all shipments.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl xs:rounded-2xl shadow-xl p-5 xs:p-6 sm:p-8 border border-gray-200">
            <h2 className="text-xl xs:text-2xl font-bold text-gray-900 mb-4 xs:mb-6">Tracking Your Order</h2>
            <div className="space-y-4 xs:space-y-5 sm:space-y-6">
              <div className="flex gap-3 xs:gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm xs:text-base">
                    1
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1 text-sm xs:text-base">Order Confirmation</h3>
                  <p className="text-xs xs:text-sm text-gray-600">
                    You'll receive an email confirmation immediately after placing your order.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 xs:gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm xs:text-base">
                    2
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1 text-sm xs:text-base">Shipping Notification</h3>
                  <p className="text-xs xs:text-sm text-gray-600">
                    Once shipped, you'll get an email with your tracking number and carrier
                    information.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 xs:gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm xs:text-base">
                    3
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1 text-sm xs:text-base">Track Online</h3>
                  <p className="text-xs xs:text-sm text-gray-600">
                    Use your tracking number on our website or the carrier's site to monitor
                    delivery progress.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 xs:gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm xs:text-base">
                    4
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1 text-sm xs:text-base">Delivery</h3>
                  <p className="text-xs xs:text-sm text-gray-600">
                    Your package arrives! Sign if required, or it will be left at your doorstep.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl xs:rounded-2xl shadow-xl p-5 xs:p-6 sm:p-8 border border-gray-200">
          <h2 className="text-xl xs:text-2xl font-bold text-gray-900 mb-4 xs:mb-6">Shipping FAQs</h2>
          <div className="space-y-3 xs:space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1.5 xs:mb-2 text-sm xs:text-base">
                Can I change my shipping address after placing an order?
              </h3>
              <p className="text-xs xs:text-sm text-gray-600">
                Please contact us immediately if you need to change your address. We can update it
                if the order hasn't been shipped yet.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1.5 xs:mb-2 text-sm xs:text-base">Do you ship to PO boxes?</h3>
              <p className="text-xs xs:text-sm text-gray-600">
                Yes, we ship to PO boxes using USPS. However, express shipping may not be available
                for PO box addresses.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1.5 xs:mb-2 text-sm xs:text-base">
                What if my package is lost or damaged?
              </h3>
              <p className="text-xs xs:text-sm text-gray-600">
                All shipments are insured. If your package is lost or arrives damaged, contact us
                within 48 hours and we'll arrange a replacement or refund.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
