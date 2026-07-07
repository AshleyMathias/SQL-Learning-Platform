import initSqlJs from 'sql.js/dist/sql-wasm.js';
import type { Database, SqlJsStatic } from 'sql.js';
import type { ColumnInfo, ConstraintInfo, QueryError, QueryResult, TableInfo } from '@sql-brush-up/shared';
import { classifySqlError } from '@sql-brush-up/shared';

let SQL: SqlJsStatic | null = null;

export async function initSqlEngine(): Promise<SqlJsStatic> {
  if (SQL) return SQL;
  SQL = await initSqlJs({
    locateFile: (file) => `/${file}`,
  });
  return SQL;
}

export class SqlEngine {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  static async createEmpty(): Promise<SqlEngine> {
    const sql = await initSqlEngine();
    return new SqlEngine(new sql.Database());
  }

  static async fromBytes(data: Uint8Array): Promise<SqlEngine> {
    const sql = await initSqlEngine();
    return new SqlEngine(new sql.Database(data));
  }

  export(): Uint8Array {
    return this.db.export();
  }

  runMultiple(sql: string): void {
    this.db.run(sql);
  }

  execute(query: string): { result?: QueryResult; error?: QueryError } {
    const start = performance.now();
    const trimmed = query.trim();

    if (!trimmed) {
      return {
        error: {
          type: 'syntax',
          message: 'Empty query',
          friendlyMessage: 'Type a SQL query before running it.',
          suggestion: 'Try: SELECT * FROM your_table_name;',
        },
      };
    }

    try {
      const isSelect = /^\s*(WITH\b|SELECT\b|PRAGMA\b|EXPLAIN\b)/i.test(trimmed);
      const results = this.db.exec(trimmed);
      const executionTimeMs = performance.now() - start;

      if (!isSelect) {
        const changes = this.db.getRowsModified();
        return {
          result: {
            columns: [],
            rows: [],
            rowCount: 0,
            affectedRows: changes,
            executionTimeMs,
            messages: [`Query executed successfully. ${changes} row(s) affected.`],
            isSelect: false,
          },
        };
      }

      if (results.length === 0) {
        return {
          result: {
            columns: [],
            rows: [],
            rowCount: 0,
            affectedRows: 0,
            executionTimeMs,
            messages: ['Query returned no rows.'],
            isSelect: true,
          },
        };
      }

      const first = results[0];
      const columns = first.columns;
      const rows = first.values.map((row) => {
        const record: Record<string, unknown> = {};
        columns.forEach((col, i) => {
          record[col] = row[i];
        });
        return record;
      });

      return {
        result: {
          columns,
          rows,
          rowCount: rows.length,
          affectedRows: 0,
          executionTimeMs,
          messages: [`${rows.length} row(s) returned.`],
          isSelect: true,
        },
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return { error: classifySqlError(message) };
    }
  }

  getTables(): string[] {
    const result = this.db.exec(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
    );
    if (!result.length) return [];
    return result[0].values.map((row) => String(row[0]));
  }

  getTableInfo(tableName: string): TableInfo {
    const columns: ColumnInfo[] = [];
    const stmt = this.db.prepare(`PRAGMA table_info("${tableName.replace(/"/g, '""')}")`);
    while (stmt.step()) {
      const row = stmt.getAsObject() as Record<string, unknown>;
      columns.push({
        name: String(row.name),
        type: String(row.type || 'TEXT'),
        notNull: Boolean(row.notnull),
        primaryKey: Boolean(row.pk),
        defaultValue: row.dflt_value != null ? String(row.dflt_value) : null,
      });
    }
    stmt.free();

    const constraints: ConstraintInfo[] = [];
    const fkStmt = this.db.prepare(`PRAGMA foreign_key_list("${tableName.replace(/"/g, '""')}")`);
    const fkMap = new Map<number, ConstraintInfo>();
    while (fkStmt.step()) {
      const row = fkStmt.getAsObject() as Record<string, unknown>;
      const id = Number(row.id);
      if (!fkMap.has(id)) {
        fkMap.set(id, {
          name: `fk_${tableName}_${row.from}`,
          type: 'FOREIGN KEY',
          columns: [String(row.from)],
          references: {
            table: String(row.table),
            columns: [String(row.to)],
          },
        });
      }
    }
    fkStmt.free();
    constraints.push(...fkMap.values());

    const pkCols = columns.filter((c) => c.primaryKey).map((c) => c.name);
    if (pkCols.length > 0) {
      constraints.unshift({
        name: `pk_${tableName}`,
        type: 'PRIMARY KEY',
        columns: pkCols,
      });
    }

    let rowCount = 0;
    try {
      const countResult = this.db.exec(`SELECT COUNT(*) as cnt FROM "${tableName.replace(/"/g, '""')}"`);
      if (countResult.length) {
        rowCount = Number(countResult[0].values[0][0]);
      }
    } catch {
      rowCount = 0;
    }

    return { name: tableName, columns, constraints, rowCount };
  }

  close(): void {
    this.db.close();
  }
}
