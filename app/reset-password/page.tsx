'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button, Input } from '@3asoftwares/ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShoppingBag,
  faLock,
  faCheckCircle,
  faExclamationTriangle,
  faArrowLeft,
  faEye,
  faEyeSlash,
} from '@fortawesome/free-solid-svg-icons';
import { useResetPassword, useValidateResetToken } from '@/lib/hooks/usePasswordReset';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const { resetPassword, isLoading } = useResetPassword();
  const { isValid, email, isLoading: isValidating } = useValidateResetToken(token);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!token) {
      setError('Invalid reset token');
      return;
    }

    try {
      const result = await resetPassword({ token, password, confirmPassword });
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
        'Failed to reset password';
      setError(graphqlError);
    }
  };

  // Show loading while validating token
  if (isValidating) {
    return (
      <div className="flex min-h-[calc(100vh_-_80px)] items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
        <div className="w-full max-w-md">
          <div className="overflow-hidden rounded-2xl bg-white p-8 shadow-xl">
            <div className="flex flex-col items-center justify-center">
              <div className="mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900"></div>
              <p className="text-gray-600">Validating reset link...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error if token is invalid
  if (!token || (!isValidating && !isValid)) {
    return (
      <div className="flex min-h-[calc(100vh_-_80px)] items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
        <div className="w-full max-w-md">
          <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="bg-gradient-to-r from-red-600 to-red-500 px-8 py-10 text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
                <FontAwesomeIcon icon={faExclamationTriangle} className="text-3xl text-white" />
              </div>
              <h1 className="mb-2 text-2xl font-bold text-white">Invalid Reset Link</h1>
              <p className="text-sm text-red-100">This password reset link is invalid or expired</p>
            </div>

            <div className="px-8 py-10">
              <div className="mb-6 text-center">
                <p className="mb-4 text-gray-600">
                  The password reset link you clicked is no longer valid. This can happen if:
                </p>
                <ul className="mb-6 space-y-2 text-left text-sm text-gray-500">
                  <li>• The link has expired (links are valid for 1 hour)</li>
                  <li>• The link has already been used</li>
                  <li>• The link was copied incorrectly</li>
                </ul>
              </div>

              <div className="space-y-3">
                <Link href="/forgot-password" className="block">
                  <Button variant="primary" className="w-full">
                    Request New Reset Link
                  </Button>
                </Link>
                <Link href="/login" className="block">
                  <Button variant="outline" className="w-full">
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

  // Show success message
  if (success) {
    return (
      <div className="flex min-h-[calc(100vh_-_80px)] items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
        <div className="w-full max-w-md">
          <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="bg-gradient-to-r from-green-600 to-green-500 px-8 py-10 text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
                <FontAwesomeIcon icon={faCheckCircle} className="text-3xl text-white" />
              </div>
              <h1 className="mb-2 text-2xl font-bold text-white">Password Reset!</h1>
              <p className="text-sm text-green-100">Your password has been successfully changed</p>
            </div>

            <div className="px-8 py-10">
              <div className="mb-6 text-center">
                <p className="text-gray-600">
                  You can now log in to your account with your new password.
                </p>
              </div>

              <Link href="/login" className="block">
                <Button variant="primary" className="w-full">
                  Sign In Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show reset password form
  return (
    <div className="flex min-h-[calc(100vh_-_80px)] items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <div className="w-full max-w-md">
        <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
          <div className="bg-gradient-to-r from-gray-900 to-gray-600 px-8 py-10 text-center">
            <h1 className="mb-2 text-3xl font-bold text-white">
              <FontAwesomeIcon icon={faShoppingBag} className="mr-2" />
              3A Softwares
            </h1>
            <p className="text-sm text-blue-100">Create a new password</p>
          </div>

          <div className="px-8 py-10">
            <div className="mb-6 text-center">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <FontAwesomeIcon icon={faLock} className="text-xl text-gray-600" />
              </div>
              <h2 className="mb-2 text-xl font-semibold text-gray-900">Reset Password</h2>
              {email && (
                <p className="text-sm text-gray-600">
                  Creating new password for <strong>{email}</strong>
                </p>
              )}
            </div>

            {error && (
              <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
                <p className="text-sm font-medium text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  label="New Password"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>

              <div className="relative mt-4">
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  label="Confirm New Password"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                >
                  <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                </button>
              </div>

              <div className="mt-4 text-sm text-gray-500">
                <p>Password must:</p>
                <ul className="mt-1 list-inside list-disc space-y-1">
                  <li className={password.length >= 6 ? 'text-green-600' : ''}>
                    Be at least 6 characters
                  </li>
                  <li
                    className={
                      password && confirmPassword && password === confirmPassword
                        ? 'text-green-600'
                        : ''
                    }
                  >
                    Match confirm password
                  </li>
                </ul>
              </div>

              <Button type="submit" disabled={isLoading} className="mt-6 w-full">
                {isLoading ? 'Resetting...' : 'Reset Password'}
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

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100vh_-_80px)] items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
          <div className="w-full max-w-md">
            <div className="overflow-hidden rounded-2xl bg-white p-8 shadow-xl">
              <div className="flex flex-col items-center justify-center">
                <div className="mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900"></div>
                <p className="text-gray-600">Loading...</p>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
