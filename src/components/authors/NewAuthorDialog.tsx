'use client';

import { useState } from "react";
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

interface NewAuthorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewAuthorDialog({ open, onOpenChange }: NewAuthorDialogProps) {
  const supabase = createClientComponentClient();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    description: "",
    avatarUrl: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const { error: insertError } = await supabase.from("authors").insert([{
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        avatar_url: formData.avatarUrl,
        description: formData.description,
      }]);

      if (insertError) {
        throw insertError;
      }

      toast.success("Author created successfully");
      queryClient.invalidateQueries({ queryKey: ["authors"] });
      onOpenChange(false);
      setFormData({
        firstName: "",
        lastName: "",
        description: "",
        avatarUrl: "",
      });
    } catch (err) {
      console.error("Error creating author:", err);
      setError(err.message || "Failed to create author");
      toast.error("Failed to create author");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Author</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>Profile Picture</Label>
            <ImageUpload
              onImageUploaded={(url) => setFormData({ ...formData, avatarUrl: url })}
              label=""
              bucket="avatars"
            />
            {formData.avatarUrl && (
              <div className="mt-2">
                <img 
                  src={formData.avatarUrl} 
                  alt="Profile preview" 
                  className="rounded-full w-16 h-16 object-cover"
                />
              </div>
            )}
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
              disabled={isSubmitting || !formData.firstName || !formData.lastName}
            >
              {isSubmitting ? "Creating..." : "Create Author"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}