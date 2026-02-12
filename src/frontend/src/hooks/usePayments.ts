import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useGetAllPaymentInstructions() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Array<[bigint, string]>>({
    queryKey: ['paymentInstructions'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPaymentInstructions();
    },
    enabled: !!actor && !actorFetching,
  });
}
