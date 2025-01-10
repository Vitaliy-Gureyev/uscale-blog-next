import { Helmet } from "react-helmet";
import { PostStructuredData } from "./PostStructuredData";

export const PostMetadata = ({ post }: any) => {
  const canonicalUrl = `${window.location.origin}/posts/${post.slug}`;
  const publishDate = post.published_at || post.created_at;
  const modifiedDate = post.updated_at;
  const description = post.summary || post.excerpt || "";

  return (
    <Helmet>
      <title>{`${post.title} - Uscale Blog`}</title>
      <meta name="description" content={description} />
      <meta name="author" content={post.author || "Uscale"} />
      <meta name="keywords" content={`${post.category || ''}, AI, Marketing, Business Automation, ${post.title}`} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph tags */}
      <meta property="og:title" content={post.title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="article" />
      <meta property="og:url" content={canonicalUrl} />
      {post.image_url && <meta property="og:image" content={post.image_url} />}
      <meta property="og:site_name" content="Uscale Blog" />
      
      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={post.title} />
      <meta name="twitter:description" content={description} />
      {post.image_url && <meta name="twitter:image" content={post.image_url} />}
      
      {/* Article specific meta tags */}
      {publishDate && <meta property="article:published_time" content={publishDate} />}
      {modifiedDate && <meta property="article:modified_time" content={modifiedDate} />}
      {post.category && <meta property="article:section" content={post.category} />}
      
      <PostStructuredData post={post} />
    </Helmet>
  );
};