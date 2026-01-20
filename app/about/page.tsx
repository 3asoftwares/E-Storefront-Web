'use client';

import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faAward,
  faHeart,
  faShieldAlt,
  faTruck,
  faHeadset,
} from '@fortawesome/free-solid-svg-icons';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="border-b border-gray-200 bg-white/95 backdrop-blur-lg">
        <div className="mx-auto max-w-7xl px-3 py-6 xs:px-4 xs:py-8 sm:px-6 lg:px-8">
          <div className="flex w-full flex-col items-center text-center">
            <Image
              src={process.env.NEXT_PUBLIC_LOGO_URL || '/icons/icon-192x192.png'}
              alt="3A Softwares"
              width={80}
              height={80}
              className="w-20 object-contain xs:w-24 sm:w-28"
              unoptimized
            />
            <h1 className="mb-3 bg-gradient-to-r from-black to-gray-300 bg-clip-text text-3xl font-extrabold text-transparent xs:mb-4 xs:text-4xl sm:text-5xl">
              About 3A Softwares
            </h1>
            <p className="mx-auto max-w-2xl px-2 text-base text-gray-600 xs:text-lg sm:text-xl">
              Your trusted online marketplace for quality products and exceptional service
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-3 py-6 xs:px-4 xs:py-8 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-5 shadow-xl xs:mb-10 xs:rounded-2xl xs:p-6 sm:mb-12 sm:p-8 md:p-12">
          <h2 className="mb-4 text-2xl font-bold text-gray-900 xs:mb-6 xs:text-3xl">Our Story</h2>
          <div className="prose max-w-none space-y-3 text-gray-600 xs:space-y-4">
            <p className="text-base leading-relaxed xs:text-lg">
              Founded in 2020, 3A Softwares started with a simple mission: to make online shopping
              accessible, enjoyable, and trustworthy for everyone. What began as a small startup has
              grown into a thriving 3asoftwares platform serving thousands of satisfied customers
              worldwide.
            </p>
            <p className="text-base leading-relaxed xs:text-lg">
              We believe that shopping online should be more than just a transaction. It&apos;s
              about discovering products you love, connecting with brands you trust, and enjoying a
              seamless experience from browsing to delivery. That&apos;s why we&apos;ve built our
              platform with care, focusing on quality, security, and customer satisfaction at every
              step.
            </p>
            <p className="text-base leading-relaxed xs:text-lg">
              Today, 3A Softwares is proud to partner with hundreds of verified sellers and brands,
              offering an extensive selection of products across multiple categories. From
              electronics to fashion, home goods to sports equipment, we&apos;re here to help you
              find exactly what you need.
            </p>
          </div>
        </div>

        <div className="mb-8 xs:mb-10 sm:mb-12">
          <h2 className="mb-6 text-center text-2xl font-bold text-gray-900 xs:mb-8 xs:text-3xl">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 xs:gap-5 sm:gap-6 lg:grid-cols-4">
            <div className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-lg transition-shadow hover:shadow-2xl active:scale-[0.98] xs:rounded-2xl xs:p-5 sm:p-6">
              <div className="mb-3 inline-block rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 p-3 xs:mb-4 xs:rounded-xl xs:p-4">
                <FontAwesomeIcon
                  icon={faShieldAlt}
                  className="h-6 w-6 text-blue-600 xs:h-7 xs:w-7 sm:h-8 sm:w-8"
                />
              </div>
              <h3 className="mb-2 text-lg font-bold text-gray-900 xs:mb-3 xs:text-xl">
                Trust & Security
              </h3>
              <p className="text-xs text-gray-600 xs:text-sm">
                Your security is our priority. We use industry-leading encryption and secure payment
                methods.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-lg transition-shadow hover:shadow-2xl active:scale-[0.98] xs:rounded-2xl xs:p-5 sm:p-6">
              <div className="mb-3 inline-block rounded-lg bg-gradient-to-br from-green-100 to-green-200 p-3 xs:mb-4 xs:rounded-xl xs:p-4">
                <FontAwesomeIcon
                  icon={faAward}
                  className="h-6 w-6 text-green-600 xs:h-7 xs:w-7 sm:h-8 sm:w-8"
                />
              </div>
              <h3 className="mb-2 text-lg font-bold text-gray-900 xs:mb-3 xs:text-xl">
                Quality First
              </h3>
              <p className="text-xs text-gray-600 xs:text-sm">
                Every product is carefully vetted to ensure it meets our high standards for quality.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-lg transition-shadow hover:shadow-2xl active:scale-[0.98] xs:rounded-2xl xs:p-5 sm:p-6">
              <div className="mb-3 inline-block rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 p-3 xs:mb-4 xs:rounded-xl xs:p-4">
                <FontAwesomeIcon
                  icon={faHeart}
                  className="h-6 w-6 text-purple-600 xs:h-7 xs:w-7 sm:h-8 sm:w-8"
                />
              </div>
              <h3 className="mb-2 text-lg font-bold text-gray-900 xs:mb-3 xs:text-xl">
                Customer Love
              </h3>
              <p className="text-xs text-gray-600 xs:text-sm">
                Your satisfaction drives everything we do. We&apos;re here to make your experience
                amazing.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-lg transition-shadow hover:shadow-2xl active:scale-[0.98] xs:rounded-2xl xs:p-5 sm:p-6">
              <div className="mb-3 inline-block rounded-lg bg-gradient-to-br from-orange-100 to-orange-200 p-3 xs:mb-4 xs:rounded-xl xs:p-4">
                <FontAwesomeIcon
                  icon={faUsers}
                  className="h-6 w-6 text-orange-600 xs:h-7 xs:w-7 sm:h-8 sm:w-8"
                />
              </div>
              <h3 className="mb-2 text-lg font-bold text-gray-900 xs:mb-3 xs:text-xl">Community</h3>
              <p className="text-xs text-gray-600 xs:text-sm">
                We&apos;re building a community of shoppers, sellers, and brands who support each
                other.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8 rounded-xl bg-gradient-to-r from-black to-gray-400 p-5 text-white shadow-2xl xs:mb-10 xs:rounded-2xl xs:p-6 sm:mb-12 sm:p-8 md:p-12">
          <h2 className="mb-6 text-center text-2xl font-bold xs:mb-8 xs:text-3xl">
            Why Choose 3A Softwares?
          </h2>
          <div className="grid grid-cols-1 gap-5 xs:grid-cols-2 xs:gap-6 sm:gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-3 inline-block rounded-lg bg-white/20 p-3 xs:mb-4 xs:rounded-xl xs:p-4">
                <FontAwesomeIcon icon={faTruck} className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Fast Shipping</h3>
              <p className="text-indigo-100">
                Free shipping on orders over ₹500 with delivery in 3-5 business days
              </p>
            </div>
            <div className="text-center">
              <div className="mb-4 inline-block rounded-xl bg-white/20 p-4">
                <FontAwesomeIcon icon={faShieldAlt} className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Secure Payments</h3>
              <p className="text-indigo-100">
                100% secure transactions with SSL encryption and fraud protection
              </p>
            </div>
            <div className="text-center">
              <div className="mb-4 inline-block rounded-xl bg-white/20 p-4">
                <FontAwesomeIcon icon={faHeadset} className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-bold">24/7 Support</h3>
              <p className="text-indigo-100">
                Dedicated customer support team ready to help you anytime
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 xs:gap-4 sm:gap-6 md:grid-cols-4">
          <div className="rounded-lg border border-gray-200 bg-white p-4 text-center shadow-lg xs:rounded-xl xs:p-5 sm:p-6">
            <p className="mb-1 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-2xl font-extrabold text-transparent xs:mb-2 xs:text-3xl sm:text-4xl">
              50K+
            </p>
            <p className="text-xs font-semibold text-gray-600 xs:text-sm sm:text-base">
              Happy Customers
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 text-center shadow-lg xs:rounded-xl xs:p-5 sm:p-6">
            <p className="mb-1 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-2xl font-extrabold text-transparent xs:mb-2 xs:text-3xl sm:text-4xl">
              10K+
            </p>
            <p className="text-xs font-semibold text-gray-600 xs:text-sm sm:text-base">Products</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 text-center shadow-lg xs:rounded-xl xs:p-5 sm:p-6">
            <p className="mb-1 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-2xl font-extrabold text-transparent xs:mb-2 xs:text-3xl sm:text-4xl">
              500+
            </p>
            <p className="text-xs font-semibold text-gray-600 xs:text-sm sm:text-base">
              Trusted Sellers
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 text-center shadow-lg xs:rounded-xl xs:p-5 sm:p-6">
            <p className="mb-1 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-2xl font-extrabold text-transparent xs:mb-2 xs:text-3xl sm:text-4xl">
              4.8/5
            </p>
            <p className="text-xs font-semibold text-gray-600 xs:text-sm sm:text-base">
              Customer Rating
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
