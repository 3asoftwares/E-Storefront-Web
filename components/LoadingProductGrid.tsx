interface ProductSkeletonGridProps {
  count?: number;
  variant?: 'default' | 'compact';
}

export const ProductSkeletonGrid: React.FC<ProductSkeletonGridProps> = ({
  count = 8,
  variant = 'default',
}) => {
  const gridClasses =
    variant === 'compact'
      ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6';

  const heightClasses = variant === 'compact' ? 'h-32' : 'h-48';

  return (
    <div className={`grid ${gridClasses}`}>
      {[...Array(count)].map((_, i) => (
        <div key={i} className="overflow-hidden rounded-lg bg-white shadow-md">
          <div
            className={`${heightClasses} animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200`}
          ></div>

          <div className="space-y-3 p-4">
            <div className="h-4 animate-pulse rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"></div>

            <div className="h-3 w-20 animate-pulse rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"></div>

            {variant === 'default' && (
              <>
                <div className="mt-2 h-5 w-24 animate-pulse rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"></div>

                <div className="mt-3 h-10 animate-pulse rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"></div>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export const LoadingProductGrid = ProductSkeletonGrid;
