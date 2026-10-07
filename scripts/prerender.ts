import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { pathToFileURL } from 'node:url';

// The last step of `pnpm build`: the client build's index.html is the template,
// and the server build (src/entry-server.tsx) renders each page into it. The
// browser then hydrates that markup instead of drawing the page from nothing.

interface ServerEntry {
  origin: string;
  pages: string[];
  notFoundPath: string;
  render(path: string): { head: string; html: string };
}

const root = join(import.meta.dirname, '..');
const dist = join(root, 'dist');
const serverEntry = join(root, 'node_modules/.tmp/ssr/entry-server.js');

const { origin, pages, notFoundPath, render } = (await import(
  pathToFileURL(serverEntry).href
)) as ServerEntry;

const template = await readFile(join(dist, 'index.html'), 'utf8');
const headEnd = '  </head>';
const emptyRoot = '<div id="root"></div>';
if (!template.includes(headEnd) || !template.includes(emptyRoot)) {
  throw new Error(`dist/index.html has no "${headEnd.trim()}" or "${emptyRoot}" to render into`);
}

async function write(file: string, content: string) {
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, content);
  console.log(`prerendered ${relative(root, file)}`);
}

// Replacer functions, because a replacement string would read `$&` and the like
// in the page's text as patterns.
function renderPage(path: string) {
  const { head, html } = render(path);
  return template
    .replace(headEnd, () => `    ${head}\n${headEnd}`)
    .replace(emptyRoot, () => `<div id="root">${html}</div>`);
}

for (const path of pages) {
  // /projects becomes projects.html, which the server sends for /projects
  // without adding a trailing slash, as projects/index.html would get.
  await write(join(dist, path === '/' ? 'index.html' : `${path}.html`), renderPage(path));
}
await write(join(dist, '404.html'), renderPage(notFoundPath));

const urls = pages.map((path) => `  <url><loc>${new URL(path, origin).href}</loc></url>`);
await write(
  join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`,
);
