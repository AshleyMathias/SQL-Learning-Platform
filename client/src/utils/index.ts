import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatExecutionTime(ms: number): string {
  if (ms < 1) return '<1ms';
  if (ms < 1000) return `${ms.toFixed(1)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function debounce<T extends (...args: Parameters<T>) => void>(fn: T, delay: number): T {
  let timer: ReturnType<typeof setTimeout>;
  return ((...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  }) as T;
}

export function formatSql(sql: string): string {
  const keywords = [
    'SELECT', 'FROM', 'WHERE', 'GROUP BY', 'HAVING', 'ORDER BY', 'LIMIT', 'OFFSET',
    'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM', 'CREATE TABLE', 'DROP TABLE',
    'ALTER TABLE', 'JOIN', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'ON', 'AS',
    'UNION', 'UNION ALL', 'WITH', 'AND', 'OR', 'NOT', 'IN', 'BETWEEN', 'LIKE', 'IS NULL',
  ];

  let formatted = sql.trim();
  for (const kw of keywords.sort((a, b) => b.length - a.length)) {
    const regex = new RegExp(`\\b${kw}\\b`, 'gi');
    formatted = formatted.replace(regex, kw);
  }

  const breakBefore = ['FROM', 'WHERE', 'GROUP BY', 'HAVING', 'ORDER BY', 'LIMIT', 'JOIN', 'LEFT JOIN', 'INNER JOIN', 'ON', 'SET', 'VALUES'];
  for (const kw of breakBefore) {
    formatted = formatted.replace(new RegExp(`\\s+(${kw})\\b`, 'gi'), `\n$1`);
  }

  return formatted.trim();
}

export function isDestructiveQuery(sql: string): { destructive: boolean; reason?: string } {
  if (/\bDROP\s+DATABASE\b/i.test(sql)) {
    return { destructive: true, reason: 'This will permanently delete the entire database.' };
  }
  if (/\bDROP\s+TABLE\b/i.test(sql)) {
    return { destructive: true, reason: 'This will permanently delete the table and all its data.' };
  }
  if (/\bDELETE\s+FROM\b/i.test(sql) && !/\bWHERE\b/i.test(sql)) {
    return { destructive: true, reason: 'DELETE without WHERE removes ALL rows from the table.' };
  }
  if (/\bTRUNCATE\b/i.test(sql)) {
    return { destructive: true, reason: 'This will remove all data from the table.' };
  }
  return { destructive: false };
}

export function updateStreak(lastActiveDate: string, currentStreak: number): { streak: number; date: string } {
  const today = new Date().toISOString().split('T')[0];
  if (lastActiveDate === today) {
    return { streak: currentStreak, date: today };
  }
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  if (lastActiveDate === yesterdayStr) {
    return { streak: currentStreak + 1, date: today };
  }
  return { streak: 1, date: today };
}
