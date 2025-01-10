interface StructuredDataProps {
  post: {
    title: string;
    excerpt?: string;
    summary?: string;
    image_url?: string;
    published_at?: string;
    updated_at?: string;
    author?: string;
    content?: string;
    category?: string;
    slug: string;
    created_at?: string;
  };
}

export const PostStructuredData = ({ post }: StructuredDataProps) => {
  const canonicalUrl = `${window.location.origin}/posts/${post.slug}`;
  const publishDate = post.published_at || post.created_at;
  const description = post.summary || post.excerpt || "";
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": description,
    "image": post.image_url ? [post.image_url] : [],
    "datePublished": publishDate,
    "dateModified": post.updated_at,
    "author": {
      "@type": "Person",
      "name": post.author || "Uscale"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Uscale",
      "logo": {
        "@type": "ImageObject",
        "url": "/lovable-uploads/aedff95c-0dc3-4dd8-bc86-b44c90691e38.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalUrl
    },
    "articleBody": post.content?.replace(/<[^>]*>/g, '') || "",
    "articleSection": post.category || "Technology",
    "wordCount": post.content ? post.content.split(/\s+/).length : 0
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(structuredData)}
    </script>
  );
};