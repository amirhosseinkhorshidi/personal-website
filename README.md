A personal website, built as a static React single-page app with Vite. It is in Persian, right to left.

## Requirements

- Node.js 24 or newer
- pnpm 11 or newer

## Commands

```bash
pnpm install      # install dependencies
pnpm dev          # start the dev server
pnpm build        # type-check and build to dist/
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

    location = /index.html {
        add_header Cache-Control "no-cache";
    }

    # Client-side routes such as /projects fall back to index.html.
    location / {
        try_files $uri $uri/ /index.html;
    }
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
