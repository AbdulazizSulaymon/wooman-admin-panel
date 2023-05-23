import { useRouter } from 'next/router';
import queryString, { ParseOptions } from 'query-string';
import { useEffect, useState } from 'react';

export const useRouterQuery = () => {
  const router = useRouter();
  const [obj, setObj] = useState<{ query: queryString.ParsedQuery<string>; url: string }>({ query: {}, url: '' });
  const options: ParseOptions = {
    parseNumbers: true,
    parseBooleans: true,
    arrayFormat: 'bracket',
    arrayFormatSeparator: '|',
  };

  useEffect(() => {
    setObj(queryString.parseUrl(router.asPath, options));
  }, [router.asPath]);

  return [obj.query, obj.url];
};
