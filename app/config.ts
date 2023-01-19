declare global {
  const CONFIG: any;
}

interface Config {
  GOOGLE_ANALYTICS_ID: string;
  LINKSF_DOMAIN: string;
  MOHCD_DOMAIN: string;
  MOHCD_SUBDOMAIN: string;
  SFFAMILIES_DOMAIN: string;
  UCSF_DOMAIN: string;
  [key: string]: any;
}

const config: Config = {
  ALGOLIA_APPLICATION_ID: CONFIG.ALGOLIA_APPLICATION_ID,
  ALGOLIA_INDEX_PREFIX: CONFIG.ALGOLIA_INDEX_PREFIX,
  ALGOLIA_READ_ONLY_API_KEY: CONFIG.ALGOLIA_READ_ONLY_API_KEY,
  GOOGLE_ANALYTICS_ID:
    process.env.NODE_ENV === 'production' ||
    window.location.host === 'www.askdarcel.org'
      ? 'UA-116318550-1'
      : 'UA-116318550-2', // TODO This should probably be in whitelabel
  GOOGLE_API_KEY: CONFIG.GOOGLE_API_KEY,
  INTERCOM_APP_ID: 'w50oz3tb',
  LINKSF_DOMAIN: CONFIG.LINKSF_DOMAIN,
  MOHCD_DOMAIN: CONFIG.MOHCD_DOMAIN,
  MOHCD_SUBDOMAIN: CONFIG.MOHCD_SUBDOMAIN,
  SENTRY_PROJECT_ID: '1291512',
  SENTRY_PUBLIC_KEY: '64ab4b168902441a9e8069bab36849be',
  SFFAMILIES_DOMAIN: CONFIG.SFFAMILIES_DOMAIN,
  SFFAMILIES_USERWAY_APP_ID: '4EhNmEIwPz',
  UCSF_DOMAIN: 'dcnav',
};

if (CONFIG.TESTCAFE_RUNNING) {
  delete (config as any).INTERCOM_APP_ID;
}

export default config;
