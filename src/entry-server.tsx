import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { App } from './app';
import { site } from './lib/site';
import { homeStructuredData } from './lib/structured-data';

// The build's server entry: scripts/prerender.ts renders each page through it
// into static HTML, so crawlers get the content without running any script.

export const origin = site.url;

/** Every page that is written out and listed in the sitemap. */
export const pages = ['/', '/projects'];

/** Any path no route owns renders the not-found page. */
export const notFoundPath = '/404';

// React writes the <title>, <meta> and <link> tags a page renders ahead of its
// markup instead of in place, so they can be split off and put in <head>.
const leadingHeadTags = /^(?:<title>[^<]*<\/title>|<(?:meta|link)\b[^>]*>)*/;

// `<` escaped so no string in the data can close the script tag early.
function jsonLd(data: object) {
  const json = JSON.stringify(data).replaceAll('<', '\\u003c');
  return `<script type="application/ld+json">${json}</script>`;
}

/** The page at `path`: the tags for its <head>, and the markup for #root. */
export function render(path: string) {
  const markup = renderToString(
    <StrictMode>
      <StaticRouter location={path}>
        <App />
      </StaticRouter>
    </StrictMode>,
  );
  const [headTags] = markup.match(leadingHeadTags)!;
  // Only the home page describes the owner; the others are pages of the same site.
  const head = path === '/' ? headTags + jsonLd(homeStructuredData()) : headTags;
  return { head, html: markup.slice(headTags.length) };
}
