import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { RootLayout } from '@/layouts/root-layout';
import { ProfilePage } from '@/pages/profile/profile-page';
import { ProjectsPage } from '@/pages/projects/projects-page';
import { ThemeProvider } from '@/providers/theme-provider';

export function App() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      // Same key the pre-paint script in index.html reads.
      storageKey="ajayche-theme"
    >
      <BrowserRouter>
        <Routes>
          <Route element={<RootLayout />}>
            <Route index element={<ProfilePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
