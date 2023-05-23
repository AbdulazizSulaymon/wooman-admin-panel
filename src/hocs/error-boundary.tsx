import { Button } from 'antd';
import React from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

const ErrorFallback = ({ error }: FallbackProps) => {
  return (
    <div className="errorWrapper">
      <div className="errorBlock">
        <p>Oops!</p>
        <p>We are experiencing a temporary outage. We are aware of this problem and are working on it.</p>
        <div className="buttonItems">
          <Button type={'primary'} onClick={() => location.replace('/')}>
            Main page
          </Button>
          <Button onClick={() => location.reload()}>Refresh</Button>
        </div>
      </div>
    </div>
  );
};

const logError = (error: Error, info: { componentStack: string }) => {
  // Do something with the error, e.g. log to an external API
  console.log('error boundary', error);

  if (document.URL.includes('localhost:')) return;
  // const trace = parse(error);
  // console.log(trace[0]);

  // mvdApi
  //     .post('wanted/api/v1/frontLog', {
  //         title: error.name,
  //         description: ${error.message}, functionName: ${trace[0].getFunctionName()} ,
  //         url: document.URL,
  //         isProduction: document.URL.includes('stm.ssd.uz'), // process.env.NODE_ENV !== 'development'
  //         project: menu?.lable || 'main'
  //     })
  //     .then((res) => {
  //         console.log(res);
  //     })
  //     .catch((err) => {
  //         console.error(err);
  //     });
};

export const ErrorBoundaryContainer = (Component: React.ReactNode) => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onError={logError}>
      {Component}
    </ErrorBoundary>
  );
};
