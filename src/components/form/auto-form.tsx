import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { projectName } from '@pages/_app';
import { Button, Form, Input, InputNumber, Select, Typography } from 'antd';
import { FormInstance, Rule } from 'antd/es/form';
import React from 'react';

const { Option } = Select;
const { Text } = Typography;

export type FormField = {
  label: string;
  name: string;
  type?: string;
  rules?: Rule[] | undefined;
  className?: string;
  options?: { label: String; value: String }[];
  mode?: 'multiple' | 'tags' | undefined;
  dynamic?: boolean;
  placeholder?: string;
};

export type SelectMode = 'multiple' | 'tags' | undefined;

export const AutoForm = ({
  form,
  fields,
  onCancel,
  onFinish,
  isSaveLoading,
  cancelTitle = 'Cancel',
  saveTitle = 'Save',
}: {
  form: FormInstance<any>;
  fields: FormField[];
  onCancel: Function;
  onFinish: (values: any) => void;
  isSaveLoading: boolean;
  cancelTitle?: string;
  saveTitle?: string;
}) => {
  return (
    <Form form={form} name="basic" layout={'vertical'} onFinish={onFinish} autoComplete="off">
      {fields.map((field) =>
        field.dynamic ? (
          <>
            <Text className={'mt-2 mb-2 block'}>{field.label}</Text>
            <Form.List key={field.name} name={field.name}>
              {(flistFields, { add, remove }, { errors }) => (
                <>
                  {flistFields.map((listField, index) => (
                    <Form.Item
                      // label={index === 0 ? field.label : ''}
                      required={false}
                      key={listField.key}
                      css={css`
                        .ant-form-item-control-input-content {
                          display: flex;
                        }

                        margin-bottom: 1rem !important;
                      `}
                    >
                      <Form.Item validateTrigger={['onChange', 'onBlur']} {...listField} noStyle>
                        <Input
                          type={field.type || 'text'}
                          className={`my-0 mr-2 ${field.className || ''}`}
                          placeholder={field.placeholder || ''}
                        />
                      </Form.Item>
                      {fields.length > 1 ? (
                        <MinusCircleOutlined className="dynamic-delete-button" onClick={() => remove(listField.name)} />
                      ) : null}
                    </Form.Item>
                  ))}

                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} style={{ width: '60%' }} icon={<PlusOutlined />}>
                      Add field
                    </Button>

                    <Form.ErrorList errors={errors} />
                  </Form.Item>
                </>
              )}
            </Form.List>
          </>
        ) : (
          <Form.Item
            key={field.name}
            label={field.label}
            name={field.name}
            rules={field.rules}
            className={`my-4 ${field.className || ''}`}
          >
            {field.type === 'password' ? (
              <Input.Password />
            ) : field.type === 'number' ? (
              <InputNumber
                css={css`
                  width: 100% !important;
                `}
              />
            ) : field.options ? (
              <Select placeholder="Select" allowClear mode={field.mode} options={field.options} />
            ) : (
              <Input type={field.type || 'text'} />
            )}
          </Form.Item>
        ),
      )}

      <Form.Item className={'mt-5 mb-0 text-right'}>
        <Button className={'mr-4'} onClick={() => onCancel()}>
          {cancelTitle}
        </Button>
        <Button type="primary" htmlType="submit" loading={isSaveLoading}>
          {saveTitle}
        </Button>
      </Form.Item>
    </Form>
  );
};
