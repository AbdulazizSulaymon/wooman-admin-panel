import { omitBy } from 'lodash';

export const priceFormatter = (price: number) => new Intl.NumberFormat('uz-Uz').format(price);

type LabelFunction = (record: Record<string, any>) => string;
export const makeOptions = (data: Record<string, any> | undefined, label: string | LabelFunction, value = 'id') => {
  return data?.map((item: Record<string, any>) => ({
    label: typeof label === 'function' ? label(item) : item[label],
    value: item[value],
  }));
};

export const clearObject = (obj: Record<string, any>) => omitBy(obj, (v) => !v);
