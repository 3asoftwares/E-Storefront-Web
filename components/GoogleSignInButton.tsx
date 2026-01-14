'use client';

import { useEffect, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGoogleAuth } from '../lib/hooks/useAuth';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement | null, config: any) => void;
          prompt: () => void;
        };
      };
    };
  }
}

interface GoogleSignInButtonProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
  theme?: 'outline' | 'filled_blue' | 'filled_black';
  size?: 'large' | 'medium' | 'small';
  width?: number;
  redirectTo?: string;
}

export default function GoogleSignInButton({
  onSuccess,
  onError,
  text = 'continue_with',
  theme = 'outline',
  size = 'large',
  width = 280,
  redirectTo = '/',
}: GoogleSignInButtonProps) {
  const router = useRouter();
  const { googleAuth, isLoading, error } = useGoogleAuth();
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleCredentialResponse = useCallback(
    async (response: any) => {
      try {
        setAuthError(null);
        const result = await googleAuth({ idToken: response.credential });

        // Check if user has customer role - only customers can use the storefront
        if (result?.user?.role && result.user.role !== 'customer') {
          setAuthError('Access denied. Only customer accounts can access the storefront.');
          onError?.(new Error('Access denied. Only customer accounts can access the storefront.'));
          return;
        }

        onSuccess?.();
        router.push(redirectTo);
      } catch (err: any) {
        console.error('Google auth error:', err);
        setAuthError(err.message || 'Google authentication failed');
        onError?.(err);
      }
    },
    [googleAuth, onSuccess, onError, router, redirectTo]
  );

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    if (!clientId) {
      return;
    }

    // Load Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setIsScriptLoaded(true);
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup script on unmount
      const existingScript = document.querySelector(
        'script[src="https://accounts.google.com/gsi/client"]'
      );
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    if (!isScriptLoaded || !clientId || !window.google) {
      return;
    }

    // Initialize Google Identity Services
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: handleCredentialResponse,
      auto_select: false,
      cancel_on_tap_outside: true,
    });

    // Render the button
    const buttonElement = document.getElementById('google-signin-button');
    if (buttonElement) {
      window.google.accounts.id.renderButton(buttonElement, {
        type: 'standard',
        theme,
        size,
        text,
        width,
        logo_alignment: 'left',
      });
    }
  }, [isScriptLoaded, handleCredentialResponse, text, theme, size, width]);

  if (error || authError) {
    return (
      <div className="text-red-600 text-sm text-center p-3 bg-red-50 rounded-lg border border-red-200">
        {authError || 'Google sign-in failed. Please try again.'}
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center">
      {isLoading ? (
        <div className="flex items-center justify-center h-10 w-full">
          <span className="loading loading-spinner loading-sm"></span>
          <span className="ml-2 text-sm">Signing in with Google...</span>
        </div>
      ) : (
        <div id="google-signin-button" className="flex justify-center"></div>
      )}
    </div>
  );
}
