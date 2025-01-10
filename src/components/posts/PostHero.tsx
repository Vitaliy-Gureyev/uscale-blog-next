interface PostHeroProps {
  imageUrl?: string | null;
  imageAlt?: string;
  title: string;
}

export const PostHero = ({ imageUrl, imageAlt, title }: PostHeroProps) => {
  return (
    <div className="relative h-[400px] rounded-lg overflow-hidden bg-gray-100">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={imageAlt || title}
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
          itemProp="image"
        />
      ) : (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          <span className="text-gray-400">No featured image</span>
        </div>
      )}
    </div>
  );
};