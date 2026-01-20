const categories = [
  { name: 'Electronics', image: '/images/electronics.jpg' },
  { name: 'Fitness', image: '/images/fitness.jpg' },
  { name: 'Home', image: '/images/home.jpg' },
  { name: 'Accessories', image: '/images/accessories.jpg' },
];

export const FeaturedCategories: React.FC = () => (
  <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
    {categories.map((cat) => (
      <div key={cat.name} className="flex flex-col items-center rounded-lg bg-white p-4 shadow">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={cat.image} alt={cat.name} className="mb-2 h-20 w-20 rounded-full object-cover" />
        <span className="text-lg font-semibold">{cat.name}</span>
      </div>
    ))}
  </div>
);
