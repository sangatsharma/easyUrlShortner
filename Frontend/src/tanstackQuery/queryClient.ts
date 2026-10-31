import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // Retry failed queries once
      staleTime: 5 * 60 * 1000, // Data remains fresh for 5 minutes
      refetchOnWindowFocus: false, // Avoid refetching when tab regains focus
    },
  },
});

export default queryClient;
