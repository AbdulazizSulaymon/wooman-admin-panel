import { LoadingOutlined } from '@ant-design/icons';
import AdminLayout from '@components/admin-layout';
import { AutoForm } from '@components/form/auto-form';
import { SpinLoading } from '@components/loading';
import { numericColumn } from '@components/table/components';
import Table, { AntTableStyled } from '@components/table/table';
import { css } from '@emotion/react';
import { useCrudModal } from '@hooks/use-crud-modal';
import { useRouterPush } from '@hooks/use-router-push';
import { useApi } from '@src/api';
import { useRoles } from '@src/queries';
import { useRouterStore } from '@src/stores/router-store';
import { useStore } from '@src/stores/stores';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Checkbox, Form, Input, Modal, Spin } from 'antd';
import { ColumnGroupType, ColumnType } from 'antd/es/table';
import dayjs from 'dayjs';
import { observer } from 'mobx-react';
import { log } from 'next/dist/server/typescript/utils';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

export default observer(function Home() {
  const push = useRouterPush();
  const api = useApi();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useRoles();

  const columns = useMemo(
    () => [
      numericColumn(),
      {
        title: `Name`,
        dataIndex: 'name',
        key: 'name',
        type: 'string',
      },
    ],
    [],
  );

  const addCallback = useCallback(() => push({ add: true }), []);
  const editCallback = useCallback((data: Record<string, any>) => push({ edit: true, id: data.id }), []);

  const { mutate: remove, isLoading: isLoadingRemove } = useMutation(
    ['delete-role'],
    (data: Record<string, any>) => api.apis.Role.deleteOne({ where: data.id }),
    {
      onSuccess: () => {
        toast.success('Deleted successfully!');
        queryClient.invalidateQueries({ queryKey: ['roles'] });
      },
      onError: () => toast.error('An error occurred!'),
    },
  );

  return (
    <AdminLayout>
      <Table
        dataSource={data?.data?.data}
        columns={columns}
        // getData={getData}
        // update={updateAsync}
        // create={createAsync}
        // remove={removeAsync}
        size={'small'}
        loading={false}
        // total={get(data, 'data.totalCount', 0)}
        total={data?.data.length}
        // add={add}
        addCallback={addCallback}
        editCallback={editCallback}
        removeCallback={remove}
        // operations={operations}
      />
      <RoleModal />
    </AdminLayout>
  );
});

const RoleModal = observer(() => {
  const push = useRouterPush();
  const { query, url } = useRouterStore();
  const [form] = Form.useForm();
  const api = useApi();
  const queryClient = useQueryClient();
  const [checkeds, setCheckeds] = useState<Record<string, Record<string, any>>>({});
  const { isLoadingPost, isLoadingUpdate, isLoadingOne, post, update, dataById } = useCrudModal({
    name: 'roles',
    model: api.apis.Role,
    getOne: () => api.apis.Role.findOne({ where: { id: query.id }, include: { permission: true } }),
  });

  const onCancel = () => {
    form.resetFields();
    queryClient.invalidateQueries({ queryKey: ['roles', query.id] });
    push({});
    setCheckeds({});
  };

  const onFinish = (values: any) => {
    console.log(values);
    console.log(dataById);

    const permissions = Object.values(checkeds)
      .filter((value) => !!value?.id)
      .map((value) => ({ id: value?.id }));

    console.log(permissions);

    const data = {
      ...values,
      permission: {
        connect: permissions,
      },
    };

    const data2 = {
      ...values,
      permission: {
        connect: permissions.filter(
          (item) => !dataById?.data.permission.find((p: Record<string, any>) => p.id === item.id),
        ),
        disconnect: dataById?.data.permission
          .filter((item: Record<string, any>) => !permissions.find((p) => p.id === item.id))
          .map((item: Record<string, any>) => ({ id: item.id })),
      },
    };

    if (query.add) post({ data });
    else if (query.edit) {
      update({ data: data2, where: { id: dataById?.data.id } });
    }
  };

  useEffect(() => {
    if (query.edit && dataById?.data) {
      form.setFieldsValue(dataById?.data);
      const pers = dataById?.data?.permission.reduce(
        (obj: Record<string, string>, value: Record<string, string>) => ({ ...obj, [value.id]: { id: value.id } }),
        {},
      );
      setCheckeds(pers);
    } else setCheckeds({});
  }, [dataById?.data]);

  const { data, isLoading, isError } = useQuery(['permissions'], () => api.apis.Permission.findMany(), {});

  const columns: (ColumnGroupType<object> | ColumnType<object>)[] = useMemo(
    () => [
      numericColumn(),
      {
        title: `Name`,
        dataIndex: 'name',
        key: 'name',
        type: 'string',
      },
      {
        title: `check`,
        dataIndex: 'id',
        key: 'id',
        type: 'string',
        align: 'center',
        render: (id: string, row: Record<string, any>) => {
          return <Checkbox checked={!!checkeds[id]}></Checkbox>;
        },
      },
    ],
    [checkeds],
  );

  return (
    <Modal
      title={`${query.add ? 'Add' : 'Edit'} role`}
      open={query.add || query.edit}
      onCancel={onCancel}
      footer={[]}
      width={700}
    >
      {isLoadingOne && <SpinLoading />}
      <Form
        form={form}
        name="basic"
        layout={'vertical'}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please input name!' }]}
          className={'my-4'}
        >
          <Input />
        </Form.Item>

        <AntTableStyled
          dataSource={data?.data?.data}
          columns={columns}
          size={'small'}
          loading={false}
          pagination={false}
          css={css`
            tbody tr {
              cursor: pointer;
            }
          `}
          onRow={(row, rowIndex) => {
            return {
              onClick: (event) => {
                // @ts-ignore
                setCheckeds({ ...checkeds, [row?.id]: !checkeds[row?.id] ? row : undefined });
              },
            };
          }}
        />

        <Form.Item className={'mt-5 mb-0 text-right'}>
          <Button className={'mr-4'} onClick={onCancel}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={isLoadingPost || isLoadingUpdate}>
            Save
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
});
