import { LeftOutlined, LoadingOutlined } from '@ant-design/icons';
import AdminLayout from '@components/admin-layout';
import { AutoForm } from '@components/form/auto-form';
import { numericColumn } from '@components/table/components';
import Table from '@components/table/table';
import { useCrudModal } from '@hooks/use-crud-modal';
import { useRouterPush } from '@hooks/use-router-push';
import { useApi } from '@src/api';
import { usePositions } from '@src/queries';
import { useRouterStore } from '@src/stores/router-store';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Form, Input, Modal, Spin } from 'antd';
import { FormInstance, Rule } from 'antd/es/form';
import dayjs from 'dayjs';
import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';

export default observer(function Home() {
  const push = useRouterPush();
  const api = useApi();
  const queryClient = useQueryClient();

  const columns = useMemo(
    () => [
      numericColumn(),
      {
        title: `Name`,
        dataIndex: 'name',
        key: 'name',
        type: 'string',
      },
      {
        title: `Description`,
        dataIndex: 'description',
        key: 'description',
        type: 'string',
      },
    ],
    [],
  );

  const { data, isLoading, isError } = usePositions();

  const addCallback = useCallback(() => push({ add: true }), []);
  const editCallback = useCallback((data: Record<string, any>) => push({ edit: true, id: data.id }), []);

  const { mutate: remove, isLoading: isLoadingRemove } = useMutation(
    ['delete-position'],
    (data: Record<string, any>) => api.apis.CustomerPositions.delete(undefined, data.id),
    {
      onSuccess: () => {
        toast.success('Deleted successfully!');
        queryClient.invalidateQueries({ queryKey: ['positions'] });
      },
      onError: () => toast.error('An error occurred!'),
    },
  );

  return (
    <AdminLayout>
      <ItemModal />
      <Table
        dataSource={data?.data}
        columns={columns}
        // getData={getData}
        // update={updateAsync}
        // create={createAsync}
        // remove={removeAsync}
        size={'small'}
        loading={isLoading}
        error={isError}
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

const ItemModal = observer(() => {
  const push = useRouterPush();
  const { query, url } = useRouterStore();
  const [form] = Form.useForm();
  const api = useApi();
  const queryClient = useQueryClient();

  const { isLoadingPost, isLoadingUpdate, isLoadingOne, post, update, dataById } = useCrudModal({
    name: 'positions',
    model: api.apis.CustomerPositions,
  });

  const onCancel = () => {
    form.resetFields();
    queryClient.invalidateQueries({ queryKey: ['positions', query.id] });
    push({});
  };

  const onFinish = (values: any) => {
    if (query.add) post(values);
    else if (query.edit) {
      update({ ...values, id: dataById?.data.id }, dataById?.data.id);
    }
  };

  useEffect(() => {
    if (query.edit && dataById?.data) form.setFieldsValue(dataById?.data);
  }, [dataById?.data]);

  const fields = useMemo(
    () => [
      { label: 'Name', name: 'name', rules: [{ required: true, message: 'Please input name!' }] },
      { label: 'Description', name: 'description' },
    ],
    [],
  );

  return (
    <Modal
      title={`${query.add ? 'Add' : 'Edit'} position`}
      open={query.add || query.edit}
      onCancel={onCancel}
      footer={[]}
    >
      {isLoadingOne && <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin rev={undefined} />} />}
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
