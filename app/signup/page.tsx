'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useRegister } from '@/lib/hooks/useAuth';
import { Button, Input } from '@3asoftwares/ui';
import GoogleSignInButton from '@/components/GoogleSignInButton';

export default function SignupPage() {
  const router = useRouter();
  const { register, isLoading, error: registerError } = useRegister();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error when user starts typing
    if (fieldErrors[name as keyof typeof fieldErrors]) {
      setFieldErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const errors: typeof fieldErrors = {};

    if (!formData.name.trim()) {
      errors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (formData.email.length > 254 || !/^[^\s@]{1,64}@[^\s@]{1,253}\.[^\s@]{2,63}$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password = 'Password must contain uppercase, lowercase, and number';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    try {
      await register({
        email: formData.email,
        password: formData.password,
        name: formData.name,
      });
      setSuccess('Account created! Redirecting to home...');
      setTimeout(() => router.push('/'), 2000);
    } catch (err: any) {
      const graphqlError = err?.graphQLErrors?.[0]?.message
        || err?.networkError?.result?.errors?.[0]?.message
        || err?.message
        || 'Signup failed';
      setError(graphqlError);
    }
  };

  return (  
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-6xl">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left side - Branding */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-700 px-5 xs:px-6 sm:px-8 py-8 xs:py-10 sm:py-12 lg:py-16 text-center lg:text-left flex flex-col justify-center">
              <div className="flex items-center justify-center lg:justify-start gap-2 xs:gap-3 mb-4 xs:mb-5 sm:mb-6">
                <img
                  src={process.env.NEXT_PUBLIC_LOGO_URL}
                  alt="3A Softwares"
                  className="w-10 h-10 xs:w-11 xs:h-11 sm:w-12 sm:h-12 object-contain"
                />
                <h1 className="text-2xl xs:text-2xl sm:text-3xl font-bold text-white">
                  3A Softwares
                </h1>
              </div>
              <p className="text-gray-300 text-base xs:text-lg mb-5 xs:mb-6 sm:mb-8">Create your account to get started</p>
              <div className="hidden lg:block space-y-4 text-gray-400">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-white">✓</span>
                  <span>Access exclusive deals & offers</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-white">✓</span>
                  <span>Save items to your wishlist</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-white">✓</span>
                  <span>Fast checkout with saved addresses</span>
                </div>
              </div>
            </div>

            {/* Right side - Form */}
            <div className="px-5 xs:px-6 sm:px-8 py-6 xs:py-8 sm:py-10 lg:py-12">
              <h2 className="text-xl xs:text-2xl font-bold text-gray-900 mb-1 xs:mb-2">Create Account</h2>
              <p className="text-gray-600 mb-4 xs:mb-6 text-sm xs:text-base">Fill in your details to get started</p>
              
              {error && (
                <div className="mb-4 xs:mb-6 p-3 xs:p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-xs xs:text-sm font-medium">{error}</p>
                </div>
              )}

              {success && (
                <div className="mb-4 xs:mb-6 p-3 xs:p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700 text-xs xs:text-sm font-medium">{success}</p>
                </div>
              )}

              <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 xs:gap-4 mb-3 xs:mb-4">
                <div>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    label="Full Name"
                    placeholder="John Doe"
                    error={fieldErrors.name}
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    label="Email Address"
                    placeholder="your@email.com"
                    error={fieldErrors.email}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 xs:gap-4 mb-3 xs:mb-4">
                <div>
                  <Input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    label="Password"
                    placeholder="Enter your password"
                    error={fieldErrors.password}
                  />
                </div>
                <div>
                  <Input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    label="Confirm Password"
                    placeholder="Confirm your password"
                    error={fieldErrors.confirmPassword}
                  />
                </div>
              </div>

              <Button disabled={isLoading} onClick={handleSubmit} className="min-h-[48px]">
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>

              <div className="relative my-4 xs:my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <GoogleSignInButton redirectTo="/" text="signup_with" />

              <p className="text-center text-sm text-gray-600 mt-6">
                Already have an account?{' '}
                <Link href="/login" className="text-gray-900 font-semibold hover:text-gray-700">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
