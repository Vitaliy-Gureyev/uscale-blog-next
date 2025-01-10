import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import EditorToolbar from './editor/EditorToolbar';

interface TipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const TipTapEditor = ({ content, onChange }: TipTapEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
          HTMLAttributes: {
            class: 'font-heading',
          },
        },
        paragraph: {
          HTMLAttributes: {
            class: 'mb-4',
          },
        },
        bold: {
          HTMLAttributes: {
            class: 'text-[#9b87f5] font-bold',
          },
        },
        italic: {},
        strike: {},
        code: {
          HTMLAttributes: {
            class: 'bg-muted rounded px-1.5 py-0.5 font-mono text-sm',
          },
        },
        codeBlock: {
          HTMLAttributes: {
            class: 'bg-muted rounded-lg p-4 font-mono text-sm',
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: 'border-l-4 border-primary pl-4 italic',
          },
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-[#9b87f5] underline hover:text-[#7E69AB] transition-colors',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full rounded-lg',
        },
        inline: false,
        allowBase64: false,
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert focus:outline-none min-h-[200px] p-4',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded-md border-input bg-background">
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default TipTapEditor;