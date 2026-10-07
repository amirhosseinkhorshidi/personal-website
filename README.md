A personal website, built as a static React single-page app with Vite. It is in Persian, right to left.

The build prerenders every page to its own HTML file, so search engines and link previews get the full
content without running any script; the browser then hydrates it. It also writes `sitemap.xml` and a
`404.html` for unknown paths.

## Requirements

- Node.js 24 or newer
- pnpm 11 or newer

## Commands

```bash
pnpm install      # install dependencies
pnpm dev          # start the dev server
pnpm build        # type-check, build and prerender every page to dist/
pnpm preview      # serve the built dist/ locally
pnpm format       # format and lint with Biome, applying fixes
pnpm check        # Biome CI + type-check, as run before a change is done
```

## Deploy with nginx

Build the site, then copy `dist/` to the server:

```bash
pnpm install --frozen-lockfile
pnpm build
```

The TLS settings live in a snippet, and the site config includes it. Save this as
`/etc/nginx/snippets/example-ssl.conf`:

```nginx
ssl_certificate     /etc/letsencrypt/live/example.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
ssl_protocols       TLSv1.2 TLSv1.3;
ssl_ciphers         ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305;
ssl_prefer_server_ciphers off;
ssl_session_cache   shared:example_ssl:10m;
ssl_session_timeout 1d;
ssl_session_tickets off;
```

Then save this as `/etc/nginx/conf.d/example.conf`:

```nginx
# HTML revalidates on every visit, so a deploy shows at once; other files keep
# the caching their location gives them.
map $sent_http_content_type $html_expires {
    default      off;
    ~^text/html  epoch;
}

# Plain HTTP only redirects to HTTPS.
server {
    listen 80;
    listen [::]:80;
    server_name example.com www.example.com;

    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on;
    server_name example.com www.example.com;
    server_tokens off;

    include /etc/nginx/snippets/example-ssl.conf;

    root /var/www/example;
    index index.html;

    gzip on;
    gzip_types text/css application/javascript image/svg+xml application/json;

    # Vite fingerprints everything in /assets, so it can be cached for a year.
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }

    # Each page is its own prerendered file: / is index.html and /projects is
    # projects.html. Any other path gets 404.html with a real 404 status, so
    # search engines never index a missing page as a copy of the home page.
    location / {
        expires $html_expires;
        try_files $uri $uri.html $uri/index.html =404;
    }

    error_page 404 /404.html;
}
```

Copy the contents of `dist/` into `/var/www/example`. The certificate must exist before nginx loads this config,
because `nginx -t` fails when the files are missing. certbot saves it in `/etc/letsencrypt/live/example.com/`, the
path the snippet reads:

```bash
sudo certbot certonly --nginx -d example.com -d www.example.com
```

nginx loads every `.conf` in `conf.d` on its own, so test the config and reload:

```bash
sudo mkdir -p /etc/nginx/snippets
sudo nginx -t && sudo systemctl reload nginx
```

`http2 on;` needs nginx 1.25.1 or newer. On an older nginx, delete that line and write `listen 443 ssl http2;` instead.
