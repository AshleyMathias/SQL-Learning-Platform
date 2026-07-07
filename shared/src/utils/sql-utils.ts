import type { QueryError } from '@sql-brush-up/shared';

const SYNTAX_PATTERNS: Array<{ pattern: RegExp; type: QueryError['type']; friendly: string; suggestion?: string }> = [
  {
    pattern: /no such table:?\s*(\S+)?/i,
    type: 'missing_table',
    friendly: 'The table you referenced does not exist in this database.',
    suggestion: 'Check the Database Explorer on the left for available table names. Table names are case-sensitive in some databases.',
  },
  {
    pattern: /no such column:?\s*(\S+)?/i,
    type: 'missing_column',
    friendly: 'A column name in your query does not exist in the table.',
    suggestion: 'Expand the table in the Database Explorer to see all available columns and their types.',
  },
  {
    pattern: /syntax error/i,
    type: 'syntax',
    friendly: 'SQLite could not understand your SQL syntax.',
    suggestion: 'Check for missing commas, unmatched quotes, or misspelled keywords like SELECT, FROM, WHERE.',
  },
  {
    pattern: /near\s+".+"/i,
    type: 'syntax',
    friendly: 'There is a syntax error near the highlighted part of your query.',
    suggestion: 'Look at the word before and after the error location. Common issues: missing semicolon, extra comma, or wrong keyword order.',
  },
  {
    pattern: /ambiguous column name/i,
    type: 'incorrect_join',
    friendly: 'A column name appears in multiple tables, so SQLite does not know which one you mean.',
    suggestion: 'Use table aliases: instead of "name", write "students.name" or "s.name".',
  },
  {
    pattern: /HAVING clause on a non-aggregate query/i,
    type: 'wrong_having',
    friendly: 'HAVING is only used with GROUP BY and aggregate functions.',
    suggestion: 'Use WHERE to filter rows before grouping, and HAVING to filter groups after aggregation.',
  },
  {
    pattern: /misuse of aggregate function/i,
    type: 'wrong_group_by',
    friendly: 'You are mixing aggregate functions (COUNT, SUM, etc.) with regular columns incorrectly.',
    suggestion: 'Every non-aggregate column in SELECT must appear in GROUP BY.',
  },
  {
    pattern: /RIGHT OUTER JOIN|FULL OUTER JOIN|FULL JOIN/i,
    type: 'unsupported',
    friendly: 'SQLite does not support RIGHT JOIN or FULL OUTER JOIN directly.',
    suggestion: 'Use LEFT JOIN with tables swapped, or combine two LEFT JOINs with UNION to simulate a FULL JOIN.',
  },
];

export function classifySqlError(rawMessage: string): QueryError {
  for (const entry of SYNTAX_PATTERNS) {
    if (entry.pattern.test(rawMessage)) {
      return {
        type: entry.type,
        message: rawMessage,
        friendlyMessage: entry.friendly,
        suggestion: entry.suggestion,
      };
    }
  }

  if (/WHERE/i.test(rawMessage) && /column/i.test(rawMessage)) {
    return {
      type: 'incorrect_where',
      message: rawMessage,
      friendlyMessage: 'Your WHERE clause has an issue — check column names, operators, and value types.',
      suggestion: 'Compare text with quotes: name = \'Alice\'. Compare numbers without quotes: age > 18.',
    };
  }

  return {
    type: 'generic',
    message: rawMessage,
    friendlyMessage: 'Something went wrong while running your query.',
    suggestion: 'Read the error message carefully, then check your table and column names in the Database Explorer.',
  };
}

export function explainQuery(sql: string): {
  clauses: Array<{ clause: string; description: string; sqlFragment?: string }>;
  executionOrder: string[];
  summary: string;
} {
  const normalized = sql.trim().replace(/\s+/g, ' ');
  const clauses: Array<{ clause: string; description: string; sqlFragment?: string }> = [];
  const executionOrder: string[] = [];

  const clausePatterns: Array<{ regex: RegExp; clause: string; description: string; order: number }> = [
    { regex: /\bFROM\b[\s\S]*?(?=\bWHERE\b|\bGROUP\b|\bHAVING\b|\bORDER\b|\bLIMIT\b|$)/i, clause: 'FROM', description: 'Identifies which table(s) to read data from.', order: 2 },
    { regex: /\bWHERE\b[\s\S]*?(?=\bGROUP\b|\bHAVING\b|\bORDER\b|\bLIMIT\b|$)/i, clause: 'WHERE', description: 'Filters individual rows before grouping.', order: 3 },
    { regex: /\bGROUP BY\b[\s\S]*?(?=\bHAVING\b|\bORDER\b|\bLIMIT\b|$)/i, clause: 'GROUP BY', description: 'Groups rows that share the same values into summary rows.', order: 4 },
    { regex: /\bHAVING\b[\s\S]*?(?=\bORDER\b|\bLIMIT\b|$)/i, clause: 'HAVING', description: 'Filters groups after aggregation (like WHERE for groups).', order: 5 },
    { regex: /\bSELECT\b[\s\S]*?(?=\bFROM\b|$)/i, clause: 'SELECT', description: 'Chooses which columns to return in the result.', order: 6 },
    { regex: /\bORDER BY\b[\s\S]*?(?=\bLIMIT\b|$)/i, clause: 'ORDER BY', description: 'Sorts the final result set.', order: 7 },
    { regex: /\bLIMIT\b[\s\S]*$/i, clause: 'LIMIT', description: 'Restricts how many rows are returned.', order: 8 },
  ];

  if (/\bSELECT\b/i.test(normalized)) {
    const selectMatch = normalized.match(/\bSELECT\b[\s\S]*?(?=\bFROM\b|$)/i);
    clauses.push({
      clause: 'SELECT',
      description: 'Chooses which columns or expressions appear in your result.',
      sqlFragment: selectMatch?.[0]?.trim(),
    });
  }

  for (const pattern of clausePatterns) {
    if (pattern.clause === 'SELECT') continue;
    const match = normalized.match(pattern.regex);
    if (match) {
      clauses.push({
        clause: pattern.clause,
        description: pattern.description,
        sqlFragment: match[0].trim(),
      });
      executionOrder.push(pattern.clause);
    }
  }

  const defaultOrder = ['FROM', 'WHERE', 'GROUP BY', 'HAVING', 'SELECT', 'ORDER BY', 'LIMIT'];
  const finalOrder = defaultOrder.filter((c) => executionOrder.includes(c) || (c === 'SELECT' && /\bSELECT\b/i.test(normalized)));

  if (finalOrder.length === 0 && /\bSELECT\b/i.test(normalized)) {
    finalOrder.push('SELECT');
  }

  const summary = finalOrder.length > 0
    ? `SQL executes in this order: ${finalOrder.join(' → ')}. This is different from how you write it!`
    : 'Run a SELECT query to see how SQL clauses execute step by step.';

  return { clauses, executionOrder: finalOrder, summary };
}

export function compareQueryResults(
  actual: { columns: string[]; rows: Record<string, unknown>[] },
  expected: { columns: string[]; rows: Record<string, unknown>[][] },
  options: { orderMatters?: boolean; allowDuplicates?: boolean } = {}
): {
  passed: boolean;
  score: number;
  feedback: string[];
  columnMatch: boolean;
  rowMatch: boolean;
  orderMatch: boolean;
  valueMatch: boolean;
} {
  const { orderMatters = false, allowDuplicates = true } = options;
  const feedback: string[] = [];
  let score = 0;
  const maxScore = 100;

  const expectedColumns = expected.columns.map((c) => c.toLowerCase());
  const actualColumns = actual.columns.map((c) => c.toLowerCase());
  const columnMatch =
    expectedColumns.length === actualColumns.length &&
    expectedColumns.every((c, i) => c === actualColumns[i]);

  if (columnMatch) {
    score += 25;
  } else {
    feedback.push(`Expected columns: [${expected.columns.join(', ')}]. Got: [${actual.columns.join(', ')}].`);
  }

  const flatExpected = expected.rows.flat();
  const valueMatch = rowsMatch(actual.rows, flatExpected, allowDuplicates);
  if (valueMatch) {
    score += 50;
  } else {
    feedback.push('Some values in your result do not match the expected output.');
  }

  const rowMatch = actual.rows.length === flatExpected.length;
  if (rowMatch) {
    score += 15;
  } else {
    feedback.push(`Expected ${flatExpected.length} row(s), but got ${actual.rows.length}.`);
  }

  let orderMatch = true;
  if (orderMatters) {
    orderMatch = rowsMatchOrdered(actual.rows, flatExpected);
    if (orderMatch) {
      score += 10;
    } else {
      feedback.push('Rows are correct but in the wrong order. Add ORDER BY to match.');
    }
  } else {
    score += 10;
  }

  const passed = columnMatch && rowMatch && valueMatch && (orderMatters ? orderMatch : true);

  if (passed) {
    feedback.push('Perfect! Your query returns the expected result.');
  }

  return { passed, score: Math.min(score, maxScore), feedback, columnMatch, rowMatch, orderMatch, valueMatch };
}

function rowsMatch(
  actual: Record<string, unknown>[],
  expected: Record<string, unknown>[],
  allowDuplicates: boolean
): boolean {
  if (actual.length !== expected.length) return false;

  const normalize = (row: Record<string, unknown>) =>
    JSON.stringify(
      Object.keys(row)
        .sort()
        .reduce<Record<string, unknown>>((acc, key) => {
          acc[key] = row[key];
          return acc;
        }, {})
    );

  const actualSet = actual.map(normalize);
  const expectedSet = expected.map(normalize);

  if (!allowDuplicates) {
    return actualSet.every((a, i) => a === expectedSet[i]);
  }

  const expectedCopy = [...expectedSet];
  for (const a of actualSet) {
    const idx = expectedCopy.indexOf(a);
    if (idx === -1) return false;
    expectedCopy.splice(idx, 1);
  }
  return expectedCopy.length === 0;
}

function rowsMatchOrdered(
  actual: Record<string, unknown>[],
  expected: Record<string, unknown>[]
): boolean {
  if (actual.length !== expected.length) return false;
  return actual.every((row, i) => JSON.stringify(row) === JSON.stringify(expected[i]));
}
