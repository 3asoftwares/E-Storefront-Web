# 🔐 Authentication Flow

## Overview

This document explains the authentication architecture, JWT handling, OAuth integration, and security patterns used in the E-Storefront application.

---

## 🎯 Authentication Architecture

### Auth Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        AUTHENTICATION FLOW                                   │
└─────────────────────────────────────────────────────────────────────────────┘

     EMAIL/PASSWORD LOGIN                    GOOGLE OAUTH
     ─────────────────────                   ─────────────
           │                                       │
           ▼                                       ▼
┌─────────────────────┐               ┌─────────────────────┐
│   Login Form        │               │   Google Sign In    │
│   email + password  │               │   OAuth 2.0 Flow    │
└──────────┬──────────┘               └──────────┬──────────┘
           │                                       │
           ▼                                       ▼
┌─────────────────────┐               ┌─────────────────────┐
│   Auth API          │               │   Google API        │
│   POST /login       │               │   OAuth Callback    │
└──────────┬──────────┘               └──────────┬──────────┘
           │                                       │
           └───────────────────┬───────────────────┘
                               ▼
                  ┌─────────────────────┐
                  │   Auth Service      │
                  │   Validate + Issue  │
                  │   JWT Tokens        │
                  └──────────┬──────────┘
                             │
                             ▼
                  ┌─────────────────────┐
                  │   Token Response    │
                  │   ├── accessToken   │
                  │   ├── refreshToken  │
                  │   └── user data     │
                  └──────────┬──────────┘
                             │
                             ▼
                  ┌─────────────────────┐
                  │   Store Tokens      │
                  │   (Secure Cookies)  │
                  └──────────┬──────────┘
                             │
                             ▼
                  ┌─────────────────────┐
                  │   Redirect to Home  │
                  │   User Logged In    │
                  └─────────────────────┘
```

---

## 🔑 JWT Token Handling

### What are JWTs?

JSON Web Tokens (JWTs) are a compact, URL-safe means of representing claims between two parties. They consist of three parts: Header, Payload, and Signature.

### Why JWTs?

| Benefit | Description |
|---------|-------------|
| **Stateless** | No server-side session storage |
| **Scalable** | Works across multiple servers |
| **Self-contained** | Contains user info in payload |
| **Secure** | Cryptographically signed |
| **Standard** | Industry-standard (RFC 7519) |

### Token Types

| Token | Purpose | Lifetime | Storage |
|-------|---------|----------|---------|
| **Access Token** | API authentication | 15 minutes | Memory/Cookie |
| **Refresh Token** | Get new access token | 7 days | HttpOnly Cookie |

### Token Storage

```typescript
// lib/auth/storage.ts

// Store tokens securely
export function storeAuth(data: AuthResponse) {
  // Store in httpOnly cookies (set by server)
  // Or in memory for SPA
  if (typeof window !== 'undefined') {
    // Access token in memory (more secure)
    sessionStorage.setItem('accessToken', data.accessToken);
    
    // User data in localStorage
    localStorage.setItem('user', JSON.stringify(data.user));
  }
}

// Get access token
export function getAccessToken(): string | null {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('accessToken');
  }
  return null;
}

// Get refresh token (from httpOnly cookie - handled by server)
export function getRefreshToken(): string | null {
  // Refresh token should be in httpOnly cookie
  // This is just for client-side reference
  return null;
}

// Clear all auth data
export function clearAuth() {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  }
}

// Get current user from storage
export function getCurrentUser(): User | null {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
  return null;
}
```

---

## 👤 Authentication Hooks

### useAuth Hook

```typescript
// lib/hooks/useAuth.ts
import { useMutation } from '@tanstack/react-query';
import { apolloClient } from '@/lib/apollo/client';
import { LOGIN, REGISTER, GOOGLE_AUTH, LOGOUT } from '@/lib/apollo/queries';
import { storeAuth, clearAuth, getAccessToken, getCurrentUser } from '@/lib/auth/storage';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const router = useRouter();
  
  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const { data } = await apolloClient.mutate({
        mutation: LOGIN,
        variables: credentials,
      });
      return data.login;
    },
    onSuccess: (data) => {
      storeAuth(data);
      router.push('/');
    },
  });
  
  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (input: RegisterInput) => {
      const { data } = await apolloClient.mutate({
        mutation: REGISTER,
        variables: { input },
      });
      return data.register;
    },
    onSuccess: (data) => {
      storeAuth(data);
      router.push('/verify-email');
    },
  });
  
  // Google auth mutation
  const googleAuthMutation = useMutation({
    mutationFn: async (token: string) => {
      const { data } = await apolloClient.mutate({
        mutation: GOOGLE_AUTH,
        variables: { token },
      });
      return data.googleAuth;
    },
    onSuccess: (data) => {
      storeAuth(data);
      router.push('/');
    },
  });
  
  // Logout
  const logout = async () => {
    try {
      await apolloClient.mutate({ mutation: LOGOUT });
    } catch {
      // Ignore logout errors
    } finally {
      clearAuth();
      apolloClient.clearStore();
      router.push('/login');
    }
  };
  
  return {
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    googleAuth: googleAuthMutation.mutateAsync,
    logout,
    isLoading: loginMutation.isPending || registerMutation.isPending,
    error: loginMutation.error || registerMutation.error,
    isAuthenticated: !!getAccessToken(),
    user: getCurrentUser(),
  };
}
```

### useInitializeAuth Hook

```typescript
// lib/hooks/useInitializeAuth.ts
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { storeAuth } from '@/lib/auth/storage';

export function useInitializeAuth() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Handle OAuth callback with tokens in URL
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    const user = searchParams.get('user');
    
    if (accessToken && refreshToken && user) {
      try {
        storeAuth({
          accessToken,
          refreshToken,
          user: JSON.parse(decodeURIComponent(user)),
        });
        
        // Clean URL
        router.replace('/');
      } catch (error) {
        console.error('Failed to parse OAuth callback:', error);
        router.replace('/login?error=oauth_failed');
      }
    }
  }, [searchParams, router]);
}
```

### useTokenValidator Hook

```typescript
// lib/hooks/useTokenValidator.ts
import { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getAccessToken, clearAuth } from '@/lib/auth/storage';
import { authApi } from './useAuth';

const PUBLIC_ROUTES = [
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/about',
  '/contact',
  '/faq',
  '/shipping',
  '/returns',
  '/products',
];

export function useTokenValidator() {
  const router = useRouter();
  const pathname = usePathname();
  const intervalRef = useRef<NodeJS.Timeout>();
  
  useEffect(() => {
    const isPublicRoute = PUBLIC_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(route + '/')
    );
    
    if (isPublicRoute) {
      return; // Skip validation for public routes
    }
    
    const validateToken = async () => {
      const token = getAccessToken();
      
      if (!token) {
        clearAuth();
        router.push('/login');
        return;
      }
      
      try {
        // Validate token with auth service
        await authApi.get('/validate');
      } catch (error) {
        // Token invalid - try refresh or redirect
        clearAuth();
        router.push('/login');
      }
    };
    
    // Validate immediately
    validateToken();
    
    // Validate every 5 minutes
    intervalRef.current = setInterval(validateToken, 5 * 60 * 1000);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [pathname, router]);
}
```

---

## 🌐 Google OAuth Integration

### What is OAuth?

OAuth 2.0 is an authorization framework that enables applications to obtain limited access to user accounts on third-party services.

### Why Google OAuth?

| Benefit | Description |
|---------|-------------|
| **User Convenience** | One-click sign in |
| **Security** | No password storage |
| **Trust** | Users trust Google |
| **Data** | Access to profile info |
| **Reduced Friction** | Higher conversion |

### Implementation

```typescript
// components/GoogleSignInButton.tsx
'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, config: any) => void;
        };
      };
    };
  }
}

export function GoogleSignInButton() {
  const buttonRef = useRef<HTMLDivElement>(null);
  const { googleAuth, isLoading } = useAuth();
  
  useEffect(() => {
    // Load Google Identity Services
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    
    script.onload = () => {
      if (window.google && buttonRef.current) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
        });
        
        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: 'outline',
          size: 'large',
          width: 300,
        });
      }
    };
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  
  const handleCredentialResponse = async (response: { credential: string }) => {
    try {
      await googleAuth(response.credential);
    } catch (error) {
      console.error('Google auth failed:', error);
    }
  };
  
  return (
    <div className="google-signin">
      <div ref={buttonRef} />
      {isLoading && <span>Signing in...</span>}
    </div>
  );
}
```

---

## 📧 Password Reset Flow

### Flow Diagram

```
┌───────────────────────────────────────────────────────────────────────────┐
│                          PASSWORD RESET FLOW                               │
└───────────────────────────────────────────────────────────────────────────┘

1. REQUEST RESET
   ┌─────────────────┐     POST /forgot-password     ┌─────────────────┐
   │  Forgot Password│────────────────────────────▶│   Auth Service  │
   │  Form (email)   │                              │                 │
   └─────────────────┘                              └────────┬────────┘
                                                             │
                                                             ▼
                                                    ┌─────────────────┐
                                                    │   Send Email    │
                                                    │   with Token    │
                                                    └─────────────────┘

2. RESET PASSWORD
   ┌─────────────────┐     POST /reset-password      ┌─────────────────┐
   │  Reset Form     │─────────────────────────────▶│   Auth Service  │
   │  (token + pass) │                              │   Validate Token│
   └─────────────────┘                              └────────┬────────┘
                                                             │
                                                             ▼
                                                    ┌─────────────────┐
                                                    │  Update Password│
                                                    │  Invalidate Token│
                                                    └─────────────────┘
```

### Implementation

```typescript
// lib/hooks/usePasswordReset.ts
import { useMutation } from '@tanstack/react-query';
import { authApi } from './useAuth';

export function useForgotPassword() {
  return useMutation({
    mutationFn: async (email: string) => {
      const { data } = await authApi.post('/forgot-password', { email });
      return data;
    },
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: async ({
      token,
      password,
    }: {
      token: string;
      password: string;
    }) => {
      const { data } = await authApi.post('/reset-password', {
        token,
        password,
      });
      return data;
    },
  });
}

export function useValidateResetToken() {
  return useMutation({
    mutationFn: async (token: string) => {
      const { data } = await authApi.post('/validate-reset-token', { token });
      return data;
    },
  });
}
```

---

## 📧 Email Verification Flow

### Implementation

```typescript
// lib/hooks/useEmailVerification.ts
import { useMutation } from '@tanstack/react-query';
import { authApi } from './useAuth';

export function useSendVerificationEmail() {
  return useMutation({
    mutationFn: async (email: string) => {
      const { data } = await authApi.post('/send-verification', { email });
      return data;
    },
  });
}

export function useVerifyEmail() {
  return useMutation({
    mutationFn: async (token: string) => {
      const { data } = await authApi.post('/verify-email', { token });
      return data;
    },
  });
}
```

---

## 🛡️ Protected Routes

### Route Protection Pattern

```typescript
// components/ProtectedRoute.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (!isAuthenticated) {
    return null; // Will redirect
  }
  
  return <>{children}</>;
}
```

### Usage in Pages

```typescript
// app/profile/page.tsx
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
```

---

## 🔒 Security Best Practices

### Token Security

| Practice | Implementation |
|----------|----------------|
| **Short-lived Access Tokens** | 15 minute expiration |
| **Secure Cookie Storage** | HttpOnly, Secure, SameSite |
| **Token Rotation** | New refresh token on each use |
| **Immediate Invalidation** | Clear on logout |

### HTTPS

All authentication requests must use HTTPS to prevent token interception.

### CSRF Protection

```typescript
// Implemented via SameSite cookies
// Set-Cookie: token=xxx; HttpOnly; Secure; SameSite=Strict
```

### XSS Prevention

- React's automatic escaping
- Content Security Policy headers
- No token storage in localStorage (prefer memory/httpOnly cookies)

---

## 📊 Auth State Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            AUTH STATE MACHINE                                │
└─────────────────────────────────────────────────────────────────────────────┘

                    ┌─────────────────────┐
                    │    UNAUTHENTICATED  │
                    │   (Initial State)   │
                    └──────────┬──────────┘
                               │
           ┌───────────────────┼───────────────────┐
           │                   │                   │
           ▼                   ▼                   ▼
   ┌───────────────┐   ┌───────────────┐   ┌───────────────┐
   │    LOGIN      │   │   REGISTER    │   │  GOOGLE AUTH  │
   └───────┬───────┘   └───────┬───────┘   └───────┬───────┘
           │                   │                   │
           └───────────────────┼───────────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   AUTHENTICATED     │
                    │  (Tokens Stored)    │
                    └──────────┬──────────┘
                               │
           ┌───────────────────┼───────────────────┐
           │                   │                   │
           ▼                   ▼                   ▼
   ┌───────────────┐   ┌───────────────┐   ┌───────────────┐
   │    LOGOUT     │   │ TOKEN EXPIRED │   │  TOKEN INVALID │
   └───────┬───────┘   └───────┬───────┘   └───────┬───────┘
           │                   │                   │
           │                   ▼                   │
           │           ┌───────────────┐           │
           │           │ REFRESH TOKEN │           │
           │           └───────┬───────┘           │
           │                   │                   │
           │          ┌────────┴────────┐          │
           │          │                 │          │
           │    SUCCESS            FAILURE         │
           │          │                 │          │
           │          ▼                 │          │
           │   AUTHENTICATED            │          │
           │                            │          │
           └───────────┬────────────────┼──────────┘
                       │                │
                       ▼                ▼
                    ┌─────────────────────┐
                    │    UNAUTHENTICATED  │
                    │   (Clear Storage)   │
                    └─────────────────────┘
```

---

## 📚 Related Documentation

- [API Layer](api-layer.md)
- [Security](security.md)
- [State Management](state-management.md)
