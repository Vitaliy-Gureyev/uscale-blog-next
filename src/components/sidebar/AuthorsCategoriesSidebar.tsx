import { useState } from "react";
import { Plus, User, List } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/src/integrations/supabase/client";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { toast } from "sonner";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/src/components/ui/sidebar";
import ImageUpload from "../posts/ImageUpload";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function AuthorsCategoriesSidebar() {
  const [newAuthor, setNewAuthor] = useState({ name: "", avatar_url: "" });
  const [newCategory, setNewCategory] = useState({ name: "", slug: "" });
  const queryClient = useQueryClient();

  const { data: authors } = useQuery({
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

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const createAuthor = useMutation({
    mutationFn: async (author: typeof newAuthor) => {
      const { error } = await supabase.from("authors").insert([author]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authors"] });
      setNewAuthor({ name: "", avatar_url: "" });
      toast.success("Author created successfully!");
    },
    onError: (error) => {
      toast.error("Failed to create author: " + error.message);
    },
  });

  const createCategory = useMutation({
    mutationFn: async (category: typeof newCategory) => {
      const { error } = await supabase.from("categories").insert([{
        ...category,
        slug: category.name.toLowerCase().replace(/\s+/g, "-"),
      }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setNewCategory({ name: "", slug: "" });
      toast.success("Category created successfully!");
    },
    onError: (error) => {
      toast.error("Failed to create category: " + error.message);
    },
  });

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Authors</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <Input
                  placeholder="Author name"
                  value={newAuthor.name}
                  onChange={(e) => setNewAuthor({ ...newAuthor, name: e.target.value })}
                />
                <ImageUpload
                  label="Author avatar"
                  bucket="avatars"
                  onImageUploaded={(url) => setNewAuthor({ ...newAuthor, avatar_url: url })}
                />
                <Button 
                  className="w-full"
                  onClick={() => createAuthor.mutate(newAuthor)}
                  disabled={!newAuthor.name}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Author
                </Button>
              </div>
              <SidebarMenu>
                {authors?.map((author) => (
                  <SidebarMenuItem key={author.id}>
                    <SidebarMenuButton className="w-full justify-start">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={author.avatar_url || ''} />
                          <AvatarFallback>
                            {author.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span>{author.name}</span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Categories</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <Input
                  placeholder="Category name"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                />
                <Button 
                  className="w-full"
                  onClick={() => createCategory.mutate(newCategory)}
                  disabled={!newCategory.name}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </div>
              <SidebarMenu>
                {categories?.map((category) => (
                  <SidebarMenuItem key={category.id}>
                    <SidebarMenuButton className="w-full justify-start">
                      <List className="h-4 w-4 mr-2" />
                      <span>{category.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}