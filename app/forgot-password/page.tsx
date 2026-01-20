'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button, Input } from '@3asoftwares/ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShoppingBag,
  faEnvelope,
  faArrowLeft,
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';
import { useForgotPassword } from '@/lib/hooks/usePasswordReset';

export default function ForgotPasswordPage() {
  const { forgotPassword, isLoading } = useForgotPassword();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    try {
      const result = await forgotPassword({ email, domain: window.location.origin });
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.message);
      }
    } catch (err: any) {
      // Extract error message from GraphQL response
      const graphqlError =
        err?.graphQLErrors?.[0]?.message ||
        err?.networkError?.result?.errors?.[0]?.message ||
        err?.message ||
        'Failed to send reset email';
      setError(graphqlError);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-[calc(100vh_-_80px)] items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
        <div className="w-full max-w-md">
          <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="bg-gradient-to-r from-green-600 to-green-500 px-8 py-10 text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
                <FontAwesomeIcon icon={faCheckCircle} className="text-3xl text-white" />
              </div>
              <h1 className="mb-2 text-2xl font-bold text-white">Check Your Email</h1>
              <p className="text-sm text-green-100">
                We&apos;ve sent password reset instructions to your email
              </p>
            </div>

            <div className="px-8 py-10">
              <div className="mb-6 text-center">
                <p className="mb-4 text-gray-600">
                  If an account exists for <strong className="text-gray-900">{email}</strong>, you
                  will receive an email with instructions to reset your password.
                </p>
                <p className="text-sm text-gray-500">
                  Didn&apos;t receive the email? Check your spam folder or try again.
                </p>
              </div>

              <div className="space-y-3">
                <Button onClick={() => setSuccess(false)} variant="outline" className="w-full">
                  <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                  Try Another Email
                </Button>
                <Link href="/login" className="block">
                  <Button variant="primary" className="w-full">
                    <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                    Back to Login
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh_-_80px)] items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <div className="w-full max-w-md">
        <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
          <div className="bg-gradient-to-r from-gray-900 to-gray-600 px-8 py-10 text-center">
            <h1 className="mb-2 text-3xl font-bold text-white">
              <FontAwesomeIcon icon={faShoppingBag} className="mr-2" />
              3A Softwares
            </h1>
            <p className="text-sm text-blue-100">Reset your password</p>
          </div>

          <div className="px-8 py-10">
            <div className="mb-6 text-center">
              <h2 className="mb-2 text-xl font-semibold text-gray-900">Forgot Password?</h2>
              <p className="text-sm text-gray-600">
                Enter your email address and we&apos;ll send you a link to reset your password.
              </p>
            </div>

            {error && (
              <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
                <p className="text-sm font-medium text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                label="Email Address"
                placeholder="your@email.com"
              />
              <Button type="submit" disabled={isLoading} className="mt-4 w-full">
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>
          </div>

          <div className="border-t border-gray-100 bg-gray-50 px-8 py-6 text-center">
            <p className="text-sm text-gray-600">
              Remember your password?{' '}
              <Link href="/login" className="font-semibold text-gray-600 hover:text-gray-900">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
