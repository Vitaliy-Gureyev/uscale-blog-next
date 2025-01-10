'use client';

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from "sonner";

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  label: string;
  bucket?: string;
  defaultImage?: string;
}

const ImageUpload = ({ onImageUploaded, label, bucket = "posts", defaultImage }: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const supabase = createClientComponentClient();

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      onImageUploaded(publicUrl);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <Input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        disabled={isUploading}
      />
      {defaultImage && (
        <div className="mt-2">
          <img 
            src={defaultImage} 
            alt="Current image" 
            className="w-16 h-16 object-cover rounded"
          />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;