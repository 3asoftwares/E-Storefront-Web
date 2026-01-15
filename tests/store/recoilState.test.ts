import { snapshot_UNSTABLE, RecoilRoot } from 'recoil';
import {
  searchQueryState,
  selectedCategoryState,
  priceRangeState,
  sortByState,
  productsDataState,
  filteredProductsState,
  categoriesState,
} from '../../store/recoilState';

describe('Recoil State', () => {
  describe('Atoms', () => {
    it('searchQueryState should have default empty string', () => {
      const snapshot = snapshot_UNSTABLE();
      expect(snapshot.getLoadable(searchQueryState).valueOrThrow()).toBe('');
    });

    it('selectedCategoryState should have default "all"', () => {
      const snapshot = snapshot_UNSTABLE();
      expect(snapshot.getLoadable(selectedCategoryState).valueOrThrow()).toBe('all');
    });

    it('priceRangeState should have default range', () => {
      const snapshot = snapshot_UNSTABLE();
      expect(snapshot.getLoadable(priceRangeState).valueOrThrow()).toEqual({ min: 0, max: 10000 });
    });

    it('sortByState should have default "newest"', () => {
      const snapshot = snapshot_UNSTABLE();
      expect(snapshot.getLoadable(sortByState).valueOrThrow()).toBe('newest');
    });

    it('productsDataState should have default empty array', () => {
      const snapshot = snapshot_UNSTABLE();
      expect(snapshot.getLoadable(productsDataState).valueOrThrow()).toEqual([]);
    });
  });

  describe('filteredProductsState selector', () => {
    const mockProducts = [
      {
        id: 1,
        name: 'Apple',
        description: 'Fresh fruit',
        category: 'fruits',
        price: 100,
        createdAt: '2024-01-01',
      },
      {
        id: 2,
        name: 'Banana',
        description: 'Yellow fruit',
        category: 'fruits',
        price: 50,
        createdAt: '2024-01-02',
      },
      {
        id: 3,
        name: 'Carrot',
        description: 'Orange vegetable',
        category: 'vegetables',
        price: 30,
        createdAt: '2024-01-03',
      },
      {
        id: 4,
        name: 'Milk',
        description: 'Dairy product',
        category: 'dairy',
        price: 80,
        createdAt: '2024-01-04',
      },
    ];

    it('should return all products when no filters applied', () => {
      const snapshot = snapshot_UNSTABLE(({ set }) => {
        set(productsDataState, mockProducts);
      });
      const filtered = snapshot.getLoadable(filteredProductsState).valueOrThrow();
      expect(filtered.length).toBe(4);
    });

    it('should filter by search query in name', () => {
      const snapshot = snapshot_UNSTABLE(({ set }) => {
        set(productsDataState, mockProducts);
        set(searchQueryState, 'apple');
      });
      const filtered = snapshot.getLoadable(filteredProductsState).valueOrThrow();
      expect(filtered.length).toBe(1);
      expect(filtered[0].name).toBe('Apple');
    });

    it('should filter by search query in description', () => {
      const snapshot = snapshot_UNSTABLE(({ set }) => {
        set(productsDataState, mockProducts);
        set(searchQueryState, 'vegetable');
      });
      const filtered = snapshot.getLoadable(filteredProductsState).valueOrThrow();
      expect(filtered.length).toBe(1);
      expect(filtered[0].name).toBe('Carrot');
    });

    it('should filter by category', () => {
      const snapshot = snapshot_UNSTABLE(({ set }) => {
        set(productsDataState, mockProducts);
        set(selectedCategoryState, 'fruits');
      });
      const filtered = snapshot.getLoadable(filteredProductsState).valueOrThrow();
      expect(filtered.length).toBe(2);
    });

    it('should filter by price range', () => {
      const snapshot = snapshot_UNSTABLE(({ set }) => {
        set(productsDataState, mockProducts);
        set(priceRangeState, { min: 50, max: 100 });
      });
      const filtered = snapshot.getLoadable(filteredProductsState).valueOrThrow();
      expect(filtered.length).toBe(3);
    });

    it('should sort by price ascending', () => {
      const snapshot = snapshot_UNSTABLE(({ set }) => {
        set(productsDataState, mockProducts);
        set(sortByState, 'price_asc');
      });
      const filtered = snapshot.getLoadable(filteredProductsState).valueOrThrow();
      expect(filtered[0].price).toBe(30);
      expect(filtered[3].price).toBe(100);
    });

    it('should sort by price descending', () => {
      const snapshot = snapshot_UNSTABLE(({ set }) => {
        set(productsDataState, mockProducts);
        set(sortByState, 'price_desc');
      });
      const filtered = snapshot.getLoadable(filteredProductsState).valueOrThrow();
      expect(filtered[0].price).toBe(100);
      expect(filtered[3].price).toBe(30);
    });

    it('should sort by name', () => {
      const snapshot = snapshot_UNSTABLE(({ set }) => {
        set(productsDataState, mockProducts);
        set(sortByState, 'name');
      });
      const filtered = snapshot.getLoadable(filteredProductsState).valueOrThrow();
      expect(filtered[0].name).toBe('Apple');
      expect(filtered[3].name).toBe('Milk');
    });

    it('should sort by newest', () => {
      const snapshot = snapshot_UNSTABLE(({ set }) => {
        set(productsDataState, mockProducts);
        set(sortByState, 'newest');
      });
      const filtered = snapshot.getLoadable(filteredProductsState).valueOrThrow();
      expect(filtered[0].name).toBe('Milk');
      expect(filtered[3].name).toBe('Apple');
    });
  });

  describe('categoriesState selector', () => {
    it('should return ["all"] when no products', () => {
      const snapshot = snapshot_UNSTABLE();
      const categories = snapshot.getLoadable(categoriesState).valueOrThrow();
      expect(categories).toEqual(['all']);
    });

    it('should return unique categories with "all" first', () => {
      const mockProducts = [
        { id: 1, category: 'fruits' },
        { id: 2, category: 'vegetables' },
        { id: 3, category: 'fruits' },
        { id: 4, category: 'dairy' },
      ];
      const snapshot = snapshot_UNSTABLE(({ set }) => {
        set(productsDataState, mockProducts);
      });
      const categories = snapshot.getLoadable(categoriesState).valueOrThrow();
      expect(categories[0]).toBe('all');
      expect(categories).toContain('fruits');
      expect(categories).toContain('vegetables');
      expect(categories).toContain('dairy');
      expect(categories.length).toBe(4);
    });

    it('should filter out falsy categories', () => {
      const mockProducts = [
        { id: 1, category: 'fruits' },
        { id: 2, category: null },
        { id: 3, category: undefined },
        { id: 4, category: '' },
      ];
      const snapshot = snapshot_UNSTABLE(({ set }) => {
        set(productsDataState, mockProducts);
      });
      const categories = snapshot.getLoadable(categoriesState).valueOrThrow();
      expect(categories).toEqual(['all', 'fruits']);
    });
  });
});
