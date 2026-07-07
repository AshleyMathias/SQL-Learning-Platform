import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, Code2, Database, Trophy, Settings, Search, Bookmark, GraduationCap,
} from 'lucide-react';
import { cn } from '@/utils';

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

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="flex h-full w-16 flex-col items-center border-r border-border bg-card/50 py-4 gap-1">
      <Link to="/dashboard" className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20" aria-label="SQL Brush Up Home">
        <GraduationCap className="h-5 w-5 text-primary" />
      </Link>
      {navItems.map(({ to, icon: Icon, label }) => (
        <Link
          key={to}
          to={to}
          title={label}
          aria-label={label}
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-lg transition-colors',
            location.pathname.startsWith(to)
              ? 'bg-primary/20 text-primary'
              : 'text-muted-foreground hover:bg-accent hover:text-foreground'
          )}
        >
          <Icon className="h-5 w-5" />
        </Link>
      ))}
    </aside>
  );
}
