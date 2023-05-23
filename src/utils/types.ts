import { PropsWithChildren } from 'react';

export interface LayoutStoreInterface {
  theme: string;
  collapsed: boolean;
  setTheme: Function;
  toggleTheme: Function;
  setCollapsed: Function;
}

export interface RouterStoreInterface {
  query: Record<string, any>;
  url: string;
  setQuery: Function;
  setUrl: Function;
  setLocation: Function;
}

export interface StoresInterface {
  layoutStore: LayoutStoreInterface;
  routerStore: RouterStoreInterface;
}

export type Props = PropsWithChildren & Record<string, any>;
