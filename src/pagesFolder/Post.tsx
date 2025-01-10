import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/src/integrations/supabase/client";
import { PostHeader } from "@/src/components/posts/PostHeader";
import { PostHero } from "@/src/components/posts/PostHero";
import { PostBreadcrumbs } from "@/src/components/posts/PostBreadcrumbs";
import { PostContent } from "@/src/components/posts/PostContent";
import { PostMeta } from "@/src/components/posts/PostMeta";
import { SocialShare } from "@/src/components/posts/SocialShare";
import { PostMetadata } from "@/src/components/posts/PostMetadata";
import { AuthorBio } from "@/src/components/posts/AuthorBio";

const Post = () => {
  const { slug } = useParams();

  const { data: post, isLoading } = useQuery({
    queryKey: ["post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("slug", slug || '')
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg" role="status">Loading post...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Post not found</p>
      </div>
    );
  }

  const publishDate = post.published_at || post.created_at;

  return (
    <>
      {post && <PostMetadata post={post} />} 

      <article 
        className="min-h-screen bg-white" 
        itemScope 
        itemType="https://schema.org/BlogPosting"
        lang="en"
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <PostBreadcrumbs title={post.title} />
          
          <header className="mb-12">
            {post.category && (
              <span 
                className="inline-block bg-blue-50 text-blue-800 text-sm font-medium px-3 py-1 rounded-full mb-6"
                itemProp="articleSection"
              >
                {post.category}
              </span>
            )}
            
            <h1 
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
              itemProp="headline"
            >
              {post.title}
            </h1>

            {post.excerpt && (
              <p 
                className="text-xl text-gray-600 mb-8"
                itemProp="description"
              >
                {post.excerpt}
              </p>
            )}

            <div className="flex flex-col items-start gap-6 mb-8">
              <PostMeta 
                author={post.author}
                createdAt={publishDate}
                content={post.content}
              />
              <SocialShare title={post.title} />
            </div>

            <div className="max-w-2xl mx-auto">
              <PostHero
                imageUrl={post.image_url}
                imageAlt={post.image_alt || `Featured image for ${post.title}`}
                title={post.title}
              />
            </div>
          </header>

          <div 
            itemProp="articleBody"
            className="prose prose-lg max-w-none"
          >
            <PostContent content={post.content} />
          </div>

          <footer className="mt-12 pt-8 border-t border-gray-200">
            <div itemProp="author" itemScope itemType="https://schema.org/Person">
              <AuthorBio 
                author={post.author}
                authorAvatar={post.author_avatar}
              />
            </div>
          </footer>
        </div>
      </article>
    </>
  );
};

export default Post;