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
  { label: 'X', href: '#', icon: 'x' },
] as const;

export const SERVICES = {
  es: [
    { title: 'Planeación Estratégica', slug: 'planeacion-estrategica' },
    { title: 'Offsite Estratégico', slug: 'offsite-estrategico' },
    { title: 'Evolución Cultural', slug: 'evolucion-cultural' },
    { title: 'Programas de Liderazgo', slug: 'programas-de-liderazgo' },
    { title: 'Coaching Ejecutivo', slug: 'coaching-ejecutivo' },
    { title: 'Evolución Empresa Familiar', slug: 'evolucion-empresa-familiar' },
  ],
  en: [
    { title: 'Strategic Planning', slug: 'strategic-planning' },
    { title: 'Strategic Offsite', slug: 'strategic-offsite' },
    { title: 'Culture Evolution', slug: 'culture-evolution' },
    { title: 'Leadership Programs', slug: 'leadership-programs' },
    { title: 'Executive Coaching', slug: 'executive-coaching' },
    { title: 'Family Business Evolution', slug: 'family-business-evolution' },
  ],
} as const;

export const GLOBE_PINS = [
  {
    name: 'LUMISIS HQ — Mérida, México',
    address: 'C 17 474, entre 20 y 22, Mérida, Yucatan 97130, MX',
    phone: '+52 999 942 9151',
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
    phone: '+52 (999) 942 9151',
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

// Countries named in the "Alcance Global" footprint copy — plotted as dots on
// the FootprintMap (capital-city coords). Spanish names serve both locales
// since the map renders dots only, no labels.
export const FOOTPRINT_COUNTRIES = [
  { name: 'México', lon: -99.13, lat: 19.43 },
  { name: 'Alemania', lon: 13.4, lat: 52.52 },
  { name: 'Francia', lon: 2.35, lat: 48.86 },
  { name: 'Suiza', lon: 7.45, lat: 46.95 },
  { name: 'Inglaterra', lon: -0.13, lat: 51.51 },
  { name: 'Kenia', lon: 36.82, lat: -1.29 },
  { name: 'Sudáfrica', lon: 28.19, lat: -25.75 },
  { name: 'Canadá', lon: -75.7, lat: 45.42 },
  { name: 'Estados Unidos', lon: -77.04, lat: 38.9 },
  { name: 'Colombia', lon: -74.07, lat: 4.71 },
  { name: 'Argentina', lon: -58.38, lat: -34.6 },
  { name: 'Brasil', lon: -47.93, lat: -15.78 },
  { name: 'Japón', lon: 139.69, lat: 35.69 },
];

export { b as prefixBase };
