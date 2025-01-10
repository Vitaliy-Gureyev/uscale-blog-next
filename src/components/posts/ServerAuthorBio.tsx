import { getServerSupabase } from "@/src/integrations/supabase/client"
import { AuthorBio } from "./AuthorBio"

interface ServerAuthorBioProps {
  author: string | null
  authorAvatar: string | null
}

export async function ServerAuthorBio({ author, authorAvatar }: ServerAuthorBioProps) {
  // Предварительная загрузка данных автора
  if (author) {
    const supabase = await getServerSupabase()
    const { data } = await supabase
      .from("authors")
      .select("*")
      .eq("name", author)
      .maybeSingle()

    // Гидрация кэша React Query
    const dehydratedState = {
      queries: [
        {
          queryKey: ["author", author],
          queryFn: () => data,
          state: { data }
        }
      ]
    }

    return <AuthorBio author={author} authorAvatar={authorAvatar} />
  }

  return null
} 