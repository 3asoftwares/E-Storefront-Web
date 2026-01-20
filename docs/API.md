# API Documentation

This document provides comprehensive documentation for the GraphQL API integration used in the E-Storefront Web application.

## 📋 Table of Contents

- [Overview](#overview)
- [GraphQL Endpoint](#graphql-endpoint)
- [Authentication](#authentication)
- [Queries](#queries)
- [Mutations](#mutations)
- [Error Handling](#error-handling)
- [Pagination](#pagination)
- [Custom Hooks](#custom-hooks)

---

## 🌐 Overview

The E-Storefront Web application communicates with backend services through a GraphQL API. The API layer handles:

- Product catalog and search
- User authentication and profile management
- Shopping cart operations
- Order processing
- Reviews and ratings
- Customer support tickets

### Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Frontend      │────▶│   Apollo Client │────▶│   GraphQL       │
│   Components    │     │   (with cache)  │     │   Gateway       │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                        │
                                                        ▼
                              ┌─────────────────────────────────────┐
                              │         Backend Microservices        │
                              │  ┌─────────┐ ┌─────────┐ ┌────────┐ │
                              │  │Products │ │ Orders  │ │  Auth  │ │
                              │  └─────────┘ └─────────┘ └────────┘ │
                              └─────────────────────────────────────┘
```

---

## 🔗 GraphQL Endpoint

### Configuration

```typescript
// Environment variable
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql

// Production
NEXT_PUBLIC_GRAPHQL_URL=https://api.3asoftwares.com/graphql
```

### Client Setup

```typescript
// lib/apollo/client.ts
import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client';

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
  credentials: 'include',
});

export const apolloClient = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      /* ... */
    },
  }),
});
```

---

## 🔐 Authentication

### Headers

All authenticated requests include an Authorization header:

```typescript
Authorization: Bearer<access_token>;
```

### Auth Link Implementation

```typescript
const authLink = new ApolloLink((operation, forward) => {
  const token = getAccessToken();

  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      ...(token && { authorization: `Bearer ${token}` }),
    },
  }));

  return forward(operation);
});
```

---

## 📖 Queries

### Products

#### Get Products (with filtering)

```graphql
query GetProducts(
  $search: String
  $category: String
  $minPrice: Float
  $maxPrice: Float
  $page: Int
  $limit: Int
  $sortBy: String
  $sortOrder: String
  $featured: Boolean
) {
  products(
    search: $search
    category: $category
    minPrice: $minPrice
    maxPrice: $maxPrice
    page: $page
    limit: $limit
    sortBy: $sortBy
    sortOrder: $sortOrder
    featured: $featured
  ) {
    products {
      id
      name
      description
      price
      images
      category {
        id
        name
      }
      stock
      rating
      reviewCount
      createdAt
    }
    total
    page
    totalPages
  }
}
```

**Usage:**

```typescript
const { data, loading, error } = useQuery(GQL_QUERIES.GET_PRODUCTS_QUERY, {
  variables: {
    category: 'electronics',
    page: 1,
    limit: 12,
    sortBy: 'price',
    sortOrder: 'asc',
  },
});
```

#### Get Single Product

```graphql
query GetProduct($id: ID!) {
  product(id: $id) {
    id
    name
    description
    price
    images
    category {
      id
      name
    }
    stock
    rating
    reviewCount
    specifications
    seller {
      id
      name
    }
  }
}
```

### Categories

#### Get All Categories

```graphql
query GetCategories {
  categories {
    id
    name
    slug
    description
    image
    productCount
    parent {
      id
      name
    }
  }
}
```

### Orders

#### Get Customer Orders

```graphql
query GetOrdersByCustomer($customerId: ID!) {
  ordersByCustomer(customerId: $customerId) {
    id
    orderNumber
    status
    paymentStatus
    items {
      product {
        id
        name
        images
      }
      quantity
      price
    }
    total
    shippingAddress {
      street
      city
      state
      country
      zipCode
    }
    createdAt
  }
}
```

#### Get Single Order

```graphql
query GetOrder($id: ID!) {
  order(id: $id) {
    id
    orderNumber
    status
    paymentStatus
    items {
      product {
        id
        name
        images
        price
      }
      quantity
      price
    }
    subtotal
    shipping
    tax
    total
    shippingAddress {
      street
      city
      state
      country
      zipCode
    }
    trackingNumber
    estimatedDelivery
    createdAt
    updatedAt
  }
}
```

### User

#### Get Current User

```graphql
query GetMe {
  me {
    id
    email
    name
    phone
    avatar
    emailVerified
    addresses {
      id
      street
      city
      state
      country
      zipCode
      isDefault
    }
    defaultAddressId
    createdAt
  }
}
```

### Reviews

#### Get Product Reviews

```graphql
query GetProductReviews($productId: ID!, $page: Int, $limit: Int) {
  productReviews(productId: $productId, page: $page, limit: $limit) {
    reviews {
      id
      rating
      title
      comment
      user {
        id
        name
        avatar
      }
      helpfulCount
      createdAt
    }
    total
    averageRating
  }
}
```

### Addresses

#### Get User Addresses

```graphql
query GetMyAddresses {
  myAddresses {
    id
    street
    apartment
    city
    state
    country
    zipCode
    phone
    isDefault
    label
  }
}
```

### Coupons

#### Validate Coupon

```graphql
query ValidateCoupon($code: String!, $cartTotal: Float!) {
  validateCoupon(code: $code, cartTotal: $cartTotal) {
    valid
    discount
    discountType
    message
  }
}
```

---

## ✏️ Mutations

### Authentication

#### Login

```graphql
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token
    refreshToken
    expiresIn
    user {
      id
      email
      name
      avatar
    }
  }
}
```

#### Register

```graphql
mutation Register($input: RegisterInput!) {
  register(input: $input) {
    token
    user {
      id
      email
      name
    }
  }
}

# Input type
input RegisterInput {
  email: String!
  password: String!
  name: String!
  phone: String
}
```

#### Google Authentication

```graphql
mutation GoogleAuth($idToken: String!) {
  googleAuth(idToken: $idToken) {
    token
    refreshToken
    user {
      id
      email
      name
      avatar
    }
  }
}
```

#### Logout

```graphql
mutation Logout {
  logout {
    success
  }
}
```

#### Password Reset

```graphql
mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email) {
    success
    message
  }
}

mutation ResetPassword($token: String!, $password: String!) {
  resetPassword(token: $token, password: $password) {
    success
    message
  }
}
```

### Orders

#### Create Order

```graphql
mutation CreateOrder($input: CreateOrderInput!) {
  createOrder(input: $input) {
    id
    orderNumber
    status
    total
    paymentUrl
  }
}

# Input type
input CreateOrderInput {
  items: [OrderItemInput!]!
  shippingAddressId: ID!
  billingAddressId: ID
  paymentMethod: String!
  couponCode: String
  notes: String
}

input OrderItemInput {
  productId: ID!
  quantity: Int!
}
```

#### Cancel Order

```graphql
mutation CancelOrder($id: ID!, $reason: String) {
  cancelOrder(id: $id, reason: $reason) {
    id
    status
  }
}
```

### Reviews

#### Create Review

```graphql
mutation CreateReview($input: CreateReviewInput!) {
  createReview(input: $input) {
    id
    rating
    comment
    createdAt
  }
}

input CreateReviewInput {
  productId: ID!
  orderId: ID!
  rating: Int!
  title: String
  comment: String!
}
```

#### Mark Review Helpful

```graphql
mutation MarkReviewHelpful($reviewId: ID!) {
  markReviewHelpful(reviewId: $reviewId) {
    id
    helpfulCount
  }
}
```

### Addresses

#### Add Address

```graphql
mutation AddAddress($input: AddressInput!) {
  addAddress(input: $input) {
    id
    street
    city
    state
    country
    zipCode
    isDefault
  }
}

input AddressInput {
  street: String!
  apartment: String
  city: String!
  state: String!
  country: String!
  zipCode: String!
  phone: String
  label: String
  isDefault: Boolean
}
```

#### Update Address

```graphql
mutation UpdateAddress($id: ID!, $input: AddressInput!) {
  updateAddress(id: $id, input: $input) {
    id
    street
    city
    state
    country
    zipCode
    isDefault
  }
}
```

#### Delete Address

```graphql
mutation DeleteAddress($id: ID!) {
  deleteAddress(id: $id) {
    success
  }
}
```

#### Set Default Address

```graphql
mutation SetDefaultAddress($id: ID!) {
  setDefaultAddress(id: $id) {
    id
    isDefault
  }
}
```

### Profile

#### Update Profile

```graphql
mutation UpdateProfile($input: UpdateProfileInput!) {
  updateProfile(input: $input) {
    id
    name
    email
    phone
    avatar
  }
}

input UpdateProfileInput {
  name: String
  phone: String
  avatar: String
}
```

### Support Tickets

#### Create Ticket

```graphql
mutation CreateTicket($input: CreateTicketInput!) {
  createTicket(input: $input) {
    id
    subject
    status
    createdAt
  }
}

input CreateTicketInput {
  subject: String!
  category: String!
  priority: String
  message: String!
  orderId: ID
}
```

#### Add Ticket Comment

```graphql
mutation AddTicketComment($ticketId: ID!, $message: String!) {
  addTicketComment(ticketId: $ticketId, message: $message) {
    id
    message
    createdAt
  }
}
```

---

## ⚠️ Error Handling

### Error Response Format

```json
{
  "errors": [
    {
      "message": "Unauthorized",
      "extensions": {
        "code": "UNAUTHENTICATED",
        "statusCode": 401
      }
    }
  ],
  "data": null
}
```

### Common Error Codes

| Code                    | Description              | Action                 |
| ----------------------- | ------------------------ | ---------------------- |
| `UNAUTHENTICATED`       | Invalid or expired token | Redirect to login      |
| `FORBIDDEN`             | Insufficient permissions | Show error message     |
| `BAD_USER_INPUT`        | Invalid input data       | Show validation errors |
| `NOT_FOUND`             | Resource not found       | Show 404 page          |
| `INTERNAL_SERVER_ERROR` | Server error             | Show generic error     |

### Error Handling Example

```typescript
const { data, error } = useQuery(GET_PRODUCTS);

if (error) {
  if (error.graphQLErrors.some(e =>
    e.extensions?.code === 'UNAUTHENTICATED'
  )) {
    router.push('/login');
    return null;
  }

  return <ErrorMessage message={error.message} />;
}
```

---

## 📄 Pagination

### Offset-Based Pagination

```graphql
query GetProducts($page: Int!, $limit: Int!) {
  products(page: $page, limit: $limit) {
    products {
      id
      name
    }
    total
    page
    totalPages
    hasNextPage
    hasPreviousPage
  }
}
```

### Infinite Scroll Implementation

```typescript
const { data, fetchMore, loading } = useQuery(GET_PRODUCTS, {
  variables: { page: 1, limit: 12 },
});

const loadMore = () => {
  if (data?.products.hasNextPage) {
    fetchMore({
      variables: { page: data.products.page + 1 },
      updateQuery: (prev, { fetchMoreResult }) => {
        return {
          products: {
            ...fetchMoreResult.products,
            products: [...prev.products.products, ...fetchMoreResult.products.products],
          },
        };
      },
    });
  }
};
```

---

## 🪝 Custom Hooks

### useProducts

```typescript
// lib/hooks/useProducts.ts
export function useProducts(filters: ProductFilters) {
  const { data, loading, error, fetchMore, refetch } = useQuery(GQL_QUERIES.GET_PRODUCTS_QUERY, {
    variables: filters,
    notifyOnNetworkStatusChange: true,
  });

  return {
    products: data?.products?.products || [],
    total: data?.products?.total || 0,
    totalPages: data?.products?.totalPages || 0,
    loading,
    error,
    fetchMore,
    refetch,
  };
}
```

### useAuth

```typescript
// lib/hooks/useAuth.ts
export function useAuth() {
  const [login, { loading: loginLoading }] = useMutation(GQL_QUERIES.LOGIN_MUTATION);

  const [register, { loading: registerLoading }] = useMutation(GQL_QUERIES.REGISTER_MUTATION);

  const handleLogin = async (email: string, password: string) => {
    const { data } = await login({ variables: { email, password } });
    if (data?.login) {
      storeAuth(data.login);
      return data.login;
    }
  };

  return {
    login: handleLogin,
    register: handleRegister,
    loading: loginLoading || registerLoading,
  };
}
```

### useOrders

```typescript
// lib/hooks/useOrders.ts
export function useOrders() {
  const user = getCurrentUser();

  const { data, loading, error, refetch } = useQuery(GQL_QUERIES.GET_ORDERS_BY_CUSTOMER_QUERY, {
    variables: { customerId: user?.id },
    skip: !user?.id,
  });

  const [createOrder] = useMutation(GQL_QUERIES.CREATE_ORDER_MUTATION);
  const [cancelOrder] = useMutation(GQL_QUERIES.CANCEL_ORDER_MUTATION);

  return {
    orders: data?.ordersByCustomer || [],
    loading,
    error,
    refetch,
    createOrder,
    cancelOrder,
  };
}
```

---

## 📚 Related Documentation

- [Architecture](ARCHITECTURE.md) - System architecture
- [Environment](ENVIRONMENT.md) - Configuration
- [Security](SECURITY.md) - API security
