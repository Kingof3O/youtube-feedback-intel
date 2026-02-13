import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-json';
import './CodeEditor.css';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: 'yaml' | 'json';
  placeholder?: string;
  disabled?: boolean;
}

export function CodeEditor({ 
  value, 
  onChange, 
  language = 'yaml', 
  placeholder,
  disabled 
}: CodeEditorProps) {
  return (
    <div className="code-editor-container glass-panel">
      <div className="code-editor-header">
        <span className="code-editor-lang">{language.toUpperCase()}</span>
      </div>
      <div className="code-editor-scroll">
        <Editor
          value={value}
          onValueChange={onChange}
          highlight={(code) => highlight(code, languages[language], language)}
          padding={20}
          className="code-editor-textarea"
          placeholder={placeholder}
          disabled={disabled}
          textareaId="code-editor-main"
          style={{
            fontFamily: '"Fira Code", "Fira Mono", "Cascadia Code", "Source Code Pro", monospace',
            fontSize: 14,
            minHeight: '100%',
          }}
        />
      </div>
    </div>
  );
}
