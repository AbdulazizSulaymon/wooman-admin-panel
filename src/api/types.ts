import { ModelsNames } from '../api/models';
import { AxiosResponse } from 'axios';

export interface apiResponseInterface {
  status: string | number;
  description?: string;
  type?: string;
}

export interface functionFixConfig {
  permission: string;
  info: string;
  param?: string;
  paramArray?: boolean;
  body?: string;
  bodyArray?: boolean;
  query?: string;
  header?: string;
  service: string;
  // serviceAccess: string;
  resp: string;
  responses?: apiResponseInterface[];
  fixedPath: string;
  admin?: boolean;
}

export type fixedConfigInterface = {
  [name in ReqNames]?: functionFixConfig;
};

export enum ReqNamesType {
  'exist' = 'POST',
  'findOne' = 'POST',
  'findMany' = 'POST',
  'createOne' = 'POST',
  'createMany' = 'POST',
  'updateOne' = 'PATCH',
  'updateMany' = 'PATCH',
  'updateAll' = 'PATCH',
  'deleteOne' = 'POST',
  'deleteMany' = 'POST',
  'deleteAll' = 'POST',
}

export enum ReqNames {
  'exist' = 'exist',
  'findOne' = 'findOne',
  'findMany' = 'findMany',
  'createOne' = 'createOne',
  'createMany' = 'createMany',
  'updateOne' = 'updateOne',
  'updateMany' = 'updateMany',
  'updateAll' = 'updateAll',
  'deleteOne' = 'deleteOne',
  'deleteMany' = 'deleteMany',
  'deleteAll' = 'deleteAll',
}

export type TypeReqNames = { [key in ReqNames]: string };
export type TypeReqName = keyof TypeReqNames;

export enum ReqType {
  'POST' = 'post',
  'GET' = 'get',
  'DELETE' = 'delete',
  'PUT' = 'put',
  'PATCH' = 'patch',
}

export type ApiFunction = (data?: Record<string, unknown>) => Promise<AxiosResponse<any, any> & { error?: unknown }>;
export type ApiFunctions = Record<TypeReqName, ApiFunction>;
export type ApiFunctionsList = Record<ModelsNames, ApiFunctions>;
