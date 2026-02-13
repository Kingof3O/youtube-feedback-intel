import { Check, Code, Copy, LayoutTemplate, RotateCcw, Save } from 'lucide-react';
import clsx from 'clsx';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { CodeEditor } from '../ui/CodeEditor';
import { VisualEditor } from './VisualEditor';

interface RuleEditorModalProps {
  isOpen: boolean;
  editingRule: string | null;
  ruleContent: string;
  ruleFormat: 'yaml' | 'json';
  editorMode: 'visual' | 'code';
  isLoadingContent: boolean;
  isSaving: boolean;
  isResetting: boolean;
  error: string | null;
  onClose: () => void;
  onEditorModeChange: (mode: 'visual' | 'code') => void;
  onRuleContentChange: (value: string) => void;
  onDismissError: () => void;
  onCopy: () => void;
  onReset: () => void;
  onSave: () => void;
}

export function RuleEditorModal({
  isOpen,
  editingRule,
  ruleContent,
  ruleFormat,
  editorMode,
  isLoadingContent,
  isSaving,
  isResetting,
  error,
  onClose,
  onEditorModeChange,
  onRuleContentChange,
  onDismissError,
  onCopy,
  onReset,
  onSave,
}: RuleEditorModalProps) {
  if (!editingRule) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-4">
          <span>Edit Rule: {editingRule}</span>
          <div className="flex bg-black/20 rounded-lg p-1 border border-white/5">
            <button
              onClick={() => onEditorModeChange('visual')}
              className={clsx(
                'px-3 py-1 text-xs rounded flex items-center gap-2 transition-all',
                editorMode === 'visual'
                  ? 'bg-accent-primary text-white shadow-sm'
                  : 'text-muted hover:text-white',
              )}
            >
              <LayoutTemplate size={12} /> Visual
            </button>
            <button
              onClick={() => onEditorModeChange('code')}
              className={clsx(
                'px-3 py-1 text-xs rounded flex items-center gap-2 transition-all',
                editorMode === 'code'
                  ? 'bg-accent-primary text-white shadow-sm'
                  : 'text-muted hover:text-white',
              )}
            >
              <Code size={12} /> Code
            </button>
          </div>
        </div>
      }
      width="full"
    >
      <div className="flex flex-col h-full gap-4">
        {isLoadingContent ? (
          <div className="flex items-center justify-center h-full text-muted">Loading content...</div>
        ) : (
          <>
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-md text-sm whitespace-pre-wrap flex items-center justify-between">
                <span>{error}</span>
                <Button size="sm" variant="ghost" onClick={onDismissError}>
                  <Check size={14} />
                </Button>
              </div>
            )}

            <div className="flex-1 min-h-0 h-full">
              {editorMode === 'visual' ? (
                <VisualEditor
                  content={ruleContent}
                  format={ruleFormat}
                  onChange={onRuleContentChange}
                />
              ) : (
                <CodeEditor
                  value={ruleContent}
                  onChange={onRuleContentChange}
                  language={ruleFormat}
                />
              )}
            </div>

            <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/5">
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={onCopy} title="Copy to clipboard">
                  <Copy size={14} /> Copy
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={onReset}
                  disabled={isResetting}
                  title="Reset to default version"
                >
                  <RotateCcw size={14} /> Reset
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={onClose}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={onSave} isLoading={isSaving} disabled={isSaving}>
                  <Save size={16} /> Save Changes
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
