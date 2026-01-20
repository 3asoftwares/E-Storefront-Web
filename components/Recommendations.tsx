export const Recommendations: React.FC<{ products: any[] }> = ({ products }) => (
  <div>
    <h2 className="mb-4 text-xl font-bold">Recommended for You</h2>
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
            className="mb-2 h-20 w-20 rounded object-cover"
          />
          <span className="text-lg font-semibold">{product.name}</span>
          <span className="mt-1 font-bold text-primary-600">${product.price}</span>
        </div>
      ))}
    </div>
  </div>
);
