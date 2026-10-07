import { Route, Routes } from 'react-router';
import { RootLayout } from '@/layouts/root-layout';
import { NotFoundPage } from '@/pages/not-found/not-found-page';
import { ProfilePage } from '@/pages/profile/profile-page';
import { ProjectsPage } from '@/pages/projects/projects-page';

// No router here: the browser entry wraps this in BrowserRouter, and the
// prerender in StaticRouter at each page's path.
export function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<ProfilePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
