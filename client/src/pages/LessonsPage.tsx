import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { getAllLessons } from '@/services/lessons/lesson-service';
import { useProgressStore } from '@/stores/progress-store';
import { usePreferencesStore } from '@/stores/preferences-store';

export function LessonsPage() {
  const lessons = getAllLessons();
  const skillLevel = usePreferencesStore((s) => s.skillLevel);
  const { completedLessons, lessonProgress } = useProgressStore();

  const filtered = skillLevel === 'advanced'
    ? lessons
    : lessons.filter((l) => l.skillLevel.includes(skillLevel));

  useEffect(() => {
    document.title = 'Lessons — SQL Brush Up';
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Learning Path</h1>
        <p className="text-muted-foreground mt-1">
          {filtered.length} lessons tailored for {skillLevel} level
        </p>
      </div>

      <div className="space-y-3">
        {filtered.map((lesson, i) => {
          const done = completedLessons.includes(lesson.id);
          const prog = lessonProgress[lesson.id] ?? (done ? 100 : 0);
          return (
            <motion.div key={lesson.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link to={`/lessons/${lesson.slug}`}>
                <Card className="hover:border-primary/40 transition-colors">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                          {lesson.order}
                        </span>
                        <div>
                          <CardTitle className="text-base flex items-center gap-2">
                            {lesson.title}
                            {done && <CheckCircle className="h-4 w-4 text-success" />}
                          </CardTitle>
                          <CardDescription>{lesson.description}</CardDescription>
                        </div>
                      </div>
                      <BookOpen className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <Progress value={prog} className="flex-1" />
                      <span className="text-xs text-muted-foreground w-10">{prog}%</span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      {lesson.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
