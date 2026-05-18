const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

function b(path: string): string {
  if (!BASE) return path;
  if (path === '/') return `${BASE}/`;
  return `${BASE}${path}`;
}

export const SITE = {
  name: 'LUMISIS',
  tagline: 'Strategy | Consulting | Coaching',
  description: {
    es: 'Consultoría estratégica, coaching ejecutivo y evolución cultural para organizaciones.',
    en: 'Strategic consulting, executive coaching and culture evolution for organizations.',
  },
  copyright: `© ${new Date().getFullYear()} LUMISIS GROUP`,
} as const;

export const NAV_ITEMS = {
  es: [
    { label: 'Inicio', href: b('/') },
    { label: '¿Por Qué Nosotros?', href: b('/por-que-nosotros') },
    { label: 'Soluciones', href: b('/soluciones') },
    { label: 'Contacto', href: b('/contacto') },
  ],
  en: [
    { label: 'Home', href: b('/en/') },
    { label: 'Why Us?', href: b('/en/why-us') },
    { label: 'Solutions', href: b('/en/solutions') },
    { label: 'Contact', href: b('/en/contact') },
  ],
} as const;

export const SOCIAL_LINKS = [
  { label: 'LinkedIn', href: '#', icon: 'linkedin' },
  { label: 'Instagram', href: '#', icon: 'instagram' },
] as const;

export const SERVICES = {
  es: [
    { title: 'Planeación estratégica', slug: 'planeacion-estrategica' },
    { title: 'Experiencias ejecutivas y offsites', slug: 'offsite-estrategico' },
    { title: 'Evolución cultural', slug: 'evolucion-cultural' },
    { title: 'Programas de liderazgo', slug: 'programas-de-liderazgo' },
    { title: 'Coaching ejecutivo', slug: 'coaching-ejecutivo' },
    { title: 'Evolución de empresas familiares', slug: 'evolucion-empresa-familiar' },
  ],
  en: [
    { title: 'Strategic planning', slug: 'strategic-planning' },
    { title: 'Executive experiences & offsites', slug: 'strategic-offsite' },
    { title: 'Culture evolution', slug: 'culture-evolution' },
    { title: 'Leadership programs', slug: 'leadership-programs' },
    { title: 'Executive coaching', slug: 'executive-coaching' },
    { title: 'Family businesses evolution', slug: 'family-business-evolution' },
  ],
} as const;

export const GLOBE_PINS = [
  {
    name: 'LUMISIS HQ — Mérida, México',
    address: 'C 17 474, entre 20 y 22, Mérida, Yucatan 97130, MX',
    phone: '+52 999 649 0203',
    lon: -89.6253,
    lat: 20.9674,
  },
  {
    name: 'Berlin, Germany',
    address: 'Giesebrechtstrasse 15, 10629',
    phone: '+49 30 235911-599',
    lon: 13.3221,
    lat: 52.5015,
  },
  {
    name: 'Mexico City, Mexico',
    address: 'Oficina Regional',
    phone: '+52 999 649 0203',
    lon: -99.1332,
    lat: 19.4326,
  },
  {
    name: 'San Diego, USA',
    address: 'Oficina Regional',
    lon: -117.1611,
    lat: 32.7157,
  },
  {
    name: 'Chihuahua, Mexico',
    address: 'Oficina Regional',
    lon: -106.0889,
    lat: 28.6353,
  },
];

export { b as prefixBase };
