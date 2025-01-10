import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { PostFormData } from "./PostForm";
import ImageUpload from "./ImageUpload";
import { PostFormTitle } from "./form/PostFormTitle";
import { PostFormAuthor } from "./form/PostFormAuthor";
import { PostFormCategory } from "./form/PostFormCategory";

interface PostFormBasicInfoProps {
  form: UseFormReturn<PostFormData>;
}

const PostFormBasicInfo = ({ form }: PostFormBasicInfoProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-6">
        <PostFormTitle form={form} />
        <PostFormAuthor form={form} />
        <PostFormCategory form={form} />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input placeholder="enter-post-slug" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="summary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Post Summary</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Brief summary of the post (max 130 characters)"
                  maxLength={130}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-6">
        <FormField
          control={form.control}
          name="image_url"
          render={({ field }) => (
            <FormItem>
              <ImageUpload
                label="Featured Image"
                onImageUploaded={(url) => field.onChange(url)}
              />
              {field.value && (
                <img
                  src={field.value}
                  alt="Featured preview"
                  className="mt-2 rounded-md max-h-32 object-cover"
                />
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="thumbnail_url"
          render={({ field }) => (
            <FormItem>
              <ImageUpload
                label="Thumbnail Image"
                onImageUploaded={(url) => field.onChange(url)}
              />
              {field.value && (
                <img
                  src={field.value}
                  alt="Thumbnail preview"
                  className="mt-2 rounded-md max-h-32 object-cover"
                />
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image_alt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image Alt Text</FormLabel>
              <FormControl>
                <Input placeholder="Descriptive text for the image" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="toc_headers"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Table of Contents Headers</FormLabel>
              <FormControl>
                <Input placeholder="e.g., h2,h3" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default PostFormBasicInfo;
