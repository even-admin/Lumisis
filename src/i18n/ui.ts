export const ui = {
  es: {
    'nav.home': 'Inicio',
    'nav.why-us': '¿Por Qué Nosotros?',
    'nav.solutions': 'Soluciones',
    'nav.contact': 'Contacto',
    'footer.nav': 'Navegación',
    'footer.connect': 'Conecta',
    'lang.switch': 'EN',
    'lang.label': 'English version',
    'cta.explore': 'Explorar',
    'cta.discover': 'Descubrir más',
    'cta.contact': 'Contáctanos',
    'services.title': 'Soluciones',
    'services.cta': 'Explorar',
  },
  en: {
    'nav.home': 'Home',
    'nav.why-us': 'Why Us?',
    'nav.solutions': 'Solutions',
    'nav.contact': 'Contact',
    'footer.nav': 'Navigation',
    'footer.connect': 'Connect',
    'lang.switch': 'ES',
    'lang.label': 'Versión en español',
    'cta.explore': 'Explore',
    'cta.discover': 'Discover More',
    'cta.contact': 'Contact Us',
    'services.title': 'Solutions',
    'services.cta': 'Explore',
  },
} as const;

export type Locale = keyof typeof ui;
export type UIKey = keyof typeof ui.es;
