'use client'

import { FeaturedPost } from "@/src/components/posts/FeaturedPost";
import { PostGrid } from "@/src/components/posts/PostGrid";
import { BlogHeader } from "./BlogHeader";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";

interface BlogContentProps {
  posts: any[];
  categories: any[];
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
  isAdmin: boolean;
}

export const BlogContent = ({
  posts,
  categories,
  selectedCategory,
  onCategorySelect,
  isAdmin,
}: BlogContentProps) => {
  if (!posts || posts.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-16">
        <BlogHeader
          title="Latest posts from Uscale"
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={onCategorySelect}
          isAdmin={isAdmin}
        />
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            {selectedCategory 
              ? `No posts found in the "${selectedCategory}" category.` 
              : "No posts found."}
          </p>
          {isAdmin && (
            <Button asChild>
              <Link href="/editor/posts/new">Create your first post</Link>
            </Button>
          )}
        </div>
      </section>
    );
  }

  const allPosts = [...posts];
  const featuredPost = allPosts.shift();
  const remainingPosts = allPosts;

  return (
    <div className="min-h-screen">
      {featuredPost && (
        <Link href={`/posts/${featuredPost.slug}`} className="block">
          <FeaturedPost 
            post={featuredPost} 
            onCategoryClick={onCategorySelect}
          />
        </Link>
      )}

      <section className="max-w-7xl mx-auto px-4 py-16">
        <BlogHeader
          title="Latest posts from Uscale"
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={onCategorySelect}
          isAdmin={isAdmin}
        />

        {remainingPosts.length > 0 ? (
          <PostGrid 
            posts={remainingPosts}
            onCategoryClick={onCategorySelect}
          />
        ) : (
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              {selectedCategory 
                ? `No additional posts found in the "${selectedCategory}" category.` 
                : "No additional posts found."}
            </p>
            {isAdmin && (
              <Button asChild>
                <Link href="/editor/posts/new">Create a new post</Link>
              </Button>
            )}
          </div>
        )}
      </section>
    </div>
  );
};