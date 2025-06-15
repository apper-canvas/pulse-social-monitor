import React, { forwardRef, useCallback, useMemo, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const RichTextEditor = forwardRef(({ 
  value = '', 
  onChange, 
  placeholder = 'Write something...', 
  ...props 
}, ref) => {
  // Create internal ref if no external ref is provided
  const internalRef = useRef(null);
  const editorRef = ref || internalRef;

  const modules = useMemo(() => ({
    toolbar: [
      ['bold', 'italic'],
      ['link'],
      ['clean']
    ],
  }), []);

  const formats = useMemo(() => [
    'bold', 'italic', 'link'
  ], []);

  const handleChange = useCallback((content, delta, source, editor) => {
    try {
      if (!editor) return;
      
      const plainText = editor.getText();
      
      // Process content to ensure it's valid
      const processedContent = plainText.trim() === '' ? '' : content;
      
      if (onChange && typeof onChange === 'function') {
        onChange(processedContent);
      }
    } catch (error) {
      console.error('RichTextEditor handleChange error:', error);
      // Fallback to raw content if editor methods fail
      if (onChange && typeof onChange === 'function') {
        onChange(content || '');
      }
    }
  }, [onChange]);

  return (
    <div className="w-full rich-text-editor">
      <style>
        {`:root {
          --ql-editor-bg: transparent;
          --ql-editor-color: white;
          --ql-placeholder-color: #9CA3AF;
          --ql-toolbar-border: #374151;
          --ql-icon-color: #9CA3AF;
          --ql-icon-hover: white;
          --ql-icon-active: #3B82F6;
        }`}
      </style>
      <style dangerouslySetInnerHTML={{
        __html: `
          .rich-text-editor .ql-editor {
            background-color: var(--ql-editor-bg) !important;
            color: var(--ql-editor-color) !important;
            font-size: 1.25rem !important;
            line-height: 1.6 !important;
            padding: 0 !important;
            border: none !important;
          }
          .rich-text-editor .ql-editor::before {
            color: var(--ql-placeholder-color) !important;
            font-style: normal !important;
          }
          .rich-text-editor .ql-toolbar {
            border: none !important;
            border-bottom: 1px solid var(--ql-toolbar-border) !important;
            background-color: var(--ql-editor-bg) !important;
            margin-bottom: 1rem !important;
          }
          .rich-text-editor .ql-toolbar .ql-stroke {
            stroke: var(--ql-icon-color) !important;
          }
          .rich-text-editor .ql-toolbar .ql-fill {
            fill: var(--ql-icon-color) !important;
          }
          .rich-text-editor .ql-toolbar button:hover .ql-stroke {
            stroke: var(--ql-icon-hover) !important;
          }
          .rich-text-editor .ql-toolbar button:hover .ql-fill {
            fill: var(--ql-icon-hover) !important;
          }
          .rich-text-editor .ql-toolbar button.ql-active .ql-stroke {
            stroke: var(--ql-icon-active) !important;
          }
          .rich-text-editor .ql-toolbar button.ql-active .ql-fill {
            fill: var(--ql-icon-active) !important;
          }
          .rich-text-editor .ql-container {
            border: none !important;
            font-family: inherit !important;
          }
          .rich-text-editor .ql-editor p {
            margin: 0 !important;
          }
        `
      }} />
      <ReactQuill
        ref={editorRef}
        theme="snow"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        modules={modules}
        formats={formats}
        style={{
          backgroundColor: 'transparent',
          color: 'white'
        }}
        {...props}
      />
    </div>
  );
});

// Add display name for debugging
RichTextEditor.displayName = 'RichTextEditor';

export default RichTextEditor;