import { Link } from 'react-router';
import { site } from '@/lib/site';

/** Prerendered to 404.html, which the server sends with a 404 for any unknown path. */
export function NotFoundPage() {
  return (
    <section className="flex flex-col items-center gap-4 rounded-3xl border border-border/60 bg-card p-6 text-center sm:p-8">
      <title>{`صفحه پیدا نشد | ${site.name}`}</title>
      <meta name="robots" content="noindex" />
      <h1 className="font-semibold text-lg">این صفحه پیدا نشد</h1>
      <p className="text-muted-foreground text-sm leading-7">
        آدرسی که باز کردی اینجا وجود نداره یا جابه‌جا شده.
      </p>
      <Link
        to="/"
        className="inline-flex h-9 items-center rounded-full border border-primary/30 bg-primary/10 px-3.5 font-medium text-primary text-sm transition-[background-color,scale] duration-300 hover:bg-primary/20 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 active:scale-95"
      >
        برگرد به صفحه اصلی
      </Link>
    </section>
  );
}
