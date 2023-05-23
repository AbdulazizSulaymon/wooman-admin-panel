import { CrudType } from '@src/utils/types';

export function toCamelCase(s: string) {
  return (
    s
      // @ts-ignore
      .split(' ')
      .map((x: string, i: number) => {
        if (i > 0) return x.charAt(0).toUpperCase() + x.slice(1);
        else return x.charAt(0).toLowerCase() + x.slice(1);
      })
      .join('')
  );
}

export function toPascalCase(s: string) {
  return (
    s
      // @ts-ignore
      .split(' ')
      .map((x: string) => x.charAt(0).toUpperCase() + x.slice(1))
      .join('')
  );
}

export const crudTypes: CrudType[] = [
  {
    reqType: 'get',
    path: '',
    name: 'get',
  },

  {
    reqType: 'post',
    path: '',
    name: 'post',
  },
  {
    reqType: 'get',
    path: (id: string | number) => id,
    name: 'getOne',
  },
  {
    reqType: 'put',
    path: (id: string | number) => id,
    name: 'put',
  },
  {
    reqType: 'delete',
    path: (id: string | number) => id,
    name: 'delete',
  },
];
