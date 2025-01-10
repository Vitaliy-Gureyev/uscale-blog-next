import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import EditPostForm from '@/src/components/posts/EditPostForm';
import { PageProps } from '@/.next/types/app/page'

export default async function PostEdit(  { params }:PageProps) {
  const supabase = createServerComponentClient({ cookies });
  const {slug} = await(params)

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const { data: post } = await supabase
    .from('posts')
    .select("*")
    .eq('slug', slug)
    .maybeSingle();

  if (!post) {
    redirect('/editor/posts');
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <EditPostForm post={post} />
    </div>
  );
}
