import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { GlobalSettingsPanel } from './GlobalSettingsPanel';
import { CategorySidebar } from './CategorySidebar';
import { CategoryKeywordsPanel } from './CategoryKeywordsPanel';
import { AddCategoryModal } from './modals/AddCategoryModal';
import { DeleteCategoryModal } from './modals/DeleteCategoryModal';
import { useRuleEditorState } from '../../../hooks/useRuleEditorState';
import { useToast } from '../../ui/useToast';

interface VisualEditorProps {
  content: string;
  format: 'yaml' | 'json';
  onChange: (content: string) => void;
}

export function VisualEditor({ content, format, onChange }: VisualEditorProps) {
  const {
    parsed,
    error,
    activeCategory,
    activeLang,
    setActiveCategory,
    setActiveLang,
    updateMinScore,
    updateCategoryScore,
    updateKeywords,
    addCategory,
    removeCategory,
  } = useRuleEditorState({ content, format, onChange });
  const { success, warning } = useToast();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  const handleAddCategory = () => {
    const result = addCategory(newCategoryName);
    if (!result.ok) {
      warning(result.reason ?? 'Unable to add category');
      return;
    }
    success(`Category "${result.name}" added`);
    setNewCategoryName('');
    setIsAddModalOpen(false);
  };

  const confirmDeleteCategory = () => {
    if (!categoryToDelete) return;
    const result = removeCategory(categoryToDelete);
    if (!result.ok) return;
    success(`Category "${categoryToDelete}" removed`);
    setCategoryToDelete(null);
    setIsDeleteModalOpen(false);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <AlertTriangle className="text-yellow-500 mb-4" size={48} />
        <h3 className="text-lg font-medium text-white mb-2">Visual Editor Unavailable</h3>
        <p className="text-muted max-w-md">{error}</p>
      </div>
    );
  }

  if (!parsed) {
    return <div className="p-8 text-center text-muted">Loading visual editor...</div>;
  }

  return (
    <div className="flex flex-col h-full gap-5 overflow-hidden">
      <GlobalSettingsPanel parsed={parsed} onMinScoreChange={updateMinScore} />

      <div className="flex flex-1 min-h-0 gap-8">
        <CategorySidebar
          parsed={parsed}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          onAddCategory={() => setIsAddModalOpen(true)}
        />

        <div className="flex-1 glass-panel rounded-2xl border border-white/10 flex flex-col overflow-hidden relative shadow-2xl bg-black/40">
          <CategoryKeywordsPanel
            parsed={parsed}
            activeCategory={activeCategory}
            activeLang={activeLang}
            onCategoryScoreChange={updateCategoryScore}
            onLanguageChange={setActiveLang}
            onKeywordsChange={updateKeywords}
            onDeleteCategory={(category) => {
              setCategoryToDelete(category);
              setIsDeleteModalOpen(true);
            }}
          />
        </div>
      </div>

      <AddCategoryModal
        isOpen={isAddModalOpen}
        name={newCategoryName}
        onClose={() => setIsAddModalOpen(false)}
        onNameChange={setNewCategoryName}
        onConfirm={handleAddCategory}
      />

      <DeleteCategoryModal
        isOpen={isDeleteModalOpen}
        categoryName={categoryToDelete}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteCategory}
      />
    </div>
  );
}
