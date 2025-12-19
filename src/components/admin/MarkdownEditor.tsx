'use client';

import { useCallback, useMemo } from 'react';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function MarkdownEditor({ value, onChange, placeholder }: MarkdownEditorProps) {
  const handleChange = useCallback(
    (value: string) => {
      onChange(value);
    },
    [onChange]
  );

  const options = useMemo(() => {
    return {
      spellChecker: false,
      placeholder: placeholder || 'Write your post content in markdown...',
      status: ['lines', 'words', 'cursor'],
      toolbar: [
        'bold',
        'italic',
        'strikethrough',
        '|',
        'heading-1',
        'heading-2',
        'heading-3',
        '|',
        'quote',
        'unordered-list',
        'ordered-list',
        '|',
        'link',
        'image',
        'code',
        'table',
        '|',
        'fullscreen',
        '|',
        'guide',
      ],
      minHeight: '400px',
      maxHeight: '800px',
    } as any;
  }, [placeholder]);

  return (
    <div className="markdown-editor">
      <SimpleMDE value={value} onChange={handleChange} options={options} />
      <style jsx global>{`
        .markdown-editor .EasyMDEContainer {
          background-color: white;
        }

        .dark .markdown-editor .EasyMDEContainer {
          background-color: rgb(17 24 39);
        }

        .markdown-editor .CodeMirror {
          background-color: white;
          color: rgb(17 24 39);
          border: 1px solid rgb(209 213 219);
          border-radius: 0.5rem;
        }

        .dark .markdown-editor .CodeMirror {
          background-color: rgb(17 24 39);
          color: rgb(243 244 246);
          border-color: rgb(75 85 99);
        }

        .markdown-editor .CodeMirror-cursor {
          border-left-color: rgb(17 24 39);
        }

        .dark .markdown-editor .CodeMirror-cursor {
          border-left-color: rgb(243 244 246);
        }

        .markdown-editor .editor-toolbar {
          background-color: rgb(243 244 246);
          border: 1px solid rgb(209 213 219);
          border-bottom: none;
          border-radius: 0.5rem 0.5rem 0 0;
        }

        .dark .markdown-editor .editor-toolbar {
          background-color: rgb(31 41 55);
          border-color: rgb(75 85 99);
        }

        .markdown-editor .editor-toolbar button {
          color: rgb(55 65 81);
        }

        .dark .markdown-editor .editor-toolbar button {
          color: rgb(209 213 219);
        }

        .markdown-editor .editor-toolbar button:hover {
          background-color: rgb(229 231 235);
          border-color: rgb(209 213 219);
        }

        .dark .markdown-editor .editor-toolbar button:hover {
          background-color: rgb(55 65 81);
          border-color: rgb(75 85 99);
        }

        .markdown-editor .editor-toolbar.fullscreen,
        .markdown-editor .CodeMirror-fullscreen {
          z-index: 9999;
        }

        .markdown-editor .editor-statusbar {
          color: rgb(107 114 128);
          background-color: rgb(249 250 251);
          border-top: 1px solid rgb(229 231 235);
        }

        .dark .markdown-editor .editor-statusbar {
          color: rgb(156 163 175);
          background-color: rgb(31 41 55);
          border-top-color: rgb(75 85 99);
        }

        .markdown-editor .editor-preview {
          background-color: rgb(249 250 251);
        }

        .dark .markdown-editor .editor-preview {
          background-color: rgb(17 24 39);
          color: rgb(243 244 246);
        }

        .markdown-editor .editor-preview-side {
          background-color: rgb(249 250 251);
          border-left: 1px solid rgb(229 231 235);
        }

        .dark .markdown-editor .editor-preview-side {
          background-color: rgb(17 24 39);
          border-left-color: rgb(75 85 99);
          color: rgb(243 244 246);
        }
      `}</style>
    </div>
  );
}
