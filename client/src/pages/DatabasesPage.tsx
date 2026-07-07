import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Database, Plus, Trash2, Download, Upload, GraduationCap, BookOpen, Heart, ArrowRight,
  Landmark, Film, Building2, Users, ShoppingCart, UtensilsCrossed, Package,
  Briefcase, Warehouse, Globe,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { databaseManager } from '@/services/database';
import { SAMPLE_DATABASES } from '@/services/database/sample-databases';
import { useProgressStore } from '@/stores/progress-store';

const iconMap: Record<string, typeof Database> = {
  GraduationCap, BookOpen, Heart, Film, Landmark, Building2, Users,
  ShoppingCart, UtensilsCrossed, Package, Briefcase, Warehouse, Globe, Database,
};

export function DatabasesPage() {
  const navigate = useNavigate();
  const [databases, setDatabases] = useState<Awaited<ReturnType<typeof databaseManager.listDatabases>>>([]);
  const [newDbName, setNewDbName] = useState('');
  const [loading, setLoading] = useState<string | null>(null);
  const [createdDatabaseName, setCreatedDatabaseName] = useState<string | null>(null);
  const { setActiveDatabaseId } = useProgressStore();

  async function refresh() {
    setDatabases(await databaseManager.listDatabases());
  }

  useEffect(() => {
    void refresh();
    document.title = 'Databases — SQL Brush Up';
  }, []);

  async function createDatabase() {
    if (!newDbName.trim()) return;
    const db = await databaseManager.createDatabase(newDbName.trim());
    setActiveDatabaseId(db.id);
    setCreatedDatabaseName(db.name);
    setNewDbName('');
    await refresh();
  }

  async function loadSample(sampleId: string) {
    setLoading(sampleId);
    const sample = SAMPLE_DATABASES.find((s) => s.id === sampleId);
    if (!sample) return;
    const db = await databaseManager.loadSampleDatabase(sample.name, sample.id, sample.schemaSql, sample.dataSql);
    setActiveDatabaseId(db.id);
    await refresh();
    setLoading(null);
  }

  async function deleteDatabase(id: string, name: string) {
    if (!confirm(`Delete database "${name}"? This cannot be undone.`)) return;
    await databaseManager.deleteDatabase(id);
    await refresh();
  }

  async function exportDb(id: string, name: string) {
    const bytes = await databaseManager.exportDatabase(id);
    if (!bytes) return;
    const blob = new Blob([new Uint8Array(bytes)], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name}.sqlite`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function importDb(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const buffer = await file.arrayBuffer();
    const name = file.name.replace(/\.sqlite$/, '');
    await databaseManager.importDatabase(name, new Uint8Array(buffer));
    await refresh();
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Databases</h1>
        <p className="text-muted-foreground mt-1">Create, import, or load sample databases</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Create Database</CardTitle>
          <CardDescription>
            This creates an empty SQLite database. Next, open the playground to create tables and insert data.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Input
            placeholder="Database name..."
            value={newDbName}
            onChange={(e) => setNewDbName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && void createDatabase()}
          />
          <Button onClick={() => void createDatabase()}><Plus className="h-4 w-4" /> Create</Button>
          <label>
            <Button variant="outline" asChild><span><Upload className="h-4 w-4" /> Import</span></Button>
            <input type="file" accept=".sqlite,.db" className="hidden" onChange={(e) => void importDb(e)} />
          </label>
        </CardContent>
      </Card>

      {createdDatabaseName && (
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">`{createdDatabaseName}` is ready</CardTitle>
            <CardDescription>
              A database file has been created successfully. It is empty right now, so the next step is to add tables and rows in the SQL Playground.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button onClick={() => navigate('/playground')}>
              Open Playground <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={() => setCreatedDatabaseName(null)}>
              Dismiss
            </Button>
          </CardContent>
        </Card>
      )}

      {databases.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3">Your Databases</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {databases.map((db) => (
              <Card key={db.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Database className="h-4 w-4 text-primary" />
                    {db.name}
                    {db.isSample && <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">Sample</span>}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Created {new Date(db.createdAt).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setActiveDatabaseId(db.id);
                      navigate('/playground');
                    }}
                  >
                    Use in Playground
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => void exportDb(db.id, db.name)}>
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => void deleteDatabase(db.id, db.name)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold mb-3">Sample Databases</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {SAMPLE_DATABASES.map((sample) => {
            const Icon = iconMap[sample.icon] ?? Database;
            return (
              <Card key={sample.id} className="hover:border-primary/40 transition-colors">
                <CardHeader className="pb-2">
                  <Icon className="h-6 w-6 text-primary mb-2" />
                  <CardTitle className="text-base">{sample.name}</CardTitle>
                  <CardDescription className="text-xs">{sample.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground mb-3">
                    {sample.tableCount} tables · {sample.rowCount} rows · {sample.category}
                  </p>
                  <Button
                    size="sm"
                    className="w-full"
                    disabled={loading === sample.id}
                    onClick={() => void loadSample(sample.id)}
                  >
                    {loading === sample.id ? 'Loading...' : 'Load Database'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
