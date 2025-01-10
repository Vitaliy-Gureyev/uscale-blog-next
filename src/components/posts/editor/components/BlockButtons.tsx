import { Editor } from '@tiptap/react';
import { Toggle } from "@/src/components/ui/toggle";
import { Quote, LinkIcon, ImageIcon } from 'lucide-react';
import { handleImageUpload } from '../utils/imageUpload';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Label } from "@/src/components/ui/label";
import { Input } from "@/src/components/ui/input";
import { useState } from 'react';

interface BlockButtonsProps {
  editor: Editor;
}

export const BlockButtons = ({ editor }: BlockButtonsProps) => {
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [altText, setAltText] = useState('');

  const handleLinkClick = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter URL', previousUrl);
    
    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const handleImageSelection = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const uploadedUrl = await handleImageUpload(file, editor);
      if (uploadedUrl) {
        editor.chain().focus().insertContent({
          type: 'image',
          attrs: { 
            src: uploadedUrl,
            alt: altText || file.name, // Use filename as fallback if no alt text
          }
        }).run();
      }
      setIsImageDialogOpen(false);
      setAltText('');
    }
  };

  return (
    <>
      <Toggle
        size="sm"
        pressed={editor.isActive('blockquote')}
        onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote className="h-4 w-4" />
      </Toggle>
      
      <Toggle
        size="sm"
        pressed={editor.isActive('link')}
        onPressedChange={handleLinkClick}
      >
        <LinkIcon className="h-4 w-4" />
      </Toggle>

      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <DialogTrigger asChild>
          <Toggle size="sm" pressed={false}>
            <ImageIcon className="h-4 w-4" />
          </Toggle>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Image</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="altText">Alt Text</Label>
              <Input
                id="altText"
                placeholder="Describe the image"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Provide a description of the image for accessibility
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Select Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageSelection}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};