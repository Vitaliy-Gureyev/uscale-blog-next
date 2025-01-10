'use client'
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { usePosts } from "@/src/hooks/usePosts";
import { BlogContent } from "@/src/components/blog/BlogContent";
import { LoadingScreen } from "@/src/components/layout/LoadingScreen";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { posts, categories, isLoading, isError, isAdmin } = usePosts(selectedCategory);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const params = new URLSearchParams(window.location.search);
    const category = params.get('category');
    if (category) {
      setSelectedCategory(category);
    }
  }, []);

  if (!isMounted) {
    return <LoadingScreen />;
  }

  if (isError) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-red-600">Error loading posts. Please try again later.</p>
      </main>
    );
  }

  // Filter posts to only show published ones for non-admin users
  const visiblePosts = isAdmin ? posts : posts?.filter(post => post.is_published);

  return (
    <>
      {/* <Helmet>
        <title>{selectedCategory ? `${selectedCategory} - Uscale Blog` : 'Latest posts from Uscale'}</title>
        <meta
          name="description"
          content="Discover how AI automation transforms marketing and business. Expert insights on implementing AI solutions and scaling operations efficiently."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`https://blog.uscale.ai${selectedCategory ? `?category=${selectedCategory}` : ''}`} />

        <meta property="og:type" content="website" />
        <meta property="og:title" content={selectedCategory ? `${selectedCategory} - Uscale Blog` : 'Latest posts from Uscale'} />
        <meta property="og:description" content="Discover how AI automation transforms marketing and business. Expert insights on implementing AI solutions and scaling operations efficiently." />
        <meta property="og:url" content={`https://blog.uscale.ai${selectedCategory ? `?category=${selectedCategory}` : ''}`} />
        <meta property="og:site_name" content="Uscale Blog" />
      </Helmet> */}

      <div className="min-h-screen bg-white">
        {isLoading ? (
          <LoadingScreen />
        ) : (
          <BlogContent
            posts={visiblePosts || []}
            categories={categories || []}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
            isAdmin={isAdmin}
          />
        )}
      </div>
    </>
  );
};

export default Index;
