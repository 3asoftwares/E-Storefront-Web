/**
 * Tests for the actual category store implementation
 */

// Mock the persist middleware
jest.mock('zustand/middleware', () => ({
    persist: (fn: any) => fn,
}));

describe('Category Store - Real Implementation', () => {
    let useCategoryStore: any;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetModules();
        // Re-import the store for each test to get fresh state
        const store = require('../../store/categoryStore');
        useCategoryStore = store.useCategoryStore;
    });

    const mockCategories = [
        { id: 'cat1', name: 'Electronics', slug: 'electronics', isActive: true, productCount: 50 },
        { id: 'cat2', name: 'Clothing', slug: 'clothing', isActive: true, productCount: 100 },
        { id: 'cat3', name: 'Books', slug: 'books', isActive: false, productCount: 30 },
    ];

    describe('Initial State', () => {
        it('should start with empty categories', () => {
            const state = useCategoryStore.getState();
            expect(state.categories).toEqual([]);
            expect(state.isLoaded).toBe(false);
            expect(state.lastFetchedAt).toBeNull();
        });
    });

    describe('setCategories', () => {
        it('should set categories and update state', () => {
            const state = useCategoryStore.getState();
            state.setCategories(mockCategories);

            const newState = useCategoryStore.getState();
            expect(newState.categories).toHaveLength(3);
            expect(newState.isLoaded).toBe(true);
            expect(newState.lastFetchedAt).toBeDefined();
        });

        it('should replace existing categories', () => {
            const state = useCategoryStore.getState();
            state.setCategories(mockCategories);
            state.setCategories([mockCategories[0]]);

            expect(useCategoryStore.getState().categories).toHaveLength(1);
        });
    });

    describe('getCategories', () => {
        it('should return all categories', () => {
            const state = useCategoryStore.getState();
            state.setCategories(mockCategories);

            expect(state.getCategories()).toHaveLength(3);
        });

        it('should return empty array when no categories', () => {
            const state = useCategoryStore.getState();
            expect(state.getCategories()).toEqual([]);
        });
    });

    describe('getCategoryBySlug', () => {
        it('should find category by slug', () => {
            const state = useCategoryStore.getState();
            state.setCategories(mockCategories);

            const category = state.getCategoryBySlug('electronics');
            expect(category).toBeDefined();
            expect(category?.id).toBe('cat1');
            expect(category?.name).toBe('Electronics');
        });

        it('should return undefined for non-existent slug', () => {
            const state = useCategoryStore.getState();
            state.setCategories(mockCategories);

            expect(state.getCategoryBySlug('non-existent')).toBeUndefined();
        });
    });

    describe('getCategoryById', () => {
        it('should find category by id', () => {
            const state = useCategoryStore.getState();
            state.setCategories(mockCategories);

            const category = state.getCategoryById('cat2');
            expect(category).toBeDefined();
            expect(category?.name).toBe('Clothing');
        });

        it('should return undefined for non-existent id', () => {
            const state = useCategoryStore.getState();
            state.setCategories(mockCategories);

            expect(state.getCategoryById('non-existent')).toBeUndefined();
        });
    });

    describe('clearCategories', () => {
        it('should clear all categories and reset state', () => {
            const state = useCategoryStore.getState();
            state.setCategories(mockCategories);
            state.clearCategories();

            const newState = useCategoryStore.getState();
            expect(newState.categories).toEqual([]);
            expect(newState.isLoaded).toBe(false);
            expect(newState.lastFetchedAt).toBeNull();
        });
    });

    describe('shouldRefetch', () => {
        it('should return true when categories are empty', () => {
            const state = useCategoryStore.getState();
            expect(state.shouldRefetch()).toBe(true);
        });

        it('should return true when lastFetchedAt is null', () => {
            // Manually set categories without lastFetchedAt
            useCategoryStore.setState({ categories: mockCategories, lastFetchedAt: null });
            expect(useCategoryStore.getState().shouldRefetch()).toBe(true);
        });

        it('should return false when recently fetched', () => {
            const state = useCategoryStore.getState();
            state.setCategories(mockCategories);

            expect(state.shouldRefetch()).toBe(false);
        });

        it('should return true when cache is stale', () => {
            const state = useCategoryStore.getState();
            state.setCategories(mockCategories);

            // Set lastFetchedAt to 10 minutes ago
            const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
            useCategoryStore.setState({ lastFetchedAt: tenMinutesAgo });

            expect(useCategoryStore.getState().shouldRefetch()).toBe(true);
        });

        it('should return false when cache is within duration', () => {
            const state = useCategoryStore.getState();
            state.setCategories(mockCategories);

            // Set lastFetchedAt to 2 minutes ago (within 5 minute cache)
            const twoMinutesAgo = Date.now() - 2 * 60 * 1000;
            useCategoryStore.setState({ lastFetchedAt: twoMinutesAgo });

            expect(useCategoryStore.getState().shouldRefetch()).toBe(false);
        });
    });

    describe('Category Properties', () => {
        it('should store all category properties', () => {
            const fullCategory = {
                id: 'cat1',
                name: 'Electronics',
                slug: 'electronics',
                description: 'Electronic devices and accessories',
                icon: '🔌',
                isActive: true,
                productCount: 150,
                createdAt: '2024-01-01T00:00:00Z',
                updatedAt: '2024-01-15T00:00:00Z',
            };

            const state = useCategoryStore.getState();
            state.setCategories([fullCategory]);

            const stored = state.getCategoryById('cat1');
            expect(stored?.description).toBe('Electronic devices and accessories');
            expect(stored?.icon).toBe('🔌');
            expect(stored?.createdAt).toBe('2024-01-01T00:00:00Z');
            expect(stored?.updatedAt).toBe('2024-01-15T00:00:00Z');
        });
    });
});
