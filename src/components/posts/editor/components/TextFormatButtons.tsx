import { Editor } from '@tiptap/react';
import { Toggle } from "@/src/components/ui/toggle";
import { Bold, Italic, Code } from 'lucide-react';

interface TextFormatButtonsProps {
  editor: Editor;
}

export const TextFormatButtons = ({ editor }: TextFormatButtonsProps) => {
  return (
    <>
      <Toggle
        size="sm"
        pressed={editor.isActive('bold')}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive('italic')}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive('code')}
        onPressedChange={() => editor.chain().focus().toggleCode().run()}
      >
        <Code className="h-4 w-4" />
      </Toggle>
    </>
  );
};
