import Index from "@/src/pagesFolder/Index";
import { Metadata } from 'next';
import {getPosts} from "@/app/lib/getPosts";

export const metadata: Metadata = {
  description: 'Discover insights about AI-powered customer engagement, marketing automation, and personalization strategies. Stay updated with the latest trends in customer experience optimization.',
  openGraph: {
    description: 'Discover insights about AI-powered customer engagement, marketing automation, and personalization strategies. Stay updated with the latest trends in customer experience optimization.',
  },
  twitter: {
    description: 'Discover insights about AI-powered customer engagement, marketing automation, and personalization strategies. Stay updated with the latest trends in customer experience optimization.',
  }
}

export default async function Home() {
  const { posts, categories, isAdmin } = await getPosts()

  return (
    <Index  posts={posts} categories={categories} isAdmin={isAdmin} />
  )
}

