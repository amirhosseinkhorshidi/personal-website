import { cloneElement, useSyncExternalStore } from 'react';
import { type Activity, ActivityCalendar, type BlockElement } from 'react-activity-calendar';
import { site } from '@/lib/site';
import { useGitHubContributions } from './use-github-contributions';

// Theme tokens rather than GitHub's greens, so the grid follows the site's
// colours and flips with the system theme on its own. The empty tone, then the
// brand colour at half, three quarters and full strength. The grid and its
// legend both read this list, so the two cannot drift apart.
const levelColors = [
  'var(--muted)',
  'color-mix(in oklab, var(--primary) 50%, transparent)',
  'color-mix(in oklab, var(--primary) 75%, transparent)',
  'var(--primary)',
];

const calendarTheme = { light: levelColors, dark: levelColors };

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

// The API scales five levels to the whole year, but the grid shows four shades
// of half a year, and the calendar throws on a level past its maximum. So the
// levels are drawn again from this window: its busy days are split into thirds,
// which keeps all three shades in use however the year went.
function withLevels(activities: Activity[]): Activity[] {
  const busy = activities
    .map(({ count }) => count)
    .filter((count) => count > 0)
    .sort((a, b) => a - b);
  const upTo = (share: number) => busy[Math.ceil(busy.length * share) - 1];
  const low = upTo(1 / 3);
  const high = upTo(2 / 3);

  return activities.map((activity) => ({
    ...activity,
    level: activity.count === 0 ? 0 : activity.count <= low ? 1 : activity.count <= high ? 2 : 3,
  }));
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

// The shades from least to most, read from the grid's side: in RTL the first
// swatch sits next to «کمتر».
function Legend() {
  return (
    <div aria-hidden="true" className="flex items-center gap-1.5 text-muted-foreground text-xs">
      <span>کمتر</span>
      <span className="flex gap-1">
        {levelColors.map((color) => (
          <span key={color} className="size-3 rounded-[3px]" style={{ backgroundColor: color }} />
        ))}
      </span>
      <span>بیشتر</span>
    </div>
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
      ? withLevels(contributions.data.filter((activity) => activity.date >= cutoff))
      : emptyWindow();
  // Null until the data lands, which is also what the prerendered HTML shows
  const total =
    contributions.status === 'ready'
      ? data.reduce((sum, activity) => sum + activity.count, 0)
      : null;

  return (
    <section
      aria-labelledby="github-activity"
      aria-busy={loading}
      className="flex flex-col gap-5 rounded-3xl border border-border/60 bg-card p-6 sm:p-8"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 id="github-activity" className="font-semibold text-sm">
            فعالیت گیت‌هاب من
          </h2>
          <p className="text-muted-foreground text-xs">تعداد فعالیت در هر روز</p>
        </div>
        <span className="inline-flex h-6 shrink-0 items-center rounded-full bg-primary/15 px-2.5 font-semibold text-primary text-xs">
          ۶ ماه اخیر
        </span>
      </div>

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
          blockRadius={4}
          maxLevel={levelColors.length - 1}
          fontSize={12}
          // The total and the legend are drawn below, in the site's own font and
          // direction, so the calendar's English footer is off
          showTotalCount={false}
          showColorLegend={false}
        />
      )}

      {contributions.status !== 'error' && (
        // Fixed height, so the total arriving does not move the page
        <div className="flex h-5 items-center justify-between gap-4 text-xs">
          <Legend />
          {total === null ? (
            <span
              aria-hidden="true"
              className="h-3.5 w-20 rounded-full bg-skeleton motion-safe:animate-skeleton-wave"
            />
          ) : (
            <p className="font-semibold text-foreground/70">
              <span className="ss02">{total.toLocaleString('fa-IR')}</span> فعالیت
            </p>
          )}
        </div>
      )}
    </section>
  );
}
