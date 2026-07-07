import { useEffect } from 'react';
import { Settings, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePreferencesStore } from '@/stores/preferences-store';
import { useProgressStore } from '@/stores/progress-store';

const FONTS = ['JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', 'Courier New'];

export function SettingsPage() {
  const prefs = usePreferencesStore();
  const { resetProgress } = useProgressStore();

  useEffect(() => {
    document.title = 'Settings — SQL Brush Up';
    document.documentElement.classList.toggle('dark', prefs.theme === 'dark');
  }, [prefs.theme]);

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold flex items-center gap-3">
        <Settings className="h-8 w-8" />
        Settings
      </h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Appearance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground">Theme</label>
            <select
              className="mt-1 w-full rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm"
              value={prefs.theme}
              onChange={(e) => prefs.setTheme(e.target.value as 'dark' | 'light' | 'system')}
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="system">System</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Font Size: {prefs.fontSize}px</label>
            <input
              type="range"
              min={12}
              max={20}
              value={prefs.fontSize}
              onChange={(e) => prefs.setFontSize(Number(e.target.value))}
              className="w-full mt-1"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Editor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground">Editor Font</label>
            <select
              className="mt-1 w-full rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm"
              value={prefs.editorFont}
              onChange={(e) => prefs.setEditorFont(e.target.value)}
            >
              {FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Editor Zoom: {prefs.editorZoom}x</label>
            <input
              type="range"
              min={0.8}
              max={1.5}
              step={0.1}
              value={prefs.editorZoom}
              onChange={(e) => prefs.setEditorZoom(Number(e.target.value))}
              className="w-full mt-1"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Keyboard Shortcuts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between"><span>Run Query</span><kbd className="px-2 py-0.5 rounded bg-muted font-mono text-xs">Ctrl + Enter</kbd></div>
          <div className="flex justify-between"><span>Comment Line</span><kbd className="px-2 py-0.5 rounded bg-muted font-mono text-xs">Ctrl + /</kbd></div>
          <div className="flex justify-between"><span>Save Query</span><kbd className="px-2 py-0.5 rounded bg-muted font-mono text-xs">Ctrl + S</kbd></div>
        </CardContent>
      </Card>

      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="text-base text-destructive">Danger Zone</CardTitle>
          <CardDescription>Reset all progress, bookmarks, and query history</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={() => {
            if (confirm('Reset all progress? This cannot be undone.')) resetProgress();
          }}>
            <RotateCcw className="h-4 w-4" /> Reset Progress
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
