import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import {NextRequest, NextResponse} from 'next/server'

export async function PATCH(
  request: Request,
) {
  const supabase = createRouteHandlerClient({ cookies })

  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json(
      { error: 'You must be logged in to update posts' },
      { status: 401 }
    )
  }

  try {
    const postData = await request.json()
    const url = new URL(request.url)
    const slug = url.pathname.split('/').pop()

    const { data, error } = await supabase
      .from('posts')
      .update({
        ...postData,
        updated_at: new Date().toISOString(),
        published_at: postData.is_published ? new Date().toISOString() : null,
      })
      .eq('slug', slug)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update post' },
      { status: 500 }
    )
  }
}

export async function DELETE(
    request: NextRequest,
) {
  const supabase = createRouteHandlerClient({ cookies })

  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json(
        { error: 'You must be logged in to delete posts' },
        { status: 401 }
    )
  }

  try {
    const url = new URL(request.url)
    const slug = url.pathname.split('/').pop()

    const { error } = await supabase
        .from('posts')
        .delete()
        .eq('slug', slug)

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Failed to delete post' },
        { status: 500 }
    )
  }
}
