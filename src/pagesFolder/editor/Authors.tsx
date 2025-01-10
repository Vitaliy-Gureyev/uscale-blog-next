import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/src/components/ui/button";
import { Plus, MoreHorizontal } from "lucide-react";
import { supabase } from "@/src/integrations/supabase/client";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { NewAuthorDialog } from "@/src/components/authors/NewAuthorDialog";
import { EditAuthorDialog } from "@/src/components/authors/EditAuthorDialog";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { toast } from "sonner";

const Authors = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const queryClient = useQueryClient();

  const { data: authors, isLoading } = useQuery({
    queryKey: ["authors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("authors")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const deleteAuthor = useMutation({
    mutationFn: async (authorId: string) => {
      const { error } = await supabase
        .from("authors")
        .delete()
        .eq("id", authorId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authors"] });
      toast.success("Author deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete author: " + error.message);
    },
  });

  const handleEdit = (author) => {
    setSelectedAuthor(author);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (authorId: string) => {
    if (window.confirm("Are you sure you want to delete this author?")) {
      deleteAuthor.mutate(authorId);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Authors</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Author
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Author</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {authors?.map((author) => (
              <TableRow key={author.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={author.avatar_url || ''} alt={author.name} />
                      <AvatarFallback>
                        {author.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{author.name}</p>
                      {author.description && (
                        <p className="text-sm text-muted-foreground">
                          {author.description}
                        </p>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {format(new Date(author.created_at), "MMM d, yyyy")}
                </TableCell>
                <TableCell>
                  {format(new Date(author.updated_at), "MMM d, yyyy")}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(author)}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => handleDelete(author.id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <NewAuthorDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen}
      />

      {selectedAuthor && (
        <EditAuthorDialog 
          open={isEditDialogOpen} 
          onOpenChange={setIsEditDialogOpen}
          author={selectedAuthor}
        />
      )}
    </div>
  );
};

export default Authors;