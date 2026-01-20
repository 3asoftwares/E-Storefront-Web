export const FeaturedProducts: React.FC<{ products: any[] }> = ({ products }) => (
  <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
    {products.map((product) => (
      <div
        key={product._id.$oid}
        className="flex flex-col items-center rounded-lg bg-white p-4 shadow"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.images[0]}
          alt={product.name}
          className="mb-2 h-24 w-24 rounded object-cover"
        />
        <span className="text-lg font-semibold">{product.name}</span>
        <span className="mt-1 font-bold text-primary-600">${product.price}</span>
      </div>
    ))}
  </div>
);
