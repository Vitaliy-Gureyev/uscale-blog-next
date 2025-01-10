import type { Database } from '@/src/integrations/supabase/types'

type Post = Database['public']['Tables']['posts']['Row']

export const generateMetaTags = (post: Post | null, url: string) => {
  const title = post ? `${post.title} - Uscale Blog` : 'Uscale Blog - Modern AI & Marketing Insights'
  const description = post 
    ? (post.excerpt || post.summary || 'Read more about ' + post.title) 
    : 'Discover how AI automation transforms marketing and business. Expert insights on implementing AI solutions and scaling operations efficiently.'
  const imageUrl = post?.image_url || '/lovable-uploads/aedff95c-0dc3-4dd8-bc86-b44c90691e38.png'
  
  return `
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta name="author" content="${post?.author || 'Uscale'}" />

    <!-- Open Graph / Social Media Meta Tags -->
    <meta property="og:type" content="${post ? 'article' : 'website'}" />
    <meta property="og:url" content="https://blog.uscale.ai${url}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${imageUrl}" />
    ${post?.published_at ? `<meta property="article:published_time" content="${post.published_at}" />` : ''}
    ${post?.category ? `<meta property="article:section" content="${post.category}" />` : ''}

    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${imageUrl}" />
  `
}

export const generateJsonLd = (post: Post | null, url: string) => {
  if (!post) return ''
  
  return `
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": "${post.title}",
        "image": "${post.image_url || '/lovable-uploads/aedff95c-0dc3-4dd8-bc86-b44c90691e38.png'}",
        "datePublished": "${post.published_at || post.created_at}",
        ${post.updated_at ? `"dateModified": "${post.updated_at}",` : ''}
        "author": {
          "@type": "Person",
          "name": "${post.author || 'Uscale'}"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Uscale",
          "logo": {
            "@type": "ImageObject",
            "url": "/lovable-uploads/86f89bcc-deb1-4fea-aa82-bc4d0cfbbc88.png"
          }
        },
        "description": "${post.excerpt || post.summary || ''}",
        "articleBody": ${JSON.stringify(post.content || '')},
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": "https://blog.uscale.ai${url}"
        }
      }
    </script>
  `
}