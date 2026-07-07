import { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { usePreferencesStore } from '@/stores/preferences-store';

const MonacoEditor = lazy(() => import('@monaco-editor/react'));

interface SqlEditorProps {
  value: string;
  onChange: (value: string) => void;
  onRun: () => void;
  readOnly?: boolean;
}

export function SqlEditor({ value, onChange, onRun, readOnly = false }: SqlEditorProps) {
  const editorFont = usePreferencesStore((s) => s.editorFont);
  const editorZoom = usePreferencesStore((s) => s.editorZoom);

  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      }
    >
      <MonacoEditor
        height="100%"
        language="sql"
        theme="vs-dark"
        value={value}
        onChange={(v) => onChange(v ?? '')}
        options={{
          readOnly,
          fontSize: 14 * editorZoom,
          fontFamily: `${editorFont}, monospace`,
          minimap: { enabled: false },
          lineNumbers: 'on',
          automaticLayout: true,
          tabSize: 2,
          insertSpaces: true,
          wordWrap: 'on',
          scrollBeyondLastLine: false,
          padding: { top: 12 },
        }}
        onMount={(editor, monaco) => {
          editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => onRun());
          editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Slash, () => {
            const selection = editor.getSelection();
            if (!selection) return;
            const model = editor.getModel();
            if (!model) return;
            const line = selection.startLineNumber;
            const lineContent = model.getLineContent(line);
            if (lineContent.trimStart().startsWith('--')) {
              model.setValue(
                model.getValue().replace(
                  new RegExp(`^(--\\s?)`, 'm'),
                  ''
                )
              );
            } else {
              editor.setPosition({ lineNumber: line, column: 1 });
              editor.trigger('keyboard', 'type', { text: '-- ' });
            }
          });
        }}
      />
    </Suspense>
  );
}
