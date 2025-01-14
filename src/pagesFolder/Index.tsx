import { BlogContent } from "@/src/components/blog/BlogContent";

interface IndexProps {
    posts: any[]
    categories: string[]
    isAdmin: boolean
}

const Index: React.FC<IndexProps> = ({ posts, categories, isAdmin }) => {
  const visiblePosts = isAdmin ? posts : posts?.filter(post => post.is_published);

  return (
      <div className="min-h-screen bg-white">
          <BlogContent
            posts={visiblePosts || []}
            categories={categories || []}
            isAdmin={isAdmin}
          />
      </div>
  );
};

export default Index;
