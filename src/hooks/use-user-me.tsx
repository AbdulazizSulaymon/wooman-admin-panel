import { useApi } from '@src/api';
import { useQuery } from '@tanstack/react-query';
import { useLocalStorageState } from 'ahooks';
import { useEffect } from 'react';

export const useUserMe = () => {
  const api = useApi();

  const [userData, setUserData] = useLocalStorageState<Record<string, any>>('use-user-me', {
    defaultValue: {},
  });

  const { data, isLoading, isError } = useQuery(['user-me'], () => api.instance.get('Users/me'), {
    enabled: !Object.values(userData || {}).length,
  });

  useEffect(() => {
    if (data?.data) {
      const permissions: Record<string, object> = {};

      data?.data?.roles.map((role: Record<string, any>) =>
        role?.permissions.map((p: Record<string, any>) => {
          permissions[p?.name] = p;
        }),
      );

      setUserData({ ...data?.data, permissions });
    }
  }, [data?.data]);

  return userData;
};
