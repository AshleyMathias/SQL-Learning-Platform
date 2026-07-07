import { useCallback, useEffect, useState } from 'react';
import { Play, Square, AlignLeft, Lightbulb, AlertTriangle } from 'lucide-react';
import { explainQuery } from '@sql-brush-up/shared';
import type { QueryError, QueryResult } from '@sql-brush-up/shared';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DatabaseExplorer } from '@/components/playground/DatabaseExplorer';
import { SqlEditor } from '@/components/playground/SqlEditor';
import { ResultTable } from '@/components/playground/ResultTable';
import { QueryVisualizer } from '@/components/playground/QueryVisualizer';
import { databaseManager } from '@/services/database';
import { useProgressStore } from '@/stores/progress-store';
import { formatSql, isDestructiveQuery, formatExecutionTime } from '@/utils';

export function PlaygroundPage() {
  const { activeDatabaseId, setActiveDatabaseId, addQueryHistory, incrementQueryCount } = useProgressStore();
  const [databases, setDatabases] = useState<{ id: string; name: string }[]>([]);
  const [sql, setSql] = useState('SELECT * FROM students LIMIT 10;');
  const [result, setResult] = useState<QueryResult | null>(null);
  const [error, setError] = useState<QueryError | null>(null);
  const [running, setRunning] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingQuery, setPendingQuery] = useState('');

  const loadDatabases = useCallback(async () => {
    const dbs = await databaseManager.listDatabases();
    setDatabases(dbs.map((d) => ({ id: d.id, name: d.name })));
    if (!activeDatabaseId && dbs.length > 0) {
      setActiveDatabaseId(dbs[0].id);
    }
  }, [activeDatabaseId, setActiveDatabaseId]);

  useEffect(() => {
    void loadDatabases();
    document.title = 'Playground — SQL Brush Up';
  }, [loadDatabases]);

  async function executeQuery(query: string) {
    if (!activeDatabaseId) {
      setError({
        type: 'generic',
        message: 'No database selected',
        friendlyMessage: 'Select or create a database first.',
        suggestion: 'Go to Databases to load a sample database or create a new one.',
      });
      return;
    }

    const destructive = isDestructiveQuery(query);
    if (destructive.destructive) {
      setPendingQuery(query);
      setShowConfirm(true);
      return;
    }

    await runQuery(query);
  }

  async function runQuery(query: string) {
    setRunning(true);
    setError(null);
    setResult(null);

    try {
      const engine = await databaseManager.getEngine(activeDatabaseId!);
      if (!engine) throw new Error('Database not found');

      const { result: res, error: err } = engine.execute(query);
      if (err) {
        setError(err);
      } else if (res) {
        setResult(res);
        await databaseManager.persistEngine(activeDatabaseId!);
        incrementQueryCount();
        const db = databases.find((d) => d.id === activeDatabaseId);
        addQueryHistory({
          databaseId: activeDatabaseId!,
          databaseName: db?.name ?? 'Unknown',
          query,
          executionTimeMs: res.executionTimeMs,
          success: true,
          rowCount: res.rowCount,
        });
      }
    } finally {
      setRunning(false);
      setShowConfirm(false);
    }
  }

  function handleTableSelect(tableName: string) {
    setSql((prev) => {
      if (prev.trim()) return `${prev}\nSELECT * FROM ${tableName} LIMIT 10;`;
      return `SELECT * FROM ${tableName} LIMIT 10;`;
    });
  }

  const explanation = result ? explainQuery(sql) : null;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold">SQL Playground</h1>
          <select
            className="rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-sm"
            value={activeDatabaseId ?? ''}
            onChange={(e) => setActiveDatabaseId(e.target.value || null)}
            aria-label="Select database"
          >
            <option value="">Select database...</option>
            {databases.map((db) => (
              <option key={db.id} value={db.id}>{db.name}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setSql(formatSql(sql))}>
            <AlignLeft className="h-4 w-4" /> Format
          </Button>
          <Button size="sm" onClick={() => void executeQuery(sql)} disabled={running}>
            {running ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            Run (Ctrl+Enter)
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-56 border-r border-border overflow-auto shrink-0">
          <DatabaseExplorer databaseId={activeDatabaseId} onSelectTable={handleTableSelect} />
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 min-h-[200px]">
            <SqlEditor value={sql} onChange={setSql} onRun={() => void executeQuery(sql)} />
          </div>
        </div>

        <div className="w-96 border-l border-border flex flex-col overflow-hidden shrink-0">
          <Tabs defaultValue="results" className="flex flex-col h-full">
            <TabsList className="mx-2 mt-2">
              <TabsTrigger value="results">Results</TabsTrigger>
              <TabsTrigger value="explain">Explain</TabsTrigger>
              <TabsTrigger value="visualize">Visualize</TabsTrigger>
            </TabsList>
            <TabsContent value="results" className="flex-1 overflow-auto m-0 p-0">
              {error && (
                <div className="p-4 space-y-2">
                  <div className="flex items-start gap-2 text-destructive">
                    <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">{error.friendlyMessage}</p>
                      <p className="text-xs text-muted-foreground mt-1 font-mono">{error.message}</p>
                    </div>
                  </div>
                  {error.suggestion && (
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/10 text-sm">
                      <Lightbulb className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <p>{error.suggestion}</p>
                    </div>
                  )}
                </div>
              )}
              {result && !result.isSelect && (
                <div className="p-4 text-sm">
                  <p className="text-success font-medium">{result.messages[0]}</p>
                  <p className="text-muted-foreground text-xs mt-1">{formatExecutionTime(result.executionTimeMs)}</p>
                </div>
              )}
              {result?.isSelect && <ResultTable result={result} />}
              {!error && !result && (
                <p className="p-4 text-sm text-muted-foreground">Run a query to see results.</p>
              )}
            </TabsContent>
            <TabsContent value="explain" className="flex-1 overflow-auto p-4 m-0">
              {explanation ? (
                <div className="space-y-3 text-sm">
                  <p className="text-muted-foreground">{explanation.summary}</p>
                  {explanation.clauses.map((c) => (
                    <div key={c.clause} className="p-3 rounded-lg bg-muted/30">
                      <p className="font-mono font-medium text-primary">{c.clause}</p>
                      <p className="text-muted-foreground text-xs mt-1">{c.description}</p>
                      {c.sqlFragment && (
                        <code className="block mt-2 text-xs font-mono bg-background p-2 rounded">{c.sqlFragment}</code>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Run a successful SELECT query to see explanation.</p>
              )}
            </TabsContent>
            <TabsContent value="visualize" className="flex-1 overflow-auto m-0">
              <QueryVisualizer sql={sql} isVisible={!!result?.isSelect} />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-xl p-6 max-w-md space-y-4">
            <h3 className="font-semibold flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" /> Destructive Operation
            </h3>
            <p className="text-sm text-muted-foreground">{isDestructiveQuery(pendingQuery).reason}</p>
            <p className="text-xs font-mono bg-muted p-2 rounded">{pendingQuery}</p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowConfirm(false)}>Cancel</Button>
              <Button variant="destructive" onClick={() => void runQuery(pendingQuery)}>Execute Anyway</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
