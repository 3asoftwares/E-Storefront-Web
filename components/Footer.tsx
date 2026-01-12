import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faLocation, faMobile, faMailForward } from '@fortawesome/free-solid-svg-icons';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-700 to-gray-900 text-white relative overflow-hidden pb-safe-bottom">
      <div className="relative max-w-7xl mx-auto px-4 xs:px-5 sm:px-6 lg:px-8 py-10 xs:py-12 sm:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 gap-4 sm:gap-8 mb-4 xs:mb-10">
          {/* Brand Section */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1 mb-4 sm:mb-0">
            <div className="flex items-center gap-2 mb-3 xs:mb-4">
              <div className="w-8 h-8 xs:w-10 xs:h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-lg xs:rounded-xl flex items-center justify-center text-white font-bold text-sm xs:text-lg shadow-lg overflow-hidden">
                <img
                  src={process.env.NEXT_PUBLIC_LOGO_URL}
                  alt={'3A Softwares'}
                  className="object-contain w-full h-full"
                />
              </div>
              <h3 className="font-extrabold text-lg xs:text-xl bg-clip-text text-transparent bg-white">
                3A Softwares
              </h3>
            </div>
            <p className="text-gray-300 text-xs xs:text-sm leading-relaxed max-full sm:max-w-xs">
              Your trusted online marketplace for quality products at competitive prices. Shop with
              confidence and style.
            </p>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="font-bold text-base xs:text-lg mb-3 xs:mb-4 text-white">Shop</h3>
            <ul className="space-y-2 xs:space-y-2.5 text-xs xs:text-sm">
              <li>
                <Link
                  href="/products"
                  className="text-gray-300 hover:text-indigo-400 transition-colors inline-flex items-center gap-2 group min-h-[32px]"
                >
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="w-2.5 h-2.5 xs:w-3 xs:h-3 group-hover:translate-x-1 transition-transform"
                  />
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/products?featured=true"
                  className="text-gray-300 hover:text-indigo-400 transition-colors inline-flex items-center gap-2 group min-h-[32px]"
                >
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="w-2.5 h-2.5 xs:w-3 xs:h-3 group-hover:translate-x-1 transition-transform"
                  />
                  Featured Items
                </Link>
              </li>
              <li>
                <Link
                  href="/products?sortBy=newest"
                  className="text-gray-300 hover:text-indigo-400 transition-colors inline-flex items-center gap-2 group min-h-[32px]"
                >
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="w-2.5 h-2.5 xs:w-3 xs:h-3 group-hover:translate-x-1 transition-transform"
                  />
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-300 hover:text-indigo-400 transition-colors inline-flex items-center gap-2 group min-h-[32px]"
                >
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="w-2.5 h-2.5 xs:w-3 xs:h-3 group-hover:translate-x-1 transition-transform"
                  />
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-bold text-base xs:text-lg mb-3 xs:mb-4 text-white">Support</h3>
            <ul className="space-y-2 xs:space-y-2.5 text-xs xs:text-sm">
              <li>
                <Link
                  href="/contact"
                  className="text-gray-300 hover:text-purple-400 transition-colors inline-flex items-center gap-2 group min-h-[32px]"
                >
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="w-2.5 h-2.5 xs:w-3 xs:h-3 group-hover:translate-x-1 transition-transform"
                  />
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-gray-300 hover:text-purple-400 transition-colors inline-flex items-center gap-2 group min-h-[32px]"
                >
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="w-2.5 h-2.5 xs:w-3 xs:h-3 group-hover:translate-x-1 transition-transform"
                  />
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-gray-300 hover:text-purple-400 transition-colors inline-flex items-center gap-2 group min-h-[32px]"
                >
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="w-2.5 h-2.5 xs:w-3 xs:h-3 group-hover:translate-x-1 transition-transform"
                  />
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-gray-300 hover:text-purple-400 transition-colors inline-flex items-center gap-2 group min-h-[32px]"
                >
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="w-2.5 h-2.5 xs:w-3 xs:h-3 group-hover:translate-x-1 transition-transform"
                  />
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-span-2 sm:col-span-1">
            <h3 className="font-bold text-base xs:text-lg mb-3 xs:mb-4 text-white">Get in Touch</h3>
            <ul className="space-y-2 xs:space-y-3 text-xs xs:text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <FontAwesomeIcon icon={faMailForward} className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <a
                  href="mailto:3asoftwares@gmail.com"
                  className="hover:text-blue-400 transition-colors break-all min-h-4 sm:min-h-11"
                >
                  3asoftwares@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <FontAwesomeIcon icon={faMobile} className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <a href="tel:1-800-4567" className="hover:text-blue-400 transition-colors min-h-4 sm:min-h-11">
                  +91 7047026537
                </a>
              </li>
              <li className="flex items-start gap-2">
                <FontAwesomeIcon icon={faLocation} className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span className="text-xs xs:text-sm">167, Dayanand Ward, Sagar Madhya Pradesh, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-6 xs:pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 xs:gap-6">
            {/* Social Links */}
            <div className="flex gap-3 xs:gap-4">
              <span
                className="w-9 h-9 xs:w-10 xs:h-10 rounded-full bg-gray-800 flex items-center justify-center min-h-[36px] min-w-[36px] cursor-default"
                aria-label="Facebook"
              >
                f
              </span>
              <span
                className="w-9 h-9 xs:w-10 xs:h-10 rounded-full bg-gray-800 flex items-center justify-center min-h-[36px] min-w-[36px] cursor-default"
                aria-label="Twitter/X"
              >
                𝕏
              </span>
              <span
                className="w-9 h-9 xs:w-10 xs:h-10 rounded-full bg-gray-800 flex items-center justify-center min-h-[36px] min-w-[36px] cursor-default"
                aria-label="LinkedIn"
              >
                in
              </span>
            </div>
            
            {/* Copyright */}
            <div className="text-center sm:text-right">
              <p className="text-gray-400 text-xs xs:text-sm">
                © {new Date().getFullYear()} 3A Softwares. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
