"use client";

import { Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { supabase } from "@/src/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Database } from "@/src/integrations/supabase/types";

interface PostMetaProps {
  author?: string | null;
  createdAt?: string | null;
  content?: string;
}

interface AuthorData {
  name: string;
  avatar_url: string | null;
}

export function PostMeta({ author, createdAt, content }: PostMetaProps) {
  const [authorData, setAuthorData] = useState<AuthorData | null>(null);
  const readTime = content ? calculateReadTime(content) : "5 min read";

  useEffect(() => {
    async function fetchAuthorData() {
      if (!author) return;
      
      const { data, error } = await supabase
        .from("authors")
        .select("*")
        .eq("name", author)
        .maybeSingle();
      
      if (!error && data) {
        setAuthorData(data);
      }
    }

    fetchAuthorData();
  }, [author]);

  return (
    <div className="flex items-center gap-6 text-gray-500">
      {author && (
        <div className="flex items-center gap-2">
          <Avatar className="h-10 w-10">
            {authorData?.avatar_url ? (
              <AvatarImage 
                src={authorData.avatar_url} 
                alt={author} 
                className="object-cover"
              />
            ) : (
              <AvatarFallback className="bg-blue-100 text-blue-600">
                {getInitials(author)}
              </AvatarFallback>
            )}
          </Avatar>
          <span className="font-medium text-gray-900">{author}</span>
        </div>
      )}
      {createdAt && (
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-2" />
          <time dateTime={createdAt}>
            {format(new Date(createdAt), "MMM d, yyyy")}
          </time>
        </div>
      )}
      <div className="flex items-center">
        <Clock className="h-4 w-4 mr-2" />
        <span>{readTime}</span>
      </div>
    </div>
  );
}

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