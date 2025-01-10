'use client'

import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/src/integrations/supabase/client";
import Image from "next/image";

interface FeaturedPostProps {
  post: any;
  onCategoryClick: (category: string) => void;
}

export const FeaturedPost = ({ post, onCategoryClick }: FeaturedPostProps) => {
  const { data: authorData } = useQuery({
    queryKey: ["author", post.author],
    queryFn: async () => {
      if (!post.author) return null;
      const { data, error } = await supabase
        .from("authors")
        .select("*")
        .eq("name", post.author)
        .maybeSingle();
      
      if (error) {
        console.error("Error fetching author:", error);
        return null;
      }
      return data;
    },
    enabled: !!post.author,
  });

  // Preload the featured image
  useEffect(() => {
    if (post.image_url) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = post.image_url;
      document.head.appendChild(link);
      return () => {
        document.head.removeChild(link);
      };
    }
  }, [post.image_url]);

  const calculateReadTime = (content: string) => {
    if (!content) return "5 min read";
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <article className="relative h-[70vh] min-h-[600px] bg-gray-900 text-white">
      {post.image_url && (
        <div className="absolute inset-0">
          <Image
            src={post.image_url}
            alt={post.image_alt || `Featured image for ${post.title}`}
            className="object-cover mix-blend-overlay"
            fill
            priority
            sizes="100vw"
          />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
      <div className="relative h-full max-w-7xl mx-auto px-4 flex items-end pb-24">
        <div className="max-w-2xl">
          <div className="flex items-center gap-4 mb-4">
            {post.category && (
              <Badge 
                variant="secondary" 
                className="cursor-pointer hover:bg-secondary/80"
                onClick={(e) => {
                  e.preventDefault();
                  onCategoryClick(post.category);
                }}
              >
                {post.category}
              </Badge>
            )}
            <div className="flex items-center gap-4 text-sm text-gray-300">
              {post.author && (
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    {authorData?.avatar_url ? (
                      <AvatarImage 
                        src={authorData.avatar_url} 
                        alt={post.author} 
                        className="object-cover"
                      />
                    ) : (
                      <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                        {getInitials(post.author)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <span>{post.author}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{calculateReadTime(post.content)}</span>
              </div>
              {post.published_at && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={post.published_at}>
                    {format(new Date(post.published_at), "MMM d, yyyy")}
                  </time>
                </div>
              )}
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {post.title}
          </h2>
          {post.excerpt && (
            <p className="text-lg text-gray-300 mb-8">
              {post.excerpt}
            </p>
          )}
          <Button 
            asChild 
            size="lg" 
            variant="default" 
            className="group bg-white text-gray-900 hover:bg-gray-100 rounded-full"
          >
            <Link href={`/posts/${post.slug}`} className="inline-flex items-center">
              Read Article
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={3} />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
};