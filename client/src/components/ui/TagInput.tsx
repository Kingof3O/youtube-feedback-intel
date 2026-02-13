import { useState, type KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import clsx from 'clsx';
import './TagInput.css';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function TagInput({ tags, onChange, placeholder = 'Add tag...', className, disabled }: TagInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const addTag = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
      setInputValue('');
    }
  };

  const removeTag = (index: number) => {
    onChange(tags.filter((_, i) => i !== index));
  };

  return (
    <div className={clsx("tag-input-container", disabled && "disabled", className)}>
      <div className="tags-list">
        {tags.map((tag, index) => (
          <span key={`${tag}-${index}`} className="tag-badge">
            {tag}
            {!disabled && (
              <button
                type="button"
                className="tag-remove"
                onClick={() => removeTag(index)}
              >
                <X size={12} />
              </button>
            )}
          </span>
        ))}
        {!disabled && (
          <input
            type="text"
            className="tag-input-field"
            placeholder={tags.length === 0 ? placeholder : ''}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={addTag}
          />
        )}
      </div>
    </div>
  );
}
