import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Lightbulb, CheckCircle, Play } from 'lucide-react';
import { compareQueryResults } from '@sql-brush-up/shared';
import type { QueryError } from '@sql-brush-up/shared';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SqlEditor } from '@/components/playground/SqlEditor';
import { ResultTable } from '@/components/playground/ResultTable';
import { getLessonBySlug } from '@/services/lessons/lesson-service';
import { databaseManager } from '@/services/database';
import { getSampleDatabase } from '@/services/database/sample-databases';
import { useProgressStore } from '@/stores/progress-store';

export function LessonDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const lesson = getLessonBySlug(slug ?? '');
  const { addCompletedLesson, setContinueLessonId, setLessonProgress, addSolvedChallenge } = useProgressStore();

  const [sectionIndex, setSectionIndex] = useState(0);
  const [practiceSql, setPracticeSql] = useState('');
  const [hintLevel, setHintLevel] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [feedback, setFeedback] = useState<string[]>([]);
  const [passed, setPassed] = useState(false);
  const [error, setError] = useState<QueryError | null>(null);
  const [queryResult, setQueryResult] = useState<import('@sql-brush-up/shared').QueryResult | null>(null);
  const [dbId, setDbId] = useState<string | null>(null);

  const section = lesson?.sections[sectionIndex];
  const practice = section?.practice;

  useEffect(() => {
    if (!lesson) return;
    document.title = `${lesson.title} — SQL Brush Up`;
    setContinueLessonId(lesson.id);
    void setupDatabase();
  }, [lesson]);

  async function setupDatabase() {
    if (!practice) return;
    const sample = getSampleDatabase(practice.databaseId);
    if (!sample) return;
    const db = await databaseManager.loadSampleDatabase(sample.name, sample.id, sample.schemaSql, sample.dataSql);
    setDbId(db.id);
    if (practice.setupSql) {
      const engine = await databaseManager.getEngine(db.id);
      engine?.runMultiple(practice.setupSql);
    }
  }

  async function runPractice() {
    if (!practice || !dbId) return;
    setError(null);
    setFeedback([]);
    const engine = await databaseManager.getEngine(dbId);
    if (!engine) return;

    const { result: res, error: err } = engine.execute(practiceSql);
    if (err) {
      setError(err);
      return;
    }
    if (!res) return;

    setQueryResult(res);

    const comparison = compareQueryResults(
      { columns: res.columns, rows: res.rows },
      { columns: practice.expectedColumns, rows: practice.expectedRows },
      { orderMatters: practice.orderMatters, allowDuplicates: practice.allowDuplicates }
    );

    if (practice.expectedRows.length === 0 && res.rows.length > 0 && practice.expectedColumns.every((c) => res.columns.map((x) => x.toLowerCase()).includes(c.toLowerCase()))) {
      comparison.passed = true;
      comparison.feedback = ['Great! Your query returns the expected columns and data.'];
    }

    setFeedback(comparison.feedback);
    setPassed(comparison.passed);

    if (comparison.passed && lesson) {
      addSolvedChallenge(practice.id);
      const progress = Math.round(((sectionIndex + 1) / lesson.sections.length) * 100);
      setLessonProgress(lesson.id, progress);
      if (progress >= 100) {
        addCompletedLesson(lesson.id, lesson.topic);
      }
    }
  }

  if (!lesson) {
    return (
      <div className="p-6 text-center">
        <p>Lesson not found.</p>
        <Button asChild className="mt-4"><Link to="/lessons">Back to Lessons</Link></Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <Link to="/lessons" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Lessons
      </Link>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-3xl font-bold">{lesson.title}</h1>
        <p className="text-muted-foreground mt-2">{lesson.introduction}</p>
      </motion.div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {lesson.sections.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => { setSectionIndex(i); setHintLevel(0); setShowSolution(false); setPassed(false); }}
            className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap ${
              i === sectionIndex ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
            }`}
          >
            {s.title}
          </button>
        ))}
      </div>

      {section && (
        <Card>
          <CardHeader>
            <CardTitle>{section.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 prose prose-invert max-w-none">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{section.content.replace(/\*\*(.*?)\*\*/g, '$1')}</p>
            {section.analogy && (
              <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 text-sm">
                <strong>Real-life analogy:</strong> {section.analogy}
              </div>
            )}
            {section.visualType === 'table' && section.visualData && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm border border-border rounded-lg">
                  <thead>
                    <tr className="bg-muted">
                      {(section.visualData.headers as string[]).map((h: string) => (
                        <th key={h} className="px-3 py-2 text-left border-b border-border">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(section.visualData.rows as unknown[][]).map((row, i) => (
                      <tr key={i}>
                        {row.map((cell, j) => (
                          <td key={j} className="px-3 py-2 border-b border-border/50 font-mono text-xs">{String(cell)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {section.exampleSql && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Example:</p>
                <code className="block p-3 rounded-lg bg-muted font-mono text-sm">{section.exampleSql}</code>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {practice && (
        <Card className="border-primary/30">
          <CardHeader>
            <CardTitle className="text-base">Practice Challenge</CardTitle>
            <p className="text-sm text-muted-foreground">{practice.question}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-40 border border-border rounded-lg overflow-hidden">
              <SqlEditor value={practiceSql} onChange={setPracticeSql} onRun={() => void runPractice()} />
            </div>

            <div className="flex gap-2 flex-wrap">
              <Button size="sm" onClick={() => void runPractice()}>
                <Play className="h-4 w-4" /> Check Answer
              </Button>
              {hintLevel < practice.hints.length && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setHintLevel((h) => h + 1)}
                >
                  <Lightbulb className="h-4 w-4" /> Hint {hintLevel + 1}
                </Button>
              )}
              {hintLevel >= practice.hints.length && !showSolution && (
                <Button size="sm" variant="secondary" onClick={() => setShowSolution(true)}>
                  Reveal Solution
                </Button>
              )}
            </div>

            {practice.hints.slice(0, hintLevel).map((hint) => (
              <div key={hint.level} className="p-3 rounded-lg bg-primary/10 text-sm">
                <p className="font-medium text-primary">{hint.title}</p>
                <p className="text-muted-foreground mt-1">{hint.content}</p>
              </div>
            ))}

            {showSolution && (
              <div className="p-3 rounded-lg bg-muted text-sm space-y-2">
                <code className="block font-mono">{practice.solution}</code>
                <p className="text-muted-foreground">{practice.explanation}</p>
              </div>
            )}

            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 text-sm text-destructive">
                <p className="font-medium">{error.friendlyMessage}</p>
                <p className="text-xs mt-1">{error.suggestion}</p>
              </div>
            )}

            {feedback.length > 0 && (
              <div className={`p-3 rounded-lg text-sm ${passed ? 'bg-success/10 text-success' : 'bg-amber-500/10'}`}>
                {passed && <CheckCircle className="h-4 w-4 inline mr-2" />}
                {feedback.map((f, i) => <p key={i}>{f}</p>)}
              </div>
            )}

            {queryResult?.isSelect && <ResultTable result={queryResult} />}
          </CardContent>
        </Card>
      )}

      {lesson.summary.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Summary</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {lesson.summary.map((s, i) => <li key={i}>• {s}</li>)}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
