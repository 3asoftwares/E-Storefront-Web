'use client';

interface ProductCardSkeletonProps {
  count?: number;
}

function SingleSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl bg-white shadow-lg">
      {/* Image skeleton */}
      <div className="h-56 bg-gray-200" />

      {/* Content skeleton */}
      <div className="p-5">
        {/* Category badge */}
        <div className="mb-3 h-5 w-20 rounded-full bg-gray-200" />

        {/* Title */}
        <div className="mb-2 h-6 w-3/4 rounded bg-gray-200" />

        {/* Rating */}
        <div className="mb-3 flex items-center gap-2">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 w-4 rounded bg-gray-200" />
            ))}
          </div>
          <div className="h-4 w-16 rounded bg-gray-200" />
        </div>

        {/* Price */}
        <div className="mb-4 h-7 w-24 rounded bg-gray-200" />

        {/* Buttons */}
        <div className="flex gap-2">
          <div className="h-10 flex-1 rounded-lg bg-gray-200" />
          <div className="h-10 w-10 rounded-lg bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

export default function ProductCardSkeleton({ count = 6 }: ProductCardSkeletonProps) {
  return (
    <div className="mb-8 grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
      {[...Array(count)].map((_, index) => (
        <SingleSkeleton key={index} />
      ))}
    </div>
  );
}
