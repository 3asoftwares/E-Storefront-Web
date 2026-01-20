'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { Button, Input } from '@3asoftwares/ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faHeart,
  faShoppingCart,
  faUser,
  faCaretDown,
  faSignOutAlt,
  faBox,
  faBars,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import {
  storeAuth,
  clearAuth as clearAuthCookies,
  getCurrentUser,
} from '@3asoftwares/utils/client';

export default function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { setUserProfile } = useCartStore();
  const [user, setUser] = useState<any>(null);
  const { items, wishlist } = useCartStore();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      storeAuth({
        user: {},
        accessToken: token,
      });
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      setUserProfile(null);
    }

    const userData = getCurrentUser();
    if (userData) {
      setUser(userData);
    }
  }, [searchParams, setUserProfile]);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
        setSearchQuery('');
      }
    },
    [searchQuery, router]
  );

  const handleLogout = useCallback(() => {
    clearAuthCookies();
    setUser(null);
    setIsMenuOpen(false);
    router.push('/');
  }, [router]);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const cartItemCount = useMemo(() => {
    return items.length > 9 ? '9+' : items.length;
  }, [items.length]);

  const wishlistCount = useMemo(() => {
    return wishlist.length > 9 ? '9+' : wishlist.length;
  }, [wishlist.length]);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur-lg safe:pt-safe-top">
      <div className="mx-auto max-w-7xl px-3 py-2 xs:px-4 sm:px-6 lg:px-8">
        <div className="flex h-12 items-center justify-between xs:h-14 sm:h-16">
          <Link href="/" className="group flex flex-shrink-0 items-center gap-1 xs:gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={process.env.NEXT_PUBLIC_LOGO_URL}
              alt={'3A Softwares'}
              className="w-10 object-contain xs:w-12 sm:w-16"
            />
            <span className="hidden max-w-[100px] truncate text-base font-extrabold text-black xs:block xs:max-w-[120px] xs:text-lg sm:max-w-none sm:text-2xl">
              3A Softwares
            </span>
          </Link>

          <form
            onSubmit={handleSearch}
            className="mx-4 hidden max-w-xl flex-1 items-center md:flex lg:mx-8"
          >
            <div className="relative w-full">
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products, brands, and more..."
                className="!mb-0"
                rightIcon={
                  <Button
                    type="submit"
                    size="sm"
                    variant="ghost"
                    className="text-gray-400 transition-colors hover:text-indigo-600"
                  >
                    <FontAwesomeIcon icon={faSearch} className="h-5 w-5" />
                  </Button>
                }
              />
            </div>
          </form>

          <div className="flex items-center gap-1 xs:gap-2 sm:gap-3 md:gap-4">
            <Link
              href="/wishlist"
              className="group relative flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg p-2 text-gray-600 transition-all hover:bg-pink-50 hover:text-pink-600 xs:p-2.5 sm:rounded-xl sm:p-3"
              title="Wishlist"
            >
              <FontAwesomeIcon
                icon={faHeart}
                className="h-5 w-5 transition-transform group-hover:scale-110 xs:h-5 xs:w-5 sm:h-6 sm:w-6"
              />
              {wishlist.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-red-500 text-[10px] font-bold text-white shadow-lg xs:-right-0.5 xs:top-0 xs:h-5 xs:w-5 xs:text-xs">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              className="group relative flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg p-2 text-gray-600 transition-all hover:bg-indigo-50 hover:text-indigo-600 xs:p-2.5 sm:rounded-xl sm:p-3"
              title="Shopping Cart"
            >
              <FontAwesomeIcon
                icon={faShoppingCart}
                className="h-5 w-5 transition-transform group-hover:scale-110 xs:h-5 xs:w-5 sm:h-6 sm:w-6"
              />
              {items.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gray-700 text-[10px] font-bold text-white shadow-lg xs:-right-0.5 xs:top-0 xs:h-5 xs:w-5 xs:text-xs">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="group relative flex gap-2">
                <Button
                  variant="outline"
                  size="md"
                  className="hidden !w-auto !border !border-gray-800 !text-gray-600 md:flex"
                  fullWidth={false}
                >
                  <FontAwesomeIcon icon={faUser} className="h-4 w-4 xs:h-5 xs:w-5" />
                  <span className="max-w-xs truncate text-xs font-bold text-gray-600 xs:text-sm">
                    {user.name || user.email?.split('@')[0]}
                  </span>
                  <FontAwesomeIcon icon={faCaretDown} className="h-4 w-4 xs:h-5 xs:w-5" />
                </Button>
                <Button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  variant="ghost"
                  size="sm"
                  className="block md:hidden"
                  fullWidth={false}
                >
                  <FontAwesomeIcon icon={faUser} className="h-5 w-5 sm:h-6 sm:w-6" />
                </Button>
                <div className="invisible absolute right-0 top-16 z-10 mt-0 w-48 rounded-lg border border-gray-200 bg-white opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:opacity-100">
                  <Link
                    href="/profile"
                    className="block border-b border-gray-100 px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    <FontAwesomeIcon icon={faUser} className="mr-2" />
                    My Profile
                  </Link>
                  <Link
                    href="/orders"
                    className="block border-b border-gray-100 px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    <FontAwesomeIcon icon={faBox} className="mr-2" />
                    My Orders
                  </Link>
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    size="md"
                    fullWidth={true}
                    className="block !justify-start border-b border-gray-100 !px-4 px-4 py-3 !text-sm text-gray-600 text-gray-700 transition-colors hover:bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className="" />
                    Sign Out
                  </Button>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden rounded-md border-2 border-black px-4 py-2 text-xs font-bold text-gray-800 transition-all hover:shadow-lg xs:px-6 xs:py-2.5 xs:text-sm sm:inline-block"
              >
                Sign In
              </Link>
            )}

            <Button
              onClick={toggleMobileMenu}
              variant="ghost"
              size="sm"
              fullWidth={false}
              className="p-1.5 text-gray-600 transition-colors hover:text-indigo-600 sm:p-2 md:hidden"
            >
              <FontAwesomeIcon
                icon={isMobileMenuOpen ? faTimes : faBars}
                className="h-5 w-5 xs:h-5 xs:w-5 sm:h-6 sm:w-6"
              />
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <form onSubmit={handleSearch} className="pb-2 sm:pb-3 sm:pb-4 md:hidden">
          <div className="relative w-full">
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="!mb-0 text-base"
              rightIcon={
                <Button
                  type="submit"
                  size="sm"
                  variant="ghost"
                  className="min-h-[44px] min-w-[44px] text-gray-400 transition-colors hover:text-indigo-600"
                >
                  <FontAwesomeIcon icon={faSearch} className="h-5 w-5" />
                </Button>
              }
            />
          </div>
        </form>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="max-h-[70vh] animate-slide-down overflow-y-auto border-t border-gray-200 bg-white shadow-lg md:hidden">
          <nav className="divide-y divide-gray-100">
            <Link
              href="/"
              onClick={closeMobileMenu}
              className="flex min-h-[52px] items-center px-4 py-4 font-medium text-gray-700 hover:bg-indigo-50 active:bg-indigo-100 xs:px-5"
            >
              Home
            </Link>
            <Link
              href="/products"
              onClick={closeMobileMenu}
              className="flex min-h-[52px] items-center px-4 py-4 font-medium text-gray-700 hover:bg-indigo-50 active:bg-indigo-100 xs:px-5"
            >
              Products
            </Link>
            <Link
              href="/orders"
              onClick={closeMobileMenu}
              className="flex min-h-[52px] items-center px-4 py-4 font-medium text-gray-700 hover:bg-indigo-50 active:bg-indigo-100 xs:px-5"
            >
              Orders
            </Link>
            <Link
              href="/about"
              onClick={closeMobileMenu}
              className="flex min-h-[52px] items-center px-4 py-4 font-medium text-gray-700 hover:bg-indigo-50 active:bg-indigo-100 xs:px-5"
            >
              About
            </Link>
            <Link
              href="/contact"
              onClick={closeMobileMenu}
              className="flex min-h-[52px] items-center px-4 py-4 font-medium text-gray-700 hover:bg-indigo-50 active:bg-indigo-100 xs:px-5"
            >
              Contact
            </Link>
            <Link
              href="/cart"
              onClick={closeMobileMenu}
              className="flex min-h-[52px] items-center px-4 py-4 font-medium text-gray-700 hover:bg-indigo-50 active:bg-indigo-100 xs:px-5"
            >
              <FontAwesomeIcon icon={faShoppingCart} className="mr-3 h-5 w-5" />
              Cart ({items.length})
            </Link>
            {user ? (
              <>
                <Link
                  href="/profile"
                  onClick={closeMobileMenu}
                  className="flex min-h-[52px] items-center px-4 py-4 font-medium text-gray-700 hover:bg-indigo-50 active:bg-indigo-100 xs:px-5"
                >
                  <FontAwesomeIcon icon={faUser} className="mr-3 h-5 w-5" />
                  Profile
                </Link>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="md"
                  fullWidth={true}
                  className="min-h-[52px] !justify-start !rounded-none !px-4 !py-4 !text-base font-medium text-red-600 hover:bg-red-50 xs:!px-5"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="mr-3 h-5 w-5" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={closeMobileMenu}
                className="flex min-h-[52px] items-center px-4 py-4 font-semibold text-indigo-600 hover:bg-indigo-50 active:bg-indigo-100 xs:px-5"
              >
                Sign In
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
