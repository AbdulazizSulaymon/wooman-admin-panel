import Router from 'next/router';
import queryString, { StringifyOptions } from 'query-string';

export const useRouterPush = () => {
  return (query: Record<string, any>) => {
    const options: StringifyOptions = { skipEmptyString: true, arrayFormat: 'bracket', arrayFormatSeparator: '|' };

    let str = '';
    if (query.url && query.query) str = queryString.stringifyUrl({ url: query.url, query: query.query }, options);
    else str = `${Router.pathname}?${queryString.stringify(query, options)}`;

    if (str !== Router.asPath) Router.push(str, undefined, { shallow: true });
  };
};
