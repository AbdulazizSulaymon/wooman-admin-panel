import { LayoutStore } from './layout-store';
import { RouterStore } from '@src/stores/router-store';
import { StoresInterface } from '@utils/types';
import { enableStaticRendering } from 'mobx-react';
import { FC, createContext, useContext } from 'react';

// enableStaticRendering(typeof window === "undefined");

const getStores = (): StoresInterface => {
  const layoutStore = new LayoutStore();
  const routerStore = new RouterStore();

  return {
    layoutStore,
    routerStore,
  };
};

const stores = getStores();
const StoreContext = createContext<StoresInterface>(stores);

const StoreProvider = ({ children }: { children: any }) => {
  return <StoreContext.Provider value={stores}>{children}</StoreContext.Provider>;
};

const useStore = () => {
  return useContext(StoreContext);
};

export { getStores, StoreContext, StoreProvider, useStore };
