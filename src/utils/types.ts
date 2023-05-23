import { ModelsNames } from '@api/models';
import { AxiosResponse } from 'axios';
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

export interface apiResponseInterface {
  status: string | number;
  description?: string;
  type?: string;
}

export type Props = PropsWithChildren & Record<string, any>;

export enum ReqNames {
  'get' = 'get',
  'post' = 'post',
  'getOne' = 'getOne',
  'put' = 'put',
  'delete' = 'delete',
}

export type TypeReqName = keyof typeof ReqNames;
export type ReqType = 'get' | 'post' | 'put' | 'patch' | 'delete';

export type ApiFunction = (
  data?: Record<string, unknown>,
  id?: string | number,
) => Promise<AxiosResponse<any, any> & { error?: unknown }>;
export type ApiFunctions = Record<TypeReqName, ApiFunction>;
export type ApiFunctionsList = Record<ModelsNames, ApiFunctions>;

export type CrudType = {
  reqType: ReqType;
  path: ((id: string | number) => string | number) | string;
  name: keyof typeof ReqNames;
};
