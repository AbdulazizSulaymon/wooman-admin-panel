import Loading from '../loading';
import { QuestionCircleOutlined } from '@ant-design/icons';
import Error from '@components/error';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Props } from '@src/utils/types';
import { Table as AntTable, Button, Pagination } from 'antd';
import { Form, Input, InputNumber, Popconfirm, Typography } from 'antd';
import { SizeType } from 'antd/es/config-provider/SizeContext';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import { ExpandableConfig } from 'rc-table/lib/interface';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { FaSave, FaTimes } from 'react-icons/fa';
import { MdOutlineDelete } from 'react-icons/md';
import { TbEdit } from 'react-icons/tb';
import { toast } from 'react-toastify';

type Item = {
  key: string;
  id: number;
} & Record<string, string>;

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text';
  record: Item;
  index: number;
  children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

function Table({
  dataSource,
  columns,
  getData = async () => {},
  update = async () => {},
  create = async () => {},
  remove = async () => {},
  size = 'middle',
  loading,
  error,
  total,
  add = true,
  addCallback,
  editCallback,
  removeCallback,
  operations,
  hideOperationColumn,
  hidePagination,
  expandable,
  name,
  noStyle,
  ...props
}: {
  dataSource: Record<string, unknown>[];
  columns: Record<string, unknown>[];
  getData?: Function;
  update?: Function;
  create?: Function;
  remove?: Function;
  size?: SizeType;
  loading?: boolean;
  error?: boolean;
  total: number;
  add?: boolean;
  addCallback?: () => void;
  editCallback?: (record: Record<string, any>) => void;
  removeCallback?: (record: Record<string, any>) => void;
  operations?: React.FC<{ record: Record<string, any> }>[];
  hideOperationColumn?: boolean;
  hidePagination?: boolean;
  expandable?: ExpandableConfig<Record<string, any>>;
  name?: string;
  noStyle?: boolean;
} & Props) {
  const [form] = Form.useForm();
  const [data, setData] = useState(dataSource);
  const [editingKey, setEditingKey] = useState('');
  const [editingRow, setEditingRow] = useState({});

  const isEditing = (record: Item) => record.key === editingKey;
  const isCreating = !!editingKey && editingKey == '-1';
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    setData(dataSource);
  }, [dataSource]);

  useEffect(() => {
    getData(pageSize, (page - 1) * pageSize);
  }, [page, pageSize]);

  const addRow = () => {
    setEditingKey('-1');
    setData([{ key: '-1' }, ...data]);
    form.resetFields();
  };

  const edit = (record: Partial<Item> & { key: React.Key }) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.key);
    setEditingRow(record);
  };

  const cancel = () => {
    setEditingKey('');
    setData([...dataSource]);
  };

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as Item;
      const { id, key, ...newRow } = { ...editingRow, ...row };

      if (isCreating) {
        create(newRow)
          .then((data: any) => {
            toast.success('Added successfully');
          })
          .catch((error: any) => {
            console.log({ error });
            toast.error('An error occurred');
          });
      } else {
        update(newRow, id)
          .then((data: any) => {
            toast.success('Changed successfully');
          })
          .catch((error: any) => {
            console.log({ error });
            toast.error('An error occurred');
          });
      }
      setEditingKey('');
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const removeRow = (record: Partial<Item> & { key: React.Key }) => {
    remove(+record.key)
      .then((data: any) => {
        toast.success('Deleted successfully');
      })
      .catch((error: any) => {
        console.log({ error });
        toast.error('An error occurred');
      })
      .finally(cancel);
  };

  // const x = useMemo(
  //   () =>
  //     window && columns.length > 5 ? `${Math.floor((columns.length / (window.innerWidth / 160)) * 100)}%` : '100%',
  //   [columns, window?.innerWidth],
  // );

  const [x, setX] = useState('');

  useEffect(() => {
    const getScrollWidth = () =>
      setX(
        window && columns.length > 5 ? `${Math.floor((columns.length / (window.innerWidth / 160)) * 100)}%` : '100%',
      );
    window.onresize = getScrollWidth;
    getScrollWidth();
  }, []);

  const operationColumn = {
    title: 'Operation',
    dataIndex: 'operation',
    width: 130,
    render: (_: any, record: Item) => {
      const editable = isEditing(record);
      return editable ? (
        <span className={'flex gap-2'}>
          <Button type={'primary'} className={'border-none'} size={'small'} onClick={() => save(record.key)}>
            <FaSave />
          </Button>
          <Popconfirm
            icon={<QuestionCircleOutlined rev={undefined} style={{ color: 'red' }} />}
            title="Do you want to cancel?"
            onConfirm={cancel}
            okText="Yes"
            cancelText="No"
          >
            <Button className={'border-none '} size={'small'}>
              <FaTimes />
            </Button>
          </Popconfirm>
        </span>
      ) : (
        editingKey == '' && (
          <span className={'flex gap-2'}>
            <Button
              type={'primary'}
              size={'small'}
              onClick={editCallback ? () => editCallback(record) : () => edit(record)}
            >
              <TbEdit />
            </Button>
            <Popconfirm
              icon={<QuestionCircleOutlined rev={undefined} style={{ color: 'red' }} />}
              title="Are you sure to delete?"
              onConfirm={removeCallback ? () => removeCallback(record) : () => removeRow(record)}
              okText="Yes"
              cancelText="Delete"
              className={'text-red-500 shadow-lg overflow-hidden'}
            >
              <Button type={'primary'} size={'small'} danger>
                <MdOutlineDelete css={css({ fill: 'white !important' })} />
              </Button>
            </Popconfirm>
            {operations?.map((Component, index) => (
              <Component record={record} key={index} />
            ))}
          </span>
        )
      );
    },
  };

  const mergedColumns = useMemo(
    () =>
      (hideOperationColumn ? columns : [...columns, operationColumn]).map((col) => {
        if (!col.editable) {
          return col;
        }
        return {
          ...col,
          onCell: (record: Item) => ({
            record,
            inputType: col.type || 'text',
            dataIndex: col.dataIndex,
            title: col.title,
            editing: isEditing(record),
          }),
        };
      }),
    [hideOperationColumn, columns, operationColumn, isEditing],
  );

  return (
    <>
      {/*<Form form={form} component={false}>*/}
      {error ? (
        <Error />
      ) : (
        <>
          <AntTableStyled
            className={clsx({ noStyle })}
            dataSource={data}
            // @ts-ignore
            columns={mergedColumns}
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            loading={loading}
            rowClassName="editable-row"
            // pagination={{
            //   onChange: cancel,
            // }}
            pagination={false}
            scroll={{ x, y: 560 }}
            size={size}
            expandable={expandable}
            title={() => (
              <div className={'flex justify-between items-center'}>
                {/*<p className={'font-bold'}>{name || 'Data'}</p>*/}
                <p className={'font-bold'}>Total: {total}</p>
                <div className={'flex items-center gap-3'}>
                  {loading && <Loading />}
                  {add && (
                    <Button type={'primary'} onClick={addCallback || addRow} disabled={isCreating}>
                      <AiOutlinePlus className={'mr-1'} /> New
                    </Button>
                  )}
                </div>
              </div>
            )}
          />
          {!hidePagination && (
            <div className={'flex justify-end'}>
              <PaginationStyled
                current={page}
                pageSize={pageSize}
                total={total}
                showQuickJumper
                size="small"
                onChange={(pageNumber) => {
                  setPage(pageNumber);
                  cancel();
                }}
                onShowSizeChange={(current, size) => setPageSize(size)}
                showTotal={(total, range) => `Total: ${total}, ${range[0]}-${range[1]}`}
              />
            </div>
          )}
        </>
      )}

      {/*</Form>*/}
    </>
  );
}

export default React.memo(observer(Table));

export const PaginationStyled = styled(Pagination)`
  & {
    padding: 0.4rem 1rem;
  }
`;

export const AntTableStyled = styled(AntTable)`
  background: transparent;
  width: 100%;

  .editable-row .ant-form-item-explain {
    position: absolute;
    top: 100%;
    font-size: 12px;
  }

  .noStyle {
    .ant-table {
      margin: 0 !important;
      margin-block: -16px !important;
    }
  }
`;
