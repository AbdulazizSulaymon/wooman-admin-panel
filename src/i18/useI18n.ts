import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

export const useI18n = (lang: string) => {
  const { t, i18n } = useTranslation();
  // const changeLanguage = (params: string) => {
  //   i18n.changeLanguage(params);
  // };

  useEffect(() => {
    i18n.changeLanguage(lang);

    // setTimeout(() => i18n.changeLanguage(lang), 1000);
  }, [i18n, lang]);
};
