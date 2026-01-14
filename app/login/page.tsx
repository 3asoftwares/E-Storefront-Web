'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useLogin } from '@/lib/hooks/useAuth';
import { useCartStore } from '@/store/cartStore';
import { Button, Input } from '@3asoftwares/ui';
import GoogleSignInButton from '@/components/GoogleSignInButton';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';
  const { login, isLoading, error: loginError } = useLogin();
  const { setUserProfile } = useCartStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = () => {
    const errors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
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
        // Check if user has customer role - only customers can use the storefront
        if (result.user.role && result.user.role !== 'customer') {
          setError('Access denied. Only customer accounts can access the storefront. Please use the appropriate portal for your role.');
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

  return (
    <div className="min-h-[calc(100vh_-_80px)] bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-4xl">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left side - Branding */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-700 px-8 py-12 lg:py-16 text-center lg:text-left flex flex-col justify-center">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
                <img
                  src={process.env.NEXT_PUBLIC_LOGO_URL}
                  alt="3A Softwares"
                  className="w-12 h-12 object-contain"
                />
                <h1 className="text-3xl font-bold text-white">
                  3A Softwares
                </h1>
              </div>
              <p className="text-gray-300 text-lg mb-8">Welcome back to your favorite store</p>
              <div className="hidden lg:block space-y-4 text-gray-400">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-white">✓</span>
                  <span>Shop from thousands of products</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-white">✓</span>
                  <span>Fast & secure checkout</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-white">✓</span>
                  <span>Track your orders easily</span>
                </div>
              </div>
            </div>

            {/* Right side - Form */}
            <div className="px-8 py-10 lg:py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Sign In</h2>
              <p className="text-gray-600 mb-4">Enter your credentials to access your account</p>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              )}

              <div className="mb-4">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: undefined }));
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
                    if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: undefined }));
                  }}
                  required
                  label="Password"
                  placeholder="••••••••"
                  error={fieldErrors.password}
                />
              </div>

              <div className="flex justify-end mb-4">
                <Link href="/forgot-password" className="min-h-5 text-sm text-gray-600 hover:text-gray-900">
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
                  <span className="px-4 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <GoogleSignInButton redirectTo={redirectUrl} text="signin_with" />

              <p className="text-center text-sm text-gray-600 mt-6">
                Don't have an account?{' '}
                <Link href="/signup" className="text-gray-900 font-semibold hover:text-gray-700">
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
