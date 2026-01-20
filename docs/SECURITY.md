# Security Policy

## 📑 Table of Contents

- [Reporting Vulnerabilities](#reporting-vulnerabilities)
- [Security Measures](#security-measures)
- [Authentication](#authentication)
- [Data Protection](#data-protection)
- [Best Practices](#best-practices)

## 🚨 Reporting Vulnerabilities

### Responsible Disclosure

If you discover a security vulnerability:

1. **DO NOT** create a public GitHub issue
2. Email: **security@3asoftwares.com**
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact

### Response Timeline

| Phase              | Timeline |
| ------------------ | -------- |
| Acknowledgment     | 24 hours |
| Initial Assessment | 48 hours |
| Status Update      | 7 days   |

## 🔒 Security Measures

### Client-Side Security

| Measure          | Implementation                   |
| ---------------- | -------------------------------- |
| XSS Prevention   | React auto-escaping, CSP headers |
| CSRF Protection  | SameSite cookies                 |
| Secure Cookies   | HttpOnly, Secure flags           |
| Input Validation | Client + server validation       |
| HTTPS            | Enforced via Vercel              |

### Security Headers

```typescript
// next.config.ts
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
];
```

### Content Security Policy

```typescript
// next.config.ts
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' *.vercel.app;
  style-src 'self' 'unsafe-inline' fonts.googleapis.com;
  img-src 'self' data: blob: *.3asoftwares.com cdn.example.com;
  font-src 'self' fonts.gstatic.com;
  connect-src 'self' *.3asoftwares.com *.googleapis.com;
  frame-ancestors 'none';
`;
```

## 🔑 Authentication

### Token Storage

```typescript
// ✅ DO: Store in httpOnly cookies (handled by backend)
// The access token is set as httpOnly cookie by the auth service

// ✅ DO: Store refresh token securely
// Handled via secure, httpOnly cookie

// ❌ DON'T: Store tokens in localStorage for sensitive apps
// localStorage.setItem('token', token); // Vulnerable to XSS
```

### Auth State Management

```typescript
// store/authStore.ts
import { create } from 'zustand';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Only store non-sensitive data in client state
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    }),

  logout: () => {
    // Clear client state
    set({ user: null, isAuthenticated: false });
    // API call to invalidate token (clears httpOnly cookie)
    fetch('/api/auth/logout', { method: 'POST' });
  },
}));
```

### Protected Routes

```typescript
// components/AuthGuard.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
```

## 🛡️ Data Protection

### Sensitive Data Handling

```typescript
// ❌ DON'T: Log sensitive data
console.log('User data:', { ...user, password }); // Never!

// ✅ DO: Sanitize logs
console.log('User logged in:', { id: user.id, email: user.email });

// ❌ DON'T: Include sensitive data in URLs
router.push(`/reset?token=${token}&email=${email}`);

// ✅ DO: Use POST for sensitive data
fetch('/api/reset', {
  method: 'POST',
  body: JSON.stringify({ token, email }),
});
```

### Form Security

```typescript
// components/LoginForm.tsx
export function LoginForm() {
  const handleSubmit = async (data: LoginData) => {
    try {
      // Send via HTTPS POST
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include', // Include cookies
      });

      // Handle response
    } catch (error) {
      // Don't expose error details to user
      setError('Login failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} autoComplete="on">
      <input
        type="email"
        name="email"
        autoComplete="email" // Help password managers
      />
      <input
        type="password"
        name="password"
        autoComplete="current-password"
      />
    </form>
  );
}
```

## ✅ Best Practices

### Code Security

```typescript
// ✅ DO: Validate and sanitize user input
function SearchInput({ onSearch }: Props) {
  const handleSearch = (query: string) => {
    // Sanitize input
    const sanitized = query.trim().slice(0, 100);
    onSearch(sanitized);
  };
}

// ✅ DO: Use parameterized queries (handled by GraphQL)
const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      name
    }
  }
`;

// ❌ DON'T: Build queries with string concatenation
const query = `query { product(id: "${userId}") { ... } }`; // SQL injection risk
```

### Dependency Security

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Check before deploying
npm audit --production
```

### Environment Variables

```typescript
// ✅ DO: Validate required variables at startup
const requiredVars = ['NEXT_PUBLIC_GRAPHQL_URL', 'NEXT_PUBLIC_APP_URL'];

for (const varName of requiredVars) {
  if (!process.env[varName]) {
    throw new Error(`Missing: ${varName}`);
  }
}

// ❌ DON'T: Expose server secrets to client
// Variables without NEXT_PUBLIC_ are server-only
const apiSecret = process.env.API_SECRET; // ✅ Server only
const publicUrl = process.env.NEXT_PUBLIC_APP_URL; // ✅ OK for client
```

### Security Checklist

- [ ] All forms use HTTPS
- [ ] Sensitive data not in URLs
- [ ] Input validation on all forms
- [ ] Security headers configured
- [ ] Dependencies audited
- [ ] No secrets in client code
- [ ] Auth tokens in httpOnly cookies
- [ ] CSP configured
- [ ] Error messages don't leak info

---

**Last Updated:** January 2026  
**Contact:** security@3asoftwares.com
