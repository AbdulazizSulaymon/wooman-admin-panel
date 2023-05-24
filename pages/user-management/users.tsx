import { LoadingOutlined } from '@ant-design/icons';
import AdminLayout from '@components/admin-layout';
import { AutoForm, SelectMode } from '@components/form/auto-form';
import { SpinLoading } from '@components/loading';
import { numericColumn } from '@components/table/components';
import Table from '@components/table/table';
import { join } from '@fireflysemantics/join';
import { useCrudModal } from '@hooks/use-crud-modal';
import { useRouterPush } from '@hooks/use-router-push';
import { useApi } from '@src/api';
import { useRoles } from '@src/queries';
import { useRouterStore } from '@src/stores/router-store';
import { useStore } from '@src/stores/stores';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Form, Input, Modal, Select, Spin } from 'antd';
import dayjs from 'dayjs';
import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';

const { Option } = Select;

export default observer(function Home() {
  const push = useRouterPush();
  const api = useApi();
  const queryClient = useQueryClient();

  const columns = useMemo(
    () => [
      numericColumn(),
      // {
      //   title: 'Rasm',
      //   dataIndex: 'photo',
      //   key: 'photo',
      //   render: (src: string, item: any) => (
      //     <div className={'flex items-center'}>
      //       <img src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${src}`} className={'h-10 object-cover rounded shadow'} />
      //     </div>
      //   ),
      //   editable: true,
      // },
      {
        title: `Name`,
        dataIndex: 'name',
        key: 'name',
        type: 'string',
        // render: (firstName: string, record: Record<string, any>) =>
        //   `${record?.firstName || ''} ${record?.lastName || ''}`,
      },
      {
        title: `Lastname`,
        dataIndex: 'lastName',
        key: 'lastName',
        type: 'string',
      },
      {
        title: `Login`,
        dataIndex: 'login',
        key: 'login',
        type: 'string',
      },
      {
        title: `Email`,
        dataIndex: 'email',
        key: 'email',
        type: 'string',
      },

      {
        title: `Phone`,
        dataIndex: 'phone',
        key: 'phone',
        type: 'string',
      },
      {
        title: `Created at`,
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (date: string) => dayjs(date).format('DD.MM.YY'),
      },
    ],
    [],
  );

  const { data, isLoading, isError } = useQuery(['users'], () => api.apis.User.findMany(), {});

  const addCallback = useCallback(() => push({ add: true }), []);
  const editCallback = useCallback((data: Record<string, any>) => push({ edit: true, id: data.id }), []);

  const { mutate: remove, isLoading: isLoadingRemove } = useMutation(
    ['delete-user'],
    (data: Record<string, any>) => api.apis.User.deleteOne({ id: data.id }),
    {
      onSuccess: () => {
        toast.success('Deleted successfully!');
        queryClient.invalidateQueries({ queryKey: ['users'] });
      },
      onError: () => toast.error('An error occurred!'),
    },
  );

  return (
    <AdminLayout>
      <UserModal />
      <Table
        dataSource={data?.data}
        columns={columns}
        // getData={getData}
        // update={updateAsync}
        // create={createAsync}
        // remove={removeAsync}
        size={'small'}
        loading={isLoading}
        // total={get(data, 'data.totalCount', 0)}
        total={data?.data.length}
        // add={add}
        addCallback={addCallback}
        editCallback={editCallback}
        removeCallback={remove}
        // operations={operations}
      />
    </AdminLayout>
  );
});

const UserModal = observer(() => {
  const push = useRouterPush();
  const { query, url } = useRouterStore();
  const [form] = Form.useForm();
  const api = useApi();
  const queryClient = useQueryClient();

  const { isLoadingPost, isLoadingUpdate, isLoadingOne, post, update, dataById } = useCrudModal({
    name: 'users',
    model: api.apis.User,
    getOne: () => api.instance.get(join('Roles/users/', query.id)),
  });

  const onCancel = () => {
    form.resetFields();
    queryClient.invalidateQueries({ queryKey: ['users', query.id] });
    push({});
  };
  const onFinish = (values: any) => {
    if (query.add) post(values);
    else if (query.edit) {
      update({ ...values, id: dataById?.data.id }, dataById?.data.id);
    }
  };

  const { data: roles, isLoading: isLoadingRoles } = useRoles();

  useEffect(() => {
    if (query.edit && dataById?.data) form.setFieldsValue(dataById?.data);
  }, [dataById?.data]);

  const fields = useMemo(
    () => [
      { label: 'Name', name: 'name', rules: [{ required: true, message: 'Please input name!' }] },
      { label: 'Lastname', name: 'surname', rules: [{ required: true, message: 'Please input lastname!' }] },
      { label: 'Login', name: 'username', rules: [{ required: true, message: 'Please input login!' }] },
      {
        label: 'Password',
        name: 'password',
        type: 'password',
        rules: [{ required: true, message: 'Please input password!' }],
      },
      { label: 'Email', name: 'email', rules: [{ required: true, message: 'Please input email!' }] },
      { label: 'Phone', name: 'phoneNumber' },
      {
        label: 'Role',
        name: 'role',
        rules: [{ required: true }],
        options: roles?.data.map((item: Record<string, any>) => ({ label: item.name, value: item.id })),
        mode: 'multiple' as SelectMode,
      },
    ],
    [roles?.data],
  );

  return (
    <Modal title={`${query.add ? 'Add' : 'Edit'} user`} open={query.add || query.edit} onCancel={onCancel} footer={[]}>
      {(isLoadingOne || isLoadingRoles) && <SpinLoading />}
      <AutoForm
        form={form}
        fields={fields}
        onCancel={onCancel}
        onFinish={onFinish}
        isSaveLoading={isLoadingPost || isLoadingUpdate}
      />
    </Modal>
  );
});
