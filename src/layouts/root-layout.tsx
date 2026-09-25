import { Outlet } from 'react-router';
import { Navigation } from '@/components/layout/navigation/navigation';

export function RootLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      {/* Sticky, and translucent so the page shows faintly as it scrolls under */}
      <header className="sticky top-4 z-50 flex justify-center px-4 pt-4">
        <Navigation />
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12">
        <Outlet />
      </main>
    </div>
  );
}
