import lessonsData from '@/lessons/lessons.json';
import type { Lesson, SearchResult } from '@sql-brush-up/shared';

const lessons = lessonsData as Lesson[];

export function getAllLessons(): Lesson[] {
  return [...lessons].sort((a, b) => a.order - b.order);
}

export function getLessonBySlug(slug: string): Lesson | undefined {
  return lessons.find((l) => l.slug === slug);
}

export function getLessonById(id: string): Lesson | undefined {
  return lessons.find((l) => l.id === id);
}

export function getLessonsBySkillLevel(level: string): Lesson[] {
  return getAllLessons().filter((l) => l.skillLevel.includes(level as Lesson['skillLevel'][number]));
}

export function getLessonsByTopic(topic: string): Lesson[] {
  return getAllLessons().filter((l) => l.topic === topic);
}

export function getFirstLessonForSkillLevel(level: string): Lesson | undefined {
  return getLessonsBySkillLevel(level)[0];
}

export function searchLessons(query: string): SearchResult[] {
  const q = query.toLowerCase();
  return getAllLessons()
    .filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        l.topic.toLowerCase().includes(q) ||
        l.tags.some((t) => t.toLowerCase().includes(q))
    )
    .map((l) => ({
      type: 'lesson' as const,
      id: l.id,
      title: l.title,
      description: l.description,
      path: `/lessons/${l.slug}`,
    }));
}

export const SQL_TOPICS = [
  'Basics', 'SELECT', 'DISTINCT', 'WHERE', 'ORDER BY', 'LIMIT', 'OFFSET',
  'LIKE', 'IN', 'BETWEEN', 'IS NULL', 'Aggregates', 'GROUP BY', 'HAVING',
  'JOINs', 'UNION', 'Subqueries', 'CTE', 'Views', 'Indexes', 'Transactions', 'Constraints',
];
