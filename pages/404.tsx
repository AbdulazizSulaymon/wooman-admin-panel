import { css } from '@emotion/react';
import { Button, Result } from 'antd';
import { useRouter } from 'next/router';
import React from 'react';

const App: React.FC = () => {
  const router = useRouter();

  return (
    <div
      css={css`
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
      `}
    >
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button type="primary" onClick={() => router.push('/')}>
            Back Home
          </Button>
        }
      />
    </div>
  );
};

export default App;
