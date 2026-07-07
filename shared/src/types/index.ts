export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';

export type ThemeMode = 'dark' | 'light' | 'system';

export interface UserPreferences {
  skillLevel: SkillLevel;
  theme: ThemeMode;
  fontSize: number;
  editorFont: string;
  editorZoom: number;
  onboardingComplete: boolean;
}

export interface DatabaseInfo {
  id: string;
  name: string;
  isSample: boolean;
  sampleId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TableInfo {
  name: string;
  columns: ColumnInfo[];
  constraints: ConstraintInfo[];
  rowCount: number;
}

export interface ColumnInfo {
  name: string;
  type: string;
  notNull: boolean;
  primaryKey: boolean;
  defaultValue: string | null;
}

export interface ConstraintInfo {
  name: string;
  type: 'PRIMARY KEY' | 'FOREIGN KEY' | 'UNIQUE' | 'CHECK';
  columns: string[];
  references?: {
    table: string;
    columns: string[];
  };
}

export interface QueryResult {
  columns: string[];
  rows: Record<string, unknown>[];
  rowCount: number;
  affectedRows: number;
  executionTimeMs: number;
  messages: string[];
  isSelect: boolean;
}

export interface QueryError {
  type:
    | 'syntax'
    | 'missing_table'
    | 'missing_column'
    | 'incorrect_where'
    | 'incorrect_join'
    | 'wrong_group_by'
    | 'wrong_having'
    | 'unsupported'
    | 'generic';
  message: string;
  friendlyMessage: string;
  suggestion?: string;
}

export interface QueryHistoryEntry {
  id: string;
  timestamp: string;
  databaseId: string;
  databaseName: string;
  query: string;
  executionTimeMs: number;
  success: boolean;
  rowCount?: number;
}

export interface Bookmark {
  id: string;
  type: 'query' | 'lesson' | 'challenge';
  title: string;
  referenceId: string;
  createdAt: string;
  metadata?: Record<string, string>;
}

export interface ProgressData {
  completedLessons: string[];
  solvedChallenges: string[];
  topicsCovered: string[];
  queryCount: number;
  currentStreak: number;
  lastActiveDate: string;
  lessonProgress: Record<string, number>;
}

export interface LessonHint {
  level: number;
  title: string;
  content: string;
}

export interface LessonPractice {
  id: string;
  question: string;
  databaseId: string;
  setupSql?: string;
  expectedColumns: string[];
  expectedRows: Record<string, unknown>[][];
  orderMatters: boolean;
  allowDuplicates: boolean;
  hints: LessonHint[];
  solution: string;
  explanation: string;
}

export interface LessonSection {
  id: string;
  title: string;
  content: string;
  analogy?: string;
  visualType?: 'table' | 'diagram' | 'flow' | 'comparison';
  visualData?: Record<string, unknown>;
  exampleSql?: string;
  exampleResult?: QueryResult;
  practice?: LessonPractice;
}

export interface Lesson {
  id: string;
  slug: string;
  title: string;
  topic: string;
  skillLevel: SkillLevel[];
  order: number;
  description: string;
  introduction: string;
  sections: LessonSection[];
  challenge?: LessonPractice;
  summary: string[];
  tags: string[];
}

export interface SampleDatabase {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  schemaSql: string;
  dataSql: string;
  tableCount: number;
  rowCount: number;
}

export interface QueryExplanation {
  clauses: QueryClauseExplanation[];
  executionOrder: string[];
  summary: string;
}

export interface QueryClauseExplanation {
  clause: string;
  description: string;
  sqlFragment?: string;
}

export interface ComparisonResult {
  passed: boolean;
  score: number;
  feedback: string[];
  columnMatch: boolean;
  rowMatch: boolean;
  orderMatch: boolean;
  valueMatch: boolean;
}

export interface SearchResult {
  type: 'lesson' | 'table' | 'function' | 'query' | 'challenge';
  id: string;
  title: string;
  description: string;
  path: string;
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  skillLevel: 'beginner',
  theme: 'dark',
  fontSize: 14,
  editorFont: 'JetBrains Mono',
  editorZoom: 1,
  onboardingComplete: false,
};

export const DEFAULT_PROGRESS: ProgressData = {
  completedLessons: [],
  solvedChallenges: [],
  topicsCovered: [],
  queryCount: 0,
  currentStreak: 0,
  lastActiveDate: '',
  lessonProgress: {},
};
