import heroHome from '@/assets/hero/home-hero-face-with-sunlight.jpg';
import heroHomeAlt from '@/assets/hero/home-hero-alt.jpg';
import heroWhyUs from '@/assets/hero/why-us-hero-hands-fireball.jpg';
import heroSolutions from '@/assets/hero/solutions-hub-hero.png';

import serviceStrategicPlanning from '@/assets/services/strategic-planning-1.png';
import serviceStrategicOffsite from '@/assets/services/strategic-offsite.jpg';
import serviceCultureEvolution from '@/assets/services/culture-evolution.jpg';
import serviceLeadershipPrograms from '@/assets/services/leadership-programs.jpg';
// Exec-coaching uses the unused hi-res face photo — the original
// executive-coaching.jpg is only 1024×1024, too small for a full-bleed hero.
import serviceExecutiveCoaching from '@/assets/hero/home-hero-face-with-sunlight.jpg';
import serviceFamilyBusiness from '@/assets/services/family-business.jpg';

import teamAmenoffis from '@/assets/team/amenoffis-acosta.jpg';
import teamRosa from '@/assets/team/rosa-villa.jpg';
import teamGabriel from '@/assets/team/gabriel-mijares.png';
import teamVictor from '@/assets/team/victor-zorrilla.png';
import teamJuan from '@/assets/team/juan-benitez.png';

import client1 from '@/assets/logos/clients/home-client-1.jpg';
import client2 from '@/assets/logos/clients/home-client-2.png';
import client3 from '@/assets/logos/clients/home-client-3.png';
import client4 from '@/assets/logos/clients/home-client-4.png';
import client5 from '@/assets/logos/clients/home-client-5.png';

import partner1 from '@/assets/logos/partners/partner-1.png';
import partner2 from '@/assets/logos/partners/partner-2.png';
import partner3 from '@/assets/logos/partners/partner-3.png';
import partner4 from '@/assets/logos/partners/partner-4.png';
import partner5 from '@/assets/logos/partners/partner-5.png';
import partner6 from '@/assets/logos/partners/partner-6.png';

import lumisisLogo from '@/assets/logos/lumisis-logo.avif';
import lumisisLogoWhite from '@/assets/logos/lumisis-white.png';
import lumisisLogoColor from '@/assets/logos/lumisis-color.png';
import lumisisIcon from '@/assets/logos/lumisis-icon.png';

export {
  heroHome,
  heroHomeAlt,
  heroWhyUs,
  heroSolutions,
  serviceStrategicPlanning,
  serviceStrategicOffsite,
  serviceCultureEvolution,
  serviceLeadershipPrograms,
  serviceExecutiveCoaching,
  serviceFamilyBusiness,
  teamAmenoffis,
  teamRosa,
  teamGabriel,
  teamVictor,
  teamJuan,
  client1, client2, client3, client4, client5,
  partner1, partner2, partner3, partner4, partner5, partner6,
  lumisisLogo,
  lumisisLogoWhite,
  lumisisLogoColor,
  lumisisIcon,
};

export const CLIENT_LOGOS = [client1, client2, client3, client4, client5];
export const PARTNER_LOGOS = [partner1, partner2, partner3, partner4, partner5, partner6];

// Bilingual split — same names + photos across locales, titles localized.
// Follows the same `.es` / `.en` shape used by NAV_ITEMS / SERVICES in constants.ts.
export const TEAM_MEMBERS = {
  es: [
    { name: 'Amenoffis Acosta', title: 'Co-fundador y CEO',                    image: teamAmenoffis, objectPosition: 'center 15%' },
    { name: 'Rosa Villa',       title: 'Co-fundadora y Directora Europa',      image: teamRosa,      objectPosition: 'center' },
    { name: 'Gabriel Mijares',  title: 'Co-fundador y Líder Global DHYO',      image: teamGabriel,   objectPosition: 'center' },
    { name: 'Víctor Zorrilla',  title: 'Co-fundador y Líder Global Coaching',  image: teamVictor,    objectPosition: 'center' },
    { name: 'Juan Benitez',     title: 'Senior Coach',                         image: teamJuan,      objectPosition: 'center' },
  ],
  en: [
    { name: 'Amenoffis Acosta', title: 'Co-founder & CEO',                     image: teamAmenoffis, objectPosition: 'center 15%' },
    { name: 'Rosa Villa',       title: 'Co-founder & Europe Director',         image: teamRosa,      objectPosition: 'center' },
    { name: 'Gabriel Mijares',  title: 'Co-founder & DHYO Global Lead',        image: teamGabriel,   objectPosition: 'center' },
    { name: 'Víctor Zorrilla',  title: 'Co-founder & Coaching Global Lead',    image: teamVictor,    objectPosition: 'center' },
    { name: 'Juan Benitez',     title: 'Senior Coach',                         image: teamJuan,      objectPosition: 'center' },
  ],
} as const;

// Hero photo → service mapping.
// NOTE (rotation 2026-05-15): the four `service*` variable names below
// describe the original *image file* (e.g. serviceLeadershipPrograms imports
// leadership-programs.jpg), NOT the service slot they now serve. Photos were
// rotated across the four leadership/culture/coaching/family-business slots,
// so the value identifier won't match its key — that's intentional, not a typo.
export const SERVICE_IMAGES: Record<string, ImageMetadata> = {
  'planeacion-estrategica': serviceStrategicPlanning,
  'strategic-planning': serviceStrategicPlanning,
  'offsite-estrategico': serviceStrategicOffsite,
  'strategic-offsite': serviceStrategicOffsite,
  'evolucion-cultural': serviceExecutiveCoaching,
  'culture-evolution': serviceExecutiveCoaching,
  'programas-de-liderazgo': serviceCultureEvolution,
  'leadership-programs': serviceCultureEvolution,
  'coaching-ejecutivo': serviceFamilyBusiness,
  'executive-coaching': serviceFamilyBusiness,
  'evolucion-empresa-familiar': serviceLeadershipPrograms,
  'family-business-evolution': serviceLeadershipPrograms,
};
