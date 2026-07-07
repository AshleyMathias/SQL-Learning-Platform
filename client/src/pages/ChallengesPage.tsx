import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Play } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getAllLessons } from '@/services/lessons/lesson-service';
import { useProgressStore } from '@/stores/progress-store';

export function ChallengesPage() {
  const lessons = getAllLessons();
  const { solvedChallenges } = useProgressStore();
  const challenges = lessons.flatMap((l) =>
    l.sections
      .filter((s) => s.practice)
      .map((s) => ({
        id: s.practice!.id,
        lessonSlug: l.slug,
        lessonTitle: l.title,
        question: s.practice!.question,
        topic: l.topic,
      }))
  );

  useEffect(() => {
    document.title = 'Challenges — SQL Brush Up';
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Trophy className="h-8 w-8 text-amber-400" />
          Practice Challenges
        </h1>
        <p className="text-muted-foreground mt-1">
          {solvedChallenges.length} of {challenges.length} solved
        </p>
      </div>

      <div className="space-y-3">
        {challenges.map((c) => {
          const solved = solvedChallenges.includes(c.id);
          return (
            <Card key={c.id} className={solved ? 'border-success/30' : ''}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">{c.question}</CardTitle>
                    <CardDescription>{c.lessonTitle} · {c.topic}</CardDescription>
                  </div>
                  {solved && <span className="text-success text-sm font-medium">Solved ✓</span>}
                </div>
              </CardHeader>
              <CardContent>
                <Button size="sm" asChild>
                  <Link to={`/lessons/${c.lessonSlug}`}>
                    <Play className="h-4 w-4" /> {solved ? 'Review' : 'Start Challenge'}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
