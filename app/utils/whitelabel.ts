import AskDarcelImage from '../assets/img/askdarcel.svg';
import BackgroundImage from '../assets/img/bg.png';
import SearchByAlgoliaImage from '../assets/img/search-by-algolia.png';
import SFFamiliesLogo from '../assets/img/sf-families.svg';
import SFServiceLogo from '../assets/img/sf-service.svg';
import SFSeal from '../assets/img/sf-seal.png';
import LinkSFLogo from '../assets/img/link-sf.png';
import config from '../config';
import styles from '../components/ui/Navigation.module.scss';

// Include new white label here
type WhiteLabelSiteKey = 'defaultWhiteLabel' | 'SFServiceGuide' | 'SFFamilies' | 'LinkSF';

interface WhiteLabelSite {
  appImages: {
    background: string;
    logoLarge: string;
    logoSmall: string;
    algolia: string;
    mohcdSeal: string;
  };
  intercom: boolean;
  logoLinkDestination: string;
  navLogoStyle: string;
  showBanner: boolean;
  showMobileNav: boolean;
  showSearch: boolean;
  siteNavStyle: string;
  siteUrl: string;
  title: string;
  userWay: boolean;
}

// Include a domain in config.js
function determineWhiteLabelSite(): WhiteLabelSiteKey {
  const domain = window.location.host;
  const subdomain = domain.split('.')[0];
  if (subdomain === String(config.SFFAMILIES_DOMAIN) || subdomain === `${String(config.SFFAMILIES_DOMAIN)}-staging`) return 'SFFamilies';
  if (subdomain === String(config.MOHCD_DOMAIN) || domain === `staging.${String(config.MOHCD_DOMAIN)}.org`) return 'SFServiceGuide';
  if (subdomain === String(config.LINKSF_DOMAIN) || subdomain === `${String(config.LINKSF_DOMAIN)}-staging`) return 'LinkSF';
  return 'defaultWhiteLabel';
}

const configKey = determineWhiteLabelSite();

/*
  Specify what is viewed in each white label.
  A '/' (which is a forward-slash) as a value for logoLinkDestination
  denotes that the link is internal to the application.
*/
const SFFamilies: WhiteLabelSite = {
  appImages: {
    background: BackgroundImage,
    logoLarge: SFFamiliesLogo,
    logoSmall: SFFamiliesLogo,
    algolia: SearchByAlgoliaImage,
    mohcdSeal: SFSeal,
  },
  intercom: false,
  logoLinkDestination: 'https://www.sffamilies.org/',
  navLogoStyle: styles.navLogoSFFamilies,
  showBanner: false,
  showMobileNav: false,
  showSearch: false,
  siteNavStyle: styles.siteNavSFFamilies,
  siteUrl: 'https://sffamilies.sfserviceguide.org/',
  title: 'SF Families',
  userWay: true,
} as const;

const SFServiceGuide: WhiteLabelSite = {
  appImages: {
    background: BackgroundImage,
    logoLarge: SFServiceLogo,
    logoSmall: SFServiceLogo,
    algolia: SearchByAlgoliaImage,
    mohcdSeal: SFSeal,
  },
  intercom: true,
  logoLinkDestination: '/',
  navLogoStyle: styles.siteNav,
  showBanner: true,
  showMobileNav: true,
  showSearch: true,
  siteNavStyle: styles.siteNav,
  siteUrl: 'https://sfserviceguide.org',
  title: 'SF Service Guide',
  userWay: false,
} as const;

const LinkSF: WhiteLabelSite = {
  appImages: {
    background: BackgroundImage,
    logoLarge: LinkSFLogo,
    logoSmall: LinkSFLogo,
    algolia: SearchByAlgoliaImage,
    mohcdSeal: SFSeal,
  },
  intercom: false,
  logoLinkDestination: '/',
  navLogoStyle: styles.siteNav,
  showBanner: true,
  showMobileNav: true,
  showSearch: true,
  siteNavStyle: styles.siteNav,
  siteUrl: 'https://linksf.sfserviceguide.org',
  title: 'Link SF',
  userWay: false,
} as const;


const defaultWhiteLabel: WhiteLabelSite = {
  appImages: {
    background: BackgroundImage,
    logoLarge: AskDarcelImage,
    logoSmall: AskDarcelImage,
    algolia: SearchByAlgoliaImage,
    mohcdSeal: SFSeal,
  },
  intercom: true,
  logoLinkDestination: '/',
  navLogoStyle: styles.siteNav,
  showBanner: true,
  showMobileNav: true,
  showSearch: true,
  siteNavStyle: styles.siteNav,
  siteUrl: 'https://askdarcel.org',
  title: 'AskDarcel',
  userWay: false,
} as const;

/*
  whiteLabel made Readonly to force developer to modify whiteLabel object in this file.
  Disallow changes at compile time.
*/
const whiteLabel: Readonly<Record<WhiteLabelSiteKey, WhiteLabelSite>> = {
  SFFamilies,
  SFServiceGuide,
  LinkSF,
  defaultWhiteLabel,
} as const;

// Disallow changes at run time
Object.freeze(whiteLabel);
Object.freeze(whiteLabel[configKey]?.appImages);

export default whiteLabel[configKey];
