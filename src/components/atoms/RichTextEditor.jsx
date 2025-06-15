import React, { useMemo } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const RichTextEditor = ({ 
  value, 
  onChange, 
  placeholder = "What's happening?",
  className = '',
  maxLength = 280,
  ...props 
}) => {
  const modules = useMemo(() => ({
    toolbar: [
      ['bold', 'italic'],
      ['link'],
      ['clean']
    ],
  }), []);

  const formats = [
    'bold', 'italic', 'link'
  ];

  // Custom handler to process hashtags
  const handleChange = (content, delta, source, editor) => {
    // Get plain text for length validation
    const plainText = editor.getText();
    
    if (plainText.length > maxLength) {
      return; // Prevent exceeding character limit
    }

    // Process hashtags in the content
    const processedContent = content.replace(
      /#(\w+)/g, 
      '<span class="text-accent font-semibold">#$1</span>'
    );

    onChange(processedContent);
  };

  return (
    <div className={`rich-text-editor ${className}`}>
      <ReactQuill
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
  </div>
);
};

export default RichTextEditor;