import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/src/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { PostFormData } from "./PostForm";
import TipTapEditor from "./TipTapEditor";

interface PostFormContentProps {
  form: UseFormReturn<PostFormData>;
}

const PostFormContent = ({ form }: PostFormContentProps) => {
  return (
    <FormField
      control={form.control}
      name="content"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Content</FormLabel>
          <FormControl>
            <TipTapEditor content={field.value} onChange={field.onChange} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default PostFormContent;
