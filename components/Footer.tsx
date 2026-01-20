import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRight,
  faLocation,
  faMobile,
  faMailForward,
} from '@fortawesome/free-solid-svg-icons';

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-700 to-gray-900 pb-safe-bottom text-white">
      <div className="relative mx-auto max-w-7xl px-4 py-10 xs:px-5 xs:py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mb-4 grid grid-cols-2 gap-4 gap-6 xs:mb-10 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="col-span-2 mb-4 sm:col-span-2 sm:mb-0 lg:col-span-1">
            <div className="mb-3 flex items-center gap-2 xs:mb-4">
              <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-sm font-bold text-white shadow-lg xs:h-10 xs:w-10 xs:rounded-xl xs:text-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={process.env.NEXT_PUBLIC_LOGO_URL}
                  alt={'3A Softwares'}
                  className="h-full w-full object-contain"
                />
              </div>
              <h3 className="bg-white bg-clip-text text-lg font-extrabold text-transparent xs:text-xl">
                3A Softwares
              </h3>
            </div>
            <p className="max-full text-xs leading-relaxed text-gray-300 xs:text-sm sm:max-w-xs">
              Your trusted online marketplace for quality products at competitive prices. Shop with
              confidence and style.
            </p>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="mb-3 text-base font-bold text-white xs:mb-4 xs:text-lg">Shop</h3>
            <ul className="space-y-2 text-xs xs:space-y-2.5 xs:text-sm">
              <li>
                <Link
                  href="/products"
                  className="group inline-flex min-h-[32px] items-center gap-2 text-gray-300 transition-colors hover:text-indigo-400"
                >
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="h-2.5 w-2.5 transition-transform group-hover:translate-x-1 xs:h-3 xs:w-3"
                  />
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/products?featured=true"
                  className="group inline-flex min-h-[32px] items-center gap-2 text-gray-300 transition-colors hover:text-indigo-400"
                >
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="h-2.5 w-2.5 transition-transform group-hover:translate-x-1 xs:h-3 xs:w-3"
                  />
                  Featured Items
                </Link>
              </li>
              <li>
                <Link
                  href="/products?sortBy=newest"
                  className="group inline-flex min-h-[32px] items-center gap-2 text-gray-300 transition-colors hover:text-indigo-400"
                >
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="h-2.5 w-2.5 transition-transform group-hover:translate-x-1 xs:h-3 xs:w-3"
                  />
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="group inline-flex min-h-[32px] items-center gap-2 text-gray-300 transition-colors hover:text-indigo-400"
                >
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="h-2.5 w-2.5 transition-transform group-hover:translate-x-1 xs:h-3 xs:w-3"
                  />
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="mb-3 text-base font-bold text-white xs:mb-4 xs:text-lg">Support</h3>
            <ul className="space-y-2 text-xs xs:space-y-2.5 xs:text-sm">
              <li>
                <Link
                  href="/contact"
                  className="group inline-flex min-h-[32px] items-center gap-2 text-gray-300 transition-colors hover:text-purple-400"
                >
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="h-2.5 w-2.5 transition-transform group-hover:translate-x-1 xs:h-3 xs:w-3"
                  />
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="group inline-flex min-h-[32px] items-center gap-2 text-gray-300 transition-colors hover:text-purple-400"
                >
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="h-2.5 w-2.5 transition-transform group-hover:translate-x-1 xs:h-3 xs:w-3"
                  />
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="group inline-flex min-h-[32px] items-center gap-2 text-gray-300 transition-colors hover:text-purple-400"
                >
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="h-2.5 w-2.5 transition-transform group-hover:translate-x-1 xs:h-3 xs:w-3"
                  />
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="group inline-flex min-h-[32px] items-center gap-2 text-gray-300 transition-colors hover:text-purple-400"
                >
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="h-2.5 w-2.5 transition-transform group-hover:translate-x-1 xs:h-3 xs:w-3"
                  />
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-span-2 sm:col-span-1">
            <h3 className="mb-3 text-base font-bold text-white xs:mb-4 xs:text-lg">Get in Touch</h3>
            <ul className="space-y-2 text-xs text-gray-400 xs:space-y-3 xs:text-sm">
              <li className="flex items-start gap-2">
                <FontAwesomeIcon icon={faMailForward} className="mt-0.5 h-3 w-3 flex-shrink-0" />
                <a
                  href="mailto:3asoftwares@gmail.com"
                  className="min-h-4 break-all transition-colors hover:text-blue-400 sm:min-h-11"
                >
                  3asoftwares@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <FontAwesomeIcon icon={faMobile} className="mt-0.5 h-3 w-3 flex-shrink-0" />
                <a
                  href="tel:1-800-4567"
                  className="min-h-4 transition-colors hover:text-blue-400 sm:min-h-11"
                >
                  +91 7047026537
                </a>
              </li>
              <li className="flex items-start gap-2">
                <FontAwesomeIcon icon={faLocation} className="mt-0.5 h-3 w-3 flex-shrink-0" />
                <span className="text-xs xs:text-sm">
                  167, Dayanand Ward, Sagar Madhya Pradesh, India
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-6 xs:pt-8">
          <div className="flex flex-col items-center justify-between gap-4 xs:gap-6 sm:flex-row">
            {/* Social Links */}
            <div className="flex gap-3 xs:gap-4">
              <span
                className="flex h-9 min-h-[36px] w-9 min-w-[36px] cursor-default items-center justify-center rounded-full bg-gray-800 xs:h-10 xs:w-10"
                aria-label="Facebook"
              >
                f
              </span>
              <span
                className="flex h-9 min-h-[36px] w-9 min-w-[36px] cursor-default items-center justify-center rounded-full bg-gray-800 xs:h-10 xs:w-10"
                aria-label="Twitter/X"
              >
                𝕏
              </span>
              <span
                className="flex h-9 min-h-[36px] w-9 min-w-[36px] cursor-default items-center justify-center rounded-full bg-gray-800 xs:h-10 xs:w-10"
                aria-label="LinkedIn"
              >
                in
              </span>
            </div>

            {/* Copyright */}
            <div className="text-center sm:text-right">
              <p className="text-xs text-gray-400 xs:text-sm">
                © {new Date().getFullYear()} 3A Softwares. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
