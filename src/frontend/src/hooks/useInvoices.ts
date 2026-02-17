import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Invoice } from '../backend';

// Admin hooks
export function useCreateInvoice() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bookingId, amount, description }: { bookingId: bigint; amount: string; description: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createInvoice(bookingId, amount, description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: (error) => {
      console.error('Create invoice mutation error:', error);
    },
  });
}

export function useGetAllInvoices() {
  const { actor, isFetching } = useActor();

  return useQuery<Invoice[]>({
    queryKey: ['invoices', 'admin'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllInvoices();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetInvoice(invoiceId: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Invoice | null>({
    queryKey: ['invoices', 'admin', invoiceId?.toString()],
    queryFn: async () => {
      if (!actor || !invoiceId) return null;
      return actor.getInvoice(invoiceId);
    },
    enabled: !!actor && !isFetching && invoiceId !== null,
  });
}

export function useMarkInvoiceAsPaid() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (invoiceId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.markInvoiceAsPaid(invoiceId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
    onError: (error) => {
      console.error('Mark invoice as paid mutation error:', error);
    },
  });
}

// Public hook
export function useGetInvoicePublic(invoiceId: bigint | null, accessCode: string | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Invoice | null>({
    queryKey: ['invoices', 'public', invoiceId?.toString(), accessCode],
    queryFn: async () => {
      if (!actor || !invoiceId || !accessCode) return null;
      return actor.getInvoicePublic(invoiceId, accessCode);
    },
    enabled: !!actor && !isFetching && invoiceId !== null && accessCode !== null,
    retry: false,
  });
}
