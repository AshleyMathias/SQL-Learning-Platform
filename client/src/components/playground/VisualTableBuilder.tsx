import { useState } from 'react';
import { Plus, Trash2, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const COLUMN_TYPES = ['INTEGER', 'TEXT', 'REAL', 'BLOB'];

export interface TableBuilderColumn {
  id: string;
  name: string;
  type: string;
  primaryKey: boolean;
  notNull: boolean;
}

interface VisualTableBuilderProps {
  disabled?: boolean;
  onCreateTable: (tableName: string, columns: TableBuilderColumn[]) => Promise<void>;
}

function createColumn(): TableBuilderColumn {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: '',
    type: 'TEXT',
    primaryKey: false,
    notNull: false,
  };
}

export function VisualTableBuilder({ disabled = false, onCreateTable }: VisualTableBuilderProps) {
  const [tableName, setTableName] = useState('');
  const [columns, setColumns] = useState<TableBuilderColumn[]>([
    { ...createColumn(), name: 'id', type: 'INTEGER', primaryKey: true, notNull: true },
    { ...createColumn(), name: 'name', type: 'TEXT', primaryKey: false, notNull: true },
  ]);

  function updateColumn(id: string, patch: Partial<TableBuilderColumn>) {
    setColumns((current) =>
      current.map((column) => {
        if (column.id !== id) return column;
        const next = { ...column, ...patch };
        if (patch.primaryKey === true) {
          next.notNull = true;
        }
        return next;
      })
    );
  }

  function addColumn() {
    setColumns((current) => [...current, createColumn()]);
  }

  function removeColumn(id: string) {
    setColumns((current) => current.filter((column) => column.id !== id));
  }

  async function handleCreate() {
    const normalizedName = tableName.trim();
    const validColumns = columns.filter((column) => column.name.trim());
    if (!normalizedName || validColumns.length === 0) return;
    await onCreateTable(normalizedName, validColumns);
  }

  return (
    <div className="rounded-xl border border-border bg-card/70 p-4">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold">
            <Wand2 className="h-4 w-4 text-primary" />
            Visual Table Builder
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Create your first table without writing `CREATE TABLE` manually.
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={addColumn} disabled={disabled}>
          <Plus className="h-4 w-4" />
          Add Column
        </Button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">Table name</label>
          <Input
            value={tableName}
            onChange={(event) => setTableName(event.target.value)}
            placeholder="students"
            disabled={disabled}
          />
        </div>

        <div className="space-y-2">
          {columns.map((column, index) => (
            <div key={column.id} className="rounded-lg border border-border bg-muted/20 p-3">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-medium text-muted-foreground">Column {index + 1}</p>
                {columns.length > 1 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeColumn(column.id)}
                    disabled={disabled}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="grid gap-2 md:grid-cols-[1.5fr_1fr_auto_auto]">
                <Input
                  value={column.name}
                  onChange={(event) => updateColumn(column.id, { name: event.target.value })}
                  placeholder="column_name"
                  disabled={disabled}
                />
                <select
                  value={column.type}
                  onChange={(event) => updateColumn(column.id, { type: event.target.value })}
                  className="rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm"
                  disabled={disabled}
                >
                  {COLUMN_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={column.primaryKey}
                    onChange={(event) =>
                      updateColumn(column.id, { primaryKey: event.target.checked, notNull: event.target.checked || column.notNull })
                    }
                    disabled={disabled}
                  />
                  Primary key
                </label>
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={column.notNull}
                    onChange={(event) => updateColumn(column.id, { notNull: event.target.checked })}
                    disabled={disabled || column.primaryKey}
                  />
                  Not null
                </label>
              </div>
            </div>
          ))}
        </div>

        <Button
          onClick={() => void handleCreate()}
          disabled={disabled || !tableName.trim() || columns.every((column) => !column.name.trim())}
        >
          Create Table
        </Button>
      </div>
    </div>
  );
}
