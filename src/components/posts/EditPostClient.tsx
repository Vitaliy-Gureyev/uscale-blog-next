'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import ImageUpload from "./ImageUpload";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/src/components/ui/alert";
import { AlertCircle } from "lucide-react";
import MDEditor from '@uiw/react-md-editor';

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  image_url?: string;
  author_id: string;
  category_id: string;
  author: {
    id: string;
    name: string;
  };
  category: {
    id: string;
    name: string;
  };
}

interface EditPostClientProps {
  post: Post;
}

export default function EditPostClient({ post }: EditPostClientProps) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    imageUrl: "",
    authorId: "",
    categoryId: "",
  });

  // Загрузка списка авторов
  const { data: authors } = useQuery({
    queryKey: ["authors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("authors")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  // Загрузка списка категорий
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        content: post.content,
        imageUrl: post.image_url || "",
        authorId: post.author_id,
        categoryId: post.category_id,
      });
    }
  }, [post]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const { error: updateError } = await supabase
        .from("posts")
        .update({
          title: formData.title,
          content: formData.content,
          image_url: formData.imageUrl,
          author_id: formData.authorId,
          category_id: formData.categoryId,
          updated_at: new Date().toISOString(),
        })
        .eq("id", post.id);

      if (updateError) throw updateError;

      toast.success("Post updated successfully");
      router.push("/editor/posts");
    } catch (err) {
      console.error("Error updating post:", err);
      setError(err.message || "Failed to update post");
      toast.error("Failed to update post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-8">Edit Post</h1>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Featured Image</Label>
          <ImageUpload
            onImageUploaded={(url) => setFormData({ ...formData, imageUrl: url })}
            label=""
            bucket="posts"
            defaultImage={formData.imageUrl}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Author</Label>
            <Select
              value={formData.authorId}
              onValueChange={(value) => setFormData({ ...formData, authorId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select author" />
              </SelectTrigger>
              <SelectContent>
                {authors?.map((author) => (
                  <SelectItem key={author.id} value={author.id}>
                    {author.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={formData.categoryId}
              onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Content</Label>
          <div data-color-mode="light">
            <MDEditor
              value={formData.content}
              onChange={(value) => setFormData({ ...formData, content: value || "" })}
              height={400}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/editor/posts")}
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
} 