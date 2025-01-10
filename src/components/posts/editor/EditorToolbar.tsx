import { Editor } from '@tiptap/react';
import { TextFormatButtons } from './components/TextFormatButtons';
import { HeadingButtons } from './components/HeadingButtons';
import { BlockButtons } from './components/BlockButtons';

interface EditorToolbarProps {
  editor: Editor;
}

const EditorToolbar = ({ editor }: EditorToolbarProps) => {
  return (
    <div className="border-b border-input p-2 flex flex-wrap gap-1">
      <TextFormatButtons editor={editor} />
      <HeadingButtons editor={editor} />
      <BlockButtons editor={editor} />
    </div>
  );
};

export default EditorToolbar;