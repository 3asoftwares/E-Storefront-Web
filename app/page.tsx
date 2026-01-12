'use client';

import Link from 'next/link';
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
import {
  ProductCard,
  ProductCardCompact,
  ProductSlider,
  LoadingProductGrid,
  SectionHeader,
} from '@/components';
import { useToast } from '@/lib/hooks/useToast';

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
  const categories: any = Array.isArray(categoriesData) ? categoriesData : categoriesData?.data || [];

  const handleAddToCart = (product: any) => {
    addItem({
      productId: product.id,
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
    });
    showToast(`${product.name} added to cart!`, 'success');
  };

  return (
    <>
      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-12 xs:py-16 sm:py-20 md:py-28 overflow-hidden min-h-[60vh] xs:min-h-[70vh] sm:min-h-[calc(100vh_-_82px)] flex items-center">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
          <div className="absolute top-0 right-0 w-48 xs:w-64 sm:w-96 h-48 xs:h-64 sm:h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 xs:w-64 sm:w-96 h-48 xs:h-64 sm:h-96 bg-white/10 rounded-full blur-3xl"></div>

          <div className="relative max-w-7xl mx-auto px-4 xs:px-5 sm:px-6 lg:px-8 w-full">
            <div className="grid md:grid-cols-2 gap-6 xs:gap-8 md:gap-12 items-center">
              <div className="text-center md:text-left">
                <div className="inline-block px-3 xs:px-4 py-1.5 xs:py-2 bg-white/10 backdrop-blur-sm rounded-full text-xs xs:text-sm font-semibold mb-4 xs:mb-6 border border-white/20">
                  <FontAwesomeIcon icon={faStar} className="text-yellow-300 mr-1.5 xs:mr-2" />
                  New Year Sale - Up to 50% Off
                </div>
                <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 xs:mb-6 leading-tight">
                  Welcome to
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-white">
                    3A Softwares
                  </span>
                </h1>
                <p className="text-base xs:text-lg sm:text-xl text-gray-300 mb-6 xs:mb-8 leading-relaxed max-w-xl mx-auto md:mx-0">
                  Discover amazing products at unbeatable prices. Fast shipping, secure checkout,
                  and 30-day hassle-free returns.
                </p>
                <div className="flex gap-3 xs:gap-4 flex-col xs:flex-row justify-center md:justify-start">
                  <Link
                    href="/products"
                    className="px-6 xs:px-8 py-3 xs:py-4 bg-white text-black font-bold rounded-xl hover:shadow-2xl hover:shadow-white/20 transition-all transform active:scale-95 text-sm xs:text-base text-center min-h-[48px] flex items-center justify-center"
                  >
                    Shop Now →
                  </Link>
                  <Link
                    href="/products?featured=true"
                    className="px-6 xs:px-8 py-3 xs:py-4 border-2 border-white/80 text-white font-bold rounded-xl hover:bg-white/10 backdrop-blur-sm transition-all text-sm xs:text-base text-center min-h-[48px] flex items-center justify-center"
                  >
                    View Featured
                  </Link>
                </div>
              </div>
              <div className="hidden md:flex justify-center items-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-400 to-gray-600 rounded-3xl blur-2xl opacity-30"></div>
                  <div className="relative text-white transform hover:scale-110 transition-transform">
                    <FontAwesomeIcon icon={faShoppingBag} className="w-24 h-24 lg:w-32 lg:h-32" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200/50 py-12 xs:py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 xs:px-5 sm:px-6 lg:px-8">
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
              <div className="text-center py-8 xs:py-12 text-gray-500">
                <p>No products available at the moment.</p>
              </div>
            ) : (
              <>
                    <ProductSlider itemsPerView={4} autoplay={true} autoplayDelay={5000}>
                  {featuredProducts.map((product: any) => (
                    <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
                  ))}
                </ProductSlider>

                <div className="text-center mt-8 xs:mt-10 sm:mt-12">
                  <Link
                    href="/products"
                    className="inline-block px-6 xs:px-8 sm:px-10 py-3 xs:py-4 bg-gradient-to-r from-gray-900 to-black text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-gray-500/50 transition-all transform active:scale-95 text-sm xs:text-base min-h-[48px]"
                  >
                    Explore All Products →
                  </Link>
                </div>
              </>
            )}
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <div className="text-center py-12 text-gray-500">
                <p>No new arrivals at the moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {newArrivals.slice(0, 6).map((product: any) => (
                  <ProductCardCompact key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>

        {recentlyViewed.length > 0 && (
          <section className="bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200/50 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-3">Recently Viewed</h2>
                <p className="text-lg text-gray-600">Continue where you left off</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
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

        <section className="bg-white border-t border-gray-200 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-3">Shop by Category</h2>
              <p className="text-lg text-gray-600">Find exactly what you're looking for</p>
            </div>

            {isLoadingCategories ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-40 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg animate-pulse"
                  />
                ))}
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center text-gray-500 py-12">No categories available</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
                      className={`bg-gradient-to-br ${config.color} rounded-lg p-8 text-center hover:shadow-xl transition-all transform hover:scale-105 group`}
                    >
                      <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                        <FontAwesomeIcon icon={config.icon} className="text-gray-700" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <section className="bg-gradient-to-r from-gray-900 to-black text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Get exclusive deals, early access to new products, and special offers delivered to
              your inbox.
            </p>
            <Button variant="secondary" size="lg" fullWidth={false}>
              Subscribe Now
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-gray-50 py-10 xs:py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 xs:px-5 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 xs:gap-6 sm:gap-8">
              <div className="text-center p-3 xs:p-4">
                <div className="text-2xl xs:text-3xl sm:text-4xl mb-2 xs:mb-3 text-gray-700">
                  <FontAwesomeIcon icon={faShoppingBag} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-0.5 xs:mb-1 text-sm xs:text-base">Free Shipping</h3>
                <p className="text-xs xs:text-sm text-gray-600">On orders over ₹500</p>
              </div>
              <div className="text-center p-3 xs:p-4">
                <div className="text-2xl xs:text-3xl sm:text-4xl mb-2 xs:mb-3 text-gray-700">
                  <FontAwesomeIcon icon={faLock} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-0.5 xs:mb-1 text-sm xs:text-base">Secure Payment</h3>
                <p className="text-xs xs:text-sm text-gray-600">100% secure transactions</p>
              </div>
              <div className="text-center p-3 xs:p-4">
                <div className="text-2xl xs:text-3xl sm:text-4xl mb-2 xs:mb-3 text-gray-700">
                  <FontAwesomeIcon icon={faUndoAlt} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-0.5 xs:mb-1 text-sm xs:text-base">Easy Returns</h3>
                <p className="text-xs xs:text-sm text-gray-600">30-day return policy</p>
              </div>
              <div className="text-center p-3 xs:p-4">
                <div className="text-2xl xs:text-3xl sm:text-4xl mb-2 xs:mb-3 text-gray-700">
                  <FontAwesomeIcon icon={faHeadset} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-0.5 xs:mb-1 text-sm xs:text-base">24/7 Support</h3>
                <p className="text-xs xs:text-sm text-gray-600">Dedicated customer service</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
