import { useRouterQuery } from '@hooks/use-router-query';
import { useStore } from '@src/stores/stores';
import { useEffect } from 'react';

export const useWatchRouter = () => {
  const store = useStore();
  const queries = useRouterQuery();

  useEffect(() => {
    store.routerStore.setQuery(queries[0]);
    store.routerStore.setUrl(queries[1]);
  }, [queries]);
};
