import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/src/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { PostFormData } from "../PostForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/src/integrations/supabase/client";

interface PostFormCategoryProps {
  form: UseFormReturn<PostFormData>;
}

export const PostFormCategory = ({ form }: PostFormCategoryProps) => {
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

  return (
    <FormField
      control={form.control}
      name="category"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Category</FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {categories?.map((category) => (
                <SelectItem key={category.id} value={category.slug}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};