import { useEffect } from 'react';
import { Bookmark, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useProgressStore } from '@/stores/progress-store';
import { Link } from 'react-router-dom';

export function BookmarksPage() {
  const { bookmarks, removeBookmark } = useProgressStore();

  useEffect(() => {
    document.title = 'Bookmarks — SQL Brush Up';
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold flex items-center gap-3">
        <Bookmark className="h-8 w-8 text-primary" />
        Bookmarks
      </h1>

      {bookmarks.length === 0 ? (
        <p className="text-muted-foreground">No bookmarks yet. Bookmark lessons, queries, or challenges as you learn.</p>
      ) : (
        <div className="space-y-3">
          {bookmarks.map((b) => (
            <Card key={b.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">{b.title}</CardTitle>
                    <CardDescription className="capitalize">{b.type}</CardDescription>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => removeBookmark(b.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {b.type === 'lesson' && (
                  <Button size="sm" variant="outline" asChild>
                    <Link to={`/lessons/${b.referenceId}`}>Open</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
