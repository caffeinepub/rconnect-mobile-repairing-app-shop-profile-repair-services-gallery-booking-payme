import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Booking, MakeBookingRequest, BookingStatus } from '@/backend';

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
      queryClient.invalidateQueries({ queryKey: ['bookings-public'] });
    },
  });
}

export function useGetAllBookings() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Booking[]>({
    queryKey: ['bookings'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllBookings();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useUpdateBookingStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bookingId, newStatus }: { bookingId: bigint; newStatus: BookingStatus }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateBookingStatus(bookingId, newStatus);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['bookings-public'] });
    },
  });
}

// Public booking hooks (no authentication required)
export function useGetAllBookingsPublic() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Booking[]>({
    queryKey: ['bookings-public'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllBookingsPublic();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetBookingPublic(bookingId: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Booking | null>({
    queryKey: ['booking-public', bookingId?.toString()],
    queryFn: async () => {
      if (!actor || !bookingId) return null;
      return actor.getBookingPublic(bookingId);
    },
    enabled: !!actor && !actorFetching && bookingId !== null,
  });
}
