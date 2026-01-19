// Mock @3asoftwares/utils/client before importing the actual module
jest.mock('@3asoftwares/utils/client', () => ({
    // Dashboard
    DASHBOARD_STATS_QUERY: 'query DashboardStats { stats }',
    SALES_ANALYTICS_QUERY: 'query SalesAnalytics { analytics }',

    // User
    GET_USERS_QUERY: 'query GetUsers { users }',
    GET_USER_QUERY: 'query GetUser { user }',
    GET_ME_QUERY: 'query GetMe { me }',
    LOGIN_MUTATION: 'mutation Login { login }',
    REGISTER_MUTATION: 'mutation Register { register }',
    GOOGLE_AUTH_MUTATION: 'mutation GoogleAuth { googleAuth }',
    LOGOUT_MUTATION: 'mutation Logout { logout }',
    UPDATE_USER_ROLE_MUTATION: 'mutation UpdateRole { updateRole }',
    DELETE_USER_MUTATION: 'mutation DeleteUser { deleteUser }',
    SEND_VERIFICATION_EMAIL_MUTATION: 'mutation SendVerification { sendVerification }',
    VERIFY_EMAIL_MUTATION: 'mutation VerifyEmail { verifyEmail }',
    FORGOT_PASSWORD_MUTATION: 'mutation ForgotPassword { forgotPassword }',
    RESET_PASSWORD_MUTATION: 'mutation ResetPassword { resetPassword }',
    VALIDATE_RESET_TOKEN_QUERY: 'query ValidateToken { validateToken }',
    UPDATE_PROFILE_MUTATION: 'mutation UpdateProfile { updateProfile }',

    // Product
    GET_PRODUCTS_QUERY: 'query GetProducts { products }',
    GET_PRODUCT_QUERY: 'query GetProduct { product }',
    GET_PRODUCTS_BY_SELLER_QUERY: 'query GetProductsBySeller { products }',
    CREATE_PRODUCT_MUTATION: 'mutation CreateProduct { createProduct }',
    UPDATE_PRODUCT_MUTATION: 'mutation UpdateProduct { updateProduct }',
    DELETE_PRODUCT_MUTATION: 'mutation DeleteProduct { deleteProduct }',

    // Order
    GET_ORDERS_QUERY: 'query GetOrders { orders }',
    GET_ORDER_QUERY: 'query GetOrder { order }',
    GET_ORDERS_BY_CUSTOMER_QUERY: 'query GetOrdersByCustomer { orders }',
    CREATE_ORDER_MUTATION: 'mutation CreateOrder { createOrder }',
    UPDATE_ORDER_STATUS_MUTATION: 'mutation UpdateOrderStatus { updateOrderStatus }',
    UPDATE_PAYMENT_STATUS_MUTATION: 'mutation UpdatePaymentStatus { updatePaymentStatus }',
    CANCEL_ORDER_MUTATION: 'mutation CancelOrder { cancelOrder }',

    // Coupon
    GET_COUPONS_QUERY: 'query GetCoupons { coupons }',
    GET_COUPON_QUERY: 'query GetCoupon { coupon }',
    VALIDATE_COUPON_QUERY: 'query ValidateCoupon { validateCoupon }',
    CREATE_COUPON_MUTATION: 'mutation CreateCoupon { createCoupon }',
    UPDATE_COUPON_MUTATION: 'mutation UpdateCoupon { updateCoupon }',
    DELETE_COUPON_MUTATION: 'mutation DeleteCoupon { deleteCoupon }',
    TOGGLE_COUPON_STATUS_MUTATION: 'mutation ToggleCouponStatus { toggleStatus }',

    // Category
    GET_CATEGORIES_QUERY: 'query GetCategories { categories }',
    GET_CATEGORY_QUERY: 'query GetCategory { category }',
    CREATE_CATEGORY_MUTATION: 'mutation CreateCategory { createCategory }',
    UPDATE_CATEGORY_MUTATION: 'mutation UpdateCategory { updateCategory }',
    DELETE_CATEGORY_MUTATION: 'mutation DeleteCategory { deleteCategory }',

    // Review
    GET_PRODUCT_REVIEWS_QUERY: 'query GetProductReviews { reviews }',
    CREATE_REVIEW_MUTATION: 'mutation CreateReview { createReview }',
    MARK_REVIEW_HELPFUL_MUTATION: 'mutation MarkHelpful { markHelpful }',
    DELETE_REVIEW_MUTATION: 'mutation DeleteReview { deleteReview }',

    // Address
    GET_MY_ADDRESSES_QUERY: 'query GetMyAddresses { addresses }',
    ADD_ADDRESS_MUTATION: 'mutation AddAddress { addAddress }',
    UPDATE_ADDRESS_MUTATION: 'mutation UpdateAddress { updateAddress }',
    DELETE_ADDRESS_MUTATION: 'mutation DeleteAddress { deleteAddress }',
    SET_DEFAULT_ADDRESS_MUTATION: 'mutation SetDefault { setDefault }',

    // Ticket
    GET_TICKETS_QUERY: 'query GetTickets { tickets }',
    GET_MY_TICKETS_QUERY: 'query GetMyTickets { tickets }',
    GET_TICKET_QUERY: 'query GetTicket { ticket }',
    CREATE_TICKET_MUTATION: 'mutation CreateTicket { createTicket }',
    ADD_TICKET_COMMENT_MUTATION: 'mutation AddComment { addComment }',
}));

// Import the real module AFTER mocking the dependency
import { getGqlQuery, GQL_QUERIES } from '../../lib/apollo/queries/queries';

describe('Apollo Queries', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getGqlQuery', () => {
        it('should return a gql query object', () => {
            const query = getGqlQuery('GET_PRODUCTS_QUERY');
            expect(query).toBeDefined();
            expect(query.kind).toBe('Document');
        });

        it('should cache queries after first call', () => {
            const query1 = getGqlQuery('GET_USERS_QUERY');
            const query2 = getGqlQuery('GET_USERS_QUERY');
            expect(query1).toBe(query2);
        });

        it('should return different queries for different keys', () => {
            const productQuery = getGqlQuery('GET_PRODUCTS_QUERY');
            const userQuery = getGqlQuery('GET_USERS_QUERY');
            expect(productQuery).not.toBe(userQuery);
        });
    });

    describe('GQL_QUERIES object', () => {
        describe('Dashboard queries', () => {
            it('should have DASHBOARD_STATS_QUERY', () => {
                expect(GQL_QUERIES.DASHBOARD_STATS_QUERY).toBeDefined();
            });

            it('should have SALES_ANALYTICS_QUERY', () => {
                expect(GQL_QUERIES.SALES_ANALYTICS_QUERY).toBeDefined();
            });
        });

        describe('User queries and mutations', () => {
            it('should have GET_USERS_QUERY', () => {
                expect(GQL_QUERIES.GET_USERS_QUERY).toBeDefined();
            });

            it('should have GET_USER_QUERY', () => {
                expect(GQL_QUERIES.GET_USER_QUERY).toBeDefined();
            });

            it('should have GET_ME_QUERY', () => {
                expect(GQL_QUERIES.GET_ME_QUERY).toBeDefined();
            });

            it('should have LOGIN_MUTATION', () => {
                expect(GQL_QUERIES.LOGIN_MUTATION).toBeDefined();
            });

            it('should have REGISTER_MUTATION', () => {
                expect(GQL_QUERIES.REGISTER_MUTATION).toBeDefined();
            });

            it('should have GOOGLE_AUTH_MUTATION', () => {
                expect(GQL_QUERIES.GOOGLE_AUTH_MUTATION).toBeDefined();
            });

            it('should have LOGOUT_MUTATION', () => {
                expect(GQL_QUERIES.LOGOUT_MUTATION).toBeDefined();
            });

            it('should have UPDATE_USER_ROLE_MUTATION', () => {
                expect(GQL_QUERIES.UPDATE_USER_ROLE_MUTATION).toBeDefined();
            });

            it('should have DELETE_USER_MUTATION', () => {
                expect(GQL_QUERIES.DELETE_USER_MUTATION).toBeDefined();
            });

            it('should have SEND_VERIFICATION_EMAIL_MUTATION', () => {
                expect(GQL_QUERIES.SEND_VERIFICATION_EMAIL_MUTATION).toBeDefined();
            });

            it('should have VERIFY_EMAIL_MUTATION', () => {
                expect(GQL_QUERIES.VERIFY_EMAIL_MUTATION).toBeDefined();
            });

            it('should have FORGOT_PASSWORD_MUTATION', () => {
                expect(GQL_QUERIES.FORGOT_PASSWORD_MUTATION).toBeDefined();
            });

            it('should have RESET_PASSWORD_MUTATION', () => {
                expect(GQL_QUERIES.RESET_PASSWORD_MUTATION).toBeDefined();
            });

            it('should have VALIDATE_RESET_TOKEN_QUERY', () => {
                expect(GQL_QUERIES.VALIDATE_RESET_TOKEN_QUERY).toBeDefined();
            });

            it('should have UPDATE_PROFILE_MUTATION', () => {
                expect(GQL_QUERIES.UPDATE_PROFILE_MUTATION).toBeDefined();
            });
        });

        describe('Product queries and mutations', () => {
            it('should have GET_PRODUCTS_QUERY', () => {
                expect(GQL_QUERIES.GET_PRODUCTS_QUERY).toBeDefined();
            });

            it('should have GET_PRODUCT_QUERY', () => {
                expect(GQL_QUERIES.GET_PRODUCT_QUERY).toBeDefined();
            });

            it('should have GET_PRODUCTS_BY_SELLER_QUERY', () => {
                expect(GQL_QUERIES.GET_PRODUCTS_BY_SELLER_QUERY).toBeDefined();
            });

            it('should have CREATE_PRODUCT_MUTATION', () => {
                expect(GQL_QUERIES.CREATE_PRODUCT_MUTATION).toBeDefined();
            });

            it('should have UPDATE_PRODUCT_MUTATION', () => {
                expect(GQL_QUERIES.UPDATE_PRODUCT_MUTATION).toBeDefined();
            });

            it('should have DELETE_PRODUCT_MUTATION', () => {
                expect(GQL_QUERIES.DELETE_PRODUCT_MUTATION).toBeDefined();
            });
        });

        describe('Order queries and mutations', () => {
            it('should have GET_ORDERS_QUERY', () => {
                expect(GQL_QUERIES.GET_ORDERS_QUERY).toBeDefined();
            });

            it('should have GET_ORDER_QUERY', () => {
                expect(GQL_QUERIES.GET_ORDER_QUERY).toBeDefined();
            });

            it('should have GET_ORDERS_BY_CUSTOMER_QUERY', () => {
                expect(GQL_QUERIES.GET_ORDERS_BY_CUSTOMER_QUERY).toBeDefined();
            });

            it('should have CREATE_ORDER_MUTATION', () => {
                expect(GQL_QUERIES.CREATE_ORDER_MUTATION).toBeDefined();
            });

            it('should have UPDATE_ORDER_STATUS_MUTATION', () => {
                expect(GQL_QUERIES.UPDATE_ORDER_STATUS_MUTATION).toBeDefined();
            });

            it('should have UPDATE_PAYMENT_STATUS_MUTATION', () => {
                expect(GQL_QUERIES.UPDATE_PAYMENT_STATUS_MUTATION).toBeDefined();
            });

            it('should have CANCEL_ORDER_MUTATION', () => {
                expect(GQL_QUERIES.CANCEL_ORDER_MUTATION).toBeDefined();
            });
        });

        describe('Coupon queries and mutations', () => {
            it('should have GET_COUPONS_QUERY', () => {
                expect(GQL_QUERIES.GET_COUPONS_QUERY).toBeDefined();
            });

            it('should have GET_COUPON_QUERY', () => {
                expect(GQL_QUERIES.GET_COUPON_QUERY).toBeDefined();
            });

            it('should have VALIDATE_COUPON_QUERY', () => {
                expect(GQL_QUERIES.VALIDATE_COUPON_QUERY).toBeDefined();
            });

            it('should have CREATE_COUPON_MUTATION', () => {
                expect(GQL_QUERIES.CREATE_COUPON_MUTATION).toBeDefined();
            });

            it('should have UPDATE_COUPON_MUTATION', () => {
                expect(GQL_QUERIES.UPDATE_COUPON_MUTATION).toBeDefined();
            });

            it('should have DELETE_COUPON_MUTATION', () => {
                expect(GQL_QUERIES.DELETE_COUPON_MUTATION).toBeDefined();
            });

            it('should have TOGGLE_COUPON_STATUS_MUTATION', () => {
                expect(GQL_QUERIES.TOGGLE_COUPON_STATUS_MUTATION).toBeDefined();
            });
        });

        describe('Category queries and mutations', () => {
            it('should have GET_CATEGORIES_QUERY', () => {
                expect(GQL_QUERIES.GET_CATEGORIES_QUERY).toBeDefined();
            });

            it('should have GET_CATEGORY_QUERY', () => {
                expect(GQL_QUERIES.GET_CATEGORY_QUERY).toBeDefined();
            });

            it('should have CREATE_CATEGORY_MUTATION', () => {
                expect(GQL_QUERIES.CREATE_CATEGORY_MUTATION).toBeDefined();
            });

            it('should have UPDATE_CATEGORY_MUTATION', () => {
                expect(GQL_QUERIES.UPDATE_CATEGORY_MUTATION).toBeDefined();
            });

            it('should have DELETE_CATEGORY_MUTATION', () => {
                expect(GQL_QUERIES.DELETE_CATEGORY_MUTATION).toBeDefined();
            });
        });

        describe('Review queries and mutations', () => {
            it('should have GET_PRODUCT_REVIEWS_QUERY', () => {
                expect(GQL_QUERIES.GET_PRODUCT_REVIEWS_QUERY).toBeDefined();
            });

            it('should have CREATE_REVIEW_MUTATION', () => {
                expect(GQL_QUERIES.CREATE_REVIEW_MUTATION).toBeDefined();
            });

            it('should have MARK_REVIEW_HELPFUL_MUTATION', () => {
                expect(GQL_QUERIES.MARK_REVIEW_HELPFUL_MUTATION).toBeDefined();
            });

            it('should have DELETE_REVIEW_MUTATION', () => {
                expect(GQL_QUERIES.DELETE_REVIEW_MUTATION).toBeDefined();
            });
        });

        describe('Address queries and mutations', () => {
            it('should have GET_MY_ADDRESSES_QUERY', () => {
                expect(GQL_QUERIES.GET_MY_ADDRESSES_QUERY).toBeDefined();
            });

            it('should have ADD_ADDRESS_MUTATION', () => {
                expect(GQL_QUERIES.ADD_ADDRESS_MUTATION).toBeDefined();
            });

            it('should have UPDATE_ADDRESS_MUTATION', () => {
                expect(GQL_QUERIES.UPDATE_ADDRESS_MUTATION).toBeDefined();
            });

            it('should have DELETE_ADDRESS_MUTATION', () => {
                expect(GQL_QUERIES.DELETE_ADDRESS_MUTATION).toBeDefined();
            });

            it('should have SET_DEFAULT_ADDRESS_MUTATION', () => {
                expect(GQL_QUERIES.SET_DEFAULT_ADDRESS_MUTATION).toBeDefined();
            });
        });

        describe('Ticket queries and mutations', () => {
            it('should have GET_TICKETS_QUERY', () => {
                expect(GQL_QUERIES.GET_TICKETS_QUERY).toBeDefined();
            });

            it('should have GET_MY_TICKETS_QUERY', () => {
                expect(GQL_QUERIES.GET_MY_TICKETS_QUERY).toBeDefined();
            });

            it('should have GET_TICKET_QUERY', () => {
                expect(GQL_QUERIES.GET_TICKET_QUERY).toBeDefined();
            });

            it('should have CREATE_TICKET_MUTATION', () => {
                expect(GQL_QUERIES.CREATE_TICKET_MUTATION).toBeDefined();
            });

            it('should have ADD_TICKET_COMMENT_MUTATION', () => {
                expect(GQL_QUERIES.ADD_TICKET_COMMENT_MUTATION).toBeDefined();
            });
        });
    });

    describe('Query caching behavior', () => {
        it('should use cached version on subsequent calls', () => {
            // First call
            const firstCall = getGqlQuery('GET_CATEGORIES_QUERY');

            // Second call should return same reference
            const secondCall = getGqlQuery('GET_CATEGORIES_QUERY');

            expect(firstCall).toBe(secondCall);
        });

        it('should create separate cache entries for different queries', () => {
            const ordersQuery = getGqlQuery('GET_ORDERS_QUERY');
            const productsQuery = getGqlQuery('GET_PRODUCTS_QUERY');

            // Should be different DocumentNode objects
            expect(ordersQuery).not.toBe(productsQuery);
            // Both should be valid DocumentNode objects with definitions
            expect(ordersQuery).toBeDefined();
            expect(productsQuery).toBeDefined();
        });
    });
});
