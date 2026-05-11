import { ui, type Locale, type UIKey } from './ui';

export function getLocaleFromUrl(url: URL): Locale {
  const [, firstSegment] = url.pathname.split('/');
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

export function getAlternatePath(currentPath: string, currentLocale: Locale): string {
  if (currentLocale === 'es') {
    if (currentPath === '/') return '/en/';
    return `/en${currentPath}`;
  }
  const stripped = currentPath.replace(/^\/en/, '') || '/';
  return stripped;
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
  const clean = currentPath.replace(/\/$/, '') || '/';
  if (clean === '/') return '/en/';
  if (clean === '/en') return '/';
  return ROUTE_MAP[clean] ?? clean;
}
