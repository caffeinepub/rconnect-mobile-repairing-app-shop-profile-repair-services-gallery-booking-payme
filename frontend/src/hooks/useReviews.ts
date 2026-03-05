import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Review } from '../backend';

export function useGetAllReviews() {
  const { actor, isFetching } = useActor();

  return useQuery<Review[]>({
    queryKey: ['reviews'],
    queryFn: async () => {
      if (!actor) return [];
      const reviews = await actor.getAllReviews();
      // Sort by newest first
      return reviews.sort((a, b) => {
        if (a.timeStamp > b.timeStamp) return -1;
        if (a.timeStamp < b.timeStamp) return 1;
        return 0;
      });
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitReview() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ author, reviewText }: { author: string; reviewText: string }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.submitReview(author, reviewText);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}
