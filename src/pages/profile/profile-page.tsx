import { type ComponentType, Fragment } from 'react';
import { GitHubIcon, InstagramIcon, TelegramIcon } from '@/components/icons/brand-icons';
import { PageMeta } from '@/components/seo/page-meta';
import { type BioPart, site } from '@/lib/site';
import { cn } from '@/lib/utils/cn';
import packageJson from '../../../package.json';
import { GitHubActivity } from './github-activity';

interface Social {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  // Written out whole so Tailwind finds each brand's classes in the source
  tone: string;
}

const socials: Social[] = [
  {
    href: site.socials.telegram,
    label: 'تلگرام',
    icon: TelegramIcon,
    tone: 'border-telegram/30 bg-telegram/10 text-telegram hover:bg-telegram/20',
  },
  {
    href: site.socials.instagram,
    label: 'اینستاگرام',
    icon: InstagramIcon,
    tone: 'border-instagram/30 bg-instagram/10 text-instagram hover:bg-instagram/20',
  },
  {
    href: site.socials.github,
    label: 'گیت‌هاب',
    icon: GitHubIcon,
    tone: 'border-github/15 bg-github/5 text-github/70 hover:bg-github/10 hover:text-github',
  },
];

// Read off the manifest, so the version shown is the one a release bumped and built
const version = packageJson.version.replace(/\d/g, (digit) => '۰۱۲۳۴۵۶۷۸۹'[Number(digit)]);

function plainText(parts: readonly BioPart[]) {
  return parts.map((part) => (typeof part === 'string' ? part : part.text)).join('');
}

export function ProfilePage() {
  return (
    <div className="flex flex-col gap-6">
      <PageMeta title={site.title} description={site.description} path="/" />
      <section className="flex flex-col gap-7 rounded-3xl border border-border/60 bg-card p-6 sm:p-8">
        <header className="flex flex-col gap-1">
          <h1 className="font-semibold text-lg">{site.name}</h1>
          <p className="text-muted-foreground text-sm">{site.role}</p>
        </header>

        <div className="flex flex-col gap-4 text-[0.9375rem] text-foreground/80 leading-8">
          {site.bio.map((paragraph) =>
            typeof paragraph === 'string' ? (
              <p key={paragraph}>{paragraph}</p>
            ) : (
              <p key={plainText(paragraph)}>
                {paragraph.map((part, index) =>
                  typeof part === 'string' ? (
                    // biome-ignore lint/suspicious/noArrayIndexKey: the parts are fixed text, never reordered, and joiners like « و » repeat
                    <Fragment key={index}>{part}</Fragment>
                  ) : (
                    <a
                      key={part.href}
                      href={part.href}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-sm font-medium text-primary transition-opacity hover:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    >
                      {part.text}
                    </a>
                  ),
                )}
              </p>
            ),
          )}
        </div>

        <ul className="flex flex-wrap gap-2">
          {socials.map((social) => (
            <li key={social.label}>
              <a
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className={cn(
                  'inline-flex h-9 items-center gap-2 rounded-full border px-3.5 font-medium text-sm transition-[background-color,scale] duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:scale-95',
                  social.tone,
                )}
              >
                <social.icon className="size-4 shrink-0" />
                {social.label}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <GitHubActivity />

      <footer className="flex items-center justify-center gap-2 text-muted-foreground text-xs">
        <p>تمامی حقوق محفوظ است</p>
        <span className="h-3 w-px bg-border" aria-hidden="true" />
        <p>
          نسخه <span className="ss02">{version}</span>
        </p>
      </footer>
    </div>
  );
}
