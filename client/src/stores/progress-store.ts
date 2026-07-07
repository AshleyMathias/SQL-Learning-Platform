import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ProgressData, Bookmark, QueryHistoryEntry } from '@sql-brush-up/shared';
import { DEFAULT_PROGRESS } from '@sql-brush-up/shared';
import { generateId, updateStreak } from '@/utils';

interface ProgressState extends ProgressData {
  bookmarks: Bookmark[];
  queryHistory: QueryHistoryEntry[];
  activeDatabaseId: string | null;
  continueLessonId: string | null;
  addCompletedLesson: (lessonId: string, topic: string) => void;
  addSolvedChallenge: (challengeId: string) => void;
  incrementQueryCount: () => void;
  setLessonProgress: (lessonId: string, progress: number) => void;
  addBookmark: (bookmark: Omit<Bookmark, 'id' | 'createdAt'>) => void;
  removeBookmark: (id: string) => void;
  addQueryHistory: (entry: Omit<QueryHistoryEntry, 'id' | 'timestamp'>) => void;
  clearQueryHistory: () => void;
  setActiveDatabaseId: (id: string | null) => void;
  setContinueLessonId: (id: string | null) => void;
  resetProgress: () => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      ...DEFAULT_PROGRESS,
      bookmarks: [],
      queryHistory: [],
      activeDatabaseId: null,
      continueLessonId: null,

      addCompletedLesson: (lessonId, topic) => {
        const state = get();
        const { streak, date } = updateStreak(state.lastActiveDate, state.currentStreak);
        set({
          completedLessons: [...new Set([...state.completedLessons, lessonId])],
          topicsCovered: [...new Set([...state.topicsCovered, topic])],
          currentStreak: streak,
          lastActiveDate: date,
        });
      },

      addSolvedChallenge: (challengeId) => {
        const state = get();
        set({
          solvedChallenges: [...new Set([...state.solvedChallenges, challengeId])],
        });
      },

      incrementQueryCount: () => {
        const state = get();
        const { streak, date } = updateStreak(state.lastActiveDate, state.currentStreak);
        set({
          queryCount: state.queryCount + 1,
          currentStreak: streak,
          lastActiveDate: date,
        });
      },

      setLessonProgress: (lessonId, progress) =>
        set((s) => ({
          lessonProgress: { ...s.lessonProgress, [lessonId]: progress },
        })),

      addBookmark: (bookmark) =>
        set((s) => ({
          bookmarks: [
            ...s.bookmarks,
            { ...bookmark, id: generateId(), createdAt: new Date().toISOString() },
          ],
        })),

      removeBookmark: (id) =>
        set((s) => ({ bookmarks: s.bookmarks.filter((b) => b.id !== id) })),

      addQueryHistory: (entry) =>
        set((s) => ({
          queryHistory: [
            { ...entry, id: generateId(), timestamp: new Date().toISOString() },
            ...s.queryHistory,
          ].slice(0, 100),
        })),

      clearQueryHistory: () => set({ queryHistory: [] }),
      setActiveDatabaseId: (activeDatabaseId) => set({ activeDatabaseId }),
      setContinueLessonId: (continueLessonId) => set({ continueLessonId }),

      resetProgress: () =>
        set({
          ...DEFAULT_PROGRESS,
          bookmarks: [],
          queryHistory: [],
          activeDatabaseId: null,
          continueLessonId: null,
        }),
    }),
    { name: 'sql-brush-up-progress' }
  )
);
