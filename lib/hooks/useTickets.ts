import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apolloClient } from '../apollo/client';
import { GQL_QUERIES } from '../apollo/queries/queries';
import { getAccessToken } from '@3asoftwares/utils/client';

export interface Ticket {
  id: string;
  ticketId: string;
  subject: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  customerName: string;
  customerEmail: string;
  customerId?: string;
  assignedTo?: string;
  assignedToName?: string;
  resolution?: string;
  attachments?: string[];
  comments?: TicketComment[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  closedAt?: string;
}

export interface TicketComment {
  userId: string;
  userName: string;
  userRole: string;
  message: string;
  isInternal: boolean;
  createdAt: string;
}

export interface TicketPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface TicketsResponse {
  myTickets: {
    tickets: Ticket[];
    pagination: TicketPagination;
  };
}

export interface TicketResponse {
  ticket: Ticket;
}

export interface CreateTicketInput {
  subject: string;
  description: string;
  category: string;
  priority?: string;
  customerName: string;
  customerEmail: string;
  customerId?: string;
  attachments?: string[];
}

export interface CreateTicketResponse {
  createTicket: Ticket;
}

export interface AddTicketCommentInput {
  ticketId: string;
  message: string;
  isInternal?: boolean;
}

export interface AddTicketCommentResponse {
  addTicketComment: Ticket;
}

export function useMyTickets(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: ['myTickets', page, limit],
    queryFn: async () => {
      const { data } = await apolloClient.query<TicketsResponse>({
        query: GQL_QUERIES.GET_MY_TICKETS_QUERY,
        variables: { page, limit },
        fetchPolicy: 'network-only',
      });

      return data.myTickets;
    },
    enabled: !!getAccessToken(),
    staleTime: 1000 * 30,
  });
}

export function useTicket(id: string) {
  return useQuery({
    queryKey: ['ticket', id],
    queryFn: async () => {
      const { data } = await apolloClient.query<TicketResponse>({
        query: GQL_QUERIES.GET_TICKET_QUERY,
        variables: { id },
        fetchPolicy: 'cache-first',
      });

      return data.ticket;
    },
    enabled: !!id && !!getAccessToken(),
    staleTime: 1000 * 60,
  });
}

export function useCreateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateTicketInput) => {
      const { data } = await apolloClient.mutate<CreateTicketResponse>({
        mutation: GQL_QUERIES.CREATE_TICKET_MUTATION,
        variables: { input },
      });

      if (!data?.createTicket) {
        throw new Error('Failed to create ticket');
      }

      return data.createTicket;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myTickets'] });
    },
  });
}

export function useAddTicketComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: AddTicketCommentInput) => {
      const { data } = await apolloClient.mutate<AddTicketCommentResponse>({
        mutation: GQL_QUERIES.ADD_TICKET_COMMENT_MUTATION,
        variables: { input },
      });

      if (!data?.addTicketComment) {
        throw new Error('Failed to add comment');
      }

      return data.addTicketComment;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ticket', variables.ticketId] });
      queryClient.invalidateQueries({ queryKey: ['myTickets'] });
    },
  });
}
