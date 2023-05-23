import { Props } from '../utils/types';
import { Button } from 'antd';
import React, { PropsWithChildren, ReactNode } from 'react';

function CircleButton({ children, className }: Props) {
  return (
    <Button type="primary" shape={'circle'} className={'flex justify-center items-center border-0 ' + className}>
      {children}
    </Button>
  );
}

export default CircleButton;
