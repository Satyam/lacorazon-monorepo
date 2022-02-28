export const getClosest = <T extends HTMLElement>(
  $: Element,
  selector: string
): T => $.closest(selector) as T;

export const getTarget = <T extends HTMLElement>(ev: Event): T =>
  ev.target as T;

const currency = 'EUR';
const locale = 'es-ES';

const dateFormatter = new Intl.DateTimeFormat(locale, {
  dateStyle: 'medium',
});

export const formatDate = (date: Date | string) =>
  date instanceof Date
    ? dateFormatter.format(date)
    : date
    ? dateFormatter.format(new Date(date))
    : '';

const currFormatter = new Intl.NumberFormat(locale, {
  style: 'currency',
  currency,
});

export const formatCurrency = (value?: number) =>
  typeof value === 'undefined' ? '' : currFormatter.format(value);

export const ROUTER_EVENT: 'router' = 'router' as const;

type RouterEventDetail = {
  path: string;
  refresh: boolean;
  method: 'push' | 'replace';
};

export class RouterEvent extends CustomEvent<RouterEventDetail> {
  constructor(detail: RouterEventDetail) {
    super(ROUTER_EVENT, { detail });
  }
}

declare global {
  interface WindowEventMap {
    [ROUTER_EVENT]: RouterEvent;
  }
}

export const router = {
  push: (path: string, refresh = false) => {
    history.pushState({ path }, '', path);
    window.dispatchEvent(new RouterEvent({ path, refresh, method: 'push' }));
  },
  replace: (path: string, refresh = false) => {
    history.replaceState({ path }, '', path);
    window.dispatchEvent(new RouterEvent({ path, refresh, method: 'replace' }));
  },
};
