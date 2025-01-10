import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { PostFormData } from "../PostForm";

interface PostFormTitleProps {
  form: UseFormReturn<PostFormData>;
}

export const PostFormTitle = ({ form }: PostFormTitleProps) => {
  return (
    <FormField
      control={form.control}
      name="title"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Title</FormLabel>
          <FormControl>
            <Input placeholder="Enter post title" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
