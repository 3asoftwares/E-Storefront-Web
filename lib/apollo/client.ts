import { ApolloClient, InMemoryCache, HttpLink, from, ApolloLink } from '@apollo/client';
import { getAccessToken } from '@3asoftwares/utils/client';

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql';

const httpLink = new HttpLink({
  uri: GRAPHQL_ENDPOINT,
  credentials: 'include',
});

const authLink = new ApolloLink((operation, forward) => {
  const token = typeof window !== 'undefined' ? getAccessToken() : null;

  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      ...(token && { authorization: `Bearer ${token}` }),
    },
  }));

  return forward(operation);
});

export const apolloClient = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          products: {
            keyArgs: [
              'search',
              'category',
              'minPrice',
              'maxPrice',
              'page',
              'limit',
              'sortBy',
              'sortOrder',
              'featured',
              'includeInactive',
            ],
            merge(existing, incoming, { args }) {
              if (!args?.page || args.page === 1) {
                return incoming;
              }
              return {
                ...incoming,
                products: [...(existing?.products || []), ...(incoming?.products || [])],
              };
            },
          },
          orders: {
            keyArgs: false,
            merge(incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});

export const resetApolloStore = async () => {
  await apolloClient.clearStore();
};
