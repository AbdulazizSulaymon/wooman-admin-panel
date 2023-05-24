import { toCamelCase } from './const';
import { Models, ModelsNames } from './models';
import {
  ApiFunction,
  ApiFunctions,
  ApiFunctionsList,
  ReqNamesType,
  ReqType,
  TypeReqName,
  fixedConfigInterface,
} from './types';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { NextRouter } from 'next/router';
import React, { useContext } from 'react';

export class Api {
  tokenName: string = 'token';
  baseUrl: string = '';
  // @ts-ignore
  apis: ApiFunctionsList = {};
  loginUrl = '';
  instance: AxiosInstance = axios.create();
  run = {};
  cancelTokens = {};
  showApis = false;
  router: NextRouter | undefined;
  // @ts-ignore
  models: Models;
  // @ts-ignore
  coreFunctions: fixedConfigInterface;

  //createApi ***********************************************
  createApi() {
    const initialProps = {
      baseURL: this.baseUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        // 'Access-Control-Allow-Origin': '*',
        // 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH',
        // 'Access-Control-Allow-Headers':
        //   'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range',
        Authorization: `Bearer ${this.getToken()}`,
      },
    };
    this.instance = axios.create(initialProps);

    this.generateApiFunctions(this.models, this.coreFunctions);
  }

  //init functions ***********************************************
  constructor(
    router: NextRouter,
    models: Models,
    coreFunctions: fixedConfigInterface,
    baseUrl: string,
    config: Record<string, unknown> = {},
  ) {
    this.showApis = !!config.showApis;
    this.tokenName = (config.tokenName as string) || 'token';
    this.loginUrl = (config.loginUrl as string) || '/login';
    this.baseUrl = baseUrl;
    this.router = router;
    this.models = models;
    this.coreFunctions = coreFunctions;

    // if (this.checkToken() && router.pathname == this.loginUrl)
    //   router.push("/platform");
    // else router.push(this.loginUrl);

    this.createApi();
  }

  checkToken() {
    const token = localStorage.getItem(this.tokenName);
    return !(!token || token == '' || token == 'null');
  }

  getToken() {
    return localStorage.getItem(this.tokenName);
  }

  logOut() {
    this.writeToken();
    this.router?.push('/login');
    this.createApi();
  }

  async login(data: Record<string, unknown>) {
    try {
      const res = await this.instance.post(this.loginUrl, data);
      this.signInSuccess(res.data.access_token, 'user');
      return res;
    } catch (e) {
      console.log(e);
      return { error: e };
    }
  }

  signInSuccess(token: string, user: any) {
    this.writeToken(token, user);
    this.router?.push('/home');
    this.createApi();
  }

  writeToken(token: string = '', user = '') {
    localStorage.setItem(this.tokenName, token);
    localStorage.setItem('user', user);
  }

  generateApiFunctions(models: Models, coreFunctions: fixedConfigInterface) {
    const apiFunctions: ApiFunctionsList = Object.values(models).reduce((res: ApiFunctionsList, model, index) => {
      const { name } = model;

      const obj: Record<string, ApiFunction> = {};
      Object.keys(coreFunctions).map((f, i) => {
        const fun = (data?: Record<string, unknown>) => {
          // try {
          const reqType = ReqType[ReqNamesType[f as TypeReqName]];
          return this.instance[reqType](`api/${toCamelCase(name)}/${coreFunctions[f as TypeReqName]?.fixedPath}`, data);
          // return { ...res, error: false };
          // } catch (e) {
          //   console.log(e);
          //   return {
          //     error: e,
          //     data: [],
          //     status: 400,
          //     statusText: "error",
          //     headers: {},
          //     config: {},
          //   };
          // }
        };
        obj[f as TypeReqName] = fun;
      });

      res[name as ModelsNames] = obj as ApiFunctions;
      return res;
    }, {} as ApiFunctionsList);

    this.apis = apiFunctions;
    if (this.showApis) {
      console.log('Generated Apis');
      console.log(this.apis);
    }
  }
}

// @ts-ignore
export const ApiContext = React.createContext({});
export const ApiProvider = ApiContext.Provider;
export const useApi = (): Api => useContext(ApiContext) as Api;
