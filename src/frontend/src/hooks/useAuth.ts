import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';

export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity, isInitializing } = useInternetIdentity();

  return useQuery<boolean>({
    queryKey: ['isAdmin', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return false;
      try {
        const result = await actor.isCallerAdmin();
        return result;
      } catch (error) {
        console.error('Error checking admin status:', error);
        // If there's an error, return false instead of throwing
        return false;
      }
    },
    // Wait for both actor and identity to be ready
    enabled: !!actor && !!identity && !actorFetching && !isInitializing,
    retry: 1,
    retryDelay: 1000,
    // Keep the data fresh
    staleTime: 30000, // 30 seconds
  });
}
