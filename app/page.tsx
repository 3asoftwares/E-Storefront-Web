'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useCallback, useMemo } from 'react';
import { useCartStore } from '../store/cartStore';
import { useCategories, useProducts } from '@/lib/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShoppingBag,
  faStar,
  faFire,
  faLaptop,
  faShirt,
  faUtensils,
  faBook,
  faHome,
  faLock,
  faUndoAlt,
  faHeadset,
} from '@fortawesome/free-solid-svg-icons';
import { Button } from '@3asoftwares/ui';
import { ProductCard, ProductCardCompact, LoadingProductGrid, SectionHeader } from '@/components';
import { useToast } from '@/lib/hooks/useToast';

// Code Splitting - Lazy load ProductSlider component
const ProductSlider = dynamic(
  () => import('@/components').then((mod) => ({ default: mod.ProductSlider })),
  {
    loading: () => <LoadingProductGrid count={4} />,
    ssr: true,
  }
);

export default function HomePage() {
  const { addItem, recentlyViewed } = useCartStore();
  const { showToast } = useToast();

  const { data: productsData, isLoading } = useProducts(1, 8, {
    featured: true,
  });
  const featuredProducts = productsData?.products || [];

  const { data: newArrivalsData, isLoading: isLoadingNew } = useProducts(1, 8, {
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const newArrivals = newArrivalsData?.products || [];

  const { data: categoriesData, isLoading: isLoadingCategories } = useCategories();
  const categories: any = Array.isArray(categoriesData)
    ? categoriesData
    : categoriesData?.data || [];

  const handleAddToCart = useCallback(
    (product: any) => {
      addItem({
        productId: product.id,
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
      });
      showToast(`${product.name} added to cart!`, 'success');
    },
    [addItem, showToast]
  );

  return (
    <>
      <main>
        {/* Hero Section */}
        <section className="relative flex min-h-[60vh] items-center overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black py-12 text-white xs:min-h-[70vh] xs:py-16 sm:min-h-[calc(100vh_-_82px)] sm:py-20 md:py-28">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
          <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-white/10 blur-3xl xs:h-64 xs:w-64 sm:h-96 sm:w-96"></div>
          <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-white/10 blur-3xl xs:h-64 xs:w-64 sm:h-96 sm:w-96"></div>

          <div className="relative mx-auto w-full max-w-7xl px-4 xs:px-5 sm:px-6 lg:px-8">
            <div className="grid items-center gap-6 xs:gap-8 md:grid-cols-2 md:gap-12">
              <div className="text-center md:text-left">
                <div className="mb-4 inline-block rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold backdrop-blur-sm xs:mb-6 xs:px-4 xs:py-2 xs:text-sm">
                  <FontAwesomeIcon icon={faStar} className="mr-1.5 text-yellow-300 xs:mr-2" />
                  New Year Sale - Up to 50% Off
                </div>
                <h1 className="mb-4 text-3xl font-extrabold leading-tight xs:mb-6 xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
                  Welcome to
                  <span className="block bg-gradient-to-r from-gray-100 to-white bg-clip-text text-transparent">
                    3A Softwares
                  </span>
                </h1>
                <p className="mx-auto mb-6 max-w-xl text-base leading-relaxed text-gray-300 xs:mb-8 xs:text-lg sm:text-xl md:mx-0">
                  Discover amazing products at unbeatable prices. Fast shipping, secure checkout,
                  and 30-day hassle-free returns.
                </p>
                <div className="flex flex-col justify-center gap-3 xs:flex-row xs:gap-4 md:justify-start">
                  <Link
                    href="/products"
                    className="flex min-h-[48px] transform items-center justify-center rounded-xl bg-white px-6 py-3 text-center text-sm font-bold text-black transition-all hover:shadow-2xl hover:shadow-white/20 active:scale-95 xs:px-8 xs:py-4 xs:text-base"
                  >
                    Shop Now →
                  </Link>
                  <Link
                    href="/products?featured=true"
                    className="flex min-h-[48px] items-center justify-center rounded-xl border-2 border-white/80 px-6 py-3 text-center text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-white/10 xs:px-8 xs:py-4 xs:text-base"
                  >
                    View Featured
                  </Link>
                </div>
              </div>
              <div className="hidden items-center justify-center md:flex">
                <div className="relative">
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-gray-400 to-gray-600 opacity-30 blur-2xl"></div>
                  <div className="relative transform text-white transition-transform hover:scale-110">
                    <FontAwesomeIcon icon={faShoppingBag} className="h-24 w-24 lg:h-32 lg:w-32" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200/50 py-8 xs:py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 xs:px-5 sm:px-6 lg:px-8">
            <SectionHeader
              badge={{
                icon: <FontAwesomeIcon icon={faFire} className="mr-2" />,
                text: 'Trending Now',
                bgColor: 'bg-gray-100',
                textColor: 'text-gray-700',
              }}
              title="Featured Products"
              description="Handpicked items curated just for you. Premium quality at the best prices."
              titleGradient="from-gray-900 to-gray-700"
            />

            {isLoading ? (
              <LoadingProductGrid count={8} />
            ) : featuredProducts.length === 0 ? (
              <div className="py-8 text-center text-gray-500 xs:py-12">
                <p>No products available at the moment.</p>
              </div>
            ) : (
              <div>
                <ProductSlider itemsPerView={4} autoplay={true} autoplayDelay={5000}>
                  {featuredProducts.map((product: any) => (
                    <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
                  ))}
                </ProductSlider>

                <div className="mt-8 text-center xs:mt-10 sm:mt-12">
                  <Link
                    href="/products"
                    className="inline-block min-h-[48px] transform rounded-xl bg-gradient-to-r from-gray-900 to-black px-6 py-3 text-sm font-bold text-white transition-all hover:shadow-2xl hover:shadow-gray-500/50 active:scale-95 xs:px-8 xs:py-4 xs:text-base sm:px-10"
                  >
                    Explore All Products →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="bg-white py-10 xs:py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 xs:px-5 sm:px-6 lg:px-8">
            <SectionHeader
              badge={{
                icon: <FontAwesomeIcon icon={faStar} className="mr-2" />,
                text: 'Just Launched',
                bgColor: 'bg-gray-100',
                textColor: 'text-gray-700',
              }}
              title="New Arrivals"
              description="Check out our latest products fresh from the collection"
              titleGradient="from-gray-900 to-gray-700"
            />

            {isLoadingNew ? (
              <LoadingProductGrid count={6} variant="compact" />
            ) : newArrivals.length === 0 ? (
              <div className="py-8 text-center text-gray-500 xs:py-12">
                <p>No new arrivals at the moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 xs:grid-cols-2 xs:gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
                {newArrivals.slice(0, 6).map((product: any) => (
                  <ProductCardCompact key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>

        {recentlyViewed.length > 0 && (
          <section className="bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200/50 py-10 xs:py-14 sm:py-20">
            <div className="mx-auto max-w-7xl px-4 xs:px-5 sm:px-6 lg:px-8">
              <div className="mb-6 text-center xs:mb-8 sm:mb-12">
                <h2 className="mb-2 text-2xl font-bold text-gray-900 xs:mb-3 xs:text-3xl sm:text-4xl">
                  Recently Viewed
                </h2>
                <p className="text-sm text-gray-600 xs:text-base sm:text-lg">
                  Continue where you left off
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 xs:grid-cols-2 xs:gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
                {recentlyViewed.slice(0, 6).map((item) => (
                  <ProductCardCompact
                    key={item.productId}
                    product={{
                      id: item.productId,
                      name: item.name,
                      price: item.price,
                      imageUrl: item.image,
                    }}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="border-t border-gray-200 bg-white py-10 xs:py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 xs:px-5 sm:px-6 lg:px-8">
            <div className="mb-6 text-center xs:mb-8 sm:mb-12">
              <h2 className="mb-2 text-2xl font-bold text-gray-900 xs:mb-3 xs:text-3xl sm:text-4xl">
                Shop by Category
              </h2>
              <p className="text-sm text-gray-600 xs:text-base sm:text-lg">
                Find exactly what you&apos;re looking for
              </p>
            </div>

            {isLoadingCategories ? (
              <div className="grid grid-cols-2 gap-3 xs:gap-4 sm:gap-6 md:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-28 animate-pulse rounded-lg bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 xs:h-32 sm:h-40"
                  />
                ))}
              </div>
            ) : categories.length === 0 ? (
              <div className="py-8 text-center text-gray-500 xs:py-12">No categories available</div>
            ) : (
              <div className="grid grid-cols-2 gap-3 xs:gap-4 sm:gap-6 md:grid-cols-4">
                {categories.slice(0, 4).map((category: any, index: number) => {
                  const categoryConfig: Record<number, { icon: any; color: string }> = {
                    0: { icon: faLaptop, color: 'from-orange-100 to-orange-50' },
                    1: { icon: faShirt, color: 'from-pink-100 to-pink-50' },
                    2: { icon: faUtensils, color: 'from-yellow-100 to-yellow-50' },
                    3: { icon: faBook, color: 'from-purple-100 to-purple-50' },
                    4: { icon: faHome, color: 'from-green-100 to-green-50' },
                  };

                  const config = categoryConfig[index];

                  return (
                    <Link
                      key={category.id || category.slug}
                      href={`/products?category=${encodeURIComponent(
                        category.slug || category.name
                      )}`}
                      className={`bg-gradient-to-br ${config.color} group flex min-h-[100px] transform flex-col items-center justify-center rounded-lg p-4 text-center transition-all hover:shadow-xl active:scale-95 xs:min-h-[120px] xs:rounded-xl xs:p-6 sm:min-h-[140px] sm:p-8 pointer:hover:scale-105`}
                    >
                      <div className="mb-2 text-3xl transition-transform group-hover:scale-110 xs:mb-3 xs:text-4xl sm:mb-4 sm:text-5xl md:text-6xl">
                        <FontAwesomeIcon icon={config.icon} className="text-gray-700" />
                      </div>
                      <h3 className="line-clamp-2 text-xs font-semibold text-gray-900 xs:text-sm sm:text-base md:text-lg">
                        {category.name}
                      </h3>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <section className="bg-gradient-to-r from-gray-900 to-black py-10 text-white xs:py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 text-center xs:px-5 sm:px-6 lg:px-8">
            <h2 className="mb-2 text-xl font-bold xs:mb-3 xs:text-2xl sm:mb-4 sm:text-3xl">
              Join Our Community
            </h2>
            <p className="mx-auto mb-5 max-w-2xl text-sm text-gray-300 xs:mb-6 xs:text-base sm:mb-8">
              Get exclusive deals, early access to new products, and special offers delivered to
              your inbox.
            </p>
            <Button variant="secondary" size="lg" fullWidth={false} className="min-h-[48px]">
              Subscribe Now
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-gray-50 py-10 xs:py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 xs:px-5 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-4 xs:gap-6 sm:gap-8 md:grid-cols-4">
              <div className="p-3 text-center xs:p-4">
                <div className="mb-2 text-2xl text-gray-700 xs:mb-3 xs:text-3xl sm:text-4xl">
                  <FontAwesomeIcon icon={faShoppingBag} />
                </div>
                <h3 className="mb-0.5 text-sm font-semibold text-gray-900 xs:mb-1 xs:text-base">
                  Free Shipping
                </h3>
                <p className="text-xs text-gray-600 xs:text-sm">On orders over ₹500</p>
              </div>
              <div className="p-3 text-center xs:p-4">
                <div className="mb-2 text-2xl text-gray-700 xs:mb-3 xs:text-3xl sm:text-4xl">
                  <FontAwesomeIcon icon={faLock} />
                </div>
                <h3 className="mb-0.5 text-sm font-semibold text-gray-900 xs:mb-1 xs:text-base">
                  Secure Payment
                </h3>
                <p className="text-xs text-gray-600 xs:text-sm">100% secure transactions</p>
              </div>
              <div className="p-3 text-center xs:p-4">
                <div className="mb-2 text-2xl text-gray-700 xs:mb-3 xs:text-3xl sm:text-4xl">
                  <FontAwesomeIcon icon={faUndoAlt} />
                </div>
                <h3 className="mb-0.5 text-sm font-semibold text-gray-900 xs:mb-1 xs:text-base">
                  Easy Returns
                </h3>
                <p className="text-xs text-gray-600 xs:text-sm">30-day return policy</p>
              </div>
              <div className="p-3 text-center xs:p-4">
                <div className="mb-2 text-2xl text-gray-700 xs:mb-3 xs:text-3xl sm:text-4xl">
                  <FontAwesomeIcon icon={faHeadset} />
                </div>
                <h3 className="mb-0.5 text-sm font-semibold text-gray-900 xs:mb-1 xs:text-base">
                  24/7 Support
                </h3>
                <p className="text-xs text-gray-600 xs:text-sm">Dedicated customer service</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
