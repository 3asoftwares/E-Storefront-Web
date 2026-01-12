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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
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
    } catch (err) {
      setError(registerError?.message || (err instanceof Error ? err.message : 'Signup failed'));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4 py-8">
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
              <p className="text-gray-300 text-lg mb-8">Create your account to get started</p>
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
            <div className="px-8 py-10 lg:py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h2>
              <p className="text-gray-600 mb-6">Fill in your details to get started</p>
              
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              )}

              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700 text-sm font-medium">{success}</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  label="Full Name"
                  placeholder="John Doe"
                />
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  label="Email Address"
                  placeholder="your@email.com"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  label="Password"
                  placeholder="••••••••"
                />
                <Input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  label="Confirm Password"
                  placeholder="••••••••"
                />
              </div>

              <Button disabled={isLoading} onClick={handleSubmit}>
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>

              <div className="relative my-6">
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
