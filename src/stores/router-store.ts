import { usePickStore } from '@hooks/use-pick-store';
import { RouterStoreInterface } from '@utils/types';
import { configure, makeAutoObservable } from 'mobx';

configure({ enforceActions: 'never' });

export class RouterStore implements RouterStoreInterface {
  query: Record<string, any> = {};
  url: string = '';

  constructor() {
    makeAutoObservable(this);
  }

  setQuery: Function = (query: Record<string, any>) => {
    this.query = query;
  };

  setUrl: Function = (url: string) => {
    this.url = url;
  };

  setLocation: Function = (query: Record<string, any>, url: string) => {
    this.setQuery(query);
    this.setUrl(url);
  };
}

export const useRouterStore = () => usePickStore('routerStore') as RouterStoreInterface;
