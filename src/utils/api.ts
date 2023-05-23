import { toast } from 'react-toastify';
import { omitBy, isNil } from 'lodash';

export const createWrapper = async (callback: () => any) => {
  try {
    const data = await callback();
    toast.success("Muvaffaqiyatli qo'shildi");
  } catch (error) {
    console.log({ error });
    toast.error('Xatolik yuz berdi');
  }
};

export const updateWrapper = async (callback: () => any) => {
  try {
    const data = await callback();
    toast.success("Muvaffaqiyatli o'zgartirildi!");
  } catch (error) {
    console.log({ error });
    toast.error('Xatolik yuz berdi');
  }
};

export const requestWrapper = async (callback: () => any, succesText: string, errorText: string) => {
  try {
    const data = await callback();
    toast.success(succesText);
  } catch (error) {
    console.log({ error });
    toast.error(errorText);
  }
};

export const clearObject = (obj: Record<string, any>) => omitBy(obj, isNil);
