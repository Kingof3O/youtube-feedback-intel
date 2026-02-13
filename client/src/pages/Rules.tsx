import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { RuleEditorModal } from '../components/rules/RuleEditorModal';
import { RulesList } from '../components/rules/RulesList';
import { useToast } from '../components/ui/useToast';
import {
  useActivateRule,
  useImportDefaultRules,
  useRules,
} from '../hooks/useRules';
import { useFetchRuleContent, useSaveRuleContent } from '../hooks/useRuleContent';

export function Rules() {
  const queryClient = useQueryClient();
  const { success, error: toastError } = useToast();
  const { data: rules = [], isLoading } = useRules();
  const activateMutation = useActivateRule();
  const importDefaultsMutation = useImportDefaultRules();
  const fetchContentMutation = useFetchRuleContent();
  const saveContentMutation = useSaveRuleContent();

  const [editingRule, setEditingRule] = useState<string | null>(null);
  const [ruleContent, setRuleContent] = useState('');
  const [ruleFormat, setRuleFormat] = useState<'yaml' | 'json'>('yaml');
  const [editorMode, setEditorMode] = useState<'visual' | 'code'>('visual');
  const [error, setError] = useState<string | null>(null);

  const handleEdit = (name: string) => {
    setEditingRule(name);
    fetchContentMutation.mutate(name, {
      onSuccess: (data) => {
        setRuleContent(data.content);
        setRuleFormat(data.format);
        setEditorMode('visual');
        setError(null);
      },
      onError: () => {
        setError('Failed to load rule content');
        setEditorMode('code');
      },
    });
  };

  const handleActivate = (name: string) => {
    activateMutation.mutate(name, {
      onSuccess: () => success(`Rule set "${name}" activated`),
      onError: (err: Error) => toastError(err.message),
    });
  };

  const handleSave = () => {
    if (!editingRule) return;
    saveContentMutation.mutate(
      { name: editingRule, content: ruleContent, format: ruleFormat },
      {
        onSuccess: () => {
          setEditingRule(null);
          success(`Changes saved for ${editingRule}`);
          void queryClient.invalidateQueries({ queryKey: ['rules'] });
        },
        onError: (err: Error) => setError(err.message),
      },
    );
  };

  const handleImportDefaults = () => {
    importDefaultsMutation.mutate(undefined, {
      onSuccess: () => {
        success('Default rules imported successfully');
        if (editingRule) handleEdit(editingRule);
      },
      onError: (err: Error) => toastError(err.message),
    });
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(ruleContent);
    success('Copied to clipboard');
  };

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-medium">Rule Sets</h2>
          <p className="text-sm text-muted">Manage classification rules and logic.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <RulesList
          rules={rules}
          isLoading={isLoading}
          isActivating={activateMutation.isPending}
          activeMutatingName={activateMutation.variables}
          onActivate={handleActivate}
          onEdit={handleEdit}
          onImportDefaults={handleImportDefaults}
          isImportingDefaults={importDefaultsMutation.isPending}
        />
      </div>

      <RuleEditorModal
        isOpen={Boolean(editingRule)}
        editingRule={editingRule}
        ruleContent={ruleContent}
        ruleFormat={ruleFormat}
        editorMode={editorMode}
        isLoadingContent={fetchContentMutation.isPending}
        isSaving={saveContentMutation.isPending}
        isResetting={importDefaultsMutation.isPending}
        error={error}
        onClose={() => setEditingRule(null)}
        onEditorModeChange={setEditorMode}
        onRuleContentChange={setRuleContent}
        onDismissError={() => setError(null)}
        onCopy={() => void handleCopy()}
        onReset={handleImportDefaults}
        onSave={handleSave}
      />
    </div>
  );
}
