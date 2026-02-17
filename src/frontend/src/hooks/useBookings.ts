import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Booking, MakeBookingRequest, BookingStatus } from '../backend';

// Admin hooks (require authentication)
export function useGetAllBookings() {
  const { actor, isFetching } = useActor();

  return useQuery<Booking[]>({
    queryKey: ['bookings', 'admin'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBookings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateBooking() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: MakeBookingRequest) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createBooking(request);
    },
    onSuccess: () => {
      // Invalidate both admin and public booking caches
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: (error) => {
      console.error('Create booking mutation error:', error);
      // Error is surfaced to UI via mutation.isError
    },
  });
}

export function useUpdateBookingStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bookingId, status }: { bookingId: bigint; status: BookingStatus }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateBookingStatus(bookingId, status);
    },
    onSuccess: () => {
      // Invalidate both admin and public booking caches
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: (error) => {
      console.error('Update booking status mutation error:', error);
    },
  });
}

// Public hooks (no authentication required)
export function useGetAllBookingsPublic() {
  const { actor, isFetching } = useActor();

  return useQuery<Booking[]>({
    queryKey: ['bookings', 'public'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBookingsPublic();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetBookingPublic(bookingId: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Booking | null>({
    queryKey: ['bookings', 'public', bookingId?.toString()],
    queryFn: async () => {
      if (!actor || !bookingId) return null;
      return actor.getBookingPublic(bookingId);
    },
    enabled: !!actor && !isFetching && bookingId !== null,
  });
}
