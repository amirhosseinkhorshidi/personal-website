import { FolderGit2, type LucideIcon, UserRound } from 'lucide-react';
import type { CSSProperties } from 'react';
import { NavLink, useLocation } from 'react-router';
import { cn } from '@/lib/utils/cn';

interface NavTab {
  path: string;
  title: string;
  icon: LucideIcon;
}

const tabs: NavTab[] = [
  { path: '/', title: 'درباره من', icon: UserRound },
  { path: '/projects', title: 'پروژه‌های من', icon: FolderGit2 },
];

const itemClass =
  'relative z-10 inline-flex h-10 items-center justify-center rounded-full transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2';

export function Navigation() {
  const { pathname } = useLocation();
  const selected = tabs.findIndex((tab) => tab.path === pathname);

  return (
    <nav
      aria-label="ناوبری اصلی"
      className="flex items-center rounded-full border border-border/60 bg-nav/60 p-1 backdrop-blur-xl backdrop-saturate-150"
    >
      {/* Equal columns, as wide as the longest title, so the thumb is one column
          wide and each step of `--i` moves it exactly one tab. `isolate` keeps the
          pill and the labels in one stacking context, so the labels stay on top. */}
      <div className="relative isolate grid auto-cols-fr grid-flow-col">
        {/* One pill slides under the selected tab; hidden on a path no tab owns */}
        <span
          aria-hidden="true"
          data-pos={selected}
          style={{ '--i': selected, width: `${100 / tabs.length}%` } as CSSProperties}
          className="nav-thumb absolute inset-y-0 start-0 z-0 rounded-full bg-nav-thumb shadow-sm"
        />
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            end
            className={({ isActive }) =>
              cn(
                itemClass,
                'gap-1.5 px-3 font-medium text-sm whitespace-nowrap',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
              )
            }
          >
            <tab.icon className="size-5 shrink-0" />
            {tab.title}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
