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
    { label: 'Inicio', href: '/' },
    { label: '¿Por Qué Nosotros?', href: '/por-que-nosotros' },
    { label: 'Soluciones', href: '/soluciones' },
    { label: 'Contacto', href: '/contacto' },
  ],
  en: [
    { label: 'Home', href: '/en/' },
    { label: 'Why Us?', href: '/en/why-us' },
    { label: 'Solutions', href: '/en/solutions' },
    { label: 'Contact', href: '/en/contact' },
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
