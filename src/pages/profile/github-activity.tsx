import { cloneElement, useSyncExternalStore } from 'react';
import { type Activity, ActivityCalendar, type BlockElement } from 'react-activity-calendar';
import { site } from '@/lib/site';
import { useGitHubContributions } from './use-github-contributions';

// Theme tokens rather than GitHub's greens, so the grid follows the site's
// colours and flips with the system theme on its own.
const calendarTheme = {
  light: ['var(--muted)', 'var(--primary)'],
  dark: ['var(--muted)', 'var(--primary)'],
};

// While loading every block is level 0, drawn in the stronger skeleton tone
const skeletonTheme = {
  light: ['var(--skeleton)', 'var(--skeleton)'],
  dark: ['var(--skeleton)', 'var(--skeleton)'],
};

const DAY_MS = 86_400_000;

// Delays each block by its diagonal from the grid's first cell, so the fade
// sweeps across the calendar as a wave instead of blinking all at once.
function skeletonBlock(block: BlockElement, activity: Activity, firstDay: string) {
  // T00:00 parses as local midnight, so getDay() is the calendar's own weekday
  const start = new Date(`${firstDay}T00:00`);
  const date = new Date(`${activity.date}T00:00`);
  const week = Math.floor((Math.round((+date - +start) / DAY_MS) + start.getDay()) / 7);
  return cloneElement(block, {
    className: 'motion-safe:animate-skeleton-wave',
    style: { ...block.props.style, animationDelay: `${(week + date.getDay()) * 30}ms` },
  });
}

// yyyy-MM-dd in local time, the format the calendar and the API share
function toDay(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

// The calendar spans from its first entry to its last, so trimming the year
// the API returns is what narrows the grid to half a year.
function sixMonthsAgo() {
  const since = new Date();
  since.setMonth(since.getMonth() - 6);
  return toDay(since);
}

// Every day of the window at level 0: the skeleton is the real grid, so the
// card keeps its size when the data lands.
function emptyWindow(): Activity[] {
  const days: Activity[] = [];
  const date = new Date();
  date.setMonth(date.getMonth() - 6);
  const today = toDay(new Date());
  for (let day = toDay(date); day <= today; day = toDay(date)) {
    days.push({ date: day, count: 0, level: 0 });
    date.setDate(date.getDate() + 1);
  }
  return days;
}

// The value never changes after hydration, so there is nothing to listen to.
const subscribeNever = () => () => {
  // nothing to unsubscribe
};

// False in the prerendered HTML and while it hydrates, true from then on. The
// grid is drawn from today's date, so drawing it at build time would leave a
// grid for the wrong days that no longer matches when the page hydrates.
function useHydrated() {
  return useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false,
  );
}

/** The owner's GitHub contribution graph for the last six months. */
export function GitHubActivity() {
  const hydrated = useHydrated();
  const contributions = useGitHubContributions(site.githubUsername);
  const loading = contributions.status === 'loading';
  const cutoff = sixMonthsAgo();
  const data =
    contributions.status === 'ready'
      ? contributions.data.filter((activity) => activity.date >= cutoff)
      : emptyWindow();

  return (
    <section
      aria-labelledby="github-activity"
      aria-busy={loading}
      className="flex flex-col gap-5 rounded-3xl border border-border/60 bg-card p-6 sm:p-8"
    >
      <h2 id="github-activity" className="font-semibold text-sm">
        فعالیت گیت‌هاب من
      </h2>

      {!hydrated ? (
        // Holds the grid's size, 27 weeks by 7 days of 20px steps plus the month
        // row, so the page does not shift when it is drawn.
        <div aria-hidden="true" className="aspect-536/156 w-full max-w-134 self-center" />
      ) : contributions.status === 'error' ? (
        <p className="text-center text-muted-foreground text-sm">دریافت فعالیت گیت‌هاب ممکن نشد.</p>
      ) : (
        // The grid's SVG has a viewBox, so capping its width scales it down on
        // narrow screens instead of letting the calendar scroll sideways.
        // Month labels stay in the library's English.
        <ActivityCalendar
          // With the legend off, the grid is the only svg inside
          className="self-center [&_svg]:h-auto [&_svg]:max-w-full"
          data={data}
          theme={loading ? skeletonTheme : calendarTheme}
          renderBlock={
            loading ? (block, activity) => skeletonBlock(block, activity, data[0].date) : undefined
          }
          blockSize={16}
          blockMargin={4}
          fontSize={12}
          showTotalCount={false}
          showColorLegend={false}
        />
      )}
    </section>
  );
}
