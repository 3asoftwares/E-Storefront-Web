import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// Mock apollo client
jest.mock('@/lib/apollo/client', () => ({
  apolloClient: {
    mutate: jest.fn(),
    query: jest.fn(),
  },
}));

// Mock GQL_QUERIES
jest.mock('@/lib/apollo/queries/queries', () => ({
  GQL_QUERIES: {
    GET_MY_TICKETS_QUERY: 'GET_MY_TICKETS_QUERY',
    GET_TICKET_QUERY: 'GET_TICKET_QUERY',
    CREATE_TICKET_MUTATION: 'CREATE_TICKET_MUTATION',
    ADD_TICKET_COMMENT_MUTATION: 'ADD_TICKET_COMMENT_MUTATION',
  },
}));

// Mock getAccessToken
jest.mock('@3asoftwares/utils/client', () => ({
  getAccessToken: jest.fn(() => 'mock-token'),
}));

// Import after mocking
import {
  useMyTickets,
  useTicket,
  useCreateTicket,
  useAddTicketComment,
} from '@/lib/hooks/useTickets';

const mockApolloClient = jest.requireMock('@/lib/apollo/client').apolloClient;
const mockGetAccessToken = jest.requireMock('@3asoftwares/utils/client').getAccessToken;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useTickets hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetAccessToken.mockReturnValue('mock-token');
  });

  describe('useMyTickets', () => {
    it('should fetch tickets successfully', async () => {
      const mockTickets = {
        tickets: [
          {
            id: '1',
            ticketId: 'TKT-001',
            subject: 'Test Ticket',
            description: 'Test description',
            category: 'general',
            priority: 'medium',
            status: 'open',
            customerName: 'John Doe',
            customerEmail: 'john@example.com',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
          },
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          pages: 1,
        },
      };

      mockApolloClient.query.mockResolvedValue({
        data: { myTickets: mockTickets },
      });

      const { result } = renderHook(() => useMyTickets(1, 10, true), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockApolloClient.query).toHaveBeenCalled();
      expect(result.current.data).toEqual(mockTickets);
    });

    it('should not fetch when disabled', async () => {
      const { result } = renderHook(() => useMyTickets(1, 10, false), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(false);
      expect(mockApolloClient.query).not.toHaveBeenCalled();
    });

    it('should not fetch when no access token', async () => {
      mockGetAccessToken.mockReturnValue(null);

      const { result } = renderHook(() => useMyTickets(1, 10, true), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(false);
      expect(mockApolloClient.query).not.toHaveBeenCalled();
    });
  });

  describe('useTicket', () => {
    it('should fetch a single ticket', async () => {
      const mockTicket = {
        id: '1',
        ticketId: 'TKT-001',
        subject: 'Test Ticket',
        description: 'Test description',
        category: 'general',
        priority: 'medium',
        status: 'open',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      mockApolloClient.query.mockResolvedValue({
        data: { ticket: mockTicket },
      });

      const { result } = renderHook(() => useTicket('1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockApolloClient.query).toHaveBeenCalled();
      expect(result.current.data).toEqual(mockTicket);
    });

    it('should not fetch when no id provided', async () => {
      const { result } = renderHook(() => useTicket(''), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(false);
      expect(mockApolloClient.query).not.toHaveBeenCalled();
    });
  });

  describe('useCreateTicket', () => {
    it('should create a ticket successfully', async () => {
      const mockCreatedTicket = {
        id: '1',
        ticketId: 'TKT-001',
        subject: 'New Ticket',
        description: 'New ticket description',
        category: 'general',
        priority: 'medium',
        status: 'open',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      mockApolloClient.mutate.mockResolvedValue({
        data: { createTicket: mockCreatedTicket },
      });

      const { result } = renderHook(() => useCreateTicket(), {
        wrapper: createWrapper(),
      });

      const response = await result.current.mutateAsync({
        subject: 'New Ticket',
        description: 'New ticket description',
        category: 'general',
        priority: 'medium',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
      });

      expect(mockApolloClient.mutate).toHaveBeenCalled();
      expect(response).toEqual(mockCreatedTicket);
    });

    it('should throw error when creation fails', async () => {
      mockApolloClient.mutate.mockResolvedValue({
        data: { createTicket: null },
      });

      const { result } = renderHook(() => useCreateTicket(), {
        wrapper: createWrapper(),
      });

      await expect(
        result.current.mutateAsync({
          subject: 'New Ticket',
          description: 'New ticket description',
          category: 'general',
          customerName: 'John Doe',
          customerEmail: 'john@example.com',
        })
      ).rejects.toThrow('Failed to create ticket');
    });
  });

  describe('useAddTicketComment', () => {
    it('should add a comment to a ticket', async () => {
      const mockUpdatedTicket = {
        id: '1',
        ticketId: 'TKT-001',
        subject: 'Test Ticket',
        comments: [
          {
            userId: 'user-1',
            userName: 'John Doe',
            userRole: 'customer',
            message: 'New comment',
            isInternal: false,
            createdAt: '2024-01-01T00:00:00Z',
          },
        ],
      };

      mockApolloClient.mutate.mockResolvedValue({
        data: { addTicketComment: mockUpdatedTicket },
      });

      const { result } = renderHook(() => useAddTicketComment(), {
        wrapper: createWrapper(),
      });

      const response = await result.current.mutateAsync({
        ticketId: '1',
        message: 'New comment',
        isInternal: false,
      });

      expect(mockApolloClient.mutate).toHaveBeenCalled();
      expect(response).toEqual(mockUpdatedTicket);
    });

    it('should throw error when adding comment fails', async () => {
      mockApolloClient.mutate.mockResolvedValue({
        data: { addTicketComment: null },
      });

      const { result } = renderHook(() => useAddTicketComment(), {
        wrapper: createWrapper(),
      });

      await expect(
        result.current.mutateAsync({
          ticketId: '1',
          message: 'New comment',
        })
      ).rejects.toThrow('Failed to add comment');
    });
  });
});
