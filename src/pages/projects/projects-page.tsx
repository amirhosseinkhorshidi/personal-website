import { GitHubIcon } from '@/components/icons/brand-icons';
import { site } from '@/lib/site';
import { cn } from '@/lib/utils/cn';
import { TelegramPostPreview } from './telegram-post-preview';

const linkClass =
  'inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 font-medium text-sm transition-[background-color,scale] duration-300 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 active:scale-95';

export function ProjectsPage() {
  return (
    <section className="flex flex-col gap-6">
      <title>{`پروژه‌ها | ${site.name}`}</title>
      <h1 className="sr-only">پروژه‌های من</h1>
      <ul className="flex flex-col gap-6">
        {site.projects.map((project) => {
          const url = project.domain && `https://${project.domain}`;
          return (
            <li
              key={project.name}
              className={cn(
                'flex flex-col gap-5 rounded-3xl border border-border/60 bg-card p-3',
                // With no preview the text leads, so it gets the same inset on top as below.
                project.preview ? 'pb-6' : 'py-6',
              )}
            >
              {project.preview && url && (
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`باز کردن ${project.name}`}
                  className={cn(
                    'block overflow-hidden rounded-2xl border border-border/60 bg-muted focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2',
                    // The drawn post keeps its own height; a 16:10 box leaves it in empty space on desktop.
                    project.preview.type === 'screenshot' && 'aspect-16/10',
                  )}
                >
                  {project.preview.type === 'screenshot' ? (
                    <>
                      <img
                        src={project.preview.light}
                        alt=""
                        loading="lazy"
                        className="size-full object-cover object-top dark:hidden"
                      />
                      <img
                        src={project.preview.dark}
                        alt=""
                        loading="lazy"
                        className="hidden size-full object-cover object-top dark:block"
                      />
                    </>
                  ) : (
                    <TelegramPostPreview />
                  )}
                </a>
              )}

              <div className="flex flex-col gap-2 px-3">
                <div className="flex items-baseline gap-2">
                  <h2 className="font-semibold">{project.name}</h2>
                  {project.status && (
                    <span className="self-center rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary text-xs">
                      {project.status}
                    </span>
                  )}
                  {project.year && (
                    <span className="self-center rounded-full bg-muted px-2 py-0.5 font-medium text-muted-foreground text-xs">
                      از {project.year}
                    </span>
                  )}
                </div>
                {project.description.map((paragraph) => (
                  <p key={paragraph} className="text-foreground/80 text-sm leading-7">
                    {paragraph}
                  </p>
                ))}
              </div>

              {(url || project.repo) && (
                <div className="flex flex-wrap gap-2 px-3">
                  {url && (
                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      dir="ltr"
                      className={cn(
                        linkClass,
                        'border-primary/30 bg-primary/10 text-primary hover:bg-primary/20',
                      )}
                    >
                      {project.domain}
                    </a>
                  )}
                  {project.repo && (
                    <a
                      href={project.repo}
                      target="_blank"
                      rel="noreferrer"
                      className={cn(
                        linkClass,
                        'border-github/20 bg-github/5 text-github hover:bg-github/10',
                      )}
                    >
                      <GitHubIcon className="size-4" />
                      گیت‌هاب
                    </a>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
