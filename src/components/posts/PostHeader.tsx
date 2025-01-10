import { Link } from "react-router-dom";
import { Button } from "@/src/components/ui/button";
import { Pencil } from "lucide-react";

interface PostHeaderProps {
  slug: string;
}

export const PostHeader = ({ slug }: PostHeaderProps) => {
  return (
    <div className="flex justify-end">
      <Link to={`/posts/${slug}/edit`}>
        <Button variant="outline" className="bg-white">
          <Pencil className="mr-2 h-4 w-4" />
          Edit Post
        </Button>
      </Link>
    </div>
  );
};