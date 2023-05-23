import { projectName } from '@pages/_app';
import { useApi } from '@src/api';
import { useMutation } from '@tanstack/react-query';
import { Button, Col, Form, Input, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function Page() {
  const api = useApi();
  const { mutate, isLoading } = useMutation(['login'], (values: any) => api.login(values), {
    onError: () => {
      toast.error('Wrong login or password');
    },
  });

  const onFinish = async (values: any) => {
    mutate(values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className={'overflow-x-hidden'}>
      <Row>
        <Col md={12} xs={24} className={'hidden md:block'}>
          <img src="/login.jpg" alt="" loading={'lazy'} className={'min-h-[100vh] w-full object-cover'} />
        </Col>
        <Col md={12} xs={24} className={'p-3 flex flex-col justify-center items-center min-h-[100vh]'}>
          <h1 className={'mb-10'}>{projectName}</h1>
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            className={'w-full'}
          >
            <Form.Item
              label="Phone"
              name="phone"
              rules={[{ required: true, message: 'Please enter your login!' }]}
              className={'mb-5'}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Please enter the password!' }]}
            >
              <Input.Password />
            </Form.Item>

            {/*<Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>*/}
            {/*  <Checkbox>Eslab qolish</Checkbox>*/}
            {/*</Form.Item>*/}

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit" loading={isLoading}>
                Login
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  );
}
