import { Outlet, useLocation } from 'react-router';
import { Navigation } from '@/components/layout/navigation/navigation';

export function RootLayout() {
  const { pathname } = useLocation();

  return (
    <div className="flex min-h-dvh flex-col">
      {/* Fixed, not sticky: when the page overscrolls, iOS 26 Safari drops a sticky
          element's content and leaves only its backdrop blur (WebKit bug 298709).
          Translucent so the page shows faintly as it scrolls under. */}
      <header className="fixed inset-x-0 top-8 z-50 flex justify-center px-4">
        <Navigation />
      </header>
      {/* The header is out of flow, so the top padding clears it: 32px offset +
          50px nav + a 32px gap, where the sticky header used to leave the page. */}
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pt-28.5 pb-12">
        {/* Keyed by path so each page fades in on arrival; the old page leaves at
            once, so navigation never waits on an exit animation. */}
        <div key={pathname} className="motion-safe:animate-page-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
