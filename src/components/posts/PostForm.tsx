import { useForm } from "react-hook-form";
import { Button } from "@/src/components/ui/button";
import { Form } from "@/src/components/ui/form";
import PostFormHeader from "./PostFormHeader";
import PostFormBasicInfo from "./PostFormBasicInfo";
import PostFormContent from "./PostFormContent";
import { useEffect } from "react";

export interface PostFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image_url: string;
  image_alt: string;
  category: string;
  summary: string;
  toc_headers: string;
  is_published: boolean;
  thumbnail_url: string;
  author: string;
  author_avatar: string;
}

interface PostFormProps {
  defaultValues: PostFormData;
  onSubmit: (data: PostFormData) => void;
  isEditing: boolean;
  onCancel: () => void;
}

const PostForm = ({ defaultValues, onSubmit, isEditing, onCancel }: PostFormProps) => {
  const form = useForm<PostFormData>({
    defaultValues: {
      ...defaultValues,
      is_published: defaultValues.is_published || false,
      toc_headers: defaultValues.toc_headers || "h2,h3",
    },
  });

  // Watch the title field to auto-generate slug
  const title = form.watch("title");

  // Auto-generate slug when title changes
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') // Replace any non-alphanumeric characters with a dash
      .replace(/^-+|-+$/g, '') // Remove leading and trailing dashes
      .substring(0, 100); // Limit length to 100 characters
  };

  // Update slug when title changes
  useEffect(() => {
    if (title && !isEditing) { // Only auto-generate slug for new posts
      const newSlug = generateSlug(title);
      form.setValue("slug", newSlug);
    }
  }, [title, form, isEditing]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <PostFormHeader form={form} isEditing={isEditing} />
        <PostFormBasicInfo form={form} />
        <PostFormContent form={form} />
        
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {isEditing ? "Update Post" : "Create Post"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;