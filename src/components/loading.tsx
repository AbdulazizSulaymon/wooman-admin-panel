import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import React from 'react';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

function Loading() {
  return <Spin indicator={antIcon} />;
}

export const SpinLoading = () => <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />;

export default Loading;
