'use client';

import { useState, useEffect, useRef } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useProducts } from '@/lib/hooks';
import { useCategories } from '@/lib/hooks/useCategories';
import type { ProductGraphQL } from '@3asoftwares/types';
import { useToast } from '@/lib/hooks/useToast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faRedo, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useSearchParams, useRouter } from 'next/navigation';
import { ProductCard, ProductCardSkeleton } from '@/components';
import { Button, Input, Select } from '@3asoftwares/ui';

type Product = ProductGraphQL;

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'popular', label: 'Most Popular' },
];

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [tempSearch, setTempSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [featured, setFeatured] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });
  const [tempPriceRange, setTempPriceRange] = useState({ min: 0, max: 0 });
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const searchDebounceRef = useRef<NodeJS.Timeout>();
  const priceDebounceRef = useRef<NodeJS.Timeout>();
  const { addItem, isInWishlist, addToWishlist, removeFromWishlist } = useCartStore();
  const { showToast } = useToast();

  // Fetch categories from store
  const { categories: categoryList = [] } = useCategories();

  // Build CATEGORIES options from fetched categories
  const CATEGORIES = [
    { value: 'All', label: 'All Categories' },
    ...categoryList.map((cat: { name: string }) => ({
      value: cat.name,
      label: cat.name,
    })),
  ];

  useEffect(() => {
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }
    searchDebounceRef.current = setTimeout(() => {
      setSearch(tempSearch);
    }, 500);
    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, [tempSearch]);

  useEffect(() => {
    if (priceDebounceRef.current) {
      clearTimeout(priceDebounceRef.current);
    }
    priceDebounceRef.current = setTimeout(() => {
      setPriceRange(tempPriceRange);
    }, 500);
    return () => {
      if (priceDebounceRef.current) {
        clearTimeout(priceDebounceRef.current);
      }
    };
  }, [tempPriceRange]);

  useEffect(() => {
    const searchQuery = searchParams.get('search');
    const categoryQuery = searchParams.get('category');
    const featuredQuery = searchParams.get('featured');

    if (searchQuery) {
      const decodedSearch = decodeURIComponent(searchQuery);
      setSearch(decodedSearch);
      setTempSearch(decodedSearch);
    } else {
      setSearch('');
      setTempSearch('');
    }

    if (categoryQuery) {
      // Match category by slug or name (case-insensitive)
      const decodedCategory = decodeURIComponent(categoryQuery);
      const matchedCategory = categoryList.find(
        (cat: { name: string; slug?: string }) =>
          cat.slug?.toLowerCase() === decodedCategory.toLowerCase() ||
          cat.name.toLowerCase() === decodedCategory.toLowerCase()
      );
      if (matchedCategory) {
        setCategory(matchedCategory.name);
      } else if (categoryList.length === 0) {
        // Categories not loaded yet, keep the raw value temporarily
        setCategory(decodedCategory);
      } else {
        setCategory('All');
      }
    } else {
      setCategory('All');
    }

    setFeatured(featuredQuery === 'true');
  }, [searchParams, categoryList]);

  const filters = {
    ...(search && { search }),
    ...(category !== 'All' && { category }),
    ...(priceRange.min > 0 && { minPrice: priceRange.min }),
    ...(priceRange.max > priceRange.min && { maxPrice: priceRange.max }),
    ...(sortBy && sortBy !== 'newest' && { sortBy }),
    ...(featured && { featured: true }),
  };

  const sortProducts = (items: Product[], sort: string): Product[] => {
    const sorted = [...items];
    switch (sort) {
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'rating':
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'popular':
        return sorted.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
      case 'newest':
      default:
        return sorted;
    }
  };

  const { data, isLoading, error } = useProducts(page, 12, filters);

  useEffect(() => {
    if (data?.products) {
      if (page === 1) {
        // Replace products when on first page (filter changed)
        setAllProducts(data.products);
      } else {
        // Append products for pagination
        setAllProducts((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const newProducts = data.products.filter((p: Product) => !existingIds.has(p.id));
          return [...prev, ...newProducts];
        });
      }
      setHasMore(page < (data.pagination.pages || 1));
    }
  }, [data, page]);

  useEffect(() => {
    setPage(1);
    setHasMore(true);
  }, [search, category, priceRange.min, priceRange.max, sortBy, featured]);

  const sortedProducts = sortProducts(allProducts, sortBy);

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.imageUrl || '/placeholder.png',
      productId: product.id,
      sellerId: product.sellerId,
    });
    showToast(`${product.name} added to cart!`, 'success');
  };

  const handleWishlistToggle = (product: any) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      showToast('Removed from wishlist', 'info');
    } else {
      addToWishlist({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.imageUrl || '/placeholder.png',
        addedAt: Date.now(),
      });
      showToast('Added to wishlist', 'success');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/30">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 safe:pt-safe-top">
        <div className="max-w-7xl mx-auto px-3 xs:px-5 sm:px-6 lg:px-8 py-3 xs:py-4 sm:py-5">
          <div className="flex items-center justify-between gap-2">
            <h1 className="text-xl xs:text-2xl sm:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-black to-gray-600">
              Discover Products
            </h1>
            <div className="px-2.5 xs:px-3 sm:px-4 py-1 xs:py-1.5 sm:py-2 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full text-xs xs:text-sm font-bold text-indigo-700 whitespace-nowrap">
              {data?.pagination.total || 0}<span className='hidden sm:block'> Products</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 xs:py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 xs:gap-6 lg:gap-8">
          {/* Filters - Collapsible on mobile */}
          <div className="lg:col-span-1">
            <details className="lg:hidden group">
              <summary className="flex items-center justify-between p-4 bg-white rounded-xl shadow-md cursor-pointer list-none border border-gray-200 min-h-[52px]">
                <span className="flex items-center gap-2 font-bold text-gray-900">
                  <FontAwesomeIcon icon={faFilter} className="text-gray-600" />
                  Filters
                </span>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className="text-gray-500 transition-transform group-open:rotate-180"
                />
              </summary>
              <div className="mt-3 bg-white rounded-xl shadow-md p-4 xs:p-5 border border-gray-200">
                {/* Mobile Filter Content */}
                <Input
                  type="text"
                  value={tempSearch}
                  onChange={(e: any) => setTempSearch(e.target.value)}
                  placeholder="Search products..."
                  className="w-full text-base"
                />

                <Select
                  value={category}
                  label={'Category'}
                  onChange={(val: any) => {
                    setCategory(val);
                    setPage(1);
                  }}
                  className="w-full"
                  options={CATEGORIES}
                />

                <div className="my-4">
                  <label className="block text-sm font-bold text-gray-700 mb-3">Price Range</label>
                  <div className="flex gap-2 -mb-4">
                    <Input
                      size="sm"
                      type="number"
                      min="0"
                      value={tempPriceRange.min === 0 ? '' : tempPriceRange.min}
                      onChange={(e: any) => {
                        const value = e.target.value ? parseInt(e.target.value) : 0;
                        setTempPriceRange({ ...tempPriceRange, min: value });
                      }}
                      placeholder="Min"
                      className="text-base"
                    />
                    <Input
                      size="sm"
                      type="number"
                      min={tempPriceRange.min}
                      value={tempPriceRange.max === 0 ? '' : tempPriceRange.max}
                      onChange={(e: any) => {
                        const value = e.target.value ? parseInt(e.target.value) : 0;
                        setTempPriceRange({ ...tempPriceRange, max: value });
                      }}
                      placeholder="Max"
                      className="text-base"
                    />
                  </div>
                </div>

                <Select
                  value={sortBy}
                  label={'Sort By'}
                  onChange={(val: any) => {
                    setSortBy(val);
                    setPage(1);
                  }}
                  className="w-full"
                  options={SORT_OPTIONS}
                />

                <Button
                  size="sm"
                  onClick={() => {
                    setSearch('');
                    setTempSearch('');
                    setCategory('All');
                    setPriceRange({ min: 0, max: 0 });
                    setTempPriceRange({ min: 0, max: 0 });
                    setSortBy('newest');
                    setFeatured(false);
                    setPage(1);
                    router.push('/products');
                  }}
                  className="w-full mt-4 min-h-[44px]"
                >
                  <FontAwesomeIcon icon={faRedo} className="mr-2" />
                  Reset Filters
                </Button>
              </div>
            </details>

            {/* Desktop Filters */}
            <div className="hidden lg:block bg-white rounded-2xl shadow-xl p-6 sticky top-32 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FontAwesomeIcon icon={faFilter} className="text-gray-600" />
                Filters
              </h2>

              <Input
                type="text"
                value={tempSearch}
                onChange={(e: any) => {
                  setTempSearch(e.target.value);
                }}
                placeholder="Search products..."
                className="w-full"
              />

              <Select
                value={category}
                label={'Category'}
                onChange={(val: any) => {
                  setCategory(val);
                  setPage(1);
                }}
                className="w-full"
                options={CATEGORIES}
              />

              <div className="my-4">
                <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  Price Range
                </label>
                <div className="flex gap-2 -mb-4">
                  <Input
                    size="sm"
                    type="number"
                    min="0"
                    value={tempPriceRange.min === 0 ? '' : tempPriceRange.min}
                    onChange={(e: any) => {
                      const value = e.target.value ? parseInt(e.target.value) : 0;
                      setTempPriceRange({
                        ...tempPriceRange,
                        min: value,
                      });
                    }}
                    placeholder="Min"
                  />
                  <Input
                    size="sm"
                    type="number"
                    min={tempPriceRange.min}
                    value={tempPriceRange.max === 0 ? '' : tempPriceRange.max}
                    onChange={(e: any) => {
                      const value = e.target.value ? parseInt(e.target.value) : 0;
                      setTempPriceRange({
                        ...tempPriceRange,
                        max: value,
                      });
                    }}
                    placeholder="Max"
                  />
                </div>
                <div className="text-xs text-gray-600">
                  ₹{priceRange.min} - ₹{priceRange.max}
                </div>
              </div>

              <Select
                value={sortBy}
                label={'Sort By'}
                onChange={(val: any) => {
                  setSortBy(val);
                  setPage(1);
                }}
                className="w-full"
                options={SORT_OPTIONS}
              />
              <div className="mt-4">
                <Button
                  size="sm"
                  onClick={() => {
                    setSearch('');
                    setTempSearch('');
                    setCategory('All');
                    setPriceRange({ min: 0, max: 0 });
                    setTempPriceRange({ min: 0, max: 0 });
                    setSortBy('newest');
                    setFeatured(false);
                    setPage(1);
                    router.push('/products');
                  }}
                  className="w-full min-h-[44px]"
                >
                  <FontAwesomeIcon icon={faRedo} className="mr-2" />
                  Reset Filters
                </Button>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="lg:col-span-3">
            {error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm xs:text-base">
                Error loading products. Please try again.
              </div>
            ) : isLoading && page === 1 ? (
              <ProductCardSkeleton count={6} />
            ) : allProducts.length === 0 ? (
              <div className="text-center py-8 xs:py-12">
                <p className="text-gray-500 text-base xs:text-lg">No products found.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 xs:gap-4 sm:gap-6 lg:gap-8 mb-4 sm:mb-8">
                  {sortedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                      onWishlistToggle={handleWishlistToggle}
                      isInWishlist={isInWishlist(product.id)}
                      showWishlistButton={true}
                    />
                  ))}
                </div>

                {hasMore && allProducts.length > 0 && (
                  <div className="flex justify-center mb-2 sm:mb-12">
                    <Button
                      disabled={isLoading}
                      onClick={handleLoadMore}
                      className="px-6 xs:px-8 py-3 bg-gradient-to-r from-gray-800 to-gray-600 hover:from-gray-500 hover:to-gray-300 disabled:opacity-50 text-white font-semibold min-h-[48px] text-sm xs:text-base"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                          Loading...
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faChevronDown} className="mr-2" />
                          Load More Products
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {!hasMore && allProducts.length > 0 && (
                  <div className="text-center py-8 xs:py-12">
                    <p className="text-gray-500 font-medium text-sm xs:text-base">
                      You've reached the end! ({allProducts.length} products shown)
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
