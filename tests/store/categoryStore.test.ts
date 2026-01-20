import { act, renderHook } from '@testing-library/react';
import { useCategoryStore, Category } from '../../store/categoryStore';

// Mock zustand persist middleware
jest.mock('zustand/middleware', () => ({
  persist: (config: any) => config,
}));

describe('categoryStore', () => {
  const mockCategories: Category[] = [
    {
      id: '1',
      name: 'Electronics',
      slug: 'electronics',
      isActive: true,
      productCount: 100,
    },
    {
      id: '2',
      name: 'Clothing',
      slug: 'clothing',
      isActive: true,
      productCount: 50,
    },
    {
      id: '3',
      name: 'Books',
      slug: 'books',
      isActive: false,
      productCount: 25,
    },
  ];

  beforeEach(() => {
    // Reset store state before each test
    const { result } = renderHook(() => useCategoryStore());
    act(() => {
      result.current.clearCategories();
    });
  });

  describe('Initial State', () => {
    it('should have empty categories initially', () => {
      const { result } = renderHook(() => useCategoryStore());
      expect(result.current.categories).toEqual([]);
    });

    it('should have isLoaded as false initially', () => {
      const { result } = renderHook(() => useCategoryStore());
      expect(result.current.isLoaded).toBe(false);
    });

    it('should have lastFetchedAt as null initially', () => {
      const { result } = renderHook(() => useCategoryStore());
      expect(result.current.lastFetchedAt).toBe(null);
    });
  });

  describe('setCategories', () => {
    it('should set categories', () => {
      const { result } = renderHook(() => useCategoryStore());

      act(() => {
        result.current.setCategories(mockCategories);
      });

      expect(result.current.categories).toEqual(mockCategories);
    });

    it('should set isLoaded to true', () => {
      const { result } = renderHook(() => useCategoryStore());

      act(() => {
        result.current.setCategories(mockCategories);
      });

      expect(result.current.isLoaded).toBe(true);
    });

    it('should set lastFetchedAt timestamp', () => {
      const { result } = renderHook(() => useCategoryStore());
      const beforeTime = Date.now();

      act(() => {
        result.current.setCategories(mockCategories);
      });

      const afterTime = Date.now();
      expect(result.current.lastFetchedAt).toBeGreaterThanOrEqual(beforeTime);
      expect(result.current.lastFetchedAt).toBeLessThanOrEqual(afterTime);
    });
  });

  describe('getCategories', () => {
    it('should return all categories', () => {
      const { result } = renderHook(() => useCategoryStore());

      act(() => {
        result.current.setCategories(mockCategories);
      });

      expect(result.current.getCategories()).toEqual(mockCategories);
    });

    it('should return empty array when no categories', () => {
      const { result } = renderHook(() => useCategoryStore());
      expect(result.current.getCategories()).toEqual([]);
    });
  });

  describe('getCategoryBySlug', () => {
    it('should return category by slug', () => {
      const { result } = renderHook(() => useCategoryStore());

      act(() => {
        result.current.setCategories(mockCategories);
      });

      const category = result.current.getCategoryBySlug('electronics');
      expect(category).toEqual(mockCategories[0]);
    });

    it('should return undefined for non-existent slug', () => {
      const { result } = renderHook(() => useCategoryStore());

      act(() => {
        result.current.setCategories(mockCategories);
      });

      const category = result.current.getCategoryBySlug('non-existent');
      expect(category).toBeUndefined();
    });
  });

  describe('getCategoryById', () => {
    it('should return category by id', () => {
      const { result } = renderHook(() => useCategoryStore());

      act(() => {
        result.current.setCategories(mockCategories);
      });

      const category = result.current.getCategoryById('1');
      expect(category).toEqual(mockCategories[0]);
    });

    it('should return undefined for non-existent id', () => {
      const { result } = renderHook(() => useCategoryStore());

      act(() => {
        result.current.setCategories(mockCategories);
      });

      const category = result.current.getCategoryById('999');
      expect(category).toBeUndefined();
    });
  });

  describe('clearCategories', () => {
    it('should clear all categories', () => {
      const { result } = renderHook(() => useCategoryStore());

      act(() => {
        result.current.setCategories(mockCategories);
      });

      expect(result.current.categories.length).toBe(3);

      act(() => {
        result.current.clearCategories();
      });

      expect(result.current.categories).toEqual([]);
    });

    it('should reset isLoaded to false', () => {
      const { result } = renderHook(() => useCategoryStore());

      act(() => {
        result.current.setCategories(mockCategories);
        result.current.clearCategories();
      });

      expect(result.current.isLoaded).toBe(false);
    });

    it('should reset lastFetchedAt to null', () => {
      const { result } = renderHook(() => useCategoryStore());

      act(() => {
        result.current.setCategories(mockCategories);
        result.current.clearCategories();
      });

      expect(result.current.lastFetchedAt).toBe(null);
    });
  });

  describe('shouldRefetch', () => {
    it('should return true when categories are empty', () => {
      const { result } = renderHook(() => useCategoryStore());
      expect(result.current.shouldRefetch()).toBe(true);
    });

    it('should return true when lastFetchedAt is null', () => {
      const { result } = renderHook(() => useCategoryStore());
      expect(result.current.shouldRefetch()).toBe(true);
    });

    it('should return false when cache is still valid', () => {
      const { result } = renderHook(() => useCategoryStore());

      act(() => {
        result.current.setCategories(mockCategories);
      });

      // Cache should be valid immediately after setting
      expect(result.current.shouldRefetch()).toBe(false);
    });

    it('should return true when cache has expired', () => {
      const { result } = renderHook(() => useCategoryStore());

      act(() => {
        result.current.setCategories(mockCategories);
      });

      // Mock expired cache (more than 5 minutes ago)
      const expiredTime = Date.now() - 6 * 60 * 1000;
      act(() => {
        // Manually set expired timestamp for testing
        useCategoryStore.setState({ lastFetchedAt: expiredTime });
      });

      expect(result.current.shouldRefetch()).toBe(true);
    });
  });
});
