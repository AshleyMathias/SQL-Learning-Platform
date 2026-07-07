import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { searchLessons } from '@/services/lessons/lesson-service';
import { debounce } from '@/utils';
import { Link } from 'react-router-dom';
import type { SearchResult } from '@sql-brush-up/shared';

const SQL_FUNCTIONS = [
  'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'COALESCE', 'NULLIF', 'UPPER', 'LOWER', 'LENGTH', 'SUBSTR', 'ROUND',
];

export function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);

  const doSearch = debounce((q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    const lessonResults = searchLessons(q);
    const funcResults: SearchResult[] = SQL_FUNCTIONS
      .filter((f) => f.toLowerCase().includes(q.toLowerCase()))
      .map((f) => ({
        type: 'function' as const,
        id: f,
        title: f,
        description: `SQL function: ${f}`,
        path: '/lessons',
      }));
    setResults([...lessonResults, ...funcResults]);
  }, 300);

  useEffect(() => {
    doSearch(query);
    document.title = 'Search — SQL Brush Up';
  }, [query]);

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Search</h1>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-10"
          placeholder="Search lessons, functions, topics..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search"
        />
      </div>

      <div className="space-y-2">
        {results.map((r) => (
          <Link key={`${r.type}-${r.id}`} to={r.path}>
            <Card className="hover:border-primary/40 transition-colors mb-2">
              <CardContent className="pt-4">
                <CardTitle className="text-sm">{r.title}</CardTitle>
                <CardDescription className="text-xs capitalize">{r.type} — {r.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
        {query && results.length === 0 && (
          <p className="text-muted-foreground text-sm">No results for "{query}"</p>
        )}
      </div>
    </div>
  );
}
