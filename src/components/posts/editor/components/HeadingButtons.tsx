import { Editor } from '@tiptap/react';
import { Toggle } from "@/src/components/ui/toggle";
import { Level } from '@tiptap/extension-heading';
import {
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6
} from 'lucide-react';

interface HeadingButtonProps {
  editor: Editor;
  level: Level;
  Icon: React.ComponentType<{ className?: string }>;
}

const HeadingButton = ({ editor, level, Icon }: HeadingButtonProps) => {
  return (
    <Toggle
      size="sm"
      pressed={editor.isActive('heading', { level })}
      onPressedChange={() => editor.chain().focus().toggleHeading({ level }).run()}
    >
      <Icon className="h-4 w-4" />
    </Toggle>
  );
};

interface HeadingButtonsProps {
  editor: Editor;
}

export const HeadingButtons = ({ editor }: HeadingButtonsProps) => {
  return (
    <>
      <HeadingButton editor={editor} level={1} Icon={Heading1} />
      <HeadingButton editor={editor} level={2} Icon={Heading2} />
      <HeadingButton editor={editor} level={3} Icon={Heading3} />
      <HeadingButton editor={editor} level={4} Icon={Heading4} />
      <HeadingButton editor={editor} level={5} Icon={Heading5} />
      <HeadingButton editor={editor} level={6} Icon={Heading6} />
    </>
  );
};
