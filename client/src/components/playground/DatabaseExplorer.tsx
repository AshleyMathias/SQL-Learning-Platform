import { useEffect, useState } from 'react';
import { ChevronRight, ChevronDown, Database, Table2, Key, Columns } from 'lucide-react';
import { databaseManager } from '@/services/database';
import type { TableInfo } from '@sql-brush-up/shared';
import { cn } from '@/utils';

interface DatabaseExplorerProps {
  databaseId: string | null;
  onSelectTable?: (tableName: string) => void;
  className?: string;
}

export function DatabaseExplorer({ databaseId, onSelectTable, className }: DatabaseExplorerProps) {
  const [tables, setTables] = useState<string[]>([]);
  const [expandedTables, setExpandedTables] = useState<Set<string>>(new Set());
  const [tableInfo, setTableInfo] = useState<Record<string, TableInfo>>({});
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    if (!databaseId) {
      setTables([]);
      return;
    }
    void loadTables();
  }, [databaseId]);

  async function loadTables() {
    if (!databaseId) return;
    const engine = await databaseManager.getEngine(databaseId);
    if (engine) setTables(engine.getTables());
  }

  async function toggleTable(tableName: string) {
    const next = new Set(expandedTables);
    if (next.has(tableName)) {
      next.delete(tableName);
    } else {
      next.add(tableName);
      if (!tableInfo[tableName] && databaseId) {
        const engine = await databaseManager.getEngine(databaseId);
        if (engine) {
          setTableInfo((prev) => ({ ...prev, [tableName]: engine.getTableInfo(tableName) }));
        }
      }
    }
    setExpandedTables(next);
  }

  if (!databaseId) {
    return (
      <div className={cn('p-4 text-sm text-muted-foreground', className)}>
        Select or create a database to explore tables.
      </div>
    );
  }

  return (
    <div className={cn('overflow-auto text-sm', className)}>
      <button
        type="button"
        className="flex w-full items-center gap-2 px-3 py-2 hover:bg-accent/50 rounded-md"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        <Database className="h-4 w-4 text-primary" />
        <span className="font-medium">Tables</span>
        <span className="ml-auto text-xs text-muted-foreground">{tables.length}</span>
      </button>

      {expanded && (
        <div className="ml-2">
          {tables.map((table) => (
            <div key={table}>
              <button
                type="button"
                className="flex w-full items-center gap-2 px-3 py-1.5 hover:bg-accent/50 rounded-md"
                onClick={() => void toggleTable(table)}
                onDoubleClick={() => onSelectTable?.(table)}
              >
                {expandedTables.has(table) ? (
                  <ChevronDown className="h-3.5 w-3.5" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5" />
                )}
                <Table2 className="h-3.5 w-3.5 text-amber-400" />
                <span>{table}</span>
                {tableInfo[table] && (
                  <span className="ml-auto text-xs text-muted-foreground">{tableInfo[table].rowCount} rows</span>
                )}
              </button>

              {expandedTables.has(table) && tableInfo[table] && (
                <div className="ml-6 border-l border-border pl-2">
                  {tableInfo[table].columns.map((col) => (
                    <div key={col.name} className="flex items-center gap-2 px-2 py-1 text-xs text-muted-foreground">
                      <Columns className="h-3 w-3" />
                      <span className={col.primaryKey ? 'text-primary font-medium' : ''}>{col.name}</span>
                      <span className="text-muted-foreground/60">{col.type}</span>
                      {col.primaryKey && <Key className="h-3 w-3 text-amber-400" />}
                    </div>
                  ))}
                  {tableInfo[table].constraints
                    .filter((c) => c.type === 'FOREIGN KEY')
                    .map((c) => (
                      <div key={c.name} className="flex items-center gap-2 px-2 py-1 text-xs text-cyan-400/80">
                        <Key className="h-3 w-3" />
                        FK → {c.references?.table}
                      </div>
                    ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
