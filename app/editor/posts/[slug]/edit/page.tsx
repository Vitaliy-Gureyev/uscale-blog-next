import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import EditPostForm from '@/src/components/posts/EditPostForm';

export default async function PostEdit({ params }: { params: { slug: string } }) {
  const supabase = createServerComponentClient({ cookies });
  
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  // Получаем данные поста для редактирования
  const { data: post } = await supabase
    .from('posts')
    .select("*")
    .eq('slug', params.slug)
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
