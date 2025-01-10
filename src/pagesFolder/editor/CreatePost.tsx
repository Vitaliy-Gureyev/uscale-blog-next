import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/src/integrations/supabase/client";
import { toast } from "sonner";
import PostForm, { PostFormData } from "@/src/components/posts/PostForm";
import { Button } from "@/src/components/ui/button";
import { ArrowLeft } from "lucide-react";

const CreatePost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = Boolean(slug);

  const { data: existingPost, isLoading: isLoadingPost } = useQuery({
    queryKey: ["post", slug],
    queryFn: async () => {
      if (!slug) return null;
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("slug", slug || '')
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: isEditing,
  });

  const createPost = useMutation({
    mutationFn: async (data: PostFormData) => {
      const { error } = await supabase.from("posts").insert([{
        ...data,
        published_at: data.is_published ? new Date().toISOString() : null,
      }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post created successfully!");
      navigate("/editor/posts");
    },
    onError: (error) => {
      toast.error("Failed to create post: " + error.message);
    },
  });

  const updatePost = useMutation({
    mutationFn: async (data: PostFormData) => {
      const { error } = await supabase
        .from("posts")
        .update({
          ...data,
          published_at: data.is_published ? new Date().toISOString() : null,
        })
        .eq("slug", slug || '');
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", slug] });
      toast.success("Post updated successfully!");
      navigate(`/editor/posts`);
    },
    onError: (error) => {
      toast.error("Failed to update post: " + error.message);
    },
  });

  const onSubmit = (data: PostFormData) => {
    if (isEditing) {
      updatePost.mutate(data);
    } else {
      createPost.mutate(data);
    }
  };

  if (isEditing && isLoadingPost) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading post...</p>
      </div>
    );
  }

  const defaultValues: PostFormData = {
    title: existingPost?.title || "",
    slug: existingPost?.slug || "",
    excerpt: existingPost?.excerpt || "",
    content: existingPost?.content || "",
    image_url: existingPost?.image_url || "",
    image_alt: existingPost?.image_alt || "",
    category: existingPost?.category || "",
    summary: existingPost?.summary || "",
    toc_headers: existingPost?.toc_headers || "h2,h3",
    is_published: existingPost?.is_published || false,
    thumbnail_url: existingPost?.thumbnail_url || "",
    author: existingPost?.author || "",
    author_avatar: existingPost?.author_avatar || "",
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate("/editor/posts")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      <PostForm
        defaultValues={defaultValues}
        onSubmit={onSubmit}
        isEditing={isEditing}
        onCancel={() => navigate("/editor/posts")}
      />
    </div>
  );
};

export default CreatePost;