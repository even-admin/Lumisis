import heroHome from '@/assets/hero/home-hero-face-with-sunlight.jpg';
import heroHomeAlt from '@/assets/hero/home-hero-alt.jpg';
import heroWhyUs from '@/assets/hero/why-us-hero-hands-fireball.jpg';
import heroSolutions from '@/assets/hero/solutions-hub-hero.png';

// Service hero photos — variable names describe the SLOT each photo serves,
// not the source file. Four slots got new team-approved photography on
// 2026-05-18; the remaining two (culture + leadership) still use rotated
// stand-in photos pending fresh assets.
import serviceStrategicPlanning from '@/assets/services/strategic-planning.png';
import serviceStrategicOffsite from '@/assets/services/strategic-offsite.jpg';
import serviceExecutiveCoaching from '@/assets/services/executive-coaching.jpg';
import serviceFamilyBusinessEvolution from '@/assets/services/family-business-evolution.png';
import serviceCultureEvolution from '@/assets/hero/home-hero-face-with-sunlight.jpg';
import serviceLeadershipPrograms from '@/assets/services/culture-evolution.jpg';

import teamAmenoffis from '@/assets/team/amenoffis-acosta.png';
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
  serviceFamilyBusinessEvolution,
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
    { name: 'Amenoffis Acosta', title: 'Co-fundador y CEO',                    image: teamAmenoffis, objectPosition: 'center',       scale: 'scale(1)' },
    { name: 'Rosa Villa',       title: 'Co-fundadora y Directora Europa',      image: teamRosa,      objectPosition: 'center',       scale: 'scale(1)' },
    { name: 'Gabriel Mijares',  title: 'Co-fundador y Líder Global DHYO',      image: teamGabriel,   objectPosition: 'center',       scale: 'scale(1)' },
    { name: 'Víctor Zorrilla',  title: 'Co-fundador y Líder Global Coaching',  image: teamVictor,    objectPosition: 'center',       scale: 'scale(1)' },
    { name: 'Juan Benitez',     title: 'Senior Coach',                         image: teamJuan,      objectPosition: 'center',       scale: 'scale(1)' },
  ],
  en: [
    { name: 'Amenoffis Acosta', title: 'Co-founder & CEO',                     image: teamAmenoffis, objectPosition: 'center',       scale: 'scale(1)' },
    { name: 'Rosa Villa',       title: 'Co-founder & Europe Director',         image: teamRosa,      objectPosition: 'center',       scale: 'scale(1)' },
    { name: 'Gabriel Mijares',  title: 'Co-founder & DHYO Global Lead',        image: teamGabriel,   objectPosition: 'center',       scale: 'scale(1)' },
    { name: 'Víctor Zorrilla',  title: 'Co-founder & Coaching Global Lead',    image: teamVictor,    objectPosition: 'center',       scale: 'scale(1)' },
    { name: 'Juan Benitez',     title: 'Senior Coach',                         image: teamJuan,      objectPosition: 'center',       scale: 'scale(1)' },
  ],
} as const;

// Slug → hero photo mapping. Variable names above match the slot.
export const SERVICE_IMAGES: Record<string, ImageMetadata> = {
  'planeacion-estrategica': serviceStrategicPlanning,
  'strategic-planning': serviceStrategicPlanning,
  'offsite-estrategico': serviceStrategicOffsite,
  'strategic-offsite': serviceStrategicOffsite,
  'evolucion-cultural': serviceCultureEvolution,
  'culture-evolution': serviceCultureEvolution,
  'programas-de-liderazgo': serviceLeadershipPrograms,
  'leadership-programs': serviceLeadershipPrograms,
  'coaching-ejecutivo': serviceExecutiveCoaching,
  'executive-coaching': serviceExecutiveCoaching,
  'evolucion-empresa-familiar': serviceFamilyBusinessEvolution,
  'family-business-evolution': serviceFamilyBusinessEvolution,
};
