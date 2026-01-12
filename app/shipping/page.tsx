'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruck, faBox, faMapMarkerAlt, faClock, faGlobe, faDollarSign, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="bg-white/95 backdrop-blur-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center w-full">
            <div className="inline-block p-4 bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl shadow-lg mb-4">
              <FontAwesomeIcon icon={faTruck} className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-black to-gray-300 mb-4">
              Shipping Information
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Fast, reliable, and affordable shipping to get your orders delivered on time
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-black to-gray-400 rounded-2xl shadow-2xl p-8 mb-12 text-white text-center">
          <FontAwesomeIcon icon={faCheckCircle} className="w-16 h-16 mb-4" />
          <h2 className="text-3xl font-bold mb-3">Free Shipping Available!</h2>
          <p className="text-xl text-gray-200">
            Get free standard shipping on all orders over ₹500
          </p>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Shipping Methods</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-2xl transition-shadow">
              <div className="inline-block p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl mb-4">
                <FontAwesomeIcon icon={faTruck} className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Standard Shipping</h3>
              <div className="mb-4">
                <p className="text-3xl font-bold text-blue-600 mb-1">₹100</p>
                <p className="text-sm text-gray-600">Free on orders over ₹500</p>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faClock} className="w-4 h-4 text-green-600" />
                  <span>5-7 business days</span>
                </div>
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="w-4 h-4 text-green-600" />
                  <span>Domestic delivery</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-green-500 hover:shadow-2xl transition-shadow relative">
              <div className="absolute top-0 right-0 bg-green-500 text-white px-3 py-1 rounded-bl-lg rounded-tr-xl text-xs font-bold">
                POPULAR
              </div>
              <div className="inline-block p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-xl mb-4">
                <FontAwesomeIcon icon={faTruck} className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Express Shipping</h3>
              <div className="mb-4">
                <p className="text-3xl font-bold text-green-600 mb-1">₹250</p>
                <p className="text-sm text-gray-600">Fastest option</p>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faClock} className="w-4 h-4 text-green-600" />
                  <span>2-3 business days</span>
                </div>
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="w-4 h-4 text-green-600" />
                  <span>Domestic delivery</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-2xl transition-shadow">
              <div className="inline-block p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl mb-4">
                <FontAwesomeIcon icon={faGlobe} className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">International</h3>
              <div className="mb-4">
                <p className="text-3xl font-bold text-purple-600 mb-1">₹350+</p>
                <p className="text-sm text-gray-600">Varies by location</p>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faClock} className="w-4 h-4 text-green-600" />
                  <span>7-14 business days</span>
                </div>
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faGlobe} className="w-4 h-4 text-green-600" />
                  <span>Worldwide delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Policy</h2>
            <div className="space-y-4 text-gray-600">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <FontAwesomeIcon icon={faBox} className="w-5 h-5 text-green-600" />
                  Processing Time
                </h3>
                <p className="text-sm ml-7">
                  Orders are typically processed within 1-2 business days. You'll receive a
                  confirmation email once your order ships with tracking information.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="w-5 h-5 text-green-600" />
                  Delivery Areas
                </h3>
                <p className="text-sm ml-7">
                  We ship to all 50 US states and internationally to over 100 countries. Some remote
                  areas may require additional shipping time.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <FontAwesomeIcon icon={faDollarSign} className="w-5 h-5 text-green-600" />
                  Shipping Costs
                </h3>
                <p className="text-sm ml-7">
                  Shipping costs are calculated based on your location and the shipping method
                  selected at checkout. Orders over ₹500 qualify for free standard shipping.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <FontAwesomeIcon icon={faClock} className="w-5 h-5 text-green-600" />
                  Delivery Timeframes
                </h3>
                <p className="text-sm ml-7">
                  Delivery times are estimates and may vary due to carrier delays, weather
                  conditions, or other factors beyond our control. Tracking information is provided
                  for all shipments.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Tracking Your Order</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                    1
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Order Confirmation</h3>
                  <p className="text-sm text-gray-600">
                    You'll receive an email confirmation immediately after placing your order.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                    2
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Shipping Notification</h3>
                  <p className="text-sm text-gray-600">
                    Once shipped, you'll get an email with your tracking number and carrier
                    information.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                    3
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Track Online</h3>
                  <p className="text-sm text-gray-600">
                    Use your tracking number on our website or the carrier's site to monitor
                    delivery progress.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                    4
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Delivery</h3>
                  <p className="text-sm text-gray-600">
                    Your package arrives! Sign if required, or it will be left at your doorstep.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping FAQs</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Can I change my shipping address after placing an order?
              </h3>
              <p className="text-sm text-gray-600">
                Please contact us immediately if you need to change your address. We can update it
                if the order hasn't been shipped yet.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Do you ship to PO boxes?</h3>
              <p className="text-sm text-gray-600">
                Yes, we ship to PO boxes using USPS. However, express shipping may not be available
                for PO box addresses.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                What if my package is lost or damaged?
              </h3>
              <p className="text-sm text-gray-600">
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
