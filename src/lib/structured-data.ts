import { site } from './site';

/**
 * Schema.org JSON-LD for the home page: the site belongs to one person, under
 * both spellings of the name, with the profiles elsewhere that are also them.
 * This is what lets a search for the name connect those pages to this site.
 */
export function homeStructuredData() {
  const home = `${site.url}/`;
  const person = `${home}#person`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfilePage',
        '@id': home,
        url: home,
        name: site.title,
        inLanguage: 'fa',
        isPartOf: { '@id': `${home}#website` },
        mainEntity: { '@id': person },
      },
      {
        '@type': 'Person',
        '@id': person,
        name: site.name,
        alternateName: site.latinName,
        url: home,
        jobTitle: site.role,
        description: site.description,
        sameAs: Object.values(site.socials),
      },
      {
        '@type': 'WebSite',
        '@id': `${home}#website`,
        url: home,
        name: site.name,
        alternateName: [site.latinName, new URL(site.url).host],
        inLanguage: 'fa',
        publisher: { '@id': person },
      },
    ],
  };
}
