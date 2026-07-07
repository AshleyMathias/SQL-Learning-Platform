import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserPreferences, SkillLevel } from '@sql-brush-up/shared';
import { DEFAULT_PREFERENCES } from '@sql-brush-up/shared';

interface PreferencesState extends UserPreferences {
  setSkillLevel: (level: SkillLevel) => void;
  completeOnboarding: () => void;
  setTheme: (theme: UserPreferences['theme']) => void;
  setFontSize: (size: number) => void;
  setEditorFont: (font: string) => void;
  setEditorZoom: (zoom: number) => void;
  resetPreferences: () => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      ...DEFAULT_PREFERENCES,
      setSkillLevel: (skillLevel) => set({ skillLevel }),
      completeOnboarding: () => set({ onboardingComplete: true }),
      setTheme: (theme) => set({ theme }),
      setFontSize: (fontSize) => set({ fontSize }),
      setEditorFont: (editorFont) => set({ editorFont }),
      setEditorZoom: (editorZoom) => set({ editorZoom }),
      resetPreferences: () => set(DEFAULT_PREFERENCES),
    }),
    { name: 'sql-brush-up-preferences' }
  )
);
