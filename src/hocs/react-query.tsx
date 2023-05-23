import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export const ReactQueryProvider = (Component: React.ReactNode) => {
  const router = useRouter();

  const [queryClient, setQueryClient] = useState<QueryClient | null>(null);

  useEffect(() => {
    if (!queryClient)
      setQueryClient(
        new QueryClient({
          defaultOptions: {
            queries: {
              staleTime: 0,
              refetchOnWindowFocus: false,
              retry: false,
            },
          },
          queryCache: new QueryCache({
            onError: async (error, query) => {
              // How to get status code fo error
              console.log({ error });
              // @ts-ignore
              if (error?.request?.status === 401) {
                router.push('/login');
                toast.warn('Token has expired. Please login again!');
                // document.location.replace('/login');
                // queryClient.refetchQueries(query.queryKey);
              }
            },
          }),
        }),
      );
  }, [queryClient, router.pathname]);

  return (
    (queryClient && (
      <QueryClientProvider client={queryClient}>
        {/*<ReactQueryCacheProvider queryCache={queryCache}>*/}
        {Component}
        <ReactQueryDevtools initialIsOpen={false} />
        {/*</ReactQueryCacheProvider>*/}
      </QueryClientProvider>
    )) ||
    null
  );
};
