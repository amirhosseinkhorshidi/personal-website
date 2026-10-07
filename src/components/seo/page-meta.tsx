import { site } from '@/lib/site';

interface PageMetaProps {
  title: string;
  description: string;
  /** The page's own path, which its canonical link and share URL point to. */
  path: string;
}

/**
 * The page's title and search/share tags. React hoists them into <head>, and
 * the prerender writes them there, so each page's HTML carries its own.
 * Tags shared by every page, such as the share image, live in index.html.
 */
export function PageMeta({ title, description, path }: PageMetaProps) {
  const url = new URL(path, site.url).href;
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
    </>
  );
}
