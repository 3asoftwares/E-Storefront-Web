'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faAward, faHeart, faShieldAlt, faTruck, faHeadset } from '@fortawesome/free-solid-svg-icons';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="bg-white/95 backdrop-blur-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-6 xs:py-8">
          <div className="flex flex-col items-center w-full text-center">
            <img
              src={process.env.NEXT_PUBLIC_LOGO_URL}
              alt={'3A Softwares'}
              className="object-contain w-20 xs:w-24 sm:w-28"
            />
            <h1 className="text-3xl xs:text-4xl sm:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-black to-gray-300 mb-3 xs:mb-4">
              About 3A Softwares
            </h1>
            <p className="text-base xs:text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-2">
              Your trusted online marketplace for quality products and exceptional service
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-6 xs:py-8">
        <div className="bg-white rounded-xl xs:rounded-2xl shadow-xl p-5 xs:p-6 sm:p-8 md:p-12 mb-8 xs:mb-10 sm:mb-12 border border-gray-200">
          <h2 className="text-2xl xs:text-3xl font-bold text-gray-900 mb-4 xs:mb-6">Our Story</h2>
          <div className="prose max-w-none text-gray-600 space-y-3 xs:space-y-4">
            <p className="text-base xs:text-lg leading-relaxed">
              Founded in 2020, 3A Softwares started with a simple mission: to make online shopping
              accessible, enjoyable, and trustworthy for everyone. What began as a small startup has
              grown into a thriving 3asoftwares platform serving thousands of satisfied customers
              worldwide.
            </p>
            <p className="text-base xs:text-lg leading-relaxed">
              We believe that shopping online should be more than just a transaction. It's about
              discovering products you love, connecting with brands you trust, and enjoying a
              seamless experience from browsing to delivery. That's why we've built our platform
              with care, focusing on quality, security, and customer satisfaction at every step.
            </p>
            <p className="text-base xs:text-lg leading-relaxed">
              Today, 3A Softwares is proud to partner with hundreds of verified sellers and brands,
              offering an extensive selection of products across multiple categories. From
              electronics to fashion, home goods to sports equipment, we're here to help you find
              exactly what you need.
            </p>
          </div>
        </div>

        <div className="mb-8 xs:mb-10 sm:mb-12">
          <h2 className="text-2xl xs:text-3xl font-bold text-gray-900 mb-6 xs:mb-8 text-center">Our Core Values</h2>
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 xs:gap-5 sm:gap-6">
            <div className="bg-white rounded-xl xs:rounded-2xl shadow-lg p-4 xs:p-5 sm:p-6 text-center border border-gray-200 hover:shadow-2xl transition-shadow active:scale-[0.98]">
              <div className="inline-block p-3 xs:p-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg xs:rounded-xl mb-3 xs:mb-4">
                <FontAwesomeIcon icon={faShieldAlt} className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 text-blue-600" />
              </div>
              <h3 className="text-lg xs:text-xl font-bold text-gray-900 mb-2 xs:mb-3">Trust & Security</h3>
              <p className="text-gray-600 text-xs xs:text-sm">
                Your security is our priority. We use industry-leading encryption and secure payment
                methods.
              </p>
            </div>
            <div className="bg-white rounded-xl xs:rounded-2xl shadow-lg p-4 xs:p-5 sm:p-6 text-center border border-gray-200 hover:shadow-2xl transition-shadow active:scale-[0.98]">
              <div className="inline-block p-3 xs:p-4 bg-gradient-to-br from-green-100 to-green-200 rounded-lg xs:rounded-xl mb-3 xs:mb-4">
                <FontAwesomeIcon icon={faAward} className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 text-green-600" />
              </div>
              <h3 className="text-lg xs:text-xl font-bold text-gray-900 mb-2 xs:mb-3">Quality First</h3>
              <p className="text-gray-600 text-xs xs:text-sm">
                Every product is carefully vetted to ensure it meets our high standards for quality.
              </p>
            </div>
            <div className="bg-white rounded-xl xs:rounded-2xl shadow-lg p-4 xs:p-5 sm:p-6 text-center border border-gray-200 hover:shadow-2xl transition-shadow active:scale-[0.98]">
              <div className="inline-block p-3 xs:p-4 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg xs:rounded-xl mb-3 xs:mb-4">
                <FontAwesomeIcon icon={faHeart} className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 text-purple-600" />
              </div>
              <h3 className="text-lg xs:text-xl font-bold text-gray-900 mb-2 xs:mb-3">Customer Love</h3>
              <p className="text-gray-600 text-xs xs:text-sm">
                Your satisfaction drives everything we do. We're here to make your experience
                amazing.
              </p>
            </div>
            <div className="bg-white rounded-xl xs:rounded-2xl shadow-lg p-4 xs:p-5 sm:p-6 text-center border border-gray-200 hover:shadow-2xl transition-shadow active:scale-[0.98]">
              <div className="inline-block p-3 xs:p-4 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg xs:rounded-xl mb-3 xs:mb-4">
                <FontAwesomeIcon icon={faUsers} className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 text-orange-600" />
              </div>
              <h3 className="text-lg xs:text-xl font-bold text-gray-900 mb-2 xs:mb-3">Community</h3>
              <p className="text-gray-600 text-xs xs:text-sm">
                We're building a community of shoppers, sellers, and brands who support each other.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-black to-gray-400 rounded-xl xs:rounded-2xl shadow-2xl p-5 xs:p-6 sm:p-8 md:p-12 mb-8 xs:mb-10 sm:mb-12 text-white">
          <h2 className="text-2xl xs:text-3xl font-bold mb-6 xs:mb-8 text-center">Why Choose 3A Softwares?</h2>
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-5 xs:gap-6 sm:gap-8">
            <div className="text-center">
              <div className="inline-block p-3 xs:p-4 bg-white/20 rounded-lg xs:rounded-xl mb-3 xs:mb-4">
                <FontAwesomeIcon icon={faTruck} className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Fast Shipping</h3>
              <p className="text-indigo-100">
                Free shipping on orders over ₹500 with delivery in 3-5 business days
              </p>
            </div>
            <div className="text-center">
              <div className="inline-block p-4 bg-white/20 rounded-xl mb-4">
                <FontAwesomeIcon icon={faShieldAlt} className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Secure Payments</h3>
              <p className="text-indigo-100">
                100% secure transactions with SSL encryption and fraud protection
              </p>
            </div>
            <div className="text-center">
              <div className="inline-block p-4 bg-white/20 rounded-xl mb-4">
                <FontAwesomeIcon icon={faHeadset} className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">24/7 Support</h3>
              <p className="text-indigo-100">
                Dedicated customer support team ready to help you anytime
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 xs:gap-4 sm:gap-6">
          <div className="bg-white rounded-lg xs:rounded-xl shadow-lg p-4 xs:p-5 sm:p-6 text-center border border-gray-200">
            <p className="text-2xl xs:text-3xl sm:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-1 xs:mb-2">
              50K+
            </p>
            <p className="text-gray-600 font-semibold text-xs xs:text-sm sm:text-base">Happy Customers</p>
          </div>
          <div className="bg-white rounded-lg xs:rounded-xl shadow-lg p-4 xs:p-5 sm:p-6 text-center border border-gray-200">
            <p className="text-2xl xs:text-3xl sm:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-600 mb-1 xs:mb-2">
              10K+
            </p>
            <p className="text-gray-600 font-semibold text-xs xs:text-sm sm:text-base">Products</p>
          </div>
          <div className="bg-white rounded-lg xs:rounded-xl shadow-lg p-4 xs:p-5 sm:p-6 text-center border border-gray-200">
            <p className="text-2xl xs:text-3xl sm:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 mb-1 xs:mb-2">
              500+
            </p>
            <p className="text-gray-600 font-semibold text-xs xs:text-sm sm:text-base">Trusted Sellers</p>
          </div>
          <div className="bg-white rounded-lg xs:rounded-xl shadow-lg p-4 xs:p-5 sm:p-6 text-center border border-gray-200">
            <p className="text-2xl xs:text-3xl sm:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-red-600 mb-1 xs:mb-2">
              4.8/5
            </p>
            <p className="text-gray-600 font-semibold text-xs xs:text-sm sm:text-base">Customer Rating</p>
          </div>
        </div>
      </div>
    </div>
  );
}
