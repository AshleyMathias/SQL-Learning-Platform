import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen, Code2, Database, Trophy, ArrowRight, Flame, Target, Clock, GraduationCap,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { usePreferencesStore } from '@/stores/preferences-store';
import { useProgressStore } from '@/stores/progress-store';
import { getAllLessons, getLessonsBySkillLevel } from '@/services/lessons/lesson-service';
import { SAMPLE_DATABASES } from '@/services/database/sample-databases';

export function DashboardPage() {
  const skillLevel = usePreferencesStore((s) => s.skillLevel);
  const progress = useProgressStore();
  const [greeting] = useState(() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  });

  const lessons = getLessonsBySkillLevel(skillLevel);
  const allLessons = getAllLessons();
  const completionPercent = allLessons.length
    ? Math.round((progress.completedLessons.length / allLessons.length) * 100)
    : 0;

  const continueLesson = progress.continueLessonId
    ? allLessons.find((l) => l.id === progress.continueLessonId)
    : lessons.find((l) => !progress.completedLessons.includes(l.id));
  const recommendedStart = lessons.find((l) => !progress.completedLessons.includes(l.id)) ?? lessons[0];

  useEffect(() => {
    document.title = 'Dashboard — SQL Brush Up';
  }, []);

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold">{greeting}!</h1>
        <p className="text-muted-foreground mt-1">
          {skillLevel === 'beginner' && 'Let\'s build your SQL foundation step by step.'}
          {skillLevel === 'intermediate' && 'Ready to level up your querying skills?'}
          {skillLevel === 'advanced' && 'Jump into practice or explore advanced topics.'}
        </p>
      </motion.div>

      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        {[
          { icon: Flame, label: 'Streak', value: `${progress.currentStreak} days` },
          { icon: Target, label: 'Lessons Done', value: progress.completedLessons.length },
          { icon: Trophy, label: 'Challenges', value: progress.solvedChallenges.length },
          { icon: Code2, label: 'Queries Run', value: progress.queryCount },
        ].map(({ icon: Icon, label, value }) => (
          <Card key={label}>
            <CardContent className="pt-6 flex items-center gap-3">
              <Icon className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {continueLesson && (
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Continue Learning
            </CardTitle>
            <CardDescription>{continueLesson.title}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link to={`/lessons/${continueLesson.slug}`}>
                Resume Lesson <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {skillLevel === 'beginner' && recommendedStart && progress.queryCount === 0 && (
        <Card className="border-emerald-500/30 bg-emerald-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-emerald-400" />
              Recommended First Step
            </CardTitle>
            <CardDescription>
              Start with one short lesson, then open the playground when you feel ready.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button asChild>
              <Link to={`/lessons/${recommendedStart.slug}`}>Start First Lesson</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/playground">Peek at Playground</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Learning Path</CardTitle>
            <CardDescription>{completionPercent}% complete</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={completionPercent} />
            <div className="space-y-2">
              {lessons.slice(0, 5).map((lesson) => (
                <Link
                  key={lesson.id}
                  to={`/lessons/${lesson.slug}`}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/50 text-sm"
                >
                  <span className={progress.completedLessons.includes(lesson.id) ? 'text-success' : ''}>
                    {lesson.title}
                  </span>
                  {progress.completedLessons.includes(lesson.id) ? '✓' : '→'}
                </Link>
              ))}
            </div>
            <Button variant="outline" asChild className="w-full">
              <Link to="/lessons">View All Lessons</Link>
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code2 className="h-5 w-5" /> Query Playground
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/playground">Open Playground</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" /> Sample Databases
              </CardTitle>
              <CardDescription>{SAMPLE_DATABASES.length} ready-to-use databases</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" asChild className="w-full">
                <Link to="/databases">Browse Databases</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {progress.queryHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" /> Recent Queries
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {progress.queryHistory.slice(0, 5).map((entry) => (
              <div key={entry.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/30 text-sm">
                <code className="font-mono text-xs truncate max-w-md">{entry.query}</code>
                <span className="text-xs text-muted-foreground">{entry.databaseName}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
