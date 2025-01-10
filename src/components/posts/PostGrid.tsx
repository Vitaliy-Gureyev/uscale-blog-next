import { Badge } from "@/src/components/ui/badge";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/src/integrations/supabase/client";

interface PostGridProps {
  posts: any[];
  onCategoryClick: (category: string) => void;
}

export const PostGrid = ({ posts, onCategoryClick }: PostGridProps) => {
  const { data: authors } = useQuery({
    queryKey: ["authors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("authors")
        .select("*");
      if (error) throw error;
      return data;
    },
  });

  const calculateReadTime = (content: string) => {
    if (!content) return "5 min read";
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  const getAuthorData = (authorName: string) => {
    return authors?.find(a => a.name === authorName);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
        <article 
          key={post.id} 
          className="group flex flex-col bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 h-full"
        >
          <a href={`/posts/${post.slug}`} className="flex flex-col flex-grow">
            <div className="aspect-video relative overflow-hidden">
              {(post.thumbnail_url || post.image_url) ? (
                <img
                  src={post.thumbnail_url || post.image_url}
                  alt={post.image_alt || `Thumbnail for ${post.title}`}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400">No image</span>
                </div>
              )}
            </div>
            <div className="p-6 flex-grow flex flex-col">
              <div className="flex items-center justify-between mb-3">
                {post.category && (
                  <Badge 
                    variant="secondary" 
                    className="cursor-pointer bg-blue-50 hover:bg-blue-50/90 text-blue-800 text-xs px-2.5 py-0.5"
                    onClick={(e) => {
                      e.preventDefault();
                      onCategoryClick(post.category);
                    }}
                  >
                    {post.category}
                  </Badge>
                )}
                <span className="text-sm text-gray-500">
                  {calculateReadTime(post.content)}
                </span>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                {post.title}
              </h3>

              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    {post.author && (
                      <AvatarImage 
                        src={getAuthorData(post.author)?.avatar_url || ''} 
                        alt={post.author} 
                        className="object-cover"
                      />
                    )}
                    <AvatarFallback className="bg-blue-100">
                      <User className="h-4 w-4 text-blue-600" strokeWidth={3} />
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-gray-900">
                    {post.author}
                  </span>
                </div>
                <time className="text-sm text-gray-500">
                  {post.created_at && format(new Date(post.created_at), "MMM d, yyyy")}
                </time>
              </div>
            </div>
          </a>
        </article>
      ))}
    </div>
  );
};