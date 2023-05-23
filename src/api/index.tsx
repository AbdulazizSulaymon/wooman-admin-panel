import { crudTypes } from '@api/const';
import { Models, ModelsNames, models } from '@api/models';
import { ApiFunction, ApiFunctions, ApiFunctionsList, CrudType, ReqType, TypeReqName } from '@utils/types';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import Router from 'next/router';
import React, { useContext } from 'react';

export class Api {
  tokenName: string = 'token';
  baseUrl: string = '';
  // @ts-ignore
  loginUrl = '';
  instance: AxiosInstance = axios.create();
  run = {};
  cancelTokens = {};
  showApis = false;
  models: Models = models;
  crudTypes = crudTypes;
  apis: ApiFunctionsList;

  //createApi ***********************************************
  createApi() {
    const initialProps = {
      baseURL: this.baseUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.getToken()}`,
      },
    };
    this.instance = axios.create(initialProps);

    this.generateApiFunctions(this.models, this.crudTypes);
  }

  //init functions ***********************************************
  constructor(baseUrl: string, config: Record<string, unknown> = {}) {
    this.showApis = !!config.showApis;
    this.tokenName = (config.tokenName as string) || 'token';
    this.loginUrl = (config.loginUrl as string) || '/login';
    this.baseUrl = baseUrl;

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
    localStorage.setItem('use-user-me', '');
    this.writeToken();
    Router.push('/login');
    this.createApi();
  }

  async login(data: Record<string, unknown>) {
    const res = await this.instance.post(this.loginUrl, data);
    this.signInSuccess(res.data.accessToken, 'user');
    return res;
  }

  signInSuccess(token: string, user: any) {
    this.writeToken(token, user);
    localStorage.setItem('use-user-me', '');
    Router.push('/home');
    this.createApi();
  }

  writeToken(token: string = '', user = '') {
    localStorage.setItem(this.tokenName, token);
    localStorage.setItem('user', user);
  }

  generateApiFunctions(models: Models, crudTypes: CrudType[]) {
    const apiFunctions: ApiFunctionsList = Object.values(models).reduce((res: ApiFunctionsList, model, index) => {
      const { name } = model;

      const obj: Record<string, ApiFunction> = {};
      crudTypes.map((f, i) => {
        const fun = (data?: Record<string, unknown>, id?: string | number) => {
          // try {
          const reqType = f.reqType;
          return this.instance[reqType](`${name}/${typeof f.path === 'function' && id ? f.path(id) : f.path}`, data);
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
        obj[f.name] = fun;
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
