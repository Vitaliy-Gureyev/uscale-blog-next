"use client";

import { Button } from "@/src/components/ui/button";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/src/components/ui/alert-dialog";
import { supabase } from "@/src/integrations/supabase/client";

interface BlogPostsClientProps {
  initialPosts: any[];
}

const BlogPostsClient = ({ initialPosts }: BlogPostsClientProps) => {
  const router = useRouter();

  const handleTitleClick = (post: any) => {
    if (!post.slug) {
      toast.error("This post needs a slug before it can be edited. Please delete and recreate the post.");
    }
  };

  const handleDelete = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      toast.success("Post deleted successfully");
      router.refresh();
    } catch (error: any) {
      toast.error("Error deleting post: " + error.message);
    }
  };

  const handleView = (slug: string) => {
    window.open(`/posts/${slug}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Blog Posts</h1>
        <Link href="/editor/posts/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Button>
        </Link>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialPosts?.map((post) => (
              <TableRow key={post.id}>
                <TableCell>
                  {post.slug ? (
                    <Link 
                      href={`/editor/posts/${post.slug}/edit`}
                      className="text-blue-600 hover:underline"
                    >
                      {post.title}
                    </Link>
                  ) : (
                    <span 
                      className="text-gray-600 cursor-not-allowed"
                      onClick={() => handleTitleClick(post)}
                    >
                      {post.title}
                    </span>
                  )}
                </TableCell>
                <TableCell>{post.category || "—"}</TableCell>
                <TableCell>{post.author || "—"}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    post.is_published 
                      ? "bg-green-50 text-green-700" 
                      : "bg-yellow-50 text-yellow-700"
                  }`}>
                    {post.is_published ? "Published" : "Draft"}
                  </span>
                </TableCell>
                <TableCell>
                  {post.created_at ? format(new Date(post.created_at), "MMM d, yyyy") : "—"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {post.slug && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleView(post.slug)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/editor/posts/${post.slug}/edit`)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Post</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this post? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(post.id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {!initialPosts?.length && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No posts found. Create your first post!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default BlogPostsClient; 