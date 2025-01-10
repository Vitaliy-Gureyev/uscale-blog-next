import { supabase } from "@/src/integrations/supabase/client";
import { toast } from "sonner";
import { Editor } from '@tiptap/react';

export const handleImageUpload = async (file: File, editor: Editor): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const filePath = `${crypto.randomUUID()}.${fileExt}`;

    const { error: uploadError, data } = await supabase.storage
      .from('posts')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('posts')
      .getPublicUrl(filePath);

    toast.success('Image uploaded successfully');
    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    toast.error('Failed to upload image');
    return null;
  }
};