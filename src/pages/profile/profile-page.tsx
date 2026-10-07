import type { ComponentType } from 'react';
import { GitHubIcon, InstagramIcon, TelegramIcon } from '@/components/icons/brand-icons';
import { PageMeta } from '@/components/seo/page-meta';
import { site } from '@/lib/site';
import { cn } from '@/lib/utils/cn';
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
          {site.bio.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
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
    </div>
  );
}
