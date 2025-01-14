'use client'

import { FeaturedPost } from "@/src/components/posts/FeaturedPost";
import { PostGrid } from "@/src/components/posts/PostGrid";
import { BlogHeader } from "./BlogHeader";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";
import {useEffect, useState} from "react";

interface BlogContentProps {
  posts: any[];
  categories: any[];
  isAdmin: boolean;
}

export const BlogContent = ({
  posts,
  categories,
  isAdmin,
}: BlogContentProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const category = params.get('category');
    if (category) {
      setSelectedCategory(category);
    }
  }, []);

  if (!posts || posts.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-16">
        <BlogHeader
          title="Latest posts from Uscale"
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
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
          <FeaturedPost
            post={featuredPost}
            onCategoryClick={setSelectedCategory}
          />
      )}

      <section className="max-w-7xl mx-auto px-4 py-16">
        <BlogHeader
          title="Latest posts from Uscale"
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
          isAdmin={isAdmin}
        />

        {remainingPosts.length > 0 ? (
          <PostGrid
            posts={remainingPosts}
            onCategoryClick={setSelectedCategory}
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
