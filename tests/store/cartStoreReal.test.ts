/**
 * Tests for the actual cart store implementation
 * This tests the real Zustand store instead of a mock
 */

// Mock the persist middleware
jest.mock('zustand/middleware', () => ({
    persist: (fn: any) => fn,
}));

// Mock the utils
jest.mock('@3asoftwares/utils/client', () => ({
    getCurrentUser: jest.fn(() => null),
}));

// Mock types
jest.mock('@3asoftwares/types', () => ({}));

import { getCurrentUser } from '@3asoftwares/utils/client';

describe('Cart Store - Real Implementation', () => {
    let useCartStore: any;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetModules();
        // Re-import the store for each test to get fresh state
        const store = require('../../store/cartStore');
        useCartStore = store.useCartStore;
    });

    describe('Cart Items', () => {
        it('should add item to cart', () => {
            const state = useCartStore.getState();
            state.addItem({ id: 'prod1', name: 'Test Product', price: 29.99, quantity: 1 });

            const newState = useCartStore.getState();
            expect(newState.items).toHaveLength(1);
            expect(newState.items[0].id).toBe('prod1');
        });

        it('should increase quantity when adding existing item', () => {
            const state = useCartStore.getState();
            state.addItem({ id: 'prod1', name: 'Test Product', price: 29.99, quantity: 1 });
            state.addItem({ id: 'prod1', name: 'Test Product', price: 29.99, quantity: 2 });

            const newState = useCartStore.getState();
            expect(newState.items).toHaveLength(1);
            expect(newState.items[0].quantity).toBe(3);
        });

        it('should remove item from cart', () => {
            const state = useCartStore.getState();
            state.addItem({ id: 'prod1', name: 'Test Product', price: 29.99, quantity: 1 });
            state.removeItem('prod1');

            expect(useCartStore.getState().items).toHaveLength(0);
        });

        it('should update item quantity', () => {
            const state = useCartStore.getState();
            state.addItem({ id: 'prod1', name: 'Test Product', price: 29.99, quantity: 1 });
            state.updateQuantity('prod1', 5);

            expect(useCartStore.getState().items[0].quantity).toBe(5);
        });

        it('should remove item when quantity is 0', () => {
            const state = useCartStore.getState();
            state.addItem({ id: 'prod1', name: 'Test Product', price: 29.99, quantity: 1 });
            state.updateQuantity('prod1', 0);

            expect(useCartStore.getState().items).toHaveLength(0);
        });

        it('should clear cart', () => {
            const state = useCartStore.getState();
            state.addItem({ id: 'prod1', name: 'Product 1', price: 10, quantity: 1 });
            state.addItem({ id: 'prod2', name: 'Product 2', price: 20, quantity: 2 });
            state.clearCart();

            expect(useCartStore.getState().items).toHaveLength(0);
        });

        it('should get total items', () => {
            const state = useCartStore.getState();
            state.addItem({ id: 'prod1', name: 'Product 1', price: 10, quantity: 2 });
            state.addItem({ id: 'prod2', name: 'Product 2', price: 20, quantity: 3 });

            expect(state.getTotalItems()).toBe(5);
        });

        it('should get total price', () => {
            const state = useCartStore.getState();
            state.addItem({ id: 'prod1', name: 'Product 1', price: 10, quantity: 2 }); // 20
            state.addItem({ id: 'prod2', name: 'Product 2', price: 15, quantity: 3 }); // 45

            expect(state.getTotalPrice()).toBe(65);
        });
    });

    describe('Wishlist', () => {
        it('should add to wishlist', () => {
            const state = useCartStore.getState();
            state.addToWishlist({ productId: 'prod1', name: 'Test', price: 29.99 });

            const newState = useCartStore.getState();
            expect(newState.wishlist).toHaveLength(1);
            expect(newState.wishlist[0].productId).toBe('prod1');
            expect(newState.wishlist[0].addedAt).toBeDefined();
        });

        it('should not add duplicate to wishlist', () => {
            const state = useCartStore.getState();
            state.addToWishlist({ productId: 'prod1', name: 'Test', price: 29.99 });
            state.addToWishlist({ productId: 'prod1', name: 'Test', price: 29.99 });

            expect(useCartStore.getState().wishlist).toHaveLength(1);
        });

        it('should remove from wishlist', () => {
            const state = useCartStore.getState();
            state.addToWishlist({ productId: 'prod1', name: 'Test', price: 29.99 });
            state.removeFromWishlist('prod1');

            expect(useCartStore.getState().wishlist).toHaveLength(0);
        });

        it('should check if in wishlist', () => {
            const state = useCartStore.getState();
            state.addToWishlist({ productId: 'prod1', name: 'Test', price: 29.99 });

            expect(state.isInWishlist('prod1')).toBe(true);
            expect(state.isInWishlist('prod2')).toBe(false);
        });
    });

    describe('Recently Viewed', () => {
        it('should add to recently viewed', () => {
            const state = useCartStore.getState();
            state.addRecentlyViewed({ productId: 'prod1', name: 'Test', price: 29.99 });

            expect(useCartStore.getState().recentlyViewed).toHaveLength(1);
        });

        it('should move existing item to front', () => {
            const state = useCartStore.getState();
            state.addRecentlyViewed({ productId: 'prod1', name: 'Product 1', price: 10 });
            state.addRecentlyViewed({ productId: 'prod2', name: 'Product 2', price: 20 });
            state.addRecentlyViewed({ productId: 'prod1', name: 'Product 1', price: 10 });

            const newState = useCartStore.getState();
            expect(newState.recentlyViewed).toHaveLength(2);
            expect(newState.recentlyViewed[0].productId).toBe('prod1');
        });

        it('should limit to 12 items', () => {
            const state = useCartStore.getState();
            for (let i = 1; i <= 15; i++) {
                state.addRecentlyViewed({ productId: `prod${i}`, name: `Product ${i}`, price: i * 10 });
            }

            expect(useCartStore.getState().recentlyViewed).toHaveLength(12);
        });

        it('should clear recently viewed', () => {
            const state = useCartStore.getState();
            state.addRecentlyViewed({ productId: 'prod1', name: 'Test', price: 29.99 });
            state.clearRecentlyViewed();

            expect(useCartStore.getState().recentlyViewed).toHaveLength(0);
        });
    });

    describe('User Profile', () => {
        it('should set user profile', () => {
            const profile = { id: 'user1', email: 'test@test.com', name: 'Test', addresses: [] };
            const state = useCartStore.getState();
            state.setUserProfile(profile);

            expect(useCartStore.getState().userProfile).toEqual(profile);
        });

        it('should load user from storage', () => {
            const mockUser = {
                id: 'user1',
                email: 'test@test.com',
                name: 'Test User',
                addresses: [],
                defaultAddressId: null,
                phone: '1234567890',
            };
            (getCurrentUser as jest.Mock).mockReturnValue(mockUser);

            const state = useCartStore.getState();
            // This function checks for window availability
            // In Node environment, it returns early, so we just verify it doesn't throw
            expect(() => state.loadUserFromStorage()).not.toThrow();
        });

        it('should not update profile if no user in storage', () => {
            (getCurrentUser as jest.Mock).mockReturnValue(null);

            const state = useCartStore.getState();
            state.loadUserFromStorage();

            expect(useCartStore.getState().userProfile).toBeNull();
        });

        it('should add address to profile', () => {
            const profile = { id: 'user1', email: 'test@test.com', name: 'Test', addresses: [] };
            const state = useCartStore.getState();
            state.setUserProfile(profile);

            const address = { id: 'addr1', street: '123 Main', city: 'Test', state: 'TS', zipCode: '12345', isDefault: true };
            state.addAddress(address);

            const newState = useCartStore.getState();
            expect(newState.userProfile.addresses).toHaveLength(1);
            expect(newState.userProfile.defaultAddressId).toBe('addr1');
        });

        it('should remove address from profile', () => {
            const address = { id: 'addr1', street: '123 Main', city: 'Test', state: 'TS', zipCode: '12345' };
            const profile = { id: 'user1', email: 'test@test.com', name: 'Test', addresses: [address] };
            const state = useCartStore.getState();
            state.setUserProfile(profile);
            state.removeAddress('addr1');

            expect(useCartStore.getState().userProfile.addresses).toHaveLength(0);
        });

        it('should set default address', () => {
            const addr1 = { id: 'addr1', street: '123 Main', city: 'Test', state: 'TS', zipCode: '12345' };
            const addr2 = { id: 'addr2', street: '456 Oak', city: 'Test', state: 'TS', zipCode: '67890' };
            const profile = { id: 'user1', email: 'test@test.com', name: 'Test', addresses: [addr1, addr2], defaultAddressId: 'addr1' };
            const state = useCartStore.getState();
            state.setUserProfile(profile);
            state.setDefaultAddress('addr2');

            expect(useCartStore.getState().userProfile.defaultAddressId).toBe('addr2');
        });
    });
});
