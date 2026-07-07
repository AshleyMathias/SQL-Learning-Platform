import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Menu, Database } from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { usePreferencesStore } from '@/stores/preferences-store';
import { useProgressStore } from '@/stores/progress-store';
import { databaseManager } from '@/services/database';

const pageMeta: Array<{ match: RegExp; title: string; subtitle: string }> = [
  { match: /^\/dashboard/, title: 'Dashboard', subtitle: 'Continue learning and pick up where you left off.' },
  { match: /^\/lessons\/.+/, title: 'Lesson', subtitle: 'Read, practice, and understand the idea before moving on.' },
  { match: /^\/lessons/, title: 'Learning Path', subtitle: 'Lessons organized to build SQL confidence step by step.' },
  { match: /^\/playground/, title: 'SQL Playground', subtitle: 'Write queries, inspect data, and see what changed.' },
  { match: /^\/databases/, title: 'Databases', subtitle: 'Load starter datasets or bring your own SQLite file.' },
  { match: /^\/challenges/, title: 'Challenges', subtitle: 'Test your understanding with guided practice.' },
  { match: /^\/bookmarks/, title: 'Bookmarks', subtitle: 'Keep useful lessons and queries close at hand.' },
  { match: /^\/search/, title: 'Search', subtitle: 'Jump quickly to lessons, topics, and SQL functions.' },
  { match: /^\/settings/, title: 'Settings', subtitle: 'Adjust the workspace to match your learning style.' },
];

export function AppLayout() {
  const location = useLocation();
  const skillLevel = usePreferencesStore((s) => s.skillLevel);
  const activeDatabaseId = useProgressStore((s) => s.activeDatabaseId);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeDatabaseName, setActiveDatabaseName] = useState<string | null>(null);

  useEffect(() => {
    async function loadActiveDatabaseName() {
      if (!activeDatabaseId) {
        setActiveDatabaseName(null);
        return;
      }

      const databases = await databaseManager.listDatabases();
      const activeDatabase = databases.find((entry) => entry.id === activeDatabaseId);
      setActiveDatabaseName(activeDatabase?.name ?? null);
    }

    void loadActiveDatabaseName();
  }, [activeDatabaseId]);

  const currentPage = pageMeta.find((entry) => entry.match.test(location.pathname)) ?? {
    title: 'SQL Brush Up',
    subtitle: 'Learn SQL by doing.',
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((current) => !current)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-b border-border bg-background/80 px-4 py-3 backdrop-blur md:px-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground md:hidden">
                <Menu className="h-4 w-4" />
                <Link to="/dashboard" className="font-medium text-foreground">SQL Brush Up</Link>
              </div>
              <h1 className="text-2xl font-semibold">{currentPage.title}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{currentPage.subtitle}</p>
            </div>

            <div className="hidden shrink-0 gap-2 md:flex">
              <span className="rounded-full bg-muted px-3 py-1 text-xs capitalize text-muted-foreground">
                {skillLevel} mode
              </span>
              {activeDatabaseName && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                  <Database className="h-3.5 w-3.5" />
                  {activeDatabaseName}
                </span>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
