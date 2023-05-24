import { join } from '@fireflysemantics/join';
import { useApi } from '@src/api';
import { useQuery } from '@tanstack/react-query';

export const useRoles = () => {
  const api = useApi();
  return useQuery(['roles'], () => api.apis.Role.findMany(), {});
};
