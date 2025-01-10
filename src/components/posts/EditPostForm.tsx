'use client'

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import PostForm, { PostFormData } from "./PostForm";
import { Button } from "@/src/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image_url: string;
  image_alt: string;
  category: {
    id: string;
    name: string;
  };
  summary: string;
  toc_headers: string;
  is_published: boolean;
  thumbnail_url: string;
  author: {
    id: string;
    name: string;
  };
  author_avatar: string;
}

interface EditPostFormProps {
  post: Post;
}

export default function EditPostForm({ post }: EditPostFormProps) {
  const router = useRouter();

  const updatePost = useMutation({
    mutationFn: async (data: PostFormData) => {
      const response = await fetch(`/api/posts/${post.slug}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update post');
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Post updated successfully!");
      router.push("/editor/posts");
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const defaultValues: PostFormData = {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    image_url: post.image_url,
    image_alt: post.image_alt,
    category: post.category.id,
    summary: post.summary,
    toc_headers: post.toc_headers,
    is_published: post.is_published,
    thumbnail_url: post.thumbnail_url,
    author: post.author.id,
    author_avatar: post.author_avatar,
  };

  return (
    <>
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      <PostForm
        defaultValues={defaultValues}
        onSubmit={(data) => updatePost.mutate(data)}
        isEditing={true}
        onCancel={() => router.back()}
      />
    </>
  );
} 