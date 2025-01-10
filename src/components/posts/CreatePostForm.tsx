'use client'

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import PostForm, { PostFormData } from "./PostForm";
import { Button } from "@/src/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function CreatePostForm() {
  const router = useRouter();

  const createPost = useMutation({
    mutationFn: async (data: PostFormData) => {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create post');
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Post created successfully!");
      router.push("/editor/posts");
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const defaultValues: PostFormData = {
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    image_url: "",
    image_alt: "",
    category: "",
    summary: "",
    toc_headers: "h2,h3",
    is_published: false,
    thumbnail_url: "",
    author: "",
    author_avatar: "",
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
        onSubmit={(data) => createPost.mutate(data)}
        isEditing={false}
        onCancel={() => router.back()}
      />
    </>
  );
} 