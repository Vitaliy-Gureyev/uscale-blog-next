import { getServerSupabase } from '@/src/integrations/supabase/client'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await getServerSupabase()

  const { data: posts } = await supabase
    .from('posts')
    .select('slug, updated_at')
    .eq('published', true)

  const baseUrls: MetadataRoute.Sitemap = [
    {
      url: 'https://blog.uscale.ai',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://blog.uscale.ai/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]

  const postUrls: MetadataRoute.Sitemap = posts?.map((post) => ({
    url: `https://blog.uscale.ai/posts/${post.slug}`,
    lastModified: post.updated_at ? new Date(post.updated_at) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  })) ?? []

  return [...baseUrls, ...postUrls]
}
