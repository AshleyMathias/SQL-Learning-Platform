import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';
import type { QueryResult } from '@sql-brush-up/shared';
import { cn, formatExecutionTime } from '@/utils';

interface ResultTableProps {
  result: QueryResult | null;
  className?: string;
}

export function ResultTable({ result, className }: ResultTableProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const rows = result?.rows ?? [];

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 36,
    overscan: 10,
  });

  if (!result || !result.isSelect) return null;

  return (
    <div className={cn('flex flex-col', className)}>
      <div className="flex items-center gap-4 px-3 py-2 text-xs text-muted-foreground border-b border-border">
        <span>{result.rowCount} row(s)</span>
        <span>{formatExecutionTime(result.executionTimeMs)}</span>
      </div>
      <div ref={parentRef} className="overflow-auto flex-1 max-h-[400px]">
        <table className="w-full text-sm border-collapse">
          <thead className="sticky top-0 bg-card z-10">
            <tr>
              {result.columns.map((col) => (
                <th key={col} className="text-left px-3 py-2 font-medium border-b border-border text-muted-foreground">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: 'relative' }}>
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const row = rows[virtualRow.index];
              return (
                <tr
                  key={virtualRow.index}
                  className="hover:bg-accent/30"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  {result.columns.map((col) => (
                    <td key={col} className="px-3 py-1.5 border-b border-border/50 font-mono text-xs">
                      {row[col] === null ? (
                        <span className="text-muted-foreground italic">NULL</span>
                      ) : (
                        String(row[col])
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
