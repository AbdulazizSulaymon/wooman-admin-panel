import { StyleProvider } from '@ant-design/cssinjs';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { ReactQueryProvider } from '@hocs/react-query';
import { useHideLogs } from '@hocs/use-hide-logs';
import { useWatchRouter } from '@hooks/use-watch-router';
import { Api, ApiProvider } from '@src/api';
import { StoreProvider, useStore } from '@src/stores/stores';
import '@styles/globals.css';
import '@styles/tailwind.css';
import { Analytics } from '@vercel/analytics/react';
import { ConfigProvider, Spin } from 'antd';
import 'antd/dist/reset.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import NextRouter, { Router, useRouter } from 'next/router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import React, { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const baseBackendUrl = 'http://95.130.227.7:3002/';
export const projectName = 'CitiFuel';

const cache = createCache({ key: 'next' });
//Binding events.
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

const LoadingScreen = () => {
  return (
    <div className={'h-[100vh] w-full fixed top-0 left-0 z-[2000] bg-white flex justify-center items-center'}>
      <Spin size={'large'} />
    </div>
  );
};

export default (function App({ Component, pageProps }: AppProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [api, setApi]: [Api | undefined, Function] = useState(undefined);

  useHideLogs();
  useWatchRouter();

  useEffect(() => {
    NextRouter.ready(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const instance = new Api(baseBackendUrl, {
      showApis: false,
      tokenName: 'Wooman Token',
      loginUrl: 'api/auth/login',
    });
    setApi(instance);
  }, []);

  return (
    <CacheProvider value={cache}>
      <Analytics />
      <Head>
        <title>{projectName}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/*<link rel="shortcut icon" href="/logo.ico" />*/}
      </Head>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        // theme={'dark'}
      />
      <ConfigProvider
        theme={{
          token: {
            // colorPrimary: '#0D74BB',
          },
        }}
      >
        <StyleProvider hashPriority="low">
          {ReactQueryProvider(
            <StoreProvider>
              {isLoading ? <LoadingScreen /> : null}
              {api && (
                <ApiProvider value={api}>
                  <Component {...pageProps} />
                </ApiProvider>
              )}
            </StoreProvider>,
          )}
        </StyleProvider>
      </ConfigProvider>
    </CacheProvider>
  );
});
