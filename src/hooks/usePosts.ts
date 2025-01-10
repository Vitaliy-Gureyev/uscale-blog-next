import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/src/integrations/supabase/client";
import { useAuthState } from "./useAuthState";

export const usePosts = (selectedCategory: string | null) => {
  const { isAdmin } = useAuthState();

  const { data: posts, isLoading, isError } = useQuery({
    queryKey: ["posts", selectedCategory, isAdmin],
    queryFn: async () => {
      let query = supabase
        .from("posts")
        .select("*")
        .order('created_at', { ascending: false });
      
      if (selectedCategory) {
        query = query.eq('category', selectedCategory);
      }
      
      if (!isAdmin) {
        query = query.eq('is_published', true);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching posts:", error);
        throw error;
      }
      return data;
    }
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("category")
        .eq('is_published', true)
        .not('category', 'is', null)
        .order('category');
      
      if (error) {
        console.error("Error fetching categories:", error);
        throw error;
      }
      
      const uniqueCategories = Array.from(
        new Set(
          data
            .map(post => post.category)
            .filter((category): category is string => category != null)
        )
      );
      
      return uniqueCategories;
    }
  });

  return {
    posts,
    categories,
    isLoading,
    isError,
    isAdmin
  };
};