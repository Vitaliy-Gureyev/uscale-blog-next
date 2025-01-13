import { getServerSupabase } from '@/src/integrations/supabase/client'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await getServerSupabase()

  const { data: posts, error } = await supabase
    .from('posts')
    .select('slug, updated_at')
    .eq('is_published', true)
    .order('updated_at', { ascending: false })

  console.log('Sitemap generation:')
  console.log('Posts data:', posts)
  console.log('Error:', error)

  if (error) {
    console.error('Error fetching posts for sitemap:', error)
  }

  const currentDate = new Date().toISOString()

  const baseUrls: MetadataRoute.Sitemap = [
    {
      url: 'https://blog.uscale.ai',
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1,
    }
  ]

  const postUrls: MetadataRoute.Sitemap = Array.isArray(posts) && posts.length > 0
    ? posts.map((post) => ({
        url: `https://blog.uscale.ai/posts/${post.slug}`,
        lastModified: post.updated_at || currentDate,
        changeFrequency: 'weekly',
        priority: 0.9,
      }))
    : [];

  console.log('Final sitemap:', [...baseUrls, ...postUrls])

  return [...baseUrls, ...postUrls]
}
