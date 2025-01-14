import {getServerSupabase} from "@/src/integrations/supabase/client";

export async function getPosts() {
    const supabase = await getServerSupabase()

    const {
        data: { session },
    } = await supabase.auth.getSession()

    const isAdmin = session?.user?.email === process.env.ADMIN_EMAIL

    let query = supabase
        .from("posts")
        .select("*")
        .order('created_at', { ascending: false })

    if (!isAdmin) {
        query = query.eq('is_published', true)
    }

    const { data: posts, error: postsError } = await query

    if (postsError) {
        console.error("Error fetching posts:", postsError)
        throw postsError
    }

    const { data: categoriesData, error: categoriesError } = await supabase
        .from("posts")
        .select("category")
        .eq('is_published', true)
        .not('category', 'is', null)
        .order('category')

    if (categoriesError) {
        console.error("Error fetching categories:", categoriesError)
        throw categoriesError
    }

    const categories = Array.from(
        new Set(
            categoriesData
                .map(post => post.category)
                .filter((category): category is string => category != null)
        )
    )

    return {
        posts,
        categories,
        isAdmin
    }
}

