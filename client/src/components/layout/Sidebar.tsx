import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, Code2, Database, Trophy, Settings, Search, Bookmark, GraduationCap, PanelLeftClose, PanelLeftOpen,
} from 'lucide-react';
import { cn } from '@/utils';
import { usePreferencesStore } from '@/stores/preferences-store';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/lessons', icon: BookOpen, label: 'Lessons' },
  { to: '/playground', icon: Code2, label: 'Playground' },
  { to: '/databases', icon: Database, label: 'Databases' },
  { to: '/challenges', icon: Trophy, label: 'Challenges' },
  { to: '/bookmarks', icon: Bookmark, label: 'Bookmarks' },
  { to: '/search', icon: Search, label: 'Search' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const location = useLocation();
  const skillLevel = usePreferencesStore((s) => s.skillLevel);

  if (isCollapsed) {
    return (
      <aside className="hidden h-full w-[84px] shrink-0 flex-col items-center border-r border-border bg-card/60 px-3 py-4 md:flex">
        <Link
          to="/dashboard"
          aria-label="SQL Brush Up Home"
          className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary transition-colors hover:bg-primary/20"
          title="SQL Brush Up"
        >
          <GraduationCap className="h-5 w-5" />
        </Link>

        <button
          type="button"
          onClick={onToggle}
          aria-label="Open sidebar"
          title="Open sidebar"
          className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background/50 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <PanelLeftOpen className="h-4.5 w-4.5" />
        </button>

        <nav className="flex w-full flex-col items-center gap-2">
          {navItems.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              title={label}
              aria-label={label}
              className={cn(
                'flex h-11 w-11 items-center justify-center rounded-2xl transition-colors',
                location.pathname.startsWith(to)
                  ? 'bg-primary/15 text-primary ring-1 ring-primary/20'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              <Icon className="h-4.5 w-4.5" />
            </Link>
          ))}
        </nav>

        <div className="mt-auto flex flex-col items-center gap-3">
          <span className="rounded-full bg-muted px-2 py-1 text-[10px] uppercase tracking-wide text-muted-foreground">
            {skillLevel.slice(0, 3)}
          </span>
          <div className="h-1.5 w-8 rounded-full bg-border" />
        </div>
      </aside>
    );
  }

  return (
    <aside className="hidden h-full w-64 shrink-0 flex-col border-r border-border bg-card/60 p-4 transition-[width,padding] duration-300 ease-out md:flex">
      <div className="mb-4 flex items-center justify-between gap-2">
        <Link
          to="/dashboard"
          className="flex min-w-0 items-center gap-3 rounded-2xl px-3 py-2 hover:bg-accent/40"
          aria-label="SQL Brush Up Home"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
            <GraduationCap className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold">SQL Brush Up</p>
            <p className="text-xs text-muted-foreground capitalize">{skillLevel} path</p>
          </div>
        </Link>
        <button
          type="button"
          onClick={onToggle}
          aria-label="Close sidebar"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <PanelLeftClose className="h-4.5 w-4.5" />
        </button>
      </div>

      <nav className="space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <Link
            key={to}
            to={to}
            title={label}
            aria-label={label}
            className={cn(
              'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors',
              location.pathname.startsWith(to)
                ? 'bg-primary/15 text-primary'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground'
            )}
          >
            <Icon className="h-4.5 w-4.5 shrink-0" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto rounded-2xl border border-border bg-muted/30 p-3">
        <p className="text-sm font-medium">Quick tip</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Start with `Lessons`, then use `Playground` to practice the same idea on real data.
        </p>
      </div>
    </aside>
  );
}
