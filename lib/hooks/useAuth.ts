

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { apolloClient } from '../apollo/client';
import { GQL_QUERIES } from '../apollo/queries/queries';
import type { UserGraphQL } from '@3asoftwares/types';
import type {
  LoginInput,
  RegisterInput,
  LoginResponse,
  RegisterResponse,
  MeResponse,
} from '@3asoftwares/types';
import { storeAuth, clearAuth as clearAuthCookies, getAccessToken } from '@3asoftwares/utils/client';

// Helper function to extract error message from GraphQL errors
const extractErrorMessage = (error: any, fallback: string): string => {
  if (!error) return fallback;
  return (
    error?.graphQLErrors?.[0]?.message ||
    error?.networkError?.result?.errors?.[0]?.message ||
    error?.message ||
    fallback
  );
};

// Helper function to handle GraphQL mutation with proper error handling
const handleMutation = async <TData, TResult>(
  mutationFn: () => Promise<{ data?: TData | null; errors?: readonly any[] }>,
  extractResult: (data: TData) => TResult | undefined,
  fallbackError: string
): Promise<TResult> => {
  try {
    const { data, errors } = await mutationFn();

    if (errors?.length) {
      throw new Error(errors[0].message);
    }

    const result = data ? extractResult(data) : undefined;
    if (!result) {
      throw new Error(fallbackError);
    }

    return result;
  } catch (error: any) {
    throw new Error(extractErrorMessage(error, fallbackError));
  }
};

export function useLogin() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (input: LoginInput) =>
      handleMutation(
        () => apolloClient.mutate<LoginResponse>({
          mutation: GQL_QUERIES.LOGIN_MUTATION,
          variables: { input },
          errorPolicy: 'all',
        }),
        (data) => data.login,
        'Login failed'
      ),
    onSuccess: (data) => {
      if (typeof window !== 'undefined') {
        storeAuth({
          user: data.user,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        });
      }

      queryClient.invalidateQueries({ queryKey: ['me'] });
      queryClient.setQueryData(['me'], data.user);
    },
  });

  return {
    login: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}

export function useRegister() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (input: RegisterInput) =>
      handleMutation(
        () => apolloClient.mutate<RegisterResponse>({
          mutation: GQL_QUERIES.REGISTER_MUTATION,
          variables: { input },
          errorPolicy: 'all',
        }),
        (data) => data.register,
        'Registration failed'
      ),
    onSuccess: (data) => {
      if (typeof window !== 'undefined') {
        storeAuth({
          user: data.user,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        });
      }

      queryClient.invalidateQueries({ queryKey: ['me'] });
      queryClient.setQueryData(['me'], data.user);
    },
  });

  return {
    register: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}

interface GoogleAuthInput {
  idToken: string;
}

interface GoogleAuthResponse {
  googleAuth: {
    user: UserGraphQL;
    accessToken: string;
    refreshToken: string;
  };
}

export function useGoogleAuth() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (input: GoogleAuthInput) =>
      handleMutation(
        () => apolloClient.mutate<GoogleAuthResponse>({
          mutation: GQL_QUERIES.GOOGLE_AUTH_MUTATION,
          variables: { input },
          errorPolicy: 'all',
        }),
        (data) => data.googleAuth,
        'Google authentication failed'
      ),
    onSuccess: (data) => {
      if (typeof window !== 'undefined') {
        storeAuth({
          user: data.user,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        });
      }

      queryClient.invalidateQueries({ queryKey: ['me'] });
      queryClient.setQueryData(['me'], data.user);
    },
  });

  return {
    googleAuth: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () =>
      handleMutation(
        () => apolloClient.mutate({
          mutation: GQL_QUERIES.LOGOUT_MUTATION,
          errorPolicy: 'all',
        }),
        () => true,
        'Logout failed'
      ),
    onSuccess: () => {
      if (typeof window !== 'undefined') {
        clearAuthCookies();
      }

      apolloClient.clearStore();
      queryClient.clear();

      router.push('/login');
    },
  });

  return {
    logout: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}

export function useCurrentUser() {
  return useQuery<UserGraphQL | null>({
    queryKey: ['me'],
    queryFn: async () => {
      try {
        if (typeof window !== 'undefined') {
          const token = getAccessToken();
          if (!token) {
            return null;
          }
        }

        const { data } = await apolloClient.query<MeResponse>({
          query: GQL_QUERIES.GET_ME_QUERY,
          fetchPolicy: 'network-only',
        });

        return data.me;
      } catch (error) {
        return null;
      }
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}

export function useIsAuthenticated() {
  const { data: user, isLoading } = useCurrentUser();
  return {
    isAuthenticated: !!user,
    isLoading,
    user,
  };
}
