import { h, createContext, ComponentChildren } from 'preact';
import { useContext, useState, useMemo } from 'preact/hooks';

import { format } from 'date-fns';
import { enUS, es } from 'date-fns/locale';

// import { registerLocale, setDefaultLocale } from 'react-datepicker';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const localeTables: { [index: string]: any } = { 'en-US': enUS, 'es-ES': es };

// Object.keys(localeTables).forEach((l) => registerLocale(l, localeTables[l]));

type intlType = {
  locales: string[];
  setLocale: (locale: string) => void;
  locale: string;
  formatDate: (date?: Date, formatStr?: string) => string;
  currency: string;
  setCurrency: (currency: string) => void;
  formatCurrency: (amount?: number) => string;
};

const notImplemented = () => {
  throw new Error('Internationalization Context not ready yet');
};

const initialValues = {
  locales: Object.keys(localeTables),
  setLocale: notImplemented,
  locale: navigator.language,
  formatDate: notImplemented,
  currency: 'EUR',
  setCurrency: notImplemented,
  formatCurrency: notImplemented,
};
export const IntlContext = createContext<intlType>(initialValues);

export const IntlProvider = ({
  locale: l = navigator.language,
  currency: c = 'EUR',
  children,
}: {
  locale?: string;
  currency?: string;
  children: ComponentChildren;
}) => {
  const [locale, setLocale] = useState(l);
  const [currency, setCurrency] = useState(c);

  const ctx = useMemo<intlType>(() => {
    const currFormatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    });

    // setDefaultLocale(locale);

    return {
      locales: Object.keys(localeTables),
      setLocale,
      locale,
      formatDate: (date?: Date, formatStr = 'P') =>
        date
          ? format(date, formatStr, {
              locale: localeTables[locale],
            })
          : '',
      currency,
      setCurrency,
      formatCurrency: (value?: number) =>
        value ? currFormatter.format(value) : '',
    };
  }, [locale, currency]);

  return <IntlContext.Provider value={ctx}>{children}</IntlContext.Provider>;
};

export function useIntl() {
  return useContext(IntlContext);
}
