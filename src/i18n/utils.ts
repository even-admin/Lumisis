import { ui, type Locale, type UIKey } from './ui';

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

export function stripBase(pathname: string): string {
  if (BASE && pathname.startsWith(BASE)) {
    return pathname.slice(BASE.length) || '/';
  }
  return pathname;
}

export function prefixBase(path: string): string {
  if (!BASE) return path;
  if (path === '/') return `${BASE}/`;
  return `${BASE}${path}`;
}

export function getLocaleFromUrl(url: URL): Locale {
  const clean = stripBase(url.pathname);
  const [, firstSegment] = clean.split('/');
  if (firstSegment === 'en') return 'en';
  return 'es';
}

export function t(locale: Locale, key: UIKey): string {
  return ui[locale][key];
}

export function getLocalizedPath(path: string, locale: Locale): string {
  if (locale === 'es') return path;
  if (path === '/') return '/en/';
  return `/en${path}`;
}

const ROUTE_MAP: Record<string, string> = {
  '/por-que-nosotros': '/en/why-us',
  '/soluciones': '/en/solutions',
  '/contacto': '/en/contact',
  '/en/why-us': '/por-que-nosotros',
  '/en/solutions': '/soluciones',
  '/en/contact': '/contacto',
};

export function getTranslatedPath(currentPath: string): string {
  const clean = stripBase(currentPath).replace(/\/$/, '') || '/';
  if (clean === '/') return prefixBase('/en/');
  if (clean === '/en') return prefixBase('/');
  const translated = ROUTE_MAP[clean];
  if (translated) return prefixBase(translated);
  return currentPath;
}
