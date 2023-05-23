import { useRouterStore } from '@src/stores/router-store';
import { ApiFunctions } from '@src/utils/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export const useCrudModal = ({ name, model, getOne }: { name: string; model: ApiFunctions; getOne?: () => any }) => {
  const { query, url } = useRouterStore();
  const queryClient = useQueryClient();

  const { mutate: post, isLoading: isLoadingPost } = useMutation(
    [`post-${name}`],
    (data: Record<string, any>) => model.post(data),
    {
      onSuccess: () => {
        toast.success('Added successfully!');
        queryClient.invalidateQueries({ queryKey: [name] });
      },
      onError: (error) => {
        // @ts-ignore
        toast.error((typeof error?.response?.data === 'string' && error?.response?.data) || 'An error occurred!');
      },
    },
  );

  const { mutate: update, isLoading: isLoadingUpdate } = useMutation(
    [`put-${name}`],
    (values?: Record<string, unknown>, id?: string | number) => {
      return model.put(values, values?.id as number);
    },
    {
      onSuccess: () => {
        toast.success('Changed successfully!');
        queryClient.invalidateQueries({ queryKey: [name] });
        queryClient.invalidateQueries({ queryKey: [name, query.id] });
      },
      onError: () => toast.error('An error occurred!'),
    },
  );

  const {
    data: dataById,
    isLoading: isLoadingOne,
    isError,
  } = useQuery([name, query.id], getOne ? getOne : () => model.getOne(undefined, query.id), {
    enabled: !!query.id,
  });

  return { isLoadingPost, isLoadingUpdate, isLoadingOne: isLoadingOne && !!query.id, post, update, dataById };
};
