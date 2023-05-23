import { Result } from 'antd';
import { ResultStatusType } from 'antd/es/result';
import React from 'react';

function Error({
  status = 'error',
  title = 'Error',
  subtitle = 'There was an error loading data !',
  className = '',
}: {
  status?: ResultStatusType;
  title?: string;
  subtitle?: string;
  className?: string;
}) {
  return <Result className={'rounded shadow ' + className} status={status} title={title} subTitle={subtitle}></Result>;
}

export default Error;
