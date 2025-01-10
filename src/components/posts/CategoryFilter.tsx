import { Badge } from "@/src/components/ui/badge";
import { X } from "lucide-react";

interface CategoryFilterProps {
  categories: string[] | undefined;
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
}

export const CategoryFilter = ({ 
  categories, 
  selectedCategory, 
  onCategorySelect 
}: CategoryFilterProps) => {
  return (
    <div className="mb-8">
      {selectedCategory && (
        <div className="mt-4 flex items-center gap-2">
          <Badge 
            className="gap-1 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 shadow-sm"
            onClick={() => onCategorySelect(null)}
          >
            {selectedCategory}
            <X className="h-3 w-3" />
          </Badge>
        </div>
      )}
      {!selectedCategory && (
        <div className="flex flex-wrap gap-2">
          {categories?.map((category) => (
            <Badge
              key={category}
              variant="outline"
              className="cursor-pointer border-2 border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1 transition-colors"
              onClick={() => onCategorySelect(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};