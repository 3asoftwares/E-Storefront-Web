// Since the Apollo client module initializes httpLink which requires fetch,
// we need to test it using a module-level mock approach

describe('Apollo Client Module', () => {
  let originalFetch: typeof global.fetch;

  beforeAll(() => {
    // Store original fetch
    originalFetch = global.fetch;
    // Mock fetch
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: {} }),
    });
  });

  afterAll(() => {
    // Restore original fetch
    global.fetch = originalFetch;
  });

  beforeEach(() => {
    // Clear module cache to allow fresh imports
    jest.resetModules();
  });

  it('should export apolloClient', async () => {
    const { apolloClient } = await import('@/lib/apollo/client');
    expect(apolloClient).toBeDefined();
  });

  it('should export resetApolloStore function', async () => {
    const { resetApolloStore } = await import('@/lib/apollo/client');
    expect(resetApolloStore).toBeDefined();
    expect(typeof resetApolloStore).toBe('function');
  });

  it('should have query method on apolloClient', async () => {
    const { apolloClient } = await import('@/lib/apollo/client');
    expect(apolloClient.query).toBeDefined();
    expect(typeof apolloClient.query).toBe('function');
  });

  it('should have mutate method on apolloClient', async () => {
    const { apolloClient } = await import('@/lib/apollo/client');
    expect(apolloClient.mutate).toBeDefined();
    expect(typeof apolloClient.mutate).toBe('function');
  });

  it('should have cache property', async () => {
    const { apolloClient } = await import('@/lib/apollo/client');
    expect(apolloClient.cache).toBeDefined();
  });

  it('should have clearStore method', async () => {
    const { apolloClient } = await import('@/lib/apollo/client');
    expect(apolloClient.clearStore).toBeDefined();
    expect(typeof apolloClient.clearStore).toBe('function');
  });

  it('should clear store when resetApolloStore is called', async () => {
    const { apolloClient, resetApolloStore } = await import('@/lib/apollo/client');
    const clearStoreSpy = jest.spyOn(apolloClient, 'clearStore');

    await resetApolloStore();

    expect(clearStoreSpy).toHaveBeenCalled();
    clearStoreSpy.mockRestore();
  });
});
