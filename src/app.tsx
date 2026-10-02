import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { RootLayout } from '@/layouts/root-layout';
import { ProfilePage } from '@/pages/profile/profile-page';
import { ProjectsPage } from '@/pages/projects/projects-page';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<ProfilePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
