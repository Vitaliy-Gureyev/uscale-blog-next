interface PostContentProps {
  content: string;
}

export const PostContent = ({ content }: PostContentProps) => {
  // Process content to add alt text captions below images and style text elements
  const processedContent = content
    .replace(/<img([^>]*)>/g, (match, attributes) => {
      // Extract alt text if it exists
      const altMatch = attributes.match(/alt="([^"]*)"/);
      const alt = altMatch ? altMatch[1] : '';
      
      // Add loading="lazy" and decoding="async" to all images
      return `<figure>
        <img${attributes} loading="lazy" decoding="async" />
        ${alt ? `<figcaption class="text-center text-sm text-gray-600 mt-2">${alt}</figcaption>` : ''}
      </figure>`;
    })
    .replace(/<h([2-6])(.*?)>(.*?)<\/h([2-6])>/g, (match, level, attrs, content) => {
      // Add ids to headings for better navigation
      const id = content.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return `<h${level}${attrs} id="${id}">${content}</h${level}>`;
    })
    .replace(/<a([^>]*)>(.*?)<\/a>/g, (match, attributes, text) => {
      // Add proper attributes to links for SEO and accessibility
      if (!attributes.includes('rel=')) {
        attributes += ' rel="noopener noreferrer"';
      }
      if (!attributes.includes('target=') && attributes.includes('href="http')) {
        attributes += ' target="_blank"';
      }
      return `<a${attributes} class="text-blue-800 hover:text-blue-600 transition-colors">${text}</a>`;
    });

  return (
    <div 
      className="prose prose-lg max-w-none prose-headings:scroll-mt-20 prose-a:text-blue-800 prose-a:no-underline hover:prose-a:text-blue-600 prose-img:rounded-lg prose-img:shadow-md"
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  );
};