# 📡 API Documentation

## Overview

This document provides a comprehensive reference for the GraphQL API layer used by the E-Storefront application.

---

## 🎯 API Architecture

### Technology Stack

| Component | Technology |
|-----------|------------|
| **Client** | Apollo Client 3.8 |
| **Protocol** | GraphQL |
| **Transport** | HTTP/HTTPS |
| **Caching** | Apollo InMemoryCache |
| **State Sync** | TanStack React Query |

### API Flow

```
┌──────────────────────────────────────────────────────────────────────┐
│                         API REQUEST FLOW                              │
└──────────────────────────────────────────────────────────────────────┘

  Component          Hook              Apollo             Server
  ─────────          ────              ──────             ──────
     │                 │                  │                  │
     │  useProducts()  │                  │                  │
     ├────────────────▶│                  │                  │
     │                 │ React Query      │                  │
     │                 │ + Apollo query   │                  │
     │                 ├─────────────────▶│                  │
     │                 │                  │ GraphQL request  │
     │                 │                  ├─────────────────▶│
     │                 │                  │                  │
     │                 │                  │◀─────────────────│
     │                 │                  │  JSON response   │
     │                 │◀─────────────────│                  │
     │                 │  Cache & return  │                  │
     │◀────────────────│                  │                  │
     │  data, loading  │                  │                  │
```

---

## 🔑 Authentication

### Auth Header

All authenticated requests include:

```
Authorization: Bearer <access_token>
```

### Auth Link Implementation

```typescript
// lib/apollo/client.ts
const authLink = setContext((_, { headers }) => {
  const token = getAccessToken();
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});
```

---

## 📦 Products API

### Get All Products

**Query:**
```graphql
query GetProducts($filters: ProductFiltersInput, $pagination: PaginationInput) {
  products(filters: $filters, pagination: $pagination) {
    items {
      id
      name
      slug
      description
      price
      compareAtPrice
      thumbnail
      images
      category {
        id
        name
        slug
      }
      inStock
      rating
      reviewCount
      createdAt
      updatedAt
    }
    totalCount
    hasNextPage
    hasPreviousPage
  }
}
```

**Variables:**
```json
{
  "filters": {
    "categoryId": "category-123",
    "minPrice": 0,
    "maxPrice": 1000,
    "inStock": true,
    "search": "keyword"
  },
  "pagination": {
    "page": 1,
    "limit": 20
  }
}
```

**Response:**
```json
{
  "data": {
    "products": {
      "items": [
        {
          "id": "prod-1",
          "name": "Product Name",
          "slug": "product-name",
          "description": "Product description...",
          "price": 29.99,
          "compareAtPrice": 39.99,
          "thumbnail": "https://cdn.example.com/image.jpg",
          "images": ["url1", "url2"],
          "category": {
            "id": "cat-1",
            "name": "Electronics",
            "slug": "electronics"
          },
          "inStock": true,
          "rating": 4.5,
          "reviewCount": 120,
          "createdAt": "2024-01-15T10:30:00Z",
          "updatedAt": "2024-01-20T15:45:00Z"
        }
      ],
      "totalCount": 150,
      "hasNextPage": true,
      "hasPreviousPage": false
    }
  }
}
```

### Get Single Product

**Query:**
```graphql
query GetProduct($id: ID!) {
  product(id: $id) {
    id
    name
    slug
    description
    price
    compareAtPrice
    thumbnail
    images
    category {
      id
      name
      slug
    }
    specifications {
      key
      value
    }
    variants {
      id
      name
      price
      inStock
      attributes {
        key
        value
      }
    }
    inStock
    rating
    reviewCount
    reviews {
      id
      author {
        id
        name
        avatar
      }
      rating
      title
      content
      createdAt
    }
  }
}
```

### Get Featured Products

**Query:**
```graphql
query GetFeaturedProducts($limit: Int) {
  featuredProducts(limit: $limit) {
    id
    name
    slug
    price
    thumbnail
    rating
    reviewCount
    inStock
  }
}
```

---

## 📁 Categories API

### Get All Categories

**Query:**
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
    children {
      id
      name
      slug
    }
  }
}
```

### Get Category Products

**Query:**
```graphql
query GetCategoryProducts($slug: String!, $pagination: PaginationInput) {
  category(slug: $slug) {
    id
    name
    products(pagination: $pagination) {
      items {
        id
        name
        price
        thumbnail
        rating
      }
      totalCount
    }
  }
}
```

---

## 👤 User API

### Get Current User

**Query:**
```graphql
query GetMe {
  me {
    id
    email
    firstName
    lastName
    avatar
    phone
    emailVerified
    createdAt
    addresses {
      id
      label
      street
      city
      state
      zipCode
      country
      isDefault
    }
  }
}
```

### Update Profile

**Mutation:**
```graphql
mutation UpdateProfile($input: UpdateProfileInput!) {
  updateProfile(input: $input) {
    id
    firstName
    lastName
    phone
    avatar
  }
}
```

**Variables:**
```json
{
  "input": {
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890"
  }
}
```

---

## 🔐 Auth API

### Login

**Mutation:**
```graphql
mutation Login($input: LoginInput!) {
  login(input: $input) {
    accessToken
    refreshToken
    user {
      id
      email
      firstName
      lastName
    }
  }
}
```

**Variables:**
```json
{
  "input": {
    "email": "user@example.com",
    "password": "securePassword123"
  }
}
```

### Register

**Mutation:**
```graphql
mutation Register($input: RegisterInput!) {
  register(input: $input) {
    success
    message
    user {
      id
      email
    }
  }
}
```

### Google OAuth

**Mutation:**
```graphql
mutation GoogleAuth($input: GoogleAuthInput!) {
  googleAuth(input: $input) {
    accessToken
    refreshToken
    user {
      id
      email
      firstName
      lastName
      avatar
    }
    isNewUser
  }
}
```

### Forgot Password

**Mutation:**
```graphql
mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email) {
    success
    message
  }
}
```

### Reset Password

**Mutation:**
```graphql
mutation ResetPassword($input: ResetPasswordInput!) {
  resetPassword(input: $input) {
    success
    message
  }
}
```

**Variables:**
```json
{
  "input": {
    "token": "reset-token-from-email",
    "password": "newSecurePassword123"
  }
}
```

### Verify Email

**Mutation:**
```graphql
mutation VerifyEmail($token: String!) {
  verifyEmail(token: $token) {
    success
    message
  }
}
```

---

## 🛒 Orders API

### Get User Orders

**Query:**
```graphql
query GetOrders($pagination: PaginationInput) {
  orders(pagination: $pagination) {
    items {
      id
      orderNumber
      status
      total
      subtotal
      tax
      shipping
      createdAt
      items {
        id
        product {
          id
          name
          thumbnail
        }
        quantity
        price
      }
      shippingAddress {
        street
        city
        state
        zipCode
        country
      }
    }
    totalCount
    hasNextPage
  }
}
```

### Get Single Order

**Query:**
```graphql
query GetOrder($id: ID!) {
  order(id: $id) {
    id
    orderNumber
    status
    total
    subtotal
    tax
    shipping
    discount
    paymentMethod
    paymentStatus
    createdAt
    updatedAt
    items {
      id
      product {
        id
        name
        slug
        thumbnail
      }
      quantity
      price
      total
    }
    shippingAddress {
      street
      city
      state
      zipCode
      country
    }
    billingAddress {
      street
      city
      state
      zipCode
      country
    }
    timeline {
      status
      timestamp
      note
    }
  }
}
```

### Create Order

**Mutation:**
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
```

**Variables:**
```json
{
  "input": {
    "items": [
      {
        "productId": "prod-1",
        "quantity": 2
      }
    ],
    "shippingAddressId": "addr-1",
    "billingAddressId": "addr-1",
    "paymentMethod": "STRIPE",
    "couponCode": "SAVE10"
  }
}
```

---

## ⭐ Reviews API

### Get Product Reviews

**Query:**
```graphql
query GetProductReviews($productId: ID!, $pagination: PaginationInput) {
  productReviews(productId: $productId, pagination: $pagination) {
    items {
      id
      author {
        id
        firstName
        lastName
        avatar
      }
      rating
      title
      content
      helpful
      verified
      createdAt
      images
    }
    totalCount
    averageRating
    ratingBreakdown {
      rating
      count
    }
  }
}
```

### Create Review

**Mutation:**
```graphql
mutation CreateReview($input: CreateReviewInput!) {
  createReview(input: $input) {
    id
    rating
    title
    content
    createdAt
  }
}
```

**Variables:**
```json
{
  "input": {
    "productId": "prod-1",
    "rating": 5,
    "title": "Great product!",
    "content": "Really happy with this purchase...",
    "images": ["url1", "url2"]
  }
}
```

---

## 📍 Addresses API

### Get User Addresses

**Query:**
```graphql
query GetAddresses {
  addresses {
    id
    label
    firstName
    lastName
    street
    apartment
    city
    state
    zipCode
    country
    phone
    isDefault
  }
}
```

### Create Address

**Mutation:**
```graphql
mutation CreateAddress($input: CreateAddressInput!) {
  createAddress(input: $input) {
    id
    label
    street
    city
    isDefault
  }
}
```

### Update Address

**Mutation:**
```graphql
mutation UpdateAddress($id: ID!, $input: UpdateAddressInput!) {
  updateAddress(id: $id, input: $input) {
    id
    label
    street
    city
    isDefault
  }
}
```

### Delete Address

**Mutation:**
```graphql
mutation DeleteAddress($id: ID!) {
  deleteAddress(id: $id) {
    success
    message
  }
}
```

---

## 🚨 Error Handling

### Error Response Format

```json
{
  "errors": [
    {
      "message": "User not found",
      "locations": [{ "line": 2, "column": 3 }],
      "path": ["user"],
      "extensions": {
        "code": "USER_NOT_FOUND",
        "statusCode": 404
      }
    }
  ],
  "data": null
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `UNAUTHENTICATED` | 401 | Missing or invalid token |
| `FORBIDDEN` | 403 | Not authorized |
| `NOT_FOUND` | 404 | Resource not found |
| `BAD_USER_INPUT` | 400 | Invalid input data |
| `INTERNAL_SERVER_ERROR` | 500 | Server error |

### Error Link Handler

```typescript
// lib/apollo/client.ts
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, extensions }) => {
      if (extensions?.code === 'UNAUTHENTICATED') {
        clearAuth();
        window.location.href = '/login';
      }
      Logger.error(`GraphQL Error: ${message}`);
    });
  }
  
  if (networkError) {
    Logger.error(`Network Error: ${networkError.message}`);
  }
});
```

---

## 📊 Rate Limiting

| Endpoint | Limit | Window |
|----------|-------|--------|
| **Queries** | 100 requests | 1 minute |
| **Mutations** | 50 requests | 1 minute |
| **Auth** | 10 attempts | 15 minutes |

---

## 📚 Related Documentation

- [API Layer](api-layer.md)
- [Auth Flow](auth-flow.md)
- [State Management](state-management.md)
