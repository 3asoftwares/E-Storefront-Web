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

  const handleCredentialResponse = useCallback(
    async (response: any) => {
      try {
        await googleAuth({ idToken: response.credential });
        onSuccess?.();
        router.push(redirectTo);
      } catch (err: any) {
        console.error('Google auth error:', err);
        onError?.(err);
      }
    },
    [googleAuth, onSuccess, onError, router, redirectTo]
  );

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    if (!clientId) {
      console.warn('Google Client ID not configured');
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

  if (error) {
    return (
      <div className="text-error text-sm text-center">Google sign-in failed. Please try again.</div>
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
