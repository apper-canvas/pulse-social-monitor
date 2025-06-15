import { useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

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
          color: 'white',
        }}
        {...props}
      />
      <style jsx global>{`
        .ql-editor {
          background-color: transparent !important;
          color: white !important;
          font-size: 1.25rem !important;
          line-height: 1.6 !important;
          padding: 0 !important;
          border: none !important;
        }
        .ql-editor::before {
          color: #9CA3AF !important;
          font-style: normal !important;
        }
        .ql-toolbar {
          border: none !important;
          border-bottom: 1px solid #374151 !important;
          background-color: transparent !important;
          margin-bottom: 1rem !important;
        }
        .ql-toolbar .ql-stroke {
          stroke: #9CA3AF !important;
        }
        .ql-toolbar .ql-fill {
          fill: #9CA3AF !important;
        }
        .ql-toolbar button:hover .ql-stroke {
          stroke: white !important;
        }
        .ql-toolbar button:hover .ql-fill {
          fill: white !important;
        }
        .ql-toolbar button.ql-active .ql-stroke {
          stroke: #3B82F6 !important;
        }
        .ql-toolbar button.ql-active .ql-fill {
          fill: #3B82F6 !important;
        }
        .ql-container {
          border: none !important;
          font-family: inherit !important;
        }
        .rich-text-editor .ql-editor p {
          margin: 0 !important;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;