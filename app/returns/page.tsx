'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo, faCheckCircle, faBoxOpen, faClock, faShieldAlt, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@3asoftwares/ui';

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="bg-white/95 backdrop-blur-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-6 xs:py-8">
          <div className="flex flex-col items-center w-full text-center">
            <div className="inline-block p-3 xs:p-4 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl xs:rounded-2xl shadow-lg mb-3 xs:mb-4">
              <FontAwesomeIcon icon={faUndo} className="w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h1 className="text-3xl xs:text-4xl sm:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-black to-gray-300 mb-3 xs:mb-4">
              Returns & Refunds
            </h1>
            <p className="text-base xs:text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-2">
              Shop with confidence - we offer hassle-free returns and quick refunds
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-8 xs:py-12 sm:py-16">
        <div className="bg-gradient-to-r from-black to-gray-400 rounded-xl xs:rounded-2xl shadow-2xl p-5 xs:p-6 sm:p-8 mb-8 xs:mb-10 sm:mb-12 text-white text-center">
          <FontAwesomeIcon icon={faCheckCircle} className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 mb-3 xs:mb-4" />
          <h2 className="text-2xl xs:text-3xl font-bold mb-2 xs:mb-3">30-Day Return Policy</h2>
          <p className="text-lg xs:text-xl text-orange-100">
            Not satisfied? Return your items within 30 days for a full refund - no questions asked!
          </p>
        </div>

        <div className="mb-8 xs:mb-10 sm:mb-12">
          <h2 className="text-2xl xs:text-3xl font-bold text-gray-900 mb-6 xs:mb-8">How to Return an Item</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 xs:gap-4 sm:gap-6">
            <div className="bg-white rounded-xl xs:rounded-2xl shadow-lg p-4 xs:p-5 sm:p-6 border border-gray-200 active:scale-[0.98] transition-transform">
              <div className="inline-block p-2 xs:p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg xs:rounded-xl mb-3 xs:mb-4">
                <div className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs xs:text-sm">
                  1
                </div>
              </div>
              <h3 className="text-base xs:text-lg font-bold text-gray-900 mb-2 xs:mb-3">Initiate Return</h3>
              <p className="text-xs xs:text-sm text-gray-600">
                Log into your account and go to Orders. Select the item you want to return and click
                "Return Item".
              </p>
            </div>

            <div className="bg-white rounded-xl xs:rounded-2xl shadow-lg p-4 xs:p-5 sm:p-6 border border-gray-200 active:scale-[0.98] transition-transform">
              <div className="inline-block p-2 xs:p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-lg xs:rounded-xl mb-3 xs:mb-4">
                <div className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xs xs:text-sm">
                  2
                </div>
              </div>
              <h3 className="text-base xs:text-lg font-bold text-gray-900 mb-2 xs:mb-3">Pack Your Item</h3>
              <p className="text-xs xs:text-sm text-gray-600">
                Pack the item securely in its original packaging if possible. Include all
                accessories and documentation.
              </p>
            </div>

            <div className="bg-white rounded-xl xs:rounded-2xl shadow-lg p-4 xs:p-5 sm:p-6 border border-gray-200 active:scale-[0.98] transition-transform">
              <div className="inline-block p-2 xs:p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg xs:rounded-xl mb-3 xs:mb-4">
                <div className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs xs:text-sm">
                  3
                </div>
              </div>
              <h3 className="text-base xs:text-lg font-bold text-gray-900 mb-2 xs:mb-3">Ship It Back</h3>
              <p className="text-xs xs:text-sm text-gray-600">
                Use the prepaid return label we email you. Drop off at any authorized carrier
                location.
              </p>
            </div>

            <div className="bg-white rounded-xl xs:rounded-2xl shadow-lg p-4 xs:p-5 sm:p-6 border border-gray-200 active:scale-[0.98] transition-transform">
              <div className="inline-block p-2 xs:p-3 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg xs:rounded-xl mb-3 xs:mb-4">
                <div className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xs xs:text-sm">
                  4
                </div>
              </div>
              <h3 className="text-base xs:text-lg font-bold text-gray-900 mb-2 xs:mb-3">Get Refunded</h3>
              <p className="text-xs xs:text-sm text-gray-600">
                Once we receive your return, we'll process your refund within 3-5 business days.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 xs:gap-6 sm:gap-8 mb-8 xs:mb-10 sm:mb-12">
          <div className="bg-white rounded-xl xs:rounded-2xl shadow-xl p-5 xs:p-6 sm:p-8 border border-gray-200">
            <h2 className="text-xl xs:text-2xl font-bold text-gray-900 mb-4 xs:mb-6">Return Policy Details</h2>
            <div className="space-y-3 xs:space-y-4 text-gray-600">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1.5 xs:mb-2 flex items-center gap-2 text-sm xs:text-base">
                  <FontAwesomeIcon icon={faClock} className="w-4 h-4 xs:w-5 xs:h-5 text-orange-600 flex-shrink-0" />
                  Return Window
                </h3>
                <p className="text-xs xs:text-sm ml-6 xs:ml-7">
                  You have 30 days from the delivery date to initiate a return. After 30 days, we
                  cannot accept returns, but warranty claims may still apply.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1.5 xs:mb-2 flex items-center gap-2 text-sm xs:text-base">
                  <FontAwesomeIcon icon={faBoxOpen} className="w-4 h-4 xs:w-5 xs:h-5 text-orange-600 flex-shrink-0" />
                  Item Condition
                </h3>
                <p className="text-xs xs:text-sm ml-6 xs:ml-7">
                  Items must be unused, unworn, and in their original condition with all tags
                  attached. Products showing signs of use may not be eligible for return.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1.5 xs:mb-2 flex items-center gap-2 text-sm xs:text-base">
                  <FontAwesomeIcon icon={faShieldAlt} className="w-4 h-4 xs:w-5 xs:h-5 text-orange-600 flex-shrink-0" />
                  Non-Returnable Items
                </h3>
                <p className="text-xs xs:text-sm ml-6 xs:ml-7">
                  For hygiene reasons, certain items like cosmetics, underwear, earrings, and
                  perishable goods cannot be returned once opened.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1.5 xs:mb-2 flex items-center gap-2 text-sm xs:text-base">
                  <FontAwesomeIcon icon={faDollarSign} className="w-4 h-4 xs:w-5 xs:h-5 text-orange-600 flex-shrink-0" />
                  Return Shipping
                </h3>
                <p className="text-xs xs:text-sm ml-6 xs:ml-7">
                  We provide free return shipping labels for all US domestic returns. International
                  returns may require the customer to cover shipping costs.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl xs:rounded-2xl shadow-xl p-5 xs:p-6 sm:p-8 border border-gray-200">
            <h2 className="text-xl xs:text-2xl font-bold text-gray-900 mb-4 xs:mb-6">Refund Information</h2>
            <div className="space-y-3 xs:space-y-4 text-gray-600">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1.5 xs:mb-2 flex items-center gap-2 text-sm xs:text-base">
                  <FontAwesomeIcon icon={faClock} className="w-4 h-4 xs:w-5 xs:h-5 text-green-600 flex-shrink-0" />
                  Processing Time
                </h3>
                <p className="text-xs xs:text-sm ml-6 xs:ml-7">
                  Once we receive and inspect your return, we'll process your refund within 3-5
                  business days. You'll receive an email confirmation when the refund is issued.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1.5 xs:mb-2 flex items-center gap-2 text-sm xs:text-base">
                  <FontAwesomeIcon icon={faDollarSign} className="w-4 h-4 xs:w-5 xs:h-5 text-green-600 flex-shrink-0" />
                  Refund Method
                </h3>
                <p className="text-xs xs:text-sm ml-6 xs:ml-7">
                  Refunds are issued to the original payment method. Credit card refunds may take
                  5-10 business days to appear on your statement depending on your bank.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1.5 xs:mb-2 flex items-center gap-2 text-sm xs:text-base">
                  <FontAwesomeIcon icon={faBoxOpen} className="w-4 h-4 xs:w-5 xs:h-5 text-green-600 flex-shrink-0" />
                  Partial Refunds
                </h3>
                <p className="text-xs xs:text-sm ml-6 xs:ml-7">
                  In some cases, partial refunds may be granted for items returned with obvious
                  signs of use, missing parts, or not in original condition.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1.5 xs:mb-2 flex items-center gap-2 text-sm xs:text-base">
                  <FontAwesomeIcon icon={faShieldAlt} className="w-4 h-4 xs:w-5 xs:h-5 text-green-600 flex-shrink-0" />
                  Exchanges
                </h3>
                <p className="text-xs xs:text-sm ml-6 xs:ml-7">
                  We don't offer direct exchanges. If you need a different size or color, please
                  return the original item for a refund and place a new order.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl xs:rounded-2xl shadow-xl p-5 xs:p-6 sm:p-8 border border-gray-200 mb-8 xs:mb-10 sm:mb-12">
          <h2 className="text-xl xs:text-2xl font-bold text-gray-900 mb-4 xs:mb-6">Special Cases</h2>
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-4 xs:gap-5 sm:gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 xs:mb-3 flex items-center gap-2 text-sm xs:text-base">
                <FontAwesomeIcon icon={faBoxOpen} className="w-4 h-4 xs:w-5 xs:h-5 text-red-600 flex-shrink-0" />
                <span className="leading-tight">Damaged or Defective Items</span>
              </h3>
              <p className="text-xs xs:text-sm text-gray-600">
                If you receive a damaged or defective item, contact us immediately with photos.
                We'll send a replacement or issue a full refund including return shipping costs.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 xs:mb-3 flex items-center gap-2 text-sm xs:text-base">
                <FontAwesomeIcon icon={faBoxOpen} className="w-4 h-4 xs:w-5 xs:h-5 text-blue-600 flex-shrink-0" />
                Wrong Item Received
              </h3>
              <p className="text-xs xs:text-sm text-gray-600">
                If you received the wrong item, we apologize! Contact us and we'll arrange to send
                the correct item at no additional cost and provide a return label for the wrong
                item.
              </p>
            </div>
            <div className="xs:col-span-2 md:col-span-1">
              <h3 className="font-semibold text-gray-900 mb-2 xs:mb-3 flex items-center gap-2 text-sm xs:text-base">
                <FontAwesomeIcon icon={faBoxOpen} className="w-4 h-4 xs:w-5 xs:h-5 text-purple-600 flex-shrink-0" />
                Missing Items
              </h3>
              <p className="text-xs xs:text-sm text-gray-600">
                If your package is missing items from your order, please contact us within 48 hours
                of delivery. We'll investigate and send the missing items or issue a refund.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-black to-gray-400 rounded-xl xs:rounded-2xl shadow-xl p-5 xs:p-6 sm:p-8 text-white text-center">
          <h2 className="text-xl xs:text-2xl font-bold mb-2 xs:mb-3">Need Help with a Return?</h2>
          <p className="text-gray-200 mb-4 xs:mb-6 max-w-2xl mx-auto text-sm xs:text-base">
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
