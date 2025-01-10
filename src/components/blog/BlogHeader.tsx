import { AdminActions } from "@/src/components/posts/AdminActions";
import { CategoryFilter } from "@/src/components/posts/CategoryFilter";

interface BlogHeaderProps {
  title: string;
  categories: any[];
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
  isAdmin: boolean;
}

export const BlogHeader = ({
  title,
  categories,
  selectedCategory,
  onCategorySelect,
}: BlogHeaderProps) => {
  return (
    <div className="flex justify-between items-start mb-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">
          <a href="/" className="hover:text-blue-600 transition-colors">
            {title}
          </a>
        </h1>
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={onCategorySelect}
        />
      </div>
      <AdminActions />
    </div>
  );
};