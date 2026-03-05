import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { MakeBookingRequest, Booking, BookingStatus } from '@/backend';

export function useCreateBooking() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: MakeBookingRequest) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createBooking(request);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}

export function useGetAllBookings() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Booking[]>({
    queryKey: ['bookings', 'all'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllBookings();
    },
    enabled: !!actor && !actorFetching,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

export function useUpdateBookingStatus() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bookingId, status }: { bookingId: bigint; status: BookingStatus }) => {
      if (!actor) throw new Error('Actor not available');
      if (!identity) throw new Error('Authentication required');
      return actor.updateBookingStatus(bookingId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}

export function useTrackBooking() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ bookingId, phoneNumber }: { bookingId: bigint; phoneNumber: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.trackBooking(bookingId, phoneNumber);
    },
  });
}

export function useCustomerBookings(phoneNumber: string | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Booking[]>({
    queryKey: ['customerBookings', phoneNumber],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      if (!phoneNumber) throw new Error('Phone number required');
      const bookings = await actor.getBookingsByPhoneNumber(phoneNumber);
      // Sort by timestamp descending (newest first)
      return bookings.sort((a, b) => {
        if (a.timestamp > b.timestamp) return -1;
        if (a.timestamp < b.timestamp) return 1;
        return 0;
      });
    },
    enabled: !!actor && !actorFetching && !!phoneNumber,
    retry: 1,
  });
}
