import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    return NextResponse.json(
      { error: 'You must be logged in to create posts' }, 
      { status: 401 }
    )
  }

  try {
    const postData = await request.json()
    
    const { data, error } = await supabase
      .from('posts')
      .insert([{
        ...postData,
        published_at: postData.is_published ? new Date().toISOString() : null,
      }])
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
      { error: error instanceof Error ? error.message : 'Failed to create post' },
      { status: 500 }
    )
  }
} 