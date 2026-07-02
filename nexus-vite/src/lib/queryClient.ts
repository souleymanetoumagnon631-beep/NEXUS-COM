import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes before data is considered stale
            retry: 1,                 // Retry failed requests once
            refetchOnWindowFocus: false, // Don't refetch when switching tabs for this specific MVP
        },
    },
});
