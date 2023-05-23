import { Props } from '../../utils/types';
import { css } from '@emotion/react';
import classNames from 'classnames';
import { AlignType, FixedType } from 'rc-table/es/interface';
import React from 'react';

export const Numeric = ({ children, className, ...props }: Props) => {
  return (
    <span
      className={classNames({
        'font-bold ': true,
        className,
      })}
      css={css`
        margin: 0 auto;
      `}
      {...props}
    >
      {children}
    </span>
  );
};

export const numericColumn = (props: Record<string, unknown> = {}) => ({
  title: '#',
  width: 50,
  fixed: 'left' as FixedType,
  align: 'center' as AlignType,
  render: (src: string, item: any, index: number) => <Numeric>{index + 1}</Numeric>,
  ...props,
});
