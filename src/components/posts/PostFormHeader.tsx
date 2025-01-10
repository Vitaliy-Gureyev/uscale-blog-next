import { FormField, FormItem, FormLabel, FormControl } from "@/src/components/ui/form";
import { Switch } from "@/src/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { PostFormData } from "./PostForm";
import { useEffect } from "react";

interface PostFormHeaderProps {
  form: UseFormReturn<PostFormData>;
  isEditing: boolean;
}

const PostFormHeader = ({ form, isEditing }: PostFormHeaderProps) => {
  // Ensure the form's published state is properly initialized
  useEffect(() => {
    const currentValue = form.getValues("is_published");
    if (currentValue !== undefined) {
      form.setValue("is_published", currentValue);
    }
  }, [form]);

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">{isEditing ? "Edit Post" : "Create New Post"}</h1>
      <div className="flex items-center gap-2">
        <FormField
          control={form.control}
          name="is_published"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2 space-y-0">
              <FormLabel className="!mt-0 text-base">Published</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    // Force form state update
                    form.setValue("is_published", checked, {
                      shouldDirty: true,
                      shouldTouch: true,
                    });
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default PostFormHeader;
