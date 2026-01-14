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
import { storeAuth, clearAuth as clearAuthCookies, getCurrentUser } from '@3asoftwares/utils/client';

export default function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    }

    const userData = getCurrentUser();
    if (userData) {
      setUser(userData);
    }
  }, [searchParams]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  }, [searchQuery, router]);

  const handleLogout = useCallback(() => {
    clearAuthCookies();
    setUser(null);
    setIsMenuOpen(false);
    router.push('/');
  }, [router]);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-sm safe:pt-safe-top">
      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center justify-between h-12 xs:h-14 sm:h-16">
          <Link href="/" className="flex items-center gap-1 xs:gap-2 group flex-shrink-0">
            <img
              src={process.env.NEXT_PUBLIC_LOGO_URL}
              alt={'3A Softwares'}
              className="object-contain w-10 xs:w-12 sm:w-16"
            />
            <span className="hidden xs:block text-base xs:text-lg sm:text-2xl font-extrabold text-black truncate max-w-[100px] xs:max-w-[120px] sm:max-w-none">
              3A Softwares
            </span>
          </Link>

          <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 mx-4 lg:mx-8 max-w-xl">
            <div className="w-full relative">
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
                    className="text-gray-400 hover:text-indigo-600 transition-colors"
                  >
                    <FontAwesomeIcon icon={faSearch} className="w-5 h-5" />
                  </Button>
                }
              />
            </div>
          </form>

          <div className="flex items-center gap-1 xs:gap-2 sm:gap-3 md:gap-4">
            <Link
              href="/wishlist"
              className="relative p-2 xs:p-2.5 sm:p-3 text-gray-600 hover:text-pink-600 transition-all rounded-lg sm:rounded-xl hover:bg-pink-50 group min-h-[44px] min-w-[44px] flex items-center justify-center"
              title="Wishlist"
            >
              <FontAwesomeIcon
                icon={faHeart}
                className="w-5 h-5 xs:w-5 xs:h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform"
              />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 xs:top-0 xs:-right-0.5 w-4 h-4 xs:w-5 xs:h-5 bg-gradient-to-br from-pink-500 to-red-500 text-white text-[10px] xs:text-xs rounded-full flex items-center justify-center font-bold shadow-lg">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              className="relative p-2 xs:p-2.5 sm:p-3 text-gray-600 hover:text-indigo-600 transition-all rounded-lg sm:rounded-xl hover:bg-indigo-50 group min-h-[44px] min-w-[44px] flex items-center justify-center"
              title="Shopping Cart"
            >
              <FontAwesomeIcon
                icon={faShoppingCart}
                className="w-5 h-5 xs:w-5 xs:h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform"
              />
              {items.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 xs:top-0 xs:-right-0.5 w-4 h-4 xs:w-5 xs:h-5 bg-gray-700 text-white text-[10px] xs:text-xs rounded-full flex items-center justify-center font-bold shadow-lg">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex relative group gap-2">
                <Button
                  variant="outline"
                  size="md"
                  className="!w-auto hidden md:flex !border !border-gray-800 !text-gray-600"
                  fullWidth={false}
                >
                  <FontAwesomeIcon icon={faUser} className="w-4 h-4 xs:w-5 xs:h-5" />
                  <span className="text-xs xs:text-sm font-bold text-gray-600 truncate max-w-xs">
                    {user.name || user.email?.split('@')[0]}
                  </span>
                  <FontAwesomeIcon icon={faCaretDown} className="w-4 h-4 xs:w-5 xs:h-5" />
                </Button>
                <Button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  variant="ghost"
                  size="sm"
                  className="block md:hidden"
                  fullWidth={false}
                >
                  <FontAwesomeIcon icon={faUser} className="w-5 h-5 sm:w-6 sm:h-6" />
                </Button>
                <div className="absolute right-0 top-16 z-10 mt-0 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link
                    href="/profile"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors border-b border-gray-100"
                  >
                    <FontAwesomeIcon icon={faUser} className="mr-2" />
                    My Profile
                  </Link>
                  <Link
                    href="/orders"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors border-b border-gray-100"
                  >
                    <FontAwesomeIcon icon={faBox} className="mr-2" />
                    My Orders
                  </Link>
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    size="md"
                    fullWidth={true}
                    className="!px-4 text-gray-600 hover:bg-gray-50 !justify-start block px-4 py-3 !text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors border-b border-gray-100"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className="" />
                    Sign Out
                  </Button>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:inline-block px-4 xs:px-6 py-2 xs:py-2.5 border-2 border-black text-gray-800 font-bold rounded-md hover:shadow-lg transition-all text-xs xs:text-sm"
              >
                Sign In
              </Link>
            )}

            <Button
              onClick={toggleMobileMenu}
              variant="ghost"
              size="sm"
              fullWidth={false}
              className="md:hidden p-1.5 sm:p-2 text-gray-600 hover:text-indigo-600 transition-colors"
            >
              <FontAwesomeIcon
                icon={isMobileMenuOpen ? faTimes : faBars}
                className="w-5 h-5 xs:w-5 xs:h-5 sm:w-6 sm:h-6"
              />
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <form onSubmit={handleSearch} className="md:hidden pb-2 sm:pb-3 sm:pb-4">
          <div className="w-full relative">
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
                  className="text-gray-400 hover:text-indigo-600 transition-colors min-h-[44px] min-w-[44px]"
                >
                  <FontAwesomeIcon icon={faSearch} className="w-5 h-5" />
                </Button>
              }
            />
          </div>
        </form>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white shadow-lg animate-slide-down max-h-[70vh] overflow-y-auto">
          <nav className="divide-y divide-gray-100">
            <Link
              href="/"
              onClick={closeMobileMenu}
              className="flex items-center px-4 xs:px-5 py-4 text-gray-700 hover:bg-indigo-50 active:bg-indigo-100 font-medium min-h-[52px]"
            >
              Home
            </Link>
            <Link
              href="/products"
              onClick={closeMobileMenu}
              className="flex items-center px-4 xs:px-5 py-4 text-gray-700 hover:bg-indigo-50 active:bg-indigo-100 font-medium min-h-[52px]"
            >
              Products
            </Link>
            <Link
              href="/orders"
              onClick={closeMobileMenu}
              className="flex items-center px-4 xs:px-5 py-4 text-gray-700 hover:bg-indigo-50 active:bg-indigo-100 font-medium min-h-[52px]"
            >
              Orders
            </Link>
            <Link
              href="/about"
              onClick={closeMobileMenu}
              className="flex items-center px-4 xs:px-5 py-4 text-gray-700 hover:bg-indigo-50 active:bg-indigo-100 font-medium min-h-[52px]"
            >
              About
            </Link>
            <Link
              href="/contact"
              onClick={closeMobileMenu}
              className="flex items-center px-4 xs:px-5 py-4 text-gray-700 hover:bg-indigo-50 active:bg-indigo-100 font-medium min-h-[52px]"
            >
              Contact
            </Link>
            <Link
              href="/cart"
              onClick={closeMobileMenu}
              className="flex items-center px-4 xs:px-5 py-4 text-gray-700 hover:bg-indigo-50 active:bg-indigo-100 font-medium min-h-[52px]"
            >
              <FontAwesomeIcon icon={faShoppingCart} className="mr-3 w-5 h-5" />
              Cart ({items.length})
            </Link>
            {user ? (
              <>
                <Link
                  href="/profile"
                  onClick={closeMobileMenu}
                  className="flex items-center px-4 xs:px-5 py-4 text-gray-700 hover:bg-indigo-50 active:bg-indigo-100 font-medium min-h-[52px]"
                >
                  <FontAwesomeIcon icon={faUser} className="mr-3 w-5 h-5" />
                  Profile
                </Link>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="md"
                  fullWidth={true}
                  className="!px-4 xs:!px-5 !py-4 text-red-600 hover:bg-red-50 !justify-start !rounded-none !text-base font-medium min-h-[52px]"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="mr-3 w-5 h-5" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Link
                href="/login"
                  onClick={closeMobileMenu}
                className="flex items-center px-4 xs:px-5 py-4 text-indigo-600 font-semibold hover:bg-indigo-50 active:bg-indigo-100 min-h-[52px]"
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
