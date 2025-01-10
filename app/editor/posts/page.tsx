import { Suspense } from "react";
import BlogPostsClient from "@/src/components/editor/BlogPostsClient";
import { getServerSupabase } from "@/src/integrations/supabase/client";
export const dynamic = "force-dynamic";

async function getPosts() {
  const supabase = await getServerSupabase();
  
  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return posts;
}

export default async function Posts() {
  const posts = await getPosts();

  return (
    <div className="p-6">
      <Suspense fallback={
        <div className="flex items-center justify-center p-8">
          <p className="text-lg text-gray-600">Loading posts...</p>
        </div>
      }>
        <BlogPostsClient initialPosts={posts} />
      </Suspense>
    </div>
  );
}
