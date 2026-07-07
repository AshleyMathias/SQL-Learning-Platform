import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { usePreferencesStore } from '@/stores/preferences-store';
import { initSqlEngine } from '@/services/database';

const WelcomePage = lazy(() => import('@/pages/WelcomePage').then((m) => ({ default: m.WelcomePage })));
const AppLayout = lazy(() => import('@/layouts/AppLayout').then((m) => ({ default: m.AppLayout })));
const DashboardPage = lazy(() => import('@/pages/DashboardPage').then((m) => ({ default: m.DashboardPage })));
const PlaygroundPage = lazy(() => import('@/pages/PlaygroundPage').then((m) => ({ default: m.PlaygroundPage })));
const LessonsPage = lazy(() => import('@/pages/LessonsPage').then((m) => ({ default: m.LessonsPage })));
const LessonDetailPage = lazy(() => import('@/pages/LessonDetailPage').then((m) => ({ default: m.LessonDetailPage })));
const DatabasesPage = lazy(() => import('@/pages/DatabasesPage').then((m) => ({ default: m.DatabasesPage })));
const ChallengesPage = lazy(() => import('@/pages/ChallengesPage').then((m) => ({ default: m.ChallengesPage })));
const BookmarksPage = lazy(() => import('@/pages/BookmarksPage').then((m) => ({ default: m.BookmarksPage })));
const SearchPage = lazy(() => import('@/pages/SearchPage').then((m) => ({ default: m.SearchPage })));
const SettingsPage = lazy(() => import('@/pages/SettingsPage').then((m) => ({ default: m.SettingsPage })));

function Loading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const onboardingComplete = usePreferencesStore((s) => s.onboardingComplete);
  if (!onboardingComplete) return <Navigate to="/" replace />;
  return <>{children}</>;
}

export default function App() {
  useEffect(() => {
    void initSqlEngine();
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route
            element={
              <OnboardingGuard>
                <AppLayout />
              </OnboardingGuard>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/playground" element={<PlaygroundPage />} />
            <Route path="/lessons" element={<LessonsPage />} />
            <Route path="/lessons/:slug" element={<LessonDetailPage />} />
            <Route path="/databases" element={<DatabasesPage />} />
            <Route path="/challenges" element={<ChallengesPage />} />
            <Route path="/bookmarks" element={<BookmarksPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
