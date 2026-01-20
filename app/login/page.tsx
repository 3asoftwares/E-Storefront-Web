'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useLogin } from '@/lib/hooks/useAuth';
import { useCartStore } from '@/store/cartStore';
import { Button, Input } from '@3asoftwares/ui';
import GoogleSignInButton from '@/components/GoogleSignInButton';
import { useEffect } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';
  const { login, isLoading, error: loginError } = useLogin();
  const { userProfile, setUserProfile } = useCartStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = () => {
    const errors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (email.length > 254 || !/^[^\s@]{1,64}@[^\s@]{1,253}\.[^\s@]{2,63}$/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    try {
      const result = await login({ email, password });

      if (result?.user) {
        if (result.user.role && result.user.role !== 'customer') {
          setError(
            'Access denied. Only customer accounts can access the storefront. Please use the appropriate portal for your role.'
          );
          return;
        }

        setUserProfile({
          id: result.user.id,
          email: result.user.email,
          name: result.user.name || result.user.email.split('@')[0],
          addresses: [],
        });
      }

      router.push(redirectUrl);
    } catch (err: any) {
      setError(loginError?.message || 'Login failed');
    }
  };

  useEffect(() => {
    if (userProfile) {
      router.push(redirectUrl);
    }
  }, [userProfile, router, redirectUrl]);

  return (
    <div className="flex min-h-[calc(100vh_-_80px)] items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-8">
      <div className="w-full max-w-4xl">
        <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left side - Branding */}
            <div className="flex flex-col justify-center bg-gradient-to-br from-gray-900 to-gray-700 px-5 py-8 text-center xs:px-6 xs:py-10 sm:px-8 sm:py-12 lg:py-16 lg:text-left">
              <div className="mb-4 flex items-center justify-center gap-2 xs:mb-5 xs:gap-3 sm:mb-6 lg:justify-start">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={process.env.NEXT_PUBLIC_LOGO_URL}
                  alt="3A Softwares"
                  className="h-10 w-10 object-contain xs:h-11 xs:w-11 sm:h-12 sm:w-12"
                />
                <h1 className="text-2xl font-bold text-white xs:text-2xl sm:text-3xl">
                  3A Softwares
                </h1>
              </div>
              <p className="mb-5 text-base text-gray-300 xs:mb-6 xs:text-lg sm:mb-8">
                Welcome back to your favorite store
              </p>
              <div className="hidden space-y-4 text-gray-400 lg:block">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-700 text-white">
                    ✓
                  </span>
                  <span>Shop from thousands of products</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-700 text-white">
                    ✓
                  </span>
                  <span>Fast & secure checkout</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-700 text-white">
                    ✓
                  </span>
                  <span>Track your orders easily</span>
                </div>
              </div>
            </div>

            {/* Right side - Form */}
            <div className="px-5 py-6 xs:px-6 xs:py-8 sm:px-8 sm:py-10 lg:py-12">
              <h2 className="mb-1 text-xl font-bold text-gray-900 xs:text-2xl">Sign In</h2>
              <p className="mb-3 text-sm text-gray-600 xs:mb-4 xs:text-base">
                Enter your credentials to access your account
              </p>

              {error && (
                <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
                  <p className="text-sm font-medium text-red-700">{error}</p>
                </div>
              )}

              <div className="mb-4">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldErrors.email)
                      setFieldErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  required
                  label="Email Address"
                  placeholder="your@email.com"
                  error={fieldErrors.email}
                />
              </div>
              <div className="mb-4">
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password)
                      setFieldErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  required
                  label="Password"
                  placeholder="Enter your password"
                  error={fieldErrors.password}
                />
              </div>

              <div className="mb-4 flex justify-end">
                <Link
                  href="/forgot-password"
                  className="min-h-5 text-sm text-gray-600 hover:text-gray-900"
                >
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" disabled={isLoading} onClick={handleSubmit}>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-4 text-gray-500">Or continue with</span>
                </div>
              </div>

              <GoogleSignInButton redirectTo={redirectUrl} text="signin_with" />

              <p className="mt-6 text-center text-sm text-gray-600">
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="font-semibold text-gray-900 hover:text-gray-700">
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
