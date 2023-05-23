import { LayoutStoreInterface } from '@utils/types';
import { configure, makeAutoObservable } from 'mobx';

configure({ enforceActions: 'never' });

export class LayoutStore implements LayoutStoreInterface {
  theme: string = 'dark';
  collapsed: boolean = true;

  constructor() {
    makeAutoObservable(this);
  }

  setTheme: Function = (theme: 'light' | 'dark') => {
    this.theme = theme;
    // console.log('setTheme', theme, this.theme);
  };

  toggleTheme: Function = () => {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
  };

  setCollapsed: Function = (isCollapsed: boolean) => {
    this.collapsed = isCollapsed;
  };
}
