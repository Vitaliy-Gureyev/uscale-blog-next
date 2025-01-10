'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getServerSupabase } from "@/src/integrations/supabase/client";

interface AuthorBioProps {
  author: string | null;
  authorAvatar: string | null;
}

// Выносим функцию получения данных автора для переиспользования
async function getAuthorData(author: string) {
  const supabase = await getServerSupabase();
  const { data, error } = await supabase
    .from("authors")
    .select("*")
    .eq("name", author)
    .maybeSingle();
  
  if (error) throw error;
  return data;
}

export const AuthorBio = ({ author, authorAvatar }: AuthorBioProps) => {
  const { data: authorData, isLoading } = useQuery({
    queryKey: ["author", author],
    queryFn: () => author ? getAuthorData(author) : null,
    enabled: !!author,
  });

  if (!author || isLoading) return null;

  return (
    <div className="border-t border-gray-200 mt-16 pt-8">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage 
            src={authorData?.avatar_url || authorAvatar || undefined} 
            alt={author} 
          />
          <AvatarFallback>
            <User className="h-8 w-8 text-gray-400" />
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold text-lg" itemProp="name">{author}</h3>
          <p className="mt-4 text-gray-600" itemProp="description">
            {authorData?.description || "A passionate writer and researcher with expertise in their field."}
          </p>
        </div>
      </div>
    </div>
  );
};