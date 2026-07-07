import { describe, it, expect } from 'vitest';
import { classifySqlError, compareQueryResults, explainQuery } from './sql-utils.js';

describe('classifySqlError', () => {
  it('classifies missing table errors', () => {
    const result = classifySqlError('no such table: users');
    expect(result.type).toBe('missing_table');
    expect(result.friendlyMessage).toContain('does not exist');
  });

  it('classifies syntax errors', () => {
    const result = classifySqlError('near "FROM": syntax error');
    expect(result.type).toBe('syntax');
  });

  it('classifies unsupported RIGHT JOIN', () => {
    const result = classifySqlError('RIGHT OUTER JOIN is not supported');
    expect(result.type).toBe('unsupported');
  });
});

describe('compareQueryResults', () => {
  it('passes when rows match', () => {
    const result = compareQueryResults(
      { columns: ['name'], rows: [{ name: 'Alice' }] },
      { columns: ['name'], rows: [[{ name: 'Alice' }]] },
      { orderMatters: false }
    );
    expect(result.passed).toBe(true);
  });

  it('fails when columns differ', () => {
    const result = compareQueryResults(
      { columns: ['name'], rows: [{ name: 'Alice' }] },
      { columns: ['id', 'name'], rows: [[{ id: 1, name: 'Alice' }]] },
      {}
    );
    expect(result.columnMatch).toBe(false);
  });
});

describe('explainQuery', () => {
  it('explains SELECT query execution order', () => {
    const result = explainQuery('SELECT name FROM students WHERE age > 18 ORDER BY name');
    expect(result.executionOrder).toContain('FROM');
    expect(result.executionOrder).toContain('WHERE');
    expect(result.summary).toContain('order');
  });
});
