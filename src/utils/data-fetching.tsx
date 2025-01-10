import { supabase } from "@/src/integrations/supabase/client"
import { QueryClient } from "@tanstack/react-query"
import type { Database } from '@/src/integrations/supabase/types'

type Post = Database['public']['Tables']['posts']['Row']

export const prefetchHomePageData = async (queryClient: QueryClient, category: string | null) => {
  // Prefetch posts
  await queryClient.prefetchQuery({
    queryKey: ["posts", category],
    queryFn: async () => {
      let query = supabase
        .from("posts")
        .select("*")
        .eq('is_published', true)
        .order('created_at', { ascending: false })
      
      if (category) {
        query = query.eq('category', category)
      }
      
      const { data, error } = await query
      if (error) throw error
      return data
    }
  })

  // Prefetch categories
  await queryClient.prefetchQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("category")
        .eq('is_published', true)
        .not('category', 'is', null)
        .order('category')
      
      if (error) throw error
      
      const uniqueCategories = Array.from(
        new Set(
          data
            .map(post => post.category)
            .filter((category): category is string => category != null)
        )
      )
      
      return uniqueCategories
    }
  })

  // Prefetch authors for the posts
  await queryClient.prefetchQuery({
    queryKey: ["authors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("authors")
        .select("*")
      
      if (error) throw error
      return data
    }
  })
}

export const prefetchPostData = async (queryClient: QueryClient, slug: string): Promise<Post | null> => {
  const post = await queryClient.fetchQuery({
    queryKey: ["post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("slug", slug || '')
        .eq('is_published', true)
        .maybeSingle()
      
      if (error) throw error
      return data
    }
  })

  if (post?.author) {
    await queryClient.prefetchQuery({
      queryKey: ["author", post.author],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("authors")
          .select("*")
          .eq("name", post?.author || '')
          .maybeSingle()
        
        if (error) throw error
        return data
      }
    })
  }

  return post
}