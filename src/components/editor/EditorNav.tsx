'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"

export function EditorNav() {
  const pathname = usePathname()
  
  const isActive = (path: string) => pathname.startsWith(path)

  return (
    <nav className="space-y-1">
      <Link
        href="/editor/posts"
        className={`block px-4 py-2 ${
          isActive('/editor/posts') ? 'bg-gray-100' : ''
        }`}
      >
        Posts
      </Link>
      <Link
        href="/editor/categories"
        className={`block px-4 py-2 ${
          isActive('/editor/categories') ? 'bg-gray-100' : ''
        }`}
      >
        Categories
      </Link>
      <Link
        href="/editor/authors"
        className={`block px-4 py-2 ${
          isActive('/editor/authors') ? 'bg-gray-100' : ''
        }`}
      >
        Authors
      </Link>
    </nav>
  )
} 