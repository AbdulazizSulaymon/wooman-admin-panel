import { useEffect } from 'react';

export const isServerSide = typeof window === 'undefined';

class Log {
  role: string;
  enabled: boolean;
  _log: (...msg: unknown[]) => void;
  _info: (...msg: unknown[]) => void;
  _warn: (...msg: unknown[]) => void;
  _error: (...msg: unknown[]) => void;

  constructor(role: string) {
    this.role = role;

    this._log = console.log.bind(console);
    this._info = console.info.bind(console);
    this._warn = console.warn.bind(console);
    this._error = console.error.bind(console);

    const debug = isServerSide ? '*' : localStorage.getItem('debug');
    this.enabled = debug === '*' || debug === role;

    if (localStorage.getItem('debug') === null) localStorage.setItem('debug', 'client');
  }

  public log(...msg: unknown[]) {
    if (this.enabled) {
      this._log(...msg);
    }
  }

  public info(...msg: unknown[]) {
    if (this.enabled) {
      this._info(...msg);
    }
  }

  public warn(...msg: unknown[]) {
    if (this.enabled) {
      this._warn(...msg);
    }
  }

  public error(...msg: unknown[]) {
    if (this.enabled) {
      this._error(...msg);
    }
  }
}

// export const dev = new Log('dev');
// export const client = new Log('client');
//
// if (!isServerSide) {
//   console.log = dev.log.bind(dev);
//   console.info = dev.info.bind(dev);
//   console.warn = dev.warn.bind(dev);
//   console.error = dev.error.bind(dev);
//   window.addEventListener('unhandledrejection', (event) => {
//     if (!dev.enabled) {
//       event.preventDefault();
//     }
//   });
// }

export const useHideLogs = () => {
  useEffect(() => {
    const debug = localStorage.getItem('debug');
    if (debug === null) localStorage.setItem('debug', 'client');
    else if (!(debug === 'dev' || debug === '*')) {
      // console.log('Log berkitilgan');
      // console.log(
      //   "%cO'zbekiston Respublikasi Ichki Ishlar Vazirligi",
      //   'font-size: 30px; color: red; font-weight: bold',
      // );
      console.log = () => null;
      console.info = () => null;
    }
  }, []);
};
