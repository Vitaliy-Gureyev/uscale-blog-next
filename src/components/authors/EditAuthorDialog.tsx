'use client';

import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import ImageUpload from "@/src/components/posts/ImageUpload";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/src/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface EditAuthorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  author: {
    id: string;
    name: string;
    avatar_url?: string;
    description?: string;
  };
}

export function EditAuthorDialog({ open, onOpenChange, author }: EditAuthorDialogProps) {
  const supabase = createClientComponentClient();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    avatarUrl: "",
  });

  useEffect(() => {
    if (author) {
      setFormData({
        name: author.name,
        description: author.description || "",
        avatarUrl: author.avatar_url || "",
      });
    }
  }, [author]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const { error: updateError } = await supabase
        .from("authors")
        .update({
          name: formData.name,
          avatar_url: formData.avatarUrl,
          description: formData.description,
        })
        .eq("id", author.id);

      if (updateError) {
        throw updateError;
      }

      toast.success("Author updated successfully");
      queryClient.invalidateQueries({ queryKey: ["authors"] });
      onOpenChange(false);
    } catch (err) {
      console.error("Error updating author:", err);
      setError(err.message || "Failed to update author");
      toast.error("Failed to update author");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Author</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>Profile Picture</Label>
            <ImageUpload
              onImageUploaded={(url) => setFormData({ ...formData, avatarUrl: url })}
              label=""
              bucket="avatars"
              defaultImage={formData.avatarUrl}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description about the author..."
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting || !formData.name}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}